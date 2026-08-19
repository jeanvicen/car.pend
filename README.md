# Drifin Slot

Drifin Slot é um jogo de corrida arcade 3D em paisagem, ambientado na Rota 66 e redesenhado para celular e PC. A modernização preserva a base de corrida, carros, upgrades, conquistas, biomas, pontuação, controles por toque, teclado e sistema de save, enquanto melhora identidade visual, apresentação dos veículos, garagem, desempenho, iluminação, animações, áudio e resposta de drift.

## O que foi modernizado

A nova direção visual usa painéis glass, ciano, violeta, âmbar e azul profundo, com uma interface mais legível em telas pequenas. O menu agora usa a marca Drifin Slot, os ícones foram substituídos pela logo neon do carro e os cards da garagem ganharam uma apresentação mais rica. A aba de carros possui um **showroom 3D** que reutiliza os mesmos meshes procedurais da pista e acompanha a seleção atual.

O renderer passou a escolher automaticamente um perfil **Econômico**, **Mobile** ou **Alto**, limitando pixel ratio, antialiasing e sombras de acordo com o aparelho. A simulação ganhou uma resposta lateral mais natural para aderência normal, freio e chuva. Também foi removido o cálculo de normais da água quando o mar não está visível na pista, evitando trabalho desnecessário por frame em celulares.

| Arquivo | Função |
| --- | --- |
| `index.html` | Jogo, interface Drifin Slot, renderer adaptativo, showroom e lógica original de corrida. |
| `manifest.webmanifest` | Nome, logo, cores, orientação e modo instalável. |
| `sw.js` | Cache do aplicativo e atualização do pacote `drifin-slot-v1`. |
| `vendor/three.min.js` | Cópia local do Three.js. |
| `icons/` | Logo Drifin Slot para PWA, navegador, iPhone e Android. |
| `assets/` | Referência visual e originais de direção de arte. |
| `apk/` | Projeto Capacitor para gerar APK/AAB Android. |
| `PLAN.md`, `STRUCTURE.md`, `MEMORY.md`, `ASSETS.md` | Plano, arquitetura, decisões e inventário de assets da modernização. |

## Instalar no celular

Abra [`https://car-pend.vercel.app`](https://car-pend.vercel.app) no navegador do celular. No Android, use o aviso **Instalar Drifin Slot** ou o menu do Chrome e escolha **Instalar aplicativo**. No iPhone, abra pelo Safari, toque em **Compartilhar** e escolha **Adicionar à Tela de Início**. O jogo foi preparado para abrir em paisagem.

## Atualizar para todos os jogadores

O ponto correto para enviar alterações é este repositório GitHub, na branch `main`:

```text
https://github.com/jeanvicen/car.pend
```

O fluxo local é:

```bash
git add .
git commit -m "Descreva a alteração"
git push origin main
```

O site atual está associado à Vercel e continua usando [`https://car-pend.vercel.app`](https://car-pend.vercel.app). O deploy ocorre após o envio para `main`. Para alterações do jogo, não remova os IDs dos controles, as chaves de `localStorage` nem o formato do save. Ao mudar arquivos do app, incremente `CACHE_NAME` em `sw.js`, por exemplo para `drifin-slot-v2`, para renovar o cache nos aparelhos.

## APK Android

A pasta [`apk/`](./apk/) contém a embalagem Capacitor. O `applicationId` Android permanece `com.klipzastudio.sunsetrush` para permitir continuidade das instalações já existentes, mas o nome visível do aplicativo é **Drifin Slot**. Para gerar um APK de teste, use um computador com Node.js, Java, Android Studio e Android SDK:

```bash
cd apk
npm install
npm run sync
npm run build-debug
```

O APK fica em `apk/android/app/build/outputs/apk/debug/app-debug.apk`. Para publicação na Google Play, configure uma chave de assinatura privada e gere o bundle release com `npm run build-release`. Senhas e chaves de assinatura nunca devem entrar no GitHub.

## Teste local

Como o service worker exige um contexto seguro, teste usando um servidor HTTP local:

```bash
python3 -m http.server 4173
```

Depois, abra `http://localhost:4173` no navegador. A tag `drifin-slot-baseline-3f3c485` aponta para a versão funcional anterior caso seja necessário comparar ou reverter.
