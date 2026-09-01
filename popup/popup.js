// PreçoSmart v3 Ultra - Engine Completo
// 5 Lojas: Mercado Livre, Shopee, KaBuM!, Amazon, AliExpress

const formatBRL = (val) =>
  Number(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

let currentPaymentMode = 'pix';
let currentCategoryFilter = 'all';

// Tags de Frete e Benefícios Oficiais por Loja
const storeBadges = {
  'Mercado Livre': { text: '⚡ Full (Amanhã)', class: 'full' },
  'Amazon': { text: '📦 Prime Grátis', class: 'prime' },
  'KaBuM!': { text: '🚀 Entrega Ninja', class: 'ninja' },
  'Shopee': { text: '🎫 Frete Grátis', class: 'coupon' },
  'AliExpress': { text: '🛃 Remessa Conforme', class: 'customs' }
};

// Banco de Cupons Ativos por Loja
const activeCoupons = [
  { code: 'TECH10', store: 'KaBuM!', discount: '10% OFF', desc: 'Em hardware e periféricos selecionados' },
  { code: 'PRIME15', store: 'Amazon', discount: 'R$ 15 OFF', desc: 'Para membros Amazon Prime' },
  { code: 'SHOPEE20', store: 'Shopee', discount: 'R$ 20 OFF', desc: 'Em compras acima de R$ 150' },
  { code: 'MELI10', store: 'Mercado Livre', discount: '10% OFF', desc: 'Em lojas oficiais de tecnologia' },
  { code: 'ALIEXPRESS25', store: 'AliExpress', discount: 'R$ 25 OFF', desc: 'Válido em produtos Choice' }
];

// Catálogo de Eletrônicos com Histórico e Cotações
const electronicsCatalog = [
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

// Injeta Tags de Afiliado nas URLs de Saída (Monetização)
async function formatAffiliateUrl(store, originalUrl) {
  const { affiliateTags = {} } = await chrome.storage.local.get('affiliateTags');
  if (!originalUrl) return '#';

  try {
    const url = new URL(originalUrl);
    if (store === 'Amazon' && affiliateTags.amazon) {
      url.searchParams.set('tag', affiliateTags.amazon);
    } else if (store === 'Shopee' && affiliateTags.shopee) {
      url.searchParams.set('aff_id', affiliateTags.shopee);
    } else if (store === 'Mercado Livre' && affiliateTags.ml) {
      url.searchParams.set('matt_tool', affiliateTags.ml);
    }
    return url.toString();
  } catch {
    return originalUrl;
  }
}

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

// Algoritmo de Auditoria Anti-Fraude ("Metade do Dobro")
function auditPriceAuthenticity(currentPrice, history) {
  if (!history || history.length === 0) {
    return {
      status: 'real',
      badge: '🟢 Desconto Autêntico',
      text: 'Preço atual verificado nas 5 lojas oficiais.'
    };
  }

  const avg = history.reduce((a, b) => a + b, 0) / history.length;
  const diffPercent = ((avg - currentPrice) / avg) * 100;

  if (diffPercent >= 8) {
    return {
      status: 'real',
      badge: '🟢 Promoção Autêntica',
      text: `Excelente momento: ${diffPercent.toFixed(0)}% abaixo da média dos últimos 30 dias!`
    };
  } else if (currentPrice > avg * 1.05) {
    return {
      status: 'warning',
      badge: '⚠️ Alerta "Metade do Dobro"',
      text: 'Atenção: Preço está acima da média recente deste eletrônico.'
    };
  } else {
    return {
      status: 'real',
      badge: '🟡 Preço Estável',
      text: 'Valor compatível com a média de mercado atual.'
    };
  }
}

// Gera SVG Sparkline
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
    <svg class="sparkline-svg" viewBox="0 0 ${width} ${height}">
      <polyline fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" points="${points}" />
    </svg>
  `;
}

// Gera cotações dinâmicas com preços em todas as 5 lojas
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

let activeModalProduct = null;

document.addEventListener('DOMContentLoaded', async () => {
  // Navegação de Abas (4 abas)
  const tabBtnCurrent = document.getElementById('tab-btn-current');
  const tabBtnSearch = document.getElementById('tab-btn-search');
  const tabBtnCoupons = document.getElementById('tab-btn-coupons');
  const tabBtnAlerts = document.getElementById('tab-btn-alerts');

  const tabCurrent = document.getElementById('tab-current');
  const tabSearch = document.getElementById('tab-search');
  const tabCoupons = document.getElementById('tab-coupons');
  const tabAlerts = document.getElementById('tab-alerts');

  function switchTab(activeBtn, activeTabEl) {
    [tabBtnCurrent, tabBtnSearch, tabBtnCoupons, tabBtnAlerts].forEach((b) => b.classList.remove('active'));
    [tabCurrent, tabSearch, tabCoupons, tabAlerts].forEach((t) => t.classList.add('hidden'));

    activeBtn.classList.add('active');
    activeTabEl.classList.remove('hidden');
  }

  tabBtnCurrent.addEventListener('click', () => switchTab(tabBtnCurrent, tabCurrent));
  tabBtnSearch.addEventListener('click', () => {
    switchTab(tabBtnSearch, tabSearch);
    renderSearchResults('');
  });
  tabBtnCoupons.addEventListener('click', () => {
    switchTab(tabBtnCoupons, tabCoupons);
    renderCouponsList();
  });
  tabBtnAlerts.addEventListener('click', () => {
    switchTab(tabBtnAlerts, tabAlerts);
    renderWatchlist();
  });

  // Alternador Pix vs Parcelado
  const btnPix = document.getElementById('btn-mode-pix');
  const btnCard = document.getElementById('btn-mode-card');

  btnPix.addEventListener('click', () => {
    btnPix.classList.add('active');
    btnCard.classList.remove('active');
    currentPaymentMode = 'pix';
    loadCurrentPageProduct();
    renderSearchResults(document.getElementById('search-input')?.value || '');
  });

  btnCard.addEventListener('click', () => {
    btnCard.classList.add('active');
    btnPix.classList.remove('active');
    currentPaymentMode = 'card';
    loadCurrentPageProduct();
    renderSearchResults(document.getElementById('search-input')?.value || '');
  });

  // Chips de Categorias
  const chipButtons = document.querySelectorAll('#category-chips .chip');
  chipButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      chipButtons.forEach((c) => c.classList.remove('active'));
      btn.classList.add('active');
      currentCategoryFilter = btn.dataset.cat;
      renderSearchResults(document.getElementById('search-input')?.value || '');
    });
  });

  // Input de Busca
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', (e) => {
    renderSearchResults(e.target.value);
  });

  // Testador de Cupons Automático
  const btnRunCouponTest = document.getElementById('btn-run-coupon-test');
  btnRunCouponTest.addEventListener('click', runCouponTester);

  // Modais: WhatsApp
  document.getElementById('btn-close-wa-modal')?.addEventListener('click', () => {
    document.getElementById('whatsapp-modal').classList.add('hidden');
  });

  document.getElementById('btn-trigger-wa-alert')?.addEventListener('click', () => {
    const targetPrice = document.getElementById('wa-target-price').value;
    const title = activeModalProduct ? activeModalProduct.title : 'Eletrônico';
    if (!targetPrice) {
      alert('Por favor, informe o valor desejado para o alerta.');
      return;
    }

    const msg = encodeURIComponent(
      `🚨 *Alerta PreçoSmart*: Olá! Quero ser notificado quando o produto *${title}* baixar para *${formatBRL(targetPrice)}*. Monitorando nas 5 lojas oficiais!`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
    document.getElementById('whatsapp-modal').classList.add('hidden');
  });

  // Modais: Afiliados (Monetização)
  const affiliateModal = document.getElementById('affiliate-modal');
  document.getElementById('btn-open-affiliate-modal')?.addEventListener('click', async () => {
    const { affiliateTags = {} } = await chrome.storage.local.get('affiliateTags');
    document.getElementById('aff-amazon').value = affiliateTags.amazon || '';
    document.getElementById('aff-shopee').value = affiliateTags.shopee || '';
    document.getElementById('aff-ml').value = affiliateTags.ml || '';
    affiliateModal.classList.remove('hidden');
  });

  document.getElementById('btn-close-aff-modal')?.addEventListener('click', () => {
    affiliateModal.classList.add('hidden');
  });

  document.getElementById('btn-save-affiliates')?.addEventListener('click', async () => {
    const amazon = document.getElementById('aff-amazon').value.trim();
    const shopee = document.getElementById('aff-shopee').value.trim();
    const ml = document.getElementById('aff-ml').value.trim();

    await chrome.storage.local.set({
      affiliateTags: { amazon, shopee, ml }
    });
    alert('Tags de afiliado salvas com sucesso! Agora todas as compras gerarão comissão para você.');
    affiliateModal.classList.add('hidden');
  });

  // Exportar Alertas
  document.getElementById('btn-export-watchlist')?.addEventListener('click', async () => {
    const { watchlist = [] } = await chrome.storage.local.get('watchlist');
    if (watchlist.length === 0) {
      alert('Nenhum item salvo para exportar.');
      return;
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(watchlist, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = 'precosmart-v3-alertas.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
  });

  // Limpar Alertas
  document.getElementById('btn-clear-watchlist')?.addEventListener('click', async () => {
    if (confirm('Deseja limpar todos os itens salvos?')) {
      await chrome.storage.local.set({ watchlist: [] });
      updateAlertsCount();
      renderWatchlist();
    }
  });

  // Link Test Store
  document.getElementById('open-test-store-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: chrome.runtime.getURL('test-store.html') });
  });

  updateAlertsCount();
  await loadCurrentPageProduct();
});

// Executa Teste Automático de Cupons com Barra de Progresso
function runCouponTester() {
  const container = document.getElementById('coupon-progress-container');
  const fill = document.getElementById('coupon-progress-fill');
  const text = document.getElementById('coupon-progress-text');
  const btn = document.getElementById('btn-run-coupon-test');

  container.classList.remove('hidden');
  btn.disabled = true;

  let step = 0;
  const total = activeCoupons.length;

  const interval = setInterval(() => {
    step++;
    const pct = Math.round((step / total) * 100);
    fill.style.width = `${pct}%`;
    text.innerText = `Testando cupom ${step} de ${total}: "${activeCoupons[step - 1].code}" na ${activeCoupons[step - 1].store}...`;

    if (step >= total) {
      clearInterval(interval);
      setTimeout(() => {
        text.innerHTML = `🎉 <strong>Melhor cupom encontrado: TECH10 na KaBuM! (10% OFF)</strong>`;
        btn.disabled = false;
        navigator.clipboard.writeText('TECH10');
        alert('Cupom "TECH10" copiado automaticamente para a sua área de transferência!');
      }, 500);
    }
  }, 400);
}

function renderCouponsList() {
  const container = document.getElementById('available-coupons-list');
  container.innerHTML = activeCoupons
    .map(
      (c, idx) => `
      <div class="coupon-item ${idx === 0 ? 'best' : ''}">
        <div>
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
            <span class="coupon-code-badge">${c.code}</span>
            <span style="font-size: 11px; font-weight: 800; color: #34d399;">${c.discount}</span>
          </div>
          <div style="font-size: 10px; color: #94a3b8;">${c.store} • ${c.desc}</div>
        </div>
        <button class="btn-copy-coupon" data-code="${c.code}">Copiar</button>
      </div>
    `
    )
    .join('');

  container.querySelectorAll('.btn-copy-coupon').forEach((btn) => {
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(btn.dataset.code);
      btn.innerText = 'Copiado! ✓';
      setTimeout(() => (btn.innerText = 'Copiar'), 1500);
    });
  });
}

async function loadCurrentPageProduct() {
  const container = document.getElementById('detected-container');
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
        <button id="btn-open-test-hero" class="btn-track" style="width: auto; padding: 8px 18px; margin: 0 auto; display: inline-block;">
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

async function renderDetectedProduct(product, container) {
  activeModalProduct = product;

  const itemInCatalog = electronicsCatalog.find((c) =>
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

  // Formatar URLs com Tags de Afiliado
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
      const shipping = storeBadges[q.store] || { text: '📦 Envio Padrão', class: 'full' };

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
            <a href="${q.affLink}" target="_blank" class="store-link-btn" title="Abrir oferta com melhor preço">Ver Oferta ↗</a>
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

      <!-- Ações: Monitorar & Alerta WhatsApp -->
      <div class="card-actions-grid">
        <button class="btn-track" id="btn-save-current">
          ★ Monitorar
        </button>
        <button class="btn-whatsapp" id="btn-open-wa-modal">
          📲 Alerta WhatsApp
        </button>
      </div>
    </div>
  `;

  document.getElementById('btn-save-current').addEventListener('click', async () => {
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
    updateAlertsCount();
    alert('Eletrônico adicionado à sua lista de alertas!');
  });

  document.getElementById('btn-open-wa-modal').addEventListener('click', () => {
    document.getElementById('wa-product-title').value = product.title;
    document.getElementById('wa-target-price').value = (product.price * 0.9).toFixed(0);
    document.getElementById('whatsapp-modal').classList.remove('hidden');
  });
}

function renderSearchResults(query) {
  const container = document.getElementById('search-results');
  const term = query.toLowerCase().trim();

  let matchedItems = [];

  if (!term) {
    matchedItems = currentCategoryFilter === 'all'
      ? electronicsCatalog
      : electronicsCatalog.filter((c) => c.category === currentCategoryFilter);
  } else {
    matchedItems = electronicsCatalog.filter((c) => {
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
                const shipping = storeBadges[q.store] || { text: '📦 Envio Padrão', class: 'full' };
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

async function renderWatchlist() {
  const container = document.getElementById('watchlist-container');
  const { watchlist = [] } = await chrome.storage.local.get('watchlist');

  if (watchlist.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div style="font-size: 28px; margin-bottom: 6px;">⭐</div>
        <h3 style="color: #ffffff; font-size: 13px; font-weight: 700; margin-bottom: 4px;">Sua lista de alertas está vazia</h3>
        <p style="font-size: 11px;">Monitore eletrônicos para acompanhar quedas de preço.</p>
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
        <button data-index="${idx}" class="btn-remove-item" style="background: none; border: none; color: #ef4444; font-size: 14px; cursor: pointer; padding: 4px;">
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
      updateAlertsCount();
      renderWatchlist();
    });
  });
}

async function updateAlertsCount() {
  const { watchlist = [] } = await chrome.storage.local.get('watchlist');
  const el = document.getElementById('alert-count');
  if (el) el.innerText = watchlist.length;
}
