# 📱 Modelo de Postagem para o LinkedIn: Lançamento do PreçoSmart

Copie e cole o texto abaixo no seu perfil do LinkedIn para apresentar o projeto como um estudo de caso técnico de alto nível para recrutadores e conexões da área de tecnologia.

---

### 📝 Texto do Post:

Você já percebeu que o mesmo eletrônico pode ter uma diferença de R$ 200 a R$ 500 dependendo de qual loja você está olhando? 💸

Para resolver esse problema de forma automática e inteligente, desenvolvi o **PreçoSmart Eletrônicos** — uma extensão para o Google Chrome em **Manifest V3** que monitora e compara ofertas em tempo real enquanto você navega! ⚡

### 🎯 Como o projeto funciona:
Ao entrar em uma página de produto no **Mercado Livre, Shopee, KaBuM!, Amazon ou AliExpress**, a extensão detecta automaticamente o modelo e o preço através de um Content Script não-intrusivo.

Instantaneamente, um widget flutuante e o ícone do navegador informam:
1. Se aquele já é o menor preço disponível na internet.
2. Ou se existe uma loja concorrente com preço mais baixo, calculando a economia exata em Reais e porcentagem (-% off) com link direto para a oferta vencedora.

### 🛠️ Principais Desafios Técnicos & Decisões de Arquitetura:
- **Manifest V3 & Service Workers:** Implementação seguindo os padrões mais recentes do Chrome, lidando com o ciclo de vida efêmero do background worker e eliminando estados voláteis globais com `chrome.storage.local`.
- **Suporte a SPAs (Single Page Applications):** Lojas como Shopee e AliExpress renderizam conteúdo de forma altamente assíncrona. Utilizei `MutationObserver` com debounce para capturar mutações de DOM sem causar overhead de performance ou render lag.
- **Microinterações & UX:** Criação de um widget com estados colapsáveis, pulso de status e popup responsivo com busca simultânea e exportação de alertas em JSON.
- **Preparado para Produção:** Projeto com política de privacidade, justificativas estritas de permissão e empacotamento automatizado para a Chrome Web Store.

O código é 100% aberto e documentado com arquitetura e guia de execução!

🔗 **Repositório no GitHub:** [Link do seu repositório aqui]
📦 **Licença:** MIT (Open Source)

Feedbacks e sugestões são muito bem-vindos nos comentários! 👇

#JavaScript #WebDevelopment #GoogleChrome #ChromeExtension #Frontend #OpenSource #SoftwareEngineering #TechInnovation #FullStack #Portfolio #Programacao
