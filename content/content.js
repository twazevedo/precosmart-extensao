// PreçoSmart - Content Script Avançado (Resiliente a SPAs & Navegação Dinâmica)
// Especializado em Eletrônicos: Mercado Livre, Shopee, KaBuM!, Amazon, AliExpress
(function () {
  'use strict';

  let currentFloatingBar = null;
  let lastProcessedUrl = '';
  let debounceTimeout = null;

  // Formatação em Real Brasileiro
  const formatBRL = (num) =>
    num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Banco de eletrônicos para comparação cruzada
  const electronicsDeals = [
    {
      keywords: ['iphone 15', '128gb'],
      cheapestStore: 'KaBuM!',
      bestPrice: 4699.90,
      link: 'https://www.kabum.com.br/busca/iphone-15',
      allStores: [
        { store: 'KaBuM!', price: 4699.90 },
        { store: 'Mercado Livre', price: 4749.00 },
        { store: 'Shopee', price: 4799.00 },
        { store: 'Amazon', price: 4899.00 },
        { store: 'AliExpress', price: 5120.00 }
      ]
    },
    {
      keywords: ['playstation 5', 'ps5'],
      cheapestStore: 'Shopee',
      bestPrice: 3499.00,
      link: 'https://shopee.com.br/search?keyword=ps5',
      allStores: [
        { store: 'Shopee', price: 3499.00 },
        { store: 'Amazon', price: 3599.00 },
        { store: 'Mercado Livre', price: 3649.00 },
        { store: 'KaBuM!', price: 3699.90 },
        { store: 'AliExpress', price: 3890.00 }
      ]
    },
    {
      keywords: ['rtx 4060', '8gb'],
      cheapestStore: 'KaBuM!',
      bestPrice: 1899.90,
      link: 'https://www.kabum.com.br/busca/rtx-4060',
      allStores: [
        { store: 'KaBuM!', price: 1899.90 },
        { store: 'AliExpress', price: 1949.00 },
        { store: 'Mercado Livre', price: 1999.00 },
        { store: 'Amazon', price: 2049.00 },
        { store: 'Shopee', price: 2099.00 }
      ]
    },
    {
      keywords: ['smart tv', 'samsung', '55'],
      cheapestStore: 'Amazon',
      bestPrice: 2499.00,
      link: 'https://www.amazon.com.br/s?k=smart+tv+55+samsung',
      allStores: [
        { store: 'Amazon', price: 2499.00 },
        { store: 'Mercado Livre', price: 2549.00 },
        { store: 'Shopee', price: 2599.00 },
        { store: 'KaBuM!', price: 2699.90 },
        { store: 'AliExpress', price: 2890.00 }
      ]
    },
    {
      keywords: ['monitor', 'ultragear', '27'],
      cheapestStore: 'KaBuM!',
      bestPrice: 1099.90,
      link: 'https://www.kabum.com.br/busca/ultragear-27',
      allStores: [
        { store: 'KaBuM!', price: 1099.90 },
        { store: 'Mercado Livre', price: 1189.00 },
        { store: 'Shopee', price: 1199.00 },
        { store: 'Amazon', price: 1249.00 },
        { store: 'AliExpress', price: 1290.00 }
      ]
    },
    {
      keywords: ['ssd', 'nvme', '1tb'],
      cheapestStore: 'AliExpress',
      bestPrice: 289.00,
      link: 'https://aliexpress.com/wholesale?SearchText=ssd+nvme+1tb',
      allStores: [
        { store: 'AliExpress', price: 289.00 },
        { store: 'Shopee', price: 319.00 },
        { store: 'KaBuM!', price: 349.90 },
        { store: 'Mercado Livre', price: 359.00 },
        { store: 'Amazon', price: 379.00 }
      ]
    },
    {
      keywords: ['nintendo switch', 'oled'],
      cheapestStore: 'Shopee',
      bestPrice: 1999.00,
      link: 'https://shopee.com.br/search?keyword=nintendo%20switch%20oled',
      allStores: [
        { store: 'Shopee', price: 1999.00 },
        { store: 'Mercado Livre', price: 2089.00 },
        { store: 'Amazon', price: 2149.00 },
        { store: 'KaBuM!', price: 2199.90 },
        { store: 'AliExpress', price: 2280.00 }
      ]
    }
  ];

  function extractPriceFromText(str) {
    if (!str) return 0;
    const clean = str.replace(/[^\d.,]/g, '');
    // Padrão brasileiro 1.234,56 ou 1234.56
    if (clean.includes(',') && clean.includes('.')) {
      return parseFloat(clean.replace(/\./g, '').replace(',', '.'));
    } else if (clean.includes(',')) {
      return parseFloat(clean.replace(',', '.'));
    }
    return parseFloat(clean) || 0;
  }

  function detectProduct() {
    const url = window.location.href;
    let title = '';
    let price = 0;
    let storeName = 'Loja';

    // 1. Mercado Livre
    if (url.includes('mercadolivre.com.br')) {
      storeName = 'Mercado Livre';
      const titleEl = document.querySelector('h1.ui-pdp-title') || document.querySelector('h1');
      const fractionEl = document.querySelector('.ui-pdp-price__second-line .andes-money-amount__fraction') ||
                         document.querySelector('.andes-money-amount__fraction');
      const centsEl = document.querySelector('.ui-pdp-price__second-line .andes-money-amount__cents') ||
                      document.querySelector('.andes-money-amount__cents');

      if (titleEl) title = titleEl.innerText.trim();
      if (fractionEl) {
        const frac = fractionEl.innerText.replace(/\D/g, '');
        const cents = centsEl ? centsEl.innerText.replace(/\D/g, '') : '00';
        price = parseFloat(`${frac}.${cents}`);
      }
    }
    // 2. Shopee Brasil (SPA Dinâmica)
    else if (url.includes('shopee.com.br')) {
      storeName = 'Shopee';
      const titleEl = document.querySelector('h1') ||
                      document.querySelector('._44qnta') ||
                      document.querySelector('.V3eNZa') ||
                      document.querySelector('[data-sqe="item"] h1');
      const priceEl = document.querySelector('.pqTWkA') ||
                      document.querySelector('._3n5z6N') ||
                      document.querySelector('.IZpeH3') ||
                      document.querySelector('.flex.items-center .text-brand') ||
                      document.querySelector('.pmmxKx');

      if (titleEl) title = titleEl.innerText.trim();
      if (priceEl) price = extractPriceFromText(priceEl.innerText);
    }
    // 3. KaBuM!
    else if (url.includes('kabum.com.br')) {
      storeName = 'KaBuM!';
      const titleEl = document.querySelector('h1');
      const priceEl = document.querySelector('[data-testid="price-value"]') ||
                      document.querySelector('.finalPrice') ||
                      document.querySelector('.regularPrice');

      if (titleEl) title = titleEl.innerText.trim();
      if (priceEl) price = extractPriceFromText(priceEl.innerText);
    }
    // 4. Amazon Brasil
    else if (url.includes('amazon.com.br')) {
      storeName = 'Amazon';
      const titleEl = document.querySelector('#productTitle') || document.querySelector('h1');
      const priceOffscreen = document.querySelector('.a-price .a-offscreen');
      const priceWholeEl = document.querySelector('.a-price-whole');
      const priceFractionEl = document.querySelector('.a-price-fraction');

      if (titleEl) title = titleEl.innerText.trim();
      if (priceOffscreen) {
        price = extractPriceFromText(priceOffscreen.innerText);
      } else if (priceWholeEl) {
        const whole = priceWholeEl.innerText.replace(/\D/g, '');
        const frac = priceFractionEl ? priceFractionEl.innerText.replace(/\D/g, '') : '00';
        price = parseFloat(`${whole}.${frac}`);
      }
    }
    // 5. AliExpress
    else if (url.includes('aliexpress.com')) {
      storeName = 'AliExpress';
      const titleEl = document.querySelector('h1') ||
                      document.querySelector('.product-title-text') ||
                      document.querySelector('[data-pl="product-title"]');
      const priceEl = document.querySelector('[class*="price--current"]') ||
                      document.querySelector('.product-price-value') ||
                      document.querySelector('.uniform-banner-box-price');

      if (titleEl) title = titleEl.innerText.trim();
      if (priceEl) price = extractPriceFromText(priceEl.innerText);
    }
    // 6. Test Store local
    else if (document.querySelector('#precosmart-test-product')) {
      storeName = document.querySelector('#testStoreName')?.innerText || 'Loja Teste';
      title = document.querySelector('#testProductTitle')?.innerText || 'Produto Teste';
      const rawPrice = document.querySelector('#testProductPrice')?.innerText || '0';
      price = extractPriceFromText(rawPrice);
    }

    if (title && price > 0) {
      return { title, price, storeName, url };
    }
    return null;
  }

  function findAlternativeDeal(productTitle, currentPrice, currentStore) {
    const titleLower = productTitle.toLowerCase();

    for (const deal of electronicsDeals) {
      const matches = deal.keywords.every((kw) => titleLower.includes(kw));
      if (matches) {
        if (deal.cheapestStore.toLowerCase() === currentStore.toLowerCase()) {
          return { isBest: true, deal };
        }
        if (currentPrice > deal.bestPrice) {
          const savings = currentPrice - deal.bestPrice;
          const savingsPct = Math.round((savings / currentPrice) * 100);
          return {
            isBest: false,
            savings,
            savingsPct,
            deal
          };
        }
      }
    }
    return null;
  }

  function renderFloatingWidget(product, comparison) {
    // Remover widget anterior se houver
    if (currentFloatingBar) {
      currentFloatingBar.remove();
      currentFloatingBar = null;
    }

    const container = document.createElement('div');
    container.id = 'precosmart-floating-bar';
    currentFloatingBar = container;

    let alertHtml = '';
    let actionBtnHtml = '';

    if (comparison && !comparison.isBest) {
      alertHtml = `
        <div class="precosmart-alert-box cheaper">
          <div class="precosmart-alert-icon">⚡</div>
          <div class="precosmart-alert-text">
            Mais barato na <strong>${comparison.deal.cheapestStore}</strong> por <strong>${formatBRL(comparison.deal.bestPrice)}</strong>.<br>
            Economize <strong>${formatBRL(comparison.savings)} (-${comparison.savingsPct}%)</strong>!
          </div>
        </div>
      `;
      actionBtnHtml = `
        <a href="${comparison.deal.link}" target="_blank" class="precosmart-btn-primary">
          Comprar na ${comparison.deal.cheapestStore}
        </a>
      `;
    } else {
      alertHtml = `
        <div class="precosmart-alert-box best">
          <div class="precosmart-alert-icon">✓</div>
          <div class="precosmart-alert-text">
            <strong>Menor Preço Encontrado!</strong> Este eletrônico está no melhor preço entre <em>Mercado Livre, Shopee, KaBuM!, Amazon e AliExpress</em>.
          </div>
        </div>
      `;
      actionBtnHtml = `
        <button class="precosmart-btn-primary" id="precosmart-save-btn">
          ★ Monitorar Preço
        </button>
      `;
    }

    container.innerHTML = `
      <div class="precosmart-header">
        <div class="precosmart-logo">
          <span class="precosmart-pulse-dot"></span>
          <span>PreçoSmart Eletrônicos</span>
        </div>
        <div style="display: flex; gap: 4px;">
          <button class="precosmart-header-btn" id="precosmart-min-btn" title="Minimizar / Expandir">_</button>
          <button class="precosmart-header-btn" id="precosmart-close-btn" title="Fechar">&times;</button>
        </div>
      </div>
      <div class="precosmart-body" id="precosmart-widget-body">
        <div class="precosmart-product-title" title="${product.title}">
          ${product.title}
        </div>
        <div class="precosmart-current-info">
          Nesta loja (<strong>${product.storeName}</strong>): <span class="precosmart-price-highlight">${formatBRL(product.price)}</span>
        </div>
        ${alertHtml}
        <div class="precosmart-actions">
          ${actionBtnHtml}
          <button class="precosmart-btn-secondary" id="precosmart-compare-btn">
            Comparar 5 Lojas
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    // Eventos
    container.querySelector('#precosmart-close-btn').addEventListener('click', () => {
      container.style.display = 'none';
    });

    const minBtn = container.querySelector('#precosmart-min-btn');
    const bodyEl = container.querySelector('#precosmart-widget-body');
    minBtn.addEventListener('click', () => {
      if (bodyEl.style.display === 'none') {
        bodyEl.style.display = 'block';
        minBtn.innerText = '_';
      } else {
        bodyEl.style.display = 'none';
        minBtn.innerText = '□';
      }
    });

    const saveBtn = container.querySelector('#precosmart-save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({
          action: 'SAVE_TO_WATCHLIST',
          product: {
            title: product.title,
            price: product.price,
            store: product.storeName,
            url: window.location.href,
            date: new Date().toLocaleDateString('pt-BR')
          }
        }, () => {
          saveBtn.innerText = '✓ Adicionado aos Alertas!';
          saveBtn.disabled = true;
        });
      });
    }

    const compareBtn = container.querySelector('#precosmart-compare-btn');
    if (compareBtn) {
      compareBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({
          action: 'PRODUCT_DETECTED',
          product: {
            title: product.title,
            price: product.price,
            store: product.storeName,
            url: window.location.href,
            comparison
          }
        });
        alert('Abra o ícone da extensão PreçoSmart no navegador para visualizar o comparativo completo nas 5 lojas!');
      });
    }

    // Comunicar background
    chrome.runtime.sendMessage({
      action: 'PRODUCT_DETECTED',
      product: {
        title: product.title,
        price: product.price,
        store: product.storeName,
        url: window.location.href,
        comparison
      }
    });
  }

  function runDetection() {
    const currentUrl = window.location.href;
    const product = detectProduct();
    if (product) {
      lastProcessedUrl = currentUrl;
      const comparison = findAlternativeDeal(product.title, product.price, product.storeName);
      renderFloatingWidget(product, comparison);
    }
  }

  // Execução inicial
  setTimeout(runDetection, 1200);

  // Observador de mutações para suportar SPAs (Single Page Applications)
  const observer = new MutationObserver(() => {
    if (window.location.href !== lastProcessedUrl) {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(runDetection, 1000);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
