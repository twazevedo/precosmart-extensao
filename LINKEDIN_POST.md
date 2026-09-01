# 💼 Publicação Oficial para o LinkedIn: PreçoSmart v3 Ultra

> **Imagem Recomendada:** Anexe o arquivo `assets/linkedin-showcase-v3.jpg` ou `assets/linkedin-banner.jpg`.

---

### 📝 Copie e Cole o Texto Abaixo no seu LinkedIn:

Quantas vezes você já comprou um eletrônico pela internet e, dias depois, descobriu que ele estava centenas de reais mais barato em outra loja confiável?

No e-commerce brasileiro, a disparidade de preços para o mesmo smartphone, placa de vídeo ou console de videogame frequentemente ultrapassa 25% a 30% entre os grandes marketplaces.

Para resolver esse problema de ponta a ponta, desenvolvi e lancei o **PreçoSmart v3 Ultra** — uma extensão completa para o Google Chrome projetada para auditar, comparar e aplicar descontos automaticamente enquanto o usuário navega.

---

### 🚀 O que o PreçoSmart v3 Ultra entrega:

1. ⚡ **Comparador Multi-Loja em Tempo Real (5 em 1):**
   Ao acessar qualquer página de eletrônicos no Mercado Livre, Shopee, KaBuM!, Amazon ou AliExpress, a extensão extrai os metadados do produto e cruza as cotações nas outras 4 lojas instantaneamente.

2. 💳 **Diferenciação Pix (à vista) vs Parcelado (12x):**
   Compara tanto o desconto promocional no Pix quanto o melhor custo de parcelamento sem juros em cada loja.

3. 🎟️ **Testador Automático de Cupons (Estilo Honey):**
   Mecanismo que testa cupons ativos em lote com feedback visual de progresso e copia automaticamente para o checkout aquele que gera a maior economia real em reais.

4. 🛡️ **Selo Anti-Fraude ("Promoção Real vs Metade do Dobro"):**
   Algoritmo de auditoria estatística que calcula a média móvel dos últimos 30 a 60 dias para alertar o consumidor se o desconto é genuíno ou se o preço foi inflado artificialmente antes de uma campanha.

5. 📲 **Alerta de Queda de Preço via WhatsApp:**
   Permite estipular um valor teto desejado e gera a notificação formatada para acionar alertas instantâneos no WhatsApp.

6. 🚚 **Comparador de Frete & Logística:**
   Sinaliza selos operacionais como Mercado Livre Full, Amazon Prime, Entrega Ninja da KaBuM! e conformidade tributária no AliExpress.

---

### 🛠️ Desafios de Engenharia & Arquitetura Técnica:

Construir essa ferramenta exigiu superar regras estritas do novo padrão **Google Chrome Manifest V3**:

* **Resiliência a SPAs:** Implementação de `MutationObserver` com debounce para monitorar alterações dinâmicas no DOM de páginas com renderização client-side (como Shopee e AliExpress) com custo computacional mínimo.
* **Ciclo de Vida Efêmero:** Gerenciamento de estado descentralizado utilizando a API assíncrona `chrome.storage.local`, garantindo que o background service worker não retenha memória desnecessária.
* **Segurança e CSP:** Arquitetura 100% livre de scripts inline ou avaliações de código dinâmicas, atendendo aos mais rigorosos critérios de revisão de segurança da Chrome Web Store.
* **Design System Próprio:** Interface moderna em Dark Glassmorphism, com tipografia refinada, acessibilidade (WAI-ARIA) e microinterações táteis.

---

O projeto é **100% Open Source** e o código fonte completo está disponível no meu GitHub:
🔗 Repositório: https://github.com/twazevedo/precosmart-extensao

Adoraria receber o feedback de colegas desenvolvedores, tech leads e entusiastas de e-commerce sobre a arquitetura e a experiência de uso!

#EngenhariaDeSoftware #JavaScript #WebDevelopment #GoogleChrome #ManifestV3 #OpenSource #SoftwareEngineering #TechInnovation #Frontend #Programacao #ProductDevelopment
