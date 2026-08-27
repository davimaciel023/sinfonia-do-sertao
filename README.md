# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:


## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Sinfonia do Sertao

Portal dos Observadores da Natureza, desenvolvido com React e Vite.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Apresentacao offline com Docker

A imagem compila o projeto e serve os arquivos estaticos com Nginx. As imagens usadas pelo portal ficam em `public/images`, e o chatbot possui respostas locais para funcionar sem internet.

```bash
docker build -t sinfonia-do-sertao .
docker run --rm -p 8080:80 sinfonia-do-sertao
```

Abra `http://localhost:8080` no navegador. Para a apresentacao, a imagem Docker precisa ser criada antes e levada para o computador sem internet:

```bash
docker save sinfonia-do-sertao -o sinfonia-do-sertao.tar
docker load -i sinfonia-do-sertao.tar
docker run --rm -p 8080:80 sinfonia-do-sertao
```

## Verificacoes

```bash
npm run build
npm run lint
```
