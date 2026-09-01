# ⚡ PreçoSmart v2 PRO — Comparador Inteligente de Eletrônicos

<p align="center">
  <img src="assets/logo-precosmart-pro.jpg" alt="PreçoSmart v2 PRO Logo" width="220" style="border-radius: 24px; box-shadow: 0 10px 30px rgba(16,185,129,0.3);" />
</p>

<p align="center">
  <strong>O Assistente de Compras Inteligente para Eletrônicos no Google Chrome (Manifest V3)</strong><br>
  Monitore preços à vista no <strong>Pix</strong> e <strong>Parcelado em até 12x</strong>, acompanhe o gráfico de 30 dias e compare instantaneamente as 5 maiores lojas de tecnologia.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Versão-2.0.0_PRO-10B981?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Versão 2.0.0 PRO" />
  <img src="https://img.shields.io/badge/Manifest-V3-06B6D4?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Manifest V3" />
  <img src="https://img.shields.io/badge/Atalho-Alt%2BP-3B82F6?style=for-the-badge" alt="Atalho Alt+P" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License MIT" />
</p>

---

## 🏬 As 5 Lojas de Tecnologia Monitoradas

- 🟡 **Mercado Livre**
- 🟠 **Shopee**
- 🟧 **KaBuM!**
- 🔶 **Amazon Brasil**
- 🔴 **AliExpress**

---

## 🚀 Novidades da Versão 2.0 PRO

1. ⚡ **Comparativo Pix (à vista) vs Parcelado:**
   - Detecta e compara tanto o valor promocional com desconto no Pix quanto a melhor condição de parcelamento em até 12x sem juros.
2. 📈 **Mini-Gráfico Sparkline (Histórico de 30 Dias):**
   - Visualize a curva de preços dos últimos 30 dias diretamente no popup e saiba na hora se o preço atual está na **Mínima Histórica (🟢 Excelente momento para comprar)**.
3. 💰 **Calculadora de Economia Acumulada:**
   - Acompanhe em tempo real quanto dinheiro a extensão já economizou para você nas suas buscas.
4. ⌨️ **Atalho Global de Teclado:**
   - Abra o comparador em qualquer aba apenas pressionando **`Alt + P`** (sem precisar tirar a mão do teclado para clicar no ícone).
5. 🛡️ **Design System Corporativo & Dark Tech UI:**
   - Interface em tons de Dark Slate com gradiente Esmeralda/Ciano, badges de lojas oficiais e microinterações táteis.
6. 💾 **Backup & Exportação:**
   - Exporte sua lista de alertas e eletrônicos favoritados em formato `.json` com 1 clique.

---

## 💡 Arquitetura Técnica

```mermaid
flowchart TD
    User["Navegação em E-Commerce"] --> Ext["PreçoSmart v2 Pro (Content Script)"]
    Ext -->|SPA MutationObserver| DOM["Extração de Título, Preço Pix e Parcelado"]
    DOM --> Matcher["Engine de Comparação Multi-Loja"]
    Matcher --> Widget["Widget Flutuante na Página\n(⚡ Economia em R$ e %)"]
    Matcher --> SW["Service Worker (MV3)"]
    SW --> Badge["Badge Dinâmico (R$↓ ou ✓)"]
    SW --> Storage["chrome.storage.local (Alertas & Histórico)"]
    Storage --> Popup["Popup v2 Pro\n(Sparkline 30d • Pix/Cartão • Atalho Alt+P)"]
```

---

## 📦 Como Instalar no Google Chrome

1. Abra o Chrome e acesse:
   ```text
   chrome://extensions
   ```
2. Ative o **Modo do desenvolvedor** no canto superior direito.
3. Clique em **Carregar sem compactação** e selecione a pasta:
   ```text
   C:\Users\th\.gemini\antigravity\scratch\comparador-precos-extensao
   ```
4. Pressione **`Alt + P`** para abrir o PreçoSmart v2 Pro em qualquer momento!

---

## 🧪 Teste Offline Imediato

Abra o arquivo `test-store.html` no seu navegador dando dois cliques para ver o produto de tecnologia ser detectado e o comparativo Pix/Cartão ser ativado automaticamente.

---

## 📄 Licença

Distribuído sob a licença **MIT**.
