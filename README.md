# Drifin Slot

Drifin Slot é um jogo de corrida arcade 3D em paisagem, ambientado na Rota 66 e preparado para celular e PC. A base de corrida, carros, upgrades, conquistas, biomas, pontuação, controles por toque, teclado e sistema de save continuam preservados.

## Modernização

A interface usa painéis glass, ciano, violeta, âmbar e azul profundo, com leitura melhor em telas pequenas. A garagem ganhou showroom 3D, os carros receberam acabamento procedural mais rico e silhuetas próprias, e o renderer escolhe automaticamente os perfis **Econômico**, **Mobile** ou **Alto**. A simulação lateral foi refinada para aderência, freio, chuva e relevo; a estrada agora tem curvas suaves, subidas e lombadas leves, enquanto áudio, iluminação, neve, reflexos e animações recebem densidade adaptativa.

A **foto anterior do carro com o pôr do sol laranja** foi restaurada como logo do PWA, favicon, ícone do iPhone e launcher Android. O nome visível continua sendo **Drifin Slot**.

| Arquivo | Função |
| --- | --- |
| `index.html` | Jogo, interface, showroom, controles e sistema de atualização. |
| `vehicle-engine.js` | Motor modular de veículos: aceleração, freio, aderência, drift, chuva e suspensão visual por perfil. |
| `manifest.webmanifest` | Nome, logo, cores, orientação e instalação PWA. |
| `version.json` | Versão publicada, descrição da atualização e estimativa de tamanho. |
| `sw.js` | Cache do aplicativo, atualização segura e limpeza de versões antigas. |
| `vendor/three.min.js` | Cópia local do Three.js. |
| `icons/` | Foto anterior nos tamanhos PWA, navegador, iPhone e Android. |
| `assets/` | Logo restaurada e referências visuais. |
| `apk/` | Projeto Capacitor para gerar APK/AAB Android. |

## Instalação no celular

Para ocupar a tela inteira e ocultar a barra superior do Android, instale o jogo como **PWA** pelo aviso `Instalar Drifin Slot` ou use o APK/AAB Android. O PWA instalado usa `display: fullscreen` e solicita fullscreen no primeiro toque em `Ligar o Motor`; o APK aplica modo imersivo nativo, ocultando status bar, navegação e gestos enquanto o jogo está em foco. Em uma aba comum do Chrome, o sistema pode manter a barra superior por segurança; nesse caso, instale o PWA ou use o APK.

Abra [`https://car-pend.vercel.app`](https://car-pend.vercel.app) no navegador do celular. No Android, use o aviso **Instalar Drifin Slot** ou o menu do Chrome e escolha **Instalar aplicativo**. No iPhone, abra pelo Safari, toque em **Compartilhar** e escolha **Adicionar à Tela de Início**. O jogo foi preparado para abrir em paisagem.

## Câmeras e modernização visual

Durante a corrida, use o botão `◌` no HUD ou pressione `C`/`V` para alternar entre a câmera externa de perseguição e a **visão interna do carro**. O cockpit mostra painel, volante com raios, mãos, antebraços, display emissivo e para-brisa translúcido. O volante gira com a direção real; a carroceria externa, rodas e efeitos inferiores são ocultados nessa visão para manter a pista livre e a leitura correta em telas pequenas. A câmera acompanha o yaw, a inclinação da estrada, o roll de curva, a aceleração, a frenagem e os saltos.

A modernização mantém o Three.js local como base de renderização, em vez de migrar todo o jogo para Babylon.js. Essa decisão preserva a compatibilidade offline, os pools de objetos, o PWA, o APK, a física e o save; os ganhos vêm de materiais físicos leves, ambiente refletivo, carros com rodas detalhadas, marcos refletivos, clima, transferência de peso visual e áudio de pneus proporcional ao drift. A release 4.1.0 acrescentou a dinâmica local; a 4.2.0 amplia a mesma base com estrada de relevo, cockpit animado, silhuetas de veículos, guardrails, neve e otimização de partículas.

## Motor modular dos veículos

O arquivo `vehicle-engine.js` concentra os perfis de direção dos cinco carros. Cada perfil possui multiplicador de velocidade, aceleração, desaceleração, força de direção, aderência seca/molhada, damping lateral, eficiência do nitro, escala de drift, resposta visual, transferência de peso, curso de suspensão e parâmetros de curva como entre-eixos, largura, altura e aerodinâmica. O `index.html` continua responsável pela progressão, colisões, pontuação e renderização; o módulo calcula a resposta do veículo e devolve valores para o loop. A câmera, o volante e a pose da carroceria usam o slip angle, yaw rate e carga lateral calculados pelo mesmo estado.

Para ajustar um carro, altere somente o objeto correspondente em `PROFILES` dentro de `vehicle-engine.js`. Os IDs são estáveis: `0` Chama, `1` Brisa, `2` Coruja, `3` Rino e `4` Fantasma. A garagem e o menu leem o mesmo perfil e mostram o rótulo de condução, evitando uma segunda fonte de verdade. Não é necessário alterar `sr_save`, o formato do código de save ou a tabela de upgrades para fazer balanceamento.

> A solução usa uma dinâmica arcade modular, apropriada à pista atual, em vez de introduzir um rigid-body completo que poderia aumentar o pacote, exigir colliders novos e alterar colisões já aprovadas. O arquivo é local, entra no app shell offline e é copiado para o APK.

## Como os jogadores recebem uma atualização

O fluxo de atualização já está no jogo. Quando uma pessoa que já possui save abrir uma versão nova, o jogo consulta `version.json` sem cache e mostra:

> **Nova atualização e melhorias** — deseja instalar?

Ao tocar em **Atualizar**, o navegador baixa o novo service worker, mostra o estado do download, aplica a versão nova somente depois que ela está pronta, preserva o save e recarrega o jogo. Depois da recarga aparece uma confirmação no próprio jogo:

> **DRIFIN SLOT — Foi atualizado para a versão X.**

Se a pessoa fechar o jogo enquanto o navegador ainda estiver baixando, o service worker pode continuar o trabalho em segundo plano conforme as regras do sistema operacional. Se o celular suspender o processo, nada é perdido: na próxima abertura o jogo consulta a versão novamente e retoma o aviso ou conclui a atualização. Uma atualização PWA não pode obrigar o sistema do celular a manter um download ativo quando o usuário encerra completamente o navegador; por isso a próxima abertura funciona como recuperação segura.

O texto informa a estimativa de tamanho definida em `version.json`: `pequena` explica que o download costuma ser rápido, `média` informa que pode levar alguns segundos e `grande` avisa que a alteração pode demorar mais. Isso descreve a expectativa de atualização sem fingir uma porcentagem de download que o service worker não fornece diretamente.

## Como publicar uma nova versão para todos

O ponto correto para enviar alterações é este repositório GitHub, na branch `main`:

```text
https://github.com/jeanvicen/car.pend
```

Depois de alterar o jogo, edite `version.json`. Aumente o campo `version`, escolha `changeSize` e descreva as melhorias:

```json
{
  "version": "4.2.0",
  "name": "Drifin Slot",
  "title": "Estrada viva, cockpit animado e clima adaptativo",
  "message": "Carros com silhuetas próprias, relevo de estrada, câmera interna animada e otimização por dispositivo.",
  "releaseNotes": ["Estrada com curvas, subidas e lombadas", "Cockpit com volante, mãos e antebraços", "Clima de chuva/neve, guardrails e service worker v7"],
  "cacheName": "drifin-slot-v7",
  "changeSize": "média",
  "releasedAt": "2026-08-19"
}
```

O `cacheName` do exemplo deve ser o mesmo valor usado na primeira linha de `sw.js`. Para cada nova release, avance os dois valores juntos — por exemplo, `4.3.0` com `drifin-slot-v8` — e inclua `vehicle-engine.js` se ele continuar sendo usado. A estrada, cockpit e partículas de clima estão dentro do `index.html`, então não dependem de downloads externos. Depois, envie tudo:

```bash
git add .
git commit -m "Release Drifin Slot 4.2.0 cockpit terrain climate"
git push origin main
```

A Vercel publica automaticamente o mesmo endereço [`https://car-pend.vercel.app`](https://car-pend.vercel.app). Os jogadores não precisam receber outro link nem reinstalar o PWA. Ao abrir o jogo novamente, a versão nova será detectada e o aviso aparecerá para quem já tinha progresso salvo.

Não remova `version.json`, `manifest.webmanifest`, `sw.js`, os IDs dos controles, as chaves de `localStorage` ou o formato do save. O save fica separado do cache, portanto atualizar os arquivos não deve apagar o progresso.

## APK Android

A pasta [`apk/`](./apk/) contém a embalagem Capacitor. O `applicationId` Android permanece `com.klipzastudio.sunsetrush` para permitir continuidade das instalações existentes, enquanto o nome visível é **Drifin Slot**. A atualização automática descrita acima vale para o PWA instalado pelo navegador. Um APK instalado como aplicativo nativo recebe novas versões por Google Play ou por um novo APK assinado; ele não pode substituir sozinho o próprio pacote nativo sem passar pelo mecanismo oficial do Android.

Para gerar o APK de teste:

```bash
cd apk
npm install
npm run sync
npm run build-debug
```

Para uma publicação Android, aumente `versionCode` e `versionName` em `apk/android/app/build.gradle`, gere o bundle e assine com uma chave privada que nunca deve entrar no GitHub:

```bash
cd apk
npm run sync
npm run build-release
```

O APK de teste fica em `apk/android/app/build/outputs/apk/debug/app-debug.apk`. O bundle de loja fica em `apk/android/app/build/outputs/bundle/release/app-release.aab`.

## Teste local

Como o service worker exige HTTP ou HTTPS, teste com um servidor local:

```bash
python3 -m http.server 4173
```

Depois, abra `http://localhost:4173`. Para simular uma nova atualização, altere `version.json`, aumente `CACHE_NAME` em `sw.js`, recarregue o site mantendo um `sr_save` existente e confirme que o aviso aparece.

A tag `drifin-slot-baseline-3f3c485` aponta para a versão funcional anterior caso seja necessário comparar ou reverter.
