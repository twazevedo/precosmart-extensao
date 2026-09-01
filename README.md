# ⚡ PreçoSmart v3 ULTRA — Inteligência de Compras, Cupons & Anti-Fraude

<p align="center">
  <img src="assets/logo-precosmart-pro.jpg" alt="PreçoSmart v3 ULTRA Logo" width="220" style="border-radius: 24px; box-shadow: 0 10px 30px rgba(16,185,129,0.3);" />
</p>

<p align="center">
  <strong>A Plataforma Definitiva de Economia em Eletrônicos no Google Chrome (Manifest V3)</strong><br>
  Comparador em tempo real (Pix e Parcelado), Testador Automático de Cupons, Selo Anti-Fraude "Metade do Dobro", Comparador de Frete e Alertas no WhatsApp.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Versão-3.0.0_ULTRA-10B981?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Versão 3.0.0 ULTRA" />
  <img src="https://img.shields.io/badge/Manifest-V3-06B6D4?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Manifest V3" />
  <img src="https://img.shields.io/badge/WhatsApp-Integrado-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" alt="WhatsApp Integrado" />
  <img src="https://img.shields.io/badge/Cupons-Automáticos-F59E0B?style=for-the-badge" alt="Cupons Automáticos" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License MIT" />
</p>

---

## 🏬 As 5 Lojas de Tecnologia Monitoradas

- 🟡 **Mercado Livre:** Entrega Full (Chega amanhã)
- 🟠 **Shopee:** Cupons de Frete Grátis
- 🟧 **KaBuM!:** Entrega Ninja & Hardware Oficial
- 🔶 **Amazon Brasil:** Envio Rápido Prime
- 🔴 **AliExpress:** Certificado Remessa Conforme (Tributos Inclusos)

---

## 🚀 Os 5 Super Módulos da Versão 3.0 ULTRA

### 1. 🎟️ Testador Automático de Cupons (Estilo Honey)
- Executa testes em lote dos cupons disponíveis para a loja atual com barra de progresso visual.
- Copia automaticamente o cupom que gerar o maior desconto em dinheiro!

### 2. 🕵️ Selo Anti-Fraude "Promoção Real vs Metade do Dobro"
- Algoritmo de auditoria que compara o valor com os últimos 60 dias:
  - 🟢 **Promoção Autêntica:** Preço mais de 8% abaixo da média histórica.
  - ⚠️ **Alerta "Metade do Dobro":** Identifica preços inflados artificialmente antes de promoções.
  - 🟡 **Preço Estável:** Valor em consonância com a média usual.

### 3. 🚚 Comparador de Frete & Logística Oficial
- Identifica e exibe as modalidades de frete expresso de cada loja (Prime, Full, Ninja, etc.).

### 4. 📲 Alertas de Queda de Preço via WhatsApp
- Defina o seu preço meta (ex: *"Avisar quando baixar de R$ 1.800,00"*) e abra a notificação pronta para enviar no WhatsApp com 1 clique.

### 5. 💰 Motor de Monetização por Afiliados
- Permite configurar suas tags de parceiro da Amazon, Shopee e Mercado Livre.
- Cada clique em *"Ver Oferta ↗"* anexa sua identificação oficial para gerar comissões automáticas!

---

## 💡 Arquitetura de Produção

```mermaid
flowchart TD
    User["Navegação em Eletrônicos"] --> Content["Content Script (MV3)"]
    Content --> Audit["Selo Anti-Fraude (Metade do Dobro)"]
    Content --> Coupon["Detector de Cupons"]
    Content --> Storage["chrome.storage.local"]
    Storage --> Popup["Popup v3 Ultra"]
    Popup -->|1 Clique| WA["Notificação WhatsApp (wa.me)"]
    Popup -->|Auto-Apply| Tester["Testador Automático de Cupons"]
    Popup -->|Monetização| Aff["Motor de Links de Afiliados"]
```

---

## 📦 Como Instalar no Google Chrome

1. Abra o Chrome e acesse:
   ```text
   chrome://extensions
   ```
2. Ative o **Modo do desenvolvedor** no topo direito.
3. Clique em **Carregar sem compactação** e selecione a pasta:
   ```text
   C:\Users\th\.gemini\antigravity\scratch\comparador-precos-extensao
   ```
4. Pressione **`Alt + P`** para abrir o PreçoSmart v3 Ultra a qualquer momento!

---

## 📄 Licença

Distribuído sob a licença **MIT**.
