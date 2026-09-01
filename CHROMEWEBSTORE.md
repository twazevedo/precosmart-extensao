# Chrome Web Store Listing: PreçoSmart - Comparador de Preços

**Last Updated:** 31/08/2026  
**Extension Version:** 1.0.0  
**Manifest Version:** 3

---

## 1. Store Listing Details

### Extension Name
PreçoSmart - Comparador de Preços em Tempo Real

### Summary (132 characters max)
Compara preços automaticamente em lojas virtuais brasileiras e encontra a melhor oferta e menor preço em tempo real.

### Detailed Description
O **PreçoSmart** é o seu assistente inteligente de economia para compras online no Brasil.

Ao navegar por lojas como Mercado Livre, Amazon Brasil, Magazine Luiza, KaBuM! e Carrefour, a extensão detecta automaticamente o produto e avisa instantaneamente se existe uma oferta mais barata em outra loja de confiança.

#### Principais Recursos:
- ⚡ **Detector Automático de Preços:** Receba um alerta discreto caso o item que você está visualizando esteja mais barato em outro e-commerce.
- 📊 **Comparador Completo:** Abra o popup da extensão e compare lado a lado as cotações de todas as lojas para aquele mesmo produto.
- 🔍 **Busca Rápida de Produtos:** Pesquise diretamente pelo popup qualquer smartphone, TV, monitor ou eletrodoméstico sem precisar abrir dezenas de abas.
- ⭐ **Lista de Alertas & Monitoramento:** Salve produtos que você deseja acompanhar e consulte os preços históricos quando quiser.

Economize tempo e dinheiro em todas as suas compras com apenas um clique!

### Category
Shopping / Compras

---

## 2. Permissions Justification

| Permission | Justification |
|------------|---------------|
| `storage` | Utilizado exclusivamente para armazenar de forma local no navegador a lista de alertas de preços do usuário e a última cotação detectada. Nenhum dado pessoal é transmitido. |
| `activeTab` | Permite que a extensão inspecione a aba aberta pelo usuário para identificar o título e o preço do produto visualizado e exibir o alerta de economia. |

### Host Permissions Justification

| Pattern | Justification |
|---------|---------------|
| `*://*.mercadolivre.com.br/*` | Permite detectar preços e produtos na loja Mercado Livre para comparação. |
| `*://*.amazon.com.br/*` | Permite detectar preços e produtos na loja Amazon Brasil para comparação. |
| `*://*.magazineluiza.com.br/*` | Permite detectar preços e produtos na loja Magazine Luiza para comparação. |
| `*://*.kabum.com.br/*` | Permite detectar preços e produtos na loja KaBuM! para comparação. |
| `*://*.carrefour.com.br/*` | Permite detectar preços e produtos na loja Carrefour para comparação. |

---

## 3. Privacy & Data Disclosures

- **Coleta de Dados:** Esta extensão **NÃO** coleta dados pessoais identificáveis, históricos de navegação completos, senhas ou dados financeiros.
- **Processamento:** Todas as verificações de preços e armazenamento de favoritos ocorrem localmente no dispositivo (`chrome.storage.local`).
- **Política de Privacidade:** Dados do usuário não são vendidos nem compartilhados com terceiros.

---

## 4. Version History

### Version 1.0.0 (31/08/2026)
- Lançamento inicial em Manifest V3.
- Injeção de banner flutuante em páginas de lojas parceiras.
- Popup com busca de produtos, comparativo lado a lado e lista de alertas.
- Suporte a Mercado Livre, Amazon, Magalu, KaBuM! e páginas de teste.
