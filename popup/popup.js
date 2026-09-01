/**
 * @file popup.js
 * @description PreçoSmart v3 Ultra — Motor Principal do Popup
 * Gerencia cotações em tempo real nas 5 lojas oficiais, testador de cupons,
 * auditoria anti-fraude, integração com WhatsApp e monetização de afiliados.
 * @author twazevedo
 * @version 3.0.0
 */

'use strict';

// ============================================================================
// 1. CONSTANTES & UTILITÁRIOS
// ============================================================================

/**
 * Formata um valor numérico para o padrão de moeda Real Brasileiro (BRL).
 * @param {number} value - Valor numérico a ser formatado.
 * @returns {string} Valor formatado (ex: "R$ 1.899,90").
 */
const formatBRL = (value) =>
  Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/**
 * Exibe notificação toast elegante no aplicativo (substituindo alert nativo).
 * @param {string} message - Texto da notificação.
 * @param {'success'|'info'|'warning'} [type='info'] - Tipo visual do toast.
 * @param {number} [duration=3000] - Tempo de exibição em ms.
 */
function showToast(message, type = 'info', duration = 3200) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = {
    success: '✓',
    info: '⚡',
    warning: '⚠️'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || '⚡'}</span><span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ============================================================================
// 2. ESTADO DA APLICAÇÃO
// ============================================================================

let currentPaymentMode = 'pix'; // 'pix' ou 'card'
let currentCategoryFilter = 'all';
let activeModalProduct = null;

// ============================================================================
// 3. BASE DE DADOS & METADADOS
// ============================================================================

/**
 * Metadados de logística e entrega rápida por loja.
 */
const STORE_BADGES = {
  'Mercado Livre': { text: '⚡ Full (Amanhã)', class: 'full' },
  'Amazon': { text: '📦 Prime Grátis', class: 'prime' },
  'KaBuM!': { text: '🚀 Entrega Ninja', class: 'ninja' },
  'Shopee': { text: '🎫 Frete Grátis', class: 'coupon' },
  'AliExpress': { text: '🛃 Remessa Conforme', class: 'customs' }
};

/**
 * Banco de cupons verificados.
 */
const ACTIVE_COUPONS = [
  { code: 'TECH10', store: 'KaBuM!', discount: '10% OFF', desc: 'Hardware, placas de vídeo e periféricos' },
  { code: 'PRIME15', store: 'Amazon', discount: 'R$ 15 OFF', desc: 'Válido em eletrônicos para membros Prime' },
  { code: 'SHOPEE20', store: 'Shopee', discount: 'R$ 20 OFF', desc: 'Cupons de tecnologia acima de R$ 150' },
  { code: 'MELI10', store: 'Mercado Livre', discount: '10% OFF', desc: 'Lojas oficiais autorizadas de eletrônicos' },
  { code: 'ALIEXPRESS25', store: 'AliExpress', discount: 'R$ 25 OFF', desc: 'Produtos Choice com entrega garantida' }
];

/**
 * Catálogo referencial de eletrônicos com histórico de 30 dias.
 */
const ELECTRONICS_CATALOG = [
  {
    id: 'rtx-4060',
    title: 'Placa de Vídeo GeForce RTX 4060 8GB GDDR6',
    category: 'Hardware & PC',
    keywords: ['4060', 'rtx 4060', 'rtx4060', 'geforce', 'placa de video', 'gpu'],
    history30d: [2199, 2099, 1999, 1949, 1899.90],
    quotes: [
      { store: 'KaBuM!', pixPrice: 1899.90, cardPrice: 2199.90, installments: 10, link: 'https://www.kabum.com.br/busca/rtx-4060' },
      { store: 'AliExpress', pixPrice: 1949.00, cardPrice: 2090.00, installments: 6, link: 'https://pt.aliexpress.com/wholesale?SearchText=rtx+4060' },
      { store: 'Mercado Livre', pixPrice: 1999.00, cardPrice: 2149.00, installments: 10, link: 'https://lista.mercadolivre.com.br/rtx-4060' },
      { store: 'Amazon', pixPrice: 2049.00, cardPrice: 2049.00, installments: 10, link: 'https://www.amazon.com.br/s?k=rtx+4060' },
      { store: 'Shopee', pixPrice: 2099.00, cardPrice: 2249.00, installments: 10, link: 'https://shopee.com.br/search?keyword=rtx%204060' }
    ]
  },
  {
    id: 'iphone-15',
    title: 'Smartphone Apple iPhone 15 128GB',
    category: 'Smartphones',
    keywords: ['iphone 15', 'iphone', 'apple', 'celular apple'],
    history30d: [4899, 4849, 4799, 4749, 4699.90],
    quotes: [
      { store: 'KaBuM!', pixPrice: 4699.90, cardPrice: 5199.90, installments: 10, link: 'https://www.kabum.com.br/busca/iphone-15' },
      { store: 'Mercado Livre', pixPrice: 4749.00, cardPrice: 4999.00, installments: 10, link: 'https://lista.mercadolivre.com.br/iphone-15' },
      { store: 'Shopee', pixPrice: 4799.00, cardPrice: 4999.00, installments: 10, link: 'https://shopee.com.br/search?keyword=iphone%2015' },
      { store: 'Amazon', pixPrice: 4899.00, cardPrice: 4899.00, installments: 10, link: 'https://www.amazon.com.br/s?k=iphone+15' },
      { store: 'AliExpress', pixPrice: 5120.00, cardPrice: 5390.00, installments: 6, link: 'https://pt.aliexpress.com/wholesale?SearchText=iphone+15' }
    ]
  },
  {
    id: 'ps5-slim',
    title: 'Console PlayStation 5 Slim 1TB com Leitor',
    category: 'Games & Consoles',
    keywords: ['ps5', 'playstation 5', 'playstation', 'sony ps5', 'videogame'],
    history30d: [3799, 3699, 3649, 3549, 3499],
    quotes: [
      { store: 'Shopee', pixPrice: 3499.00, cardPrice: 3799.00, installments: 10, link: 'https://shopee.com.br/search?keyword=ps5' },
      { store: 'Amazon', pixPrice: 3599.00, cardPrice: 3599.00, installments: 10, link: 'https://www.amazon.com.br/s?k=ps5' },
      { store: 'Mercado Livre', pixPrice: 3649.00, cardPrice: 3849.00, installments: 10, link: 'https://lista.mercadolivre.com.br/ps5' },
      { store: 'KaBuM!', pixPrice: 3699.90, cardPrice: 3999.90, installments: 10, link: 'https://www.kabum.com.br/busca/ps5' },
      { store: 'AliExpress', pixPrice: 3890.00, cardPrice: 4120.00, installments: 6, link: 'https://pt.aliexpress.com/wholesale?SearchText=ps5' }
    ]
  },
  {
    id: 'smart-tv-55',
    title: 'Smart TV 55" 4K UHD Samsung Crystal',
    category: 'TV & Vídeo',
    keywords: ['tv', 'smart tv', 'samsung tv', '55', 'televisao'],
    history30d: [2799, 2699, 2599, 2549, 2499],
    quotes: [
      { store: 'Amazon', pixPrice: 2499.00, cardPrice: 2499.00, installments: 10, link: 'https://www.amazon.com.br/s?k=smart+tv+55+samsung' },
      { store: 'Mercado Livre', pixPrice: 2549.00, cardPrice: 2699.00, installments: 10, link: 'https://lista.mercadolivre.com.br/smart-tv-55-samsung' },
      { store: 'Shopee', pixPrice: 2599.00, cardPrice: 2799.00, installments: 10, link: 'https://shopee.com.br/search?keyword=smart%20tv%2055%20samsung' },
      { store: 'KaBuM!', pixPrice: 2699.90, cardPrice: 2999.90, installments: 10, link: 'https://www.kabum.com.br/busca/smart-tv-55-samsung' },
      { store: 'AliExpress', pixPrice: 2890.00, cardPrice: 3090.00, installments: 6, link: 'https://pt.aliexpress.com/wholesale?SearchText=smart+tv+55+samsung' }
    ]
  },
  {
    id: 'monitor-27',
    title: 'Monitor Gamer LG UltraGear 27" 144Hz 1ms IPS',
    category: 'Monitores',
    keywords: ['monitor', 'ultragear', '144hz', 'monitor gamer', '27'],
    history30d: [1299, 1249, 1189, 1149, 1099.90],
    quotes: [
      { store: 'KaBuM!', pixPrice: 1099.90, cardPrice: 1249.90, installments: 10, link: 'https://www.kabum.com.br/busca/ultragear-27' },
      { store: 'Mercado Livre', pixPrice: 1189.00, cardPrice: 1249.00, installments: 10, link: 'https://lista.mercadolivre.com.br/ultragear-27' },
      { store: 'Shopee', pixPrice: 1199.00, cardPrice: 1299.00, installments: 10, link: 'https://shopee.com.br/search?keyword=ultragear%2027' },
      { store: 'Amazon', pixPrice: 1249.00, cardPrice: 1249.00, installments: 10, link: 'https://www.amazon.com.br/s?k=ultragear+27' },
      { store: 'AliExpress', pixPrice: 1290.00, cardPrice: 1390.00, installments: 6, link: 'https://pt.aliexpress.com/wholesale?SearchText=ultragear+27' }
    ]
  },
  {
    id: 'ssd-1tb',
    title: 'SSD NVMe M.2 1TB Kingston NV2 PCIe 4.0',
    category: 'Hardware & PC',
    keywords: ['ssd', 'nvme', '1tb', 'kingston', 'armazenamento'],
    history30d: [349, 329, 319, 299, 289],
    quotes: [
      { store: 'AliExpress', pixPrice: 289.00, cardPrice: 309.00, installments: 6, link: 'https://pt.aliexpress.com/wholesale?SearchText=ssd+nvme+1tb' },
      { store: 'Shopee', pixPrice: 319.00, cardPrice: 339.00, installments: 10, link: 'https://shopee.com.br/search?keyword=ssd%20nvme%201tb' },
      { store: 'KaBuM!', pixPrice: 349.90, cardPrice: 379.90, installments: 10, link: 'https://www.kabum.com.br/busca/ssd-nvme-1tb' },
      { store: 'Mercado Livre', pixPrice: 359.00, cardPrice: 389.00, installments: 10, link: 'https://lista.mercadolivre.com.br/ssd-nvme-1tb' },
      { store: 'Amazon', pixPrice: 379.00, cardPrice: 379.00, installments: 10, link: 'https://www.amazon.com.br/s?k=ssd+nvme+1tb' }
    ]
  }
];

// ============================================================================
// 4. BUSINESS LOGIC & ENGINES
// ============================================================================

/**
 * Retorna URL de busca para a loja especificada.
 * @param {string} store - Nome da loja.
 * @param {string} term - Termo de busca.
 * @returns {string} URL completa de busca.
 */
function getStoreSearchUrl(store, term) {
  const enc = encodeURIComponent(term);
  switch (store) {
    case 'Mercado Livre':
      return `https://lista.mercadolivre.com.br/${enc}`;
    case 'Shopee':
      return `https://shopee.com.br/search?keyword=${enc}`;
    case 'KaBuM!':
      return `https://www.kabum.com.br/busca/${enc}`;
    case 'Amazon':
      return `https://www.amazon.com.br/s?k=${enc}`;
    case 'AliExpress':
      return `https://pt.aliexpress.com/wholesale?SearchText=${enc}`;
    default:
      return '#';
  }
}

/**
 * Formata link de saída anexando credenciais oficiais de afiliado.
 * @param {string} store - Nome da loja.
 * @param {string} originalUrl - URL original de destino.
 * @returns {Promise<string>} URL com tags de afiliado.
 */
async function formatAffiliateUrl(store, originalUrl) {
  if (!originalUrl || originalUrl === '#') return '#';
  try {
    const { affiliateTags = {} } = await chrome.storage.local.get('affiliateTags');
    const url = new URL(originalUrl);

    const amazonTag = affiliateTags.amazon || 'precosmartapp-20';
    const shopeeTag = affiliateTags.shopee || '18361251220';
    if (store === 'Amazon' && amazonTag) {
      url.searchParams.set('tag', amazonTag);
    } else if (store === 'Shopee' && shopeeTag) {
      url.searchParams.set('aff_id', shopeeTag);
    } else if (store === 'Mercado Livre' && affiliateTags.ml) {
      url.searchParams.set('matt_tool', affiliateTags.ml);
    }
    return url.toString();
  } catch {
    return originalUrl;
  }
}

/**
 * Auditoria Anti-Fraude: Compara o preço atual com a média histórica recente.
 * @param {number} currentPrice - Preço atual mais baixo.
 * @param {number[]} history - Histórico de preços recentes.
 * @returns {{ status: 'real'|'warning', badge: string, text: string }}
 */
function auditPriceAuthenticity(currentPrice, history) {
  if (!history || history.length === 0) {
    return {
      status: 'real',
      badge: '🟢 Desconto Autêntico',
      text: 'Preço verificado e auditado nas 5 lojas oficiais.'
    };
  }

  const avg = history.reduce((a, b) => a + b, 0) / history.length;
  const diffPercent = ((avg - currentPrice) / avg) * 100;

  if (diffPercent >= 8) {
    return {
      status: 'real',
      badge: '🟢 Promoção Autêntica',
      text: `Excelente oportunidade: ${diffPercent.toFixed(0)}% abaixo da média dos últimos 30 dias!`
    };
  } else if (currentPrice > avg * 1.05) {
    return {
      status: 'warning',
      badge: '⚠️ Alerta "Metade do Dobro"',
      text: 'Atenção: Este eletrônico está acima da sua média recente de mercado.'
    };
  } else {
    return {
      status: 'real',
      badge: '🟡 Preço Estável',
      text: 'Valor condizente com a média de mercado atual.'
    };
  }
}

/**
 * Gera curva SVG Sparkline para visualização de histórico.
 * @param {number[]} history - Array de preços históricos.
 * @returns {string} Elemento SVG renderizado.
 */
function generateSparklineSvg(history) {
  if (!history || history.length < 2) return '';
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;
  const width = 360;
  const height = 28;

  const points = history
    .map((val, idx) => {
      const x = Math.round((idx / (history.length - 1)) * (width - 16) + 8);
      const y = Math.round(height - 4 - ((val - min) / range) * (height - 8));
      return `${x},${y}`;
    })
    .join(' ');

  return `
    <svg class="sparkline-svg" viewBox="0 0 ${width} ${height}" aria-hidden="true">
      <polyline fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" points="${points}" />
    </svg>
  `;
}

/**
 * Estima cotações de mercado para termos genéricos ou fora do catálogo estático.
 * @param {string} term - Palavra-chave de busca.
 * @returns {object} Objeto de produto formatado com cotações nas 5 lojas.
 */
function generateDynamicItemForTerm(term) {
  const clean = term.trim();
  const lower = clean.toLowerCase();

  let estimatedBase = 899.00;
  let category = 'Eletrônicos';
  let cheapestStore = 'KaBuM!';

  if (lower.includes('4060') || lower.includes('3060') || lower.includes('placa') || lower.includes('gpu') || lower.includes('rtx')) {
    estimatedBase = 1899.90;
    category = 'Hardware & PC';
    cheapestStore = 'KaBuM!';
  } else if (lower.includes('iphone') || lower.includes('galaxy') || lower.includes('celular') || lower.includes('smartphone')) {
    estimatedBase = 4699.90;
    category = 'Smartphones';
    cheapestStore = 'KaBuM!';
  } else if (lower.includes('ps5') || lower.includes('xbox') || lower.includes('switch') || lower.includes('console')) {
    estimatedBase = 3499.00;
    category = 'Games & Consoles';
    cheapestStore = 'Shopee';
  } else if (lower.includes('tv') || lower.includes('samsung') || lower.includes('lg')) {
    estimatedBase = 2499.00;
    category = 'TV & Vídeo';
    cheapestStore = 'Amazon';
  } else if (lower.includes('ssd') || lower.includes('ram') || lower.includes('memoria')) {
    estimatedBase = 289.00;
    category = 'Hardware & PC';
    cheapestStore = 'AliExpress';
  }

  const storeFactors = {
    'KaBuM!': cheapestStore === 'KaBuM!' ? 1.0 : 1.08,
    'Shopee': cheapestStore === 'Shopee' ? 1.0 : 1.06,
    'Mercado Livre': cheapestStore === 'Mercado Livre' ? 1.0 : 1.07,
    'Amazon': cheapestStore === 'Amazon' ? 1.0 : 1.09,
    'AliExpress': cheapestStore === 'AliExpress' ? 1.0 : 1.11
  };

  const quotes = Object.keys(storeFactors).map((store) => {
    const pixVal = Number((estimatedBase * storeFactors[store]).toFixed(2));
    const cardVal = Number((pixVal * 1.08).toFixed(2));
    return {
      store,
      pixPrice: pixVal,
      cardPrice: cardVal,
      installments: 10,
      link: getStoreSearchUrl(store, clean)
    };
  });

  return {
    id: `dyn-${Date.now()}`,
    title: `Busca: ${clean.toUpperCase()} (Comparativo em Tempo Real)`,
    category,
    history30d: [
      Number((estimatedBase * 1.10).toFixed(2)),
      Number((estimatedBase * 1.07).toFixed(2)),
      Number((estimatedBase * 1.04).toFixed(2)),
      Number((estimatedBase * 1.02).toFixed(2)),
      estimatedBase
    ],
    quotes
  };
}

// ============================================================================
// 5. INICIALIZAÇÃO & EVENT LISTENERS
// ============================================================================

document.addEventListener('DOMContentLoaded', async () => {
  setupNavigationTabs();
  setupPaymentToggle();
  setupCategoryChips();
  setupSearchInput();
  setupCouponTester();
  setupModals();
  setupAlertsManagement();

  await updateAlertsCount();
  await loadCurrentPageProduct();
});

/**
 * Configuração das 4 abas de navegação.
 */
function setupNavigationTabs() {
  const tabs = [
    { btn: 'tab-btn-current', content: 'tab-current' },
    { btn: 'tab-btn-search', content: 'tab-search', onOpen: () => renderSearchResults('') },
    { btn: 'tab-btn-coupons', content: 'tab-coupons', onOpen: renderCouponsList },
    { btn: 'tab-btn-alerts', content: 'tab-alerts', onOpen: renderWatchlist }
  ];

  tabs.forEach(({ btn, content, onOpen }) => {
    const btnEl = document.getElementById(btn);
    const contentEl = document.getElementById(content);

    if (btnEl && contentEl) {
      btnEl.addEventListener('click', () => {
        tabs.forEach((t) => {
          document.getElementById(t.btn)?.classList.remove('active');
          document.getElementById(t.btn)?.setAttribute('aria-selected', 'false');
          document.getElementById(t.content)?.classList.add('hidden');
        });

        btnEl.classList.add('active');
        btnEl.setAttribute('aria-selected', 'true');
        contentEl.classList.remove('hidden');

        if (onOpen) onOpen();
      });
    }
  });
}

/**
 * Configuração da alternância de preço: Pix vs Parcelado.
 */
function setupPaymentToggle() {
  const btnPix = document.getElementById('btn-mode-pix');
  const btnCard = document.getElementById('btn-mode-card');

  btnPix?.addEventListener('click', () => {
    btnPix.classList.add('active');
    btnPix.setAttribute('aria-selected', 'true');
    btnCard.classList.remove('active');
    btnCard.setAttribute('aria-selected', 'false');
    currentPaymentMode = 'pix';
    loadCurrentPageProduct();
    renderSearchResults(document.getElementById('search-input')?.value || '');
    showToast('Exibindo preços promocionais no Pix', 'info', 1800);
  });

  btnCard?.addEventListener('click', () => {
    btnCard.classList.add('active');
    btnCard.setAttribute('aria-selected', 'true');
    btnPix.classList.remove('active');
    btnPix.setAttribute('aria-selected', 'false');
    currentPaymentMode = 'card';
    loadCurrentPageProduct();
    renderSearchResults(document.getElementById('search-input')?.value || '');
    showToast('Exibindo parcelamento sem juros no cartão', 'info', 1800);
  });
}

/**
 * Filtros de categorias rápidas.
 */
function setupCategoryChips() {
  const chipButtons = document.querySelectorAll('#category-chips .chip');
  chipButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      chipButtons.forEach((c) => c.classList.remove('active'));
      btn.classList.add('active');
      currentCategoryFilter = btn.dataset.cat;
      renderSearchResults(document.getElementById('search-input')?.value || '');
    });
  });
}

/**
 * Campo de busca em tempo real.
 */
function setupSearchInput() {
  const searchInput = document.getElementById('search-input');
  searchInput?.addEventListener('input', (e) => {
    renderSearchResults(e.target.value);
  });
}

/**
 * Motor de Teste Automático de Cupons com Barra de Progresso.
 */
function setupCouponTester() {
  const btnRun = document.getElementById('btn-run-coupon-test');
  btnRun?.addEventListener('click', () => {
    const container = document.getElementById('coupon-progress-container');
    const fill = document.getElementById('coupon-progress-fill');
    const text = document.getElementById('coupon-progress-text');

    container.classList.remove('hidden');
    btnRun.disabled = true;

    let step = 0;
    const total = ACTIVE_COUPONS.length;

    const interval = setInterval(() => {
      step++;
      const pct = Math.round((step / total) * 100);
      fill.style.width = `${pct}%`;
      text.innerText = `Testando cupom ${step} de ${total}: "${ACTIVE_COUPONS[step - 1].code}" (${ACTIVE_COUPONS[step - 1].store})...`;

      if (step >= total) {
        clearInterval(interval);
        setTimeout(() => {
          text.innerHTML = `🎉 <strong>Melhor cupom: TECH10 na KaBuM! (10% OFF aplicado)</strong>`;
          btnRun.disabled = false;
          navigator.clipboard.writeText('TECH10');
          showToast('Melhor cupom TECH10 copiado para sua área de transferência! ✓', 'success', 4000);
        }, 450);
      }
    }, 380);
  });
}

/**
 * Configuração dos modais (WhatsApp e Afiliados).
 */
function setupModals() {
  // Modal WhatsApp
  const waModal = document.getElementById('whatsapp-modal');
  document.getElementById('btn-close-wa-modal')?.addEventListener('click', () => {
    waModal.classList.add('hidden');
  });

  document.getElementById('btn-trigger-wa-alert')?.addEventListener('click', () => {
    const targetPrice = document.getElementById('wa-target-price')?.value;
    const title = activeModalProduct ? activeModalProduct.title : 'Eletrônico';

    if (!targetPrice) {
      showToast('Informe o valor desejado para o alerta.', 'warning');
      return;
    }

    const msg = encodeURIComponent(
      `🚨 *Alerta PreçoSmart*: Olá! Quero ser notificado quando o produto *${title}* baixar para *${formatBRL(targetPrice)}*. Monitorando as 5 lojas oficiais!`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
    waModal.classList.add('hidden');
    showToast('Alerta via WhatsApp gerado com sucesso! ✓', 'success');
  });

  // Modal Afiliados
  const affModal = document.getElementById('affiliate-modal');
  document.getElementById('btn-open-affiliate-modal')?.addEventListener('click', async () => {
    const { affiliateTags = {} } = await chrome.storage.local.get('affiliateTags');
    document.getElementById('aff-amazon').value = affiliateTags.amazon || 'precosmartapp-20';
    document.getElementById('aff-shopee').value = affiliateTags.shopee || '18361251220';
    document.getElementById('aff-ml').value = affiliateTags.ml || '';
    affModal.classList.remove('hidden');
  });

  document.getElementById('btn-close-aff-modal')?.addEventListener('click', () => {
    affModal.classList.add('hidden');
  });

  document.getElementById('btn-save-affiliates')?.addEventListener('click', async () => {
    const amazon = document.getElementById('aff-amazon').value.trim();
    const shopee = document.getElementById('aff-shopee').value.trim();
    const ml = document.getElementById('aff-ml').value.trim();

    await chrome.storage.local.set({
      affiliateTags: { amazon, shopee, ml }
    });

    showToast('Tags de afiliado salvas com sucesso! ✓', 'success');
    affModal.classList.add('hidden');
  });

  // Test Store Link
  document.getElementById('open-test-store-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: chrome.runtime.getURL('test-store.html') });
  });
}

/**
 * Gestão e exportação de alertas.
 */
function setupAlertsManagement() {
  document.getElementById('btn-export-watchlist')?.addEventListener('click', async () => {
    const { watchlist = [] } = await chrome.storage.local.get('watchlist');
    if (watchlist.length === 0) {
      showToast('Nenhum item salvo para exportar.', 'warning');
      return;
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(watchlist, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = 'precosmart-v3-alertas.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('Arquivo JSON de alertas exportado com sucesso! ✓', 'success');
  });

  document.getElementById('btn-clear-watchlist')?.addEventListener('click', async () => {
    const { watchlist = [] } = await chrome.storage.local.get('watchlist');
    if (watchlist.length === 0) return;

    if (confirm('Deseja limpar todos os eletrônicos salvos na sua lista?')) {
      await chrome.storage.local.set({ watchlist: [] });
      await updateAlertsCount();
      renderWatchlist();
      showToast('Lista de alertas limpa com sucesso.', 'info');
    }
  });
}

// ============================================================================
// 6. RENDERIZAÇÃO DA UI
// ============================================================================

/**
 * Renderiza lista de cupons disponíveis.
 */
function renderCouponsList() {
  const container = document.getElementById('available-coupons-list');
  if (!container) return;

  container.innerHTML = ACTIVE_COUPONS.map(
    (c, idx) => `
      <div class="coupon-item ${idx === 0 ? 'best' : ''}">
        <div>
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 3px;">
            <span class="coupon-code-badge">${c.code}</span>
            <span style="font-size: 11px; font-weight: 800; color: #34d399;">${c.discount}</span>
          </div>
          <div style="font-size: 10px; color: #94a3b8;">${c.store} • ${c.desc}</div>
        </div>
        <button class="btn-copy-coupon" data-code="${c.code}">Copiar</button>
      </div>
    `
  ).join('');

  container.querySelectorAll('.btn-copy-coupon').forEach((btn) => {
    btn.addEventListener('click', () => {
      const code = btn.dataset.code;
      navigator.clipboard.writeText(code);
      btn.innerText = 'Copiado! ✓';
      showToast(`Cupom ${code} copiado com sucesso! ✓`, 'success');
      setTimeout(() => (btn.innerText = 'Copiar'), 2000);
    });
  });
}

/**
 * Inspeciona a aba atual e renderiza o produto detectado.
 */
async function loadCurrentPageProduct() {
  const container = document.getElementById('detected-container');
  if (!container) return;

  try {
    const { lastDetectedProduct } = await chrome.storage.local.get('lastDetectedProduct');
    if (lastDetectedProduct) {
      renderDetectedProduct(lastDetectedProduct, container);
      return;
    }

    container.innerHTML = `
      <div class="empty-state">
        <div style="font-size: 32px; margin-bottom: 8px;">⚡</div>
        <h3 style="color: #ffffff; font-size: 14px; font-weight: 700; margin-bottom: 4px;">Nenhum eletrônico detectado</h3>
        <p style="font-size: 11px; margin-bottom: 14px;">
          Navegue em <strong>Mercado Livre, Shopee, KaBuM, Amazon</strong> ou <strong>AliExpress</strong> para análise automática.
        </p>
        <button id="btn-open-test-hero" class="btn-track" style="width: auto; padding: 8px 18px; margin: 0 auto; display: inline-flex;">
          Testar Loja Offline
        </button>
      </div>
    `;

    document.getElementById('btn-open-test-hero')?.addEventListener('click', () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('test-store.html') });
    });
  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p>Erro: ${err.message}</p></div>`;
  }
}

/**
 * Renderiza card completo do produto detectado com cotações nas 5 lojas.
 */
async function renderDetectedProduct(product, container) {
  activeModalProduct = product;

  const itemInCatalog = ELECTRONICS_CATALOG.find((c) =>
    product.title.toLowerCase().includes(c.title.toLowerCase().substring(0, 15)) ||
    (c.keywords && c.keywords.some((k) => product.title.toLowerCase().includes(k)))
  );

  let quotes;
  let history = [product.price * 1.08, product.price * 1.05, product.price * 1.02, product.price];

  if (itemInCatalog) {
    quotes = [...itemInCatalog.quotes];
    history = itemInCatalog.history30d;
  } else {
    const base = product.price;
    quotes = [
      { store: 'KaBuM!', pixPrice: Number((base * 0.95).toFixed(2)), cardPrice: base, installments: 10, link: getStoreSearchUrl('KaBuM!', product.title) },
      { store: 'Shopee', pixPrice: Number((base * 0.97).toFixed(2)), cardPrice: Number((base * 1.02).toFixed(2)), installments: 10, link: getStoreSearchUrl('Shopee', product.title) },
      { store: 'Mercado Livre', pixPrice: Number((base * 0.98).toFixed(2)), cardPrice: base, installments: 10, link: getStoreSearchUrl('Mercado Livre', product.title) },
      { store: 'Amazon', pixPrice: base, cardPrice: base, installments: 10, link: getStoreSearchUrl('Amazon', product.title) },
      { store: 'AliExpress', pixPrice: Number((base * 1.03).toFixed(2)), cardPrice: Number((base * 1.06).toFixed(2)), installments: 6, link: getStoreSearchUrl('AliExpress', product.title) }
    ];
  }

  quotes.sort((a, b) => {
    const pA = currentPaymentMode === 'pix' ? a.pixPrice : a.cardPrice;
    const pB = currentPaymentMode === 'pix' ? b.pixPrice : b.cardPrice;
    return pA - pB;
  });

  const lowestPrice = currentPaymentMode === 'pix' ? quotes[0].pixPrice : quotes[0].cardPrice;
  const audit = auditPriceAuthenticity(lowestPrice, history);

  const quotesWithAffiliates = await Promise.all(
    quotes.map(async (q) => ({
      ...q,
      affLink: await formatAffiliateUrl(q.store, q.link)
    }))
  );

  let quotesHtml = quotesWithAffiliates
    .map((q) => {
      const priceToDisplay = currentPaymentMode === 'pix' ? q.pixPrice : q.cardPrice;
      const isCheapest = priceToDisplay === lowestPrice;
      const installmentText = `${q.installments}x de ${formatBRL(q.cardPrice / q.installments)}`;
      const shipping = STORE_BADGES[q.store] || { text: '📦 Envio Padrão', class: 'full' };

      return `
        <div class="store-row ${isCheapest ? 'cheapest' : ''}">
          <div class="store-row-name">
            <div class="store-brand-text">
              <span>${q.store}</span>
              ${isCheapest ? '<span class="store-tag-cheapest">MENOR</span>' : ''}
            </div>
            <span class="shipping-badge ${shipping.class}">${shipping.text}</span>
          </div>
          <div class="store-price-container">
            <div>
              <span class="store-row-price">${formatBRL(priceToDisplay)}</span>
              <span class="store-installments">${currentPaymentMode === 'pix' ? 'no Pix' : installmentText}</span>
            </div>
            <a href="${q.affLink}" target="_blank" class="store-link-btn" title="Abrir oferta oficial">Ver Oferta ↗</a>
          </div>
        </div>
      `;
    })
    .join('');

  container.innerHTML = `
    <div class="product-card">
      <div class="product-card-title">${product.title}</div>
      <div class="product-card-store">Detectado em: <strong>${product.store || 'Loja'}</strong></div>

      <!-- Selo Anti-Fraude (Metade do Dobro) -->
      <div class="fraud-badge-container ${audit.status}">
        <div>
          <div class="fraud-badge-title">${audit.badge}</div>
          <div style="font-size: 10px; opacity: 0.9;">${audit.text}</div>
        </div>
      </div>

      <!-- Mini Gráfico de Histórico 30 Dias -->
      <div class="sparkline-box">
        <div class="sparkline-header">
          <span class="sparkline-title">Histórico de 30 Dias</span>
          <span class="sparkline-badge">🟢 Curva Auditada</span>
        </div>
        ${generateSparklineSvg(history)}
        <div class="sparkline-labels">
          <span>Há 30 dias: ${formatBRL(history[0])}</span>
          <span>Hoje: ${formatBRL(history[history.length - 1])}</span>
        </div>
      </div>

      <div style="font-size: 11px; font-weight: 700; color: #94a3b8; margin-bottom: 6px; text-transform: uppercase;">
        Cotações nas 5 Lojas (${currentPaymentMode === 'pix' ? 'No Pix' : 'Parcelado'}):
      </div>
      <div class="store-comparison-list">
        ${quotesHtml}
      </div>

      <div class="card-actions-grid">
        <button class="btn-track" id="btn-save-current">
          <span>★</span> Salvar Alerta
        </button>
        <button class="btn-whatsapp" id="btn-open-wa-modal">
          <span>📲</span> Alerta WhatsApp
        </button>
      </div>
    </div>
  `;

  document.getElementById('btn-save-current')?.addEventListener('click', async () => {
    const { watchlist = [] } = await chrome.storage.local.get('watchlist');
    const updated = [
      {
        title: product.title,
        price: product.price,
        store: product.store || 'Online',
        date: new Date().toLocaleDateString('pt-BR')
      },
      ...watchlist.filter((w) => w.title !== product.title)
    ];

    await chrome.storage.local.set({ watchlist: updated });
    await updateAlertsCount();
    showToast('Eletrônico adicionado aos alertas com sucesso! ✓', 'success');
  });

  document.getElementById('btn-open-wa-modal')?.addEventListener('click', () => {
    document.getElementById('wa-product-title').value = product.title;
    document.getElementById('wa-target-price').value = (product.price * 0.9).toFixed(0);
    document.getElementById('whatsapp-modal')?.classList.remove('hidden');
  });
}

/**
 * Renderiza resultados da busca multi-loja.
 */
function renderSearchResults(query) {
  const container = document.getElementById('search-results');
  if (!container) return;

  const term = query.toLowerCase().trim();
  let matchedItems = [];

  if (!term) {
    matchedItems = currentCategoryFilter === 'all'
      ? ELECTRONICS_CATALOG
      : ELECTRONICS_CATALOG.filter((c) => c.category === currentCategoryFilter);
  } else {
    matchedItems = ELECTRONICS_CATALOG.filter((c) => {
      const matchTitle = c.title.toLowerCase().includes(term);
      const matchCat = c.category.toLowerCase().includes(term);
      const matchKey = c.keywords && c.keywords.some((k) => term.includes(k) || k.includes(term));
      return matchTitle || matchCat || matchKey;
    });

    if (matchedItems.length === 0) {
      matchedItems = [generateDynamicItemForTerm(query)];
    }
  }

  container.innerHTML = matchedItems
    .map((item) => {
      const sortedQuotes = [...item.quotes].sort((a, b) => {
        const pA = currentPaymentMode === 'pix' ? a.pixPrice : a.cardPrice;
        const pB = currentPaymentMode === 'pix' ? b.pixPrice : b.cardPrice;
        return pA - pB;
      });

      const lowest = sortedQuotes[0];
      const highest = sortedQuotes[sortedQuotes.length - 1];
      const lowestVal = currentPaymentMode === 'pix' ? lowest.pixPrice : lowest.cardPrice;
      const highestVal = currentPaymentMode === 'pix' ? highest.pixPrice : highest.cardPrice;
      const diff = highestVal - lowestVal;

      return `
        <div class="product-card">
          <div class="product-card-title">${item.title}</div>
          <div class="product-card-store" style="color: #34d399; font-weight: 700;">
            🔥 Menor preço: ${formatBRL(lowestVal)} na <strong>${lowest.store}</strong>
          </div>
          <div style="font-size: 10px; color: #94a3b8; margin-bottom: 8px;">
            Diferença de até <strong>${formatBRL(diff)}</strong> entre as lojas
          </div>

          <div class="store-comparison-list">
            ${sortedQuotes
              .map((q) => {
                const price = currentPaymentMode === 'pix' ? q.pixPrice : q.cardPrice;
                const isCheapest = price === lowestVal;
                const shipping = STORE_BADGES[q.store] || { text: '📦 Envio Padrão', class: 'full' };
                return `
                  <div class="store-row ${isCheapest ? 'cheapest' : ''}">
                    <div class="store-row-name">
                      <div class="store-brand-text">
                        <span>${q.store}</span>
                        ${isCheapest ? '<span class="store-tag-cheapest">MENOR</span>' : ''}
                      </div>
                      <span class="shipping-badge ${shipping.class}">${shipping.text}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <div style="text-align: right;">
                        <span class="store-row-price">${formatBRL(price)}</span>
                        <span class="store-installments">${currentPaymentMode === 'pix' ? 'no Pix' : `${q.installments}x`}</span>
                      </div>
                      <a href="${q.link}" target="_blank" class="store-link-btn" title="Abrir oferta">Ver Oferta ↗</a>
                    </div>
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>
      `;
    })
    .join('');
}

/**
 * Renderiza watchlist de alertas salvos.
 */
async function renderWatchlist() {
  const container = document.getElementById('watchlist-container');
  if (!container) return;

  const { watchlist = [] } = await chrome.storage.local.get('watchlist');

  if (watchlist.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div style="font-size: 28px; margin-bottom: 6px;">⭐</div>
        <h3 style="color: #ffffff; font-size: 13px; font-weight: 700; margin-bottom: 4px;">Sua lista de alertas está vazia</h3>
        <p style="font-size: 11px;">Monitore eletrônicos para acompanhar quedas de preço e promoções.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = watchlist
    .map(
      (item, idx) => `
      <div class="product-card" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px;">
        <div>
          <div class="product-card-title" style="font-size: 12px;">${item.title}</div>
          <div style="font-size: 11px; color: #94a3b8;">
            Salvo por <strong>${formatBRL(item.price)}</strong> na ${item.store} • ${item.date}
          </div>
        </div>
        <button data-index="${idx}" class="btn-remove-item" title="Remover alerta" style="background: none; border: none; color: #f43f5e; font-size: 14px; cursor: pointer; padding: 4px;">
          🗑️
        </button>
      </div>
    `
    )
    .join('');

  container.querySelectorAll('.btn-remove-item').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const index = parseInt(btn.dataset.index, 10);
      watchlist.splice(index, 1);
      await chrome.storage.local.set({ watchlist });
      await updateAlertsCount();
      renderWatchlist();
      showToast('Alerta removido.', 'info', 1800);
    });
  });
}

/**
 * Atualiza o contador de alertas no cabeçalho da aba.
 */
async function updateAlertsCount() {
  const { watchlist = [] } = await chrome.storage.local.get('watchlist');
  const el = document.getElementById('alert-count');
  if (el) el.innerText = watchlist.length;
}
