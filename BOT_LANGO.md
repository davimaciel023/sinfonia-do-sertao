# Bot Lango — guia rápido

O widget do Bot Lango não usa mais o Botpress. Agora é:

- **Frontend**: `src/components/BotLango/` — um componente React que reproduz a
  mesma estética do webchat antigo (cor `#371F14`, tema claro, cabeçalho
  "vidro", tela inicial com card + 4 starters em grade, bolha flutuante).
- **Backend**: `netlify/functions/chat.mjs` — uma Netlify Function que chama a
  API da Groq (gratuita) com streaming de verdade. É isso que resolve o bug
  dos "3 pontinhos" que sumiam sem resposta: o texto vai aparecendo aos
  poucos, então o indicador de "digitando" só desaparece quando a resposta
  realmente começa a chegar.
- **Base de conhecimento**: `netlify/functions/_shared/systemPrompt.mjs` — o
  "cérebro" do bot. Reúne o papel, o tom, o escopo, as guardrails de
  segurança e o conteúdo real do site (história, observadores, indicadores
  naturais, calendário, comparação com a Funceme). Para atualizar o que o bot
  sabe, edite esse arquivo — é só texto.

## 1. Criar a chave de API da Groq

A Groq tem um plano gratuito de verdade (sem pedir cartão) para a API, com um
limite de uso diário — mais do que suficiente para um chatbot de projeto
acadêmico.

1. Crie uma conta em [console.groq.com](https://console.groq.com).
2. Vá em [**API Keys**](https://console.groq.com/keys) → **Create API Key**.
3. Copie a chave (começa com `gsk_...`) — ela só aparece uma vez.

Não é preciso adicionar cartão nem créditos para usar o plano gratuito.

> **Sobre o modelo padrão:** usamos `qwen/qwen3.8-27b`. O motivo: contas da
> Groq têm uma lista de "Allowed Models" (Organization Limits → Allowed
> Models) que restringe quais modelos podem ser usados — nem todo modelo
> gratuito listado na documentação da Groq está liberado pra sua conta por
> padrão. Se um modelo der **403 "blocked at the organization level"**, é
> isso; se der **404 "model_not_found"**, o ID do modelo não existe (mudou
> ou foi descontinuado).
>
> Pra ver/mudar o que está liberado: acesse
> [console.groq.com/settings/limits](https://console.groq.com/settings/limits)
> (logado com a conta da chave) → **Allowed Models** → **Edit**, e adicione
> outros modelos (como os da família `openai/gpt-oss-*`, geralmente mais
> rápidos) se quiser trocar. Depois de mudar o `.env`, é preciso reiniciar
> o `netlify dev` pra ele carregar a variável nova.
>
> Evite os modelos da família "Compound" (`groq/compound`,
> `groq/compound-mini`) para este bot: são sistemas agentes com busca na
> web/execução de código, respondem mais devagar e o formato de streaming
> deles não bate com o que a função `chat.mjs` sabe interpretar — o bot fica
> sem resposta.

## 2. Rodar localmente

O `vite dev` sozinho não roda a Netlify Function. Use o `netlify dev` (que
sobe o site e as funções juntos):

```bash
npm install
npx netlify-cli dev
```

Antes disso, copie `.env.example` para `.env` e cole sua chave:

```bash
cp .env.example .env
# edite .env e preencha GROQ_API_KEY
```

## 3. Deploy (Netlify)

O projeto já está configurado para Netlify (`netlify.toml`). No painel do
site em [app.netlify.com](https://app.netlify.com):

1. **Site configuration → Environment variables** → adicione `GROQ_API_KEY`
   com sua chave.
2. (Opcional) adicione `GROQ_MODEL` se quiser trocar o modelo padrão
   (`openai/gpt-oss-20b`) por outro disponível na Groq (ex.:
   `llama-3.3-70b-versatile`).
3. Faça o deploy normalmente (`git push`, se o site estiver conectado a um
   repositório). As Netlify Functions são detectadas automaticamente pela
   pasta `netlify/functions`.

## 4. O que foi removido

- Os dois `<script>` do Botpress e o CSS que escondia o indicador de
  "digitando" foram removidos do `index.html`.
- O botão "Conversar com o Bot Calango" (`ChatbotDestaque.jsx`) agora abre o
  novo widget em vez de chamar `window.botpress.open()`.

## 5. Ajustes finos

- **Starters da tela inicial**: `src/components/BotLango/starters.js`.
- **Cores/tamanhos**: `src/components/BotLango/BotLangoWidget.css` (tudo
  isolado sob a classe `.botlango`, não vaza pro resto do site).
- **Tamanho/velocidade das respostas**: `MAX_TOKENS` e `MODEL` no topo de
  `netlify/functions/chat.mjs`.
- **Limites do plano gratuito**: se em algum momento o bot passar a responder
  com a mensagem de erro padrão sob uso intenso (por exemplo, muita gente
  testando ao mesmo tempo na apresentação do projeto), é provável que seja o
  limite diário/por minuto do plano gratuito da Groq — os limites atuais
  ficam em [console.groq.com/settings/limits](https://console.groq.com/settings/limits).
