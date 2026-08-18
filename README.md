# Sunset Rush · Fúria do Pôr do Sol

Sunset Rush é um jogo de corrida arcade em paisagem, ambientado na Rota 66. A experiência original foi preservada: corrida, carros, upgrades, conquistas, biomas, pontuação, controles por toque, teclado e sistema de save continuam no mesmo arquivo principal.

## O que está preparado

O projeto agora também possui um **PWA instalável**. O jogo pode ser aberto pelo navegador do celular e adicionado à tela inicial como um aplicativo, com ícone próprio, orientação paisagem, carregamento local do motor 3D e funcionamento básico sem conexão depois do primeiro acesso.

| Arquivo | Função |
| --- | --- |
| `index.html` | Jogo original e interface, com ajustes técnicos de publicação e carregamento local do Three.js. |
| `manifest.webmanifest` | Nome, ícones, cores, orientação e modo instalável. |
| `sw.js` | Cache do aplicativo e atualização controlada dos arquivos estáticos. |
| `vendor/three.min.js` | Cópia local do Three.js para reduzir a dependência de CDN. |
| `icons/` | Ícones da logo para PWA, navegador e tela inicial. |
| `vercel.json` | Cabeçalhos para que o HTML e o service worker recebam atualizações corretamente. |

## Instalar no celular

Abra [`https://car-pend.vercel.app`](https://car-pend.vercel.app) no navegador do celular. No Android, use o menu do navegador e escolha **Instalar aplicativo** ou **Adicionar à tela inicial**. No iPhone, abra pelo Safari, toque em **Compartilhar** e escolha **Adicionar à Tela de Início**. Depois disso, o jogo aparece com o ícone do carro e abre em modo de aplicativo, normalmente em paisagem.

A instalação depende de o endereço estar publicado com HTTPS. O endereço atual do projeto já usa HTTPS.

## Como atualizar o jogo para todos

O ponto correto para enviar alterações é este repositório GitHub, na branch `main`:

```text
https://github.com/jeanvicen/car.pend
```

O site atual está associado ao projeto Vercel que publica [`https://car-pend.vercel.app`](https://car-pend.vercel.app). Portanto, o fluxo recomendado é:

1. Alterar os arquivos localmente, preservando a lógica de corrida.
2. Testar o jogo no celular e no computador.
3. Enviar as alterações para a branch `main`:

```bash
git add .
git commit -m "Descreva a alteração"
git push origin main
```

4. A Vercel fará um novo deploy automaticamente quando o projeto estiver conectado ao GitHub.
5. Os jogadores continuarão usando o mesmo endereço. O service worker foi configurado para buscar versões novas, e a atualização do cache também pode ser forçada fechando e abrindo o aplicativo uma vez.

Se uma alteração for feita diretamente pelo editor do GitHub, use **Commit changes** na branch `main`; o resultado será o mesmo: o deploy será iniciado pelo vínculo GitHub–Vercel.

## Regra para futuras alterações

Não remova `manifest.webmanifest`, `sw.js`, `vendor/three.min.js` ou a pasta `icons/`. Se o jogo for alterado, aumente a versão em `CACHE_NAME` dentro de `sw.js`, por exemplo de `sunset-rush-v1` para `sunset-rush-v2`, para garantir que todos os arquivos estáticos sejam renovados no próximo acesso.

## Teste local

Como o service worker exige um contexto seguro, teste por um servidor local, e não abrindo `index.html` diretamente pelo explorador de arquivos. Um exemplo simples é:

```bash
python3 -m http.server 4173
```

Depois, abra `http://localhost:4173` no navegador.
