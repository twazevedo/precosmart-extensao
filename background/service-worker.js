// PreçoSmart - Background Service Worker (Manifest V3)

// Salva dados no chrome.storage
async function saveToWatchlist(item) {
  const { watchlist = [] } = await chrome.storage.local.get('watchlist');
  const updated = [item, ...watchlist.filter((i) => i.title !== item.title)];
  await chrome.storage.local.set({ watchlist: updated });
}

// Escuta mensagens vindas do content script ou do popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      if (message.action === 'PRODUCT_DETECTED') {
        const { product } = message;
        const tabId = sender.tab ? sender.tab.id : null;

        // Salvar último produto detectado para o popup consultar
        await chrome.storage.local.set({ lastDetectedProduct: product });

        // Atualizar badge da extensão
        if (tabId && product.comparison) {
          if (!product.comparison.isBest) {
            await chrome.action.setBadgeText({ tabId, text: 'R$↓' });
            await chrome.action.setBadgeBackgroundColor({ tabId, color: '#E11D48' });
            await chrome.action.setTitle({
              tabId,
              title: `PreçoSmart: Oferta mais barata na ${product.comparison.deal.cheapestStore}!`
            });
          } else {
            await chrome.action.setBadgeText({ tabId, text: '✓' });
            await chrome.action.setBadgeBackgroundColor({ tabId, color: '#059669' });
            await chrome.action.setTitle({
              tabId,
              title: 'PreçoSmart: Você está no menor preço!'
            });
          }
        }
        sendResponse({ success: true });
      } else if (message.action === 'SAVE_TO_WATCHLIST') {
        await saveToWatchlist(message.product);
        sendResponse({ success: true });
      } else if (message.action === 'GET_WATCHLIST') {
        const { watchlist = [] } = await chrome.storage.local.get('watchlist');
        sendResponse({ watchlist });
      }
    } catch (err) {
      console.error('Erro no service-worker:', err);
      sendResponse({ error: err.message });
    }
  })();

  return true; // Mantém o canal de mensagem aberto para resposta assíncrona
});

// Limpa o badge ao navegar para outra página
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status === 'loading') {
    try {
      await chrome.action.setBadgeText({ tabId, text: '' });
    } catch (e) {
      // Ignorar se a aba já foi fechada
    }
  }
});
