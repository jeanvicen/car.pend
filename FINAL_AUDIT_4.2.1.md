# Relatório final de auditoria — Drifin Slot 4.2.1

**Projeto:** Drifin Slot — Neon Drift  
**Repositório:** [jeanvicen/car.pend](https://github.com/jeanvicen/car.pend)  
**Deploy público:** [car-pend.vercel.app](https://car-pend.vercel.app/)  
**Branch publicada:** `main`  
**Commits do hotfix:** [`02699ac`](https://github.com/jeanvicen/car.pend/commit/02699ac) e [`fa6c78c`](https://github.com/jeanvicen/car.pend/commit/fa6c78c)  
**Versão:** `4.2.1`  
**Cache PWA:** `drifin-slot-v8`  
**Data:** 19 de agosto de 2026

## Resumo executivo

O bug relatado — a estrada desaparecer durante a corrida — foi corrigido e publicado. A causa principal confirmada no preview foi uma sobreposição de profundidade: o plano de terreno estava quase na mesma altura vertical da estrada, enquanto o relevo procedural introduzia descidas e ondulações. Em determinados trechos, o terreno podia ser desenhado por cima do asfalto e dar a impressão de que a estrada havia sumido. A margem visual também era reduzida pelas ribbons mais curtas e pela névoa chuvosa que terminava perto demais da câmera.

> **Resultado:** a versão 4.2.1 mantém a estrada visível em curvas, subidas, lombadas, transições de bioma, partículas e névoa, sem remover corrida, colisões, progressão, save, upgrades, conquistas, PWA, áudio ou controles.

## Correções implementadas

| Área | Correção aplicada | Efeito esperado |
| --- | --- | --- |
| Profundidade do terreno | `groundMesh` e `sideGround` foram movidos de aproximadamente `y=-0.05` para `y=-1.15`. | O terreno fica abaixo das ondulações da pista e não cobre o asfalto. |
| Faces da estrada | `roadMat.side` e `M.wetAsphalt.side` usam `THREE.DoubleSide`. | A pista continua renderizando mesmo quando a câmera passa por baixo de uma subida ou observa a face oposta. |
| Geometria procedural | Ribbons usam `fromZ=24`, `toZ=-420` e mais segmentos por perfil de dispositivo. | Aumenta a margem de estrada à frente da câmera e reduz cortes no horizonte. |
| Descarte de objetos | `frustumCulled=false` e `visible=true` são reforçados durante cada atualização; `computeBoundingSphere()` é recalculado junto das normais. | Evita que uma bounding sphere desatualizada esconda uma ribbon ainda necessária. |
| Chuva e névoa | `fog.far` passa de `240` para `185` conforme a intensidade da chuva; `fog.near` usa `34→20`. | Mantém a leitura do asfalto e das faixas durante a chuva sem criar um corte prematuro. |
| Diagnóstico | A expressão temporária `window.__drifinNoCollision` foi removida. | Colisões com tráfego voltam a funcionar normalmente no código publicado. |

A correção não alterou o contrato de progressão. As chaves de save `sr_save`, `drifin_installed_version` e `drifin_update_complete` foram preservadas, assim como o `applicationId` Android `com.klipzastudio.sunsetrush`.

## Validação local longa

A execução interativa no preview fresco `http://127.0.0.1:4183/?hotfix=ground-depth-2` foi conduzida com o modo de colisões desativadas apenas durante o diagnóstico, para permitir alcançar o trecho distante sem alterar o código final. A estrada permaneceu visível em todas as capturas registradas entre 0,08 km e 2,05 km.

| Trecho | Resultado observado |
| --- | --- |
| 0,08–0,98 km | Asfalto, faixas, acostamentos, tráfego e pickups renderizados normalmente. |
| 1,07–1,34 km | Marca de 1 km e transição `Litoral → Deserto` sem corte da pista. |
| 1,60–1,82 km | Partículas, faróis, neblina e fase chuvosa presentes; asfalto e faixas continuaram visíveis. |
| 2,05 km | Estrada ainda completa, com tráfego, iluminação e HUD funcionando após o pico de chuva. |

A primeira captura em aproximadamente 0,91–0,92 km havia mostrado o carro sobre uma área clara, sem asfalto evidente. A inspeção do código e o teste após baixar o terreno demonstraram que o problema visual era compatível com o plano de terreno cobrindo a ribbon quando o relevo descia; após a correção, o mesmo fluxo foi repetido até 2,05 km sem reincidência.

## Validação pública e atualização PWA

Depois do push, o endpoint público de [version.json](https://car-pend.vercel.app/version.json) passou a entregar `4.2.1`, `drifin-slot-v8`, `changeSize: pequena` e as notas do hotfix. O [service worker público](https://car-pend.vercel.app/sw.js) passou a declarar `CACHE_NAME = 'drifin-slot-v8'`, mantendo instalação, ativação, limpeza de caches anteriores, `SKIP_WAITING`, atualização sem cache de `version.json`, fallback de navegação e cache em segundo plano.

A página pública abriu o aviso `Hotfix de visibilidade da estrada` com os botões `Atualizar` e `Depois`. O botão `Atualizar` foi acionado; o painel fechou e o menu preservou o recorde público `1428` e `697` moedas. Em seguida, a corrida pública iniciou com a contagem regressiva e alcançou 0,29 km a 88 km/h, com estrada completa, tráfego, score, combo, carro, HUD e controles visíveis. O teste público foi executado sem a chave temporária de colisões.

## APK e AAB Android

A configuração Android foi atualizada para `versionCode 5` e `versionName "4.2.1"`, mantendo namespace, applicationId e orientação landscape. Os comandos `npm run build-debug` e `npm run build-release` concluíram com `BUILD SUCCESSFUL`.

| Artefato | Caminho | Tamanho | SHA-256 |
| --- | --- | ---: | --- |
| APK debug | `apk/android/app/build/outputs/apk/debug/app-debug.apk` | 4.959.253 bytes | `48e68caea48abb016922f1eec7bbd78368f94d438e9ef72bf53b6796533278d9` |
| AAB release | `apk/android/app/build/outputs/bundle/release/app-release.aab` | 3.739.512 bytes | `4667731a184211eb81300bf1bb5ef37bb05ae99e153a3e3ae21c326587a5bca1` |

A inspeção do APK confirmou `package='com.klipzastudio.sunsetrush'`, `versionCode='5'`, `versionName='4.2.1'` e `application-label:'Drifin Slot'`. O `version.json` empacotado também confirma `4.2.1` e `drifin-slot-v8`; a busca no `index.html` empacotado não encontrou `__drifinNoCollision`.

## Verificações técnicas

| Verificação | Resultado |
| --- | --- |
| `node --check vehicle-engine.js` | Aprovado. |
| `node --check apk/scripts/copy-web.mjs` | Aprovado. |
| `git diff --check` | Aprovado, sem whitespace inválido. |
| Sincronização Capacitor | Aprovada; arquivos web copiados para `apk/www` e Android sincronizado. |
| Build APK debug | Aprovado. |
| Build AAB release | Aprovado. |
| Push GitHub | Aprovado em `main`; commit de código `02699ac`. |
| Registro de validação | Publicado no commit `fa6c78c`. |
| Deploy Vercel | Aprovado; manifesto e service worker públicos entregam 4.2.1/v8. |

## Como publicar as próximas atualizações

Para uma próxima alteração, o fluxo permanece simples: editar o jogo em `/home/ubuntu/car.pend-work/`, atualizar `version.json` com uma nova versão e um novo `cacheName`, atualizar o `CACHE_NAME` em `sw.js`, ajustar `versionCode`/`versionName` no Gradle quando houver nova versão Android, executar os testes de sintaxe e build e enviar para a branch `main`. O push para `main` continua sendo o gatilho do deploy automático da Vercel.

O sistema de atualização detecta o novo `version.json`, mostra a notificação para quem tem save, usa o tamanho declarado da mudança para apresentar uma atualização pequena, média ou grande, instala o novo service worker e continua o download em segundo plano conforme o ciclo já implementado. Depois da ativação, o jogador recebe a confirmação de que o Drifin Slot foi atualizado.

## Referências

[1]: https://github.com/jeanvicen/car.pend "Repositório GitHub do Drifin Slot"  
[2]: https://github.com/jeanvicen/car.pend/commit/02699ac "Commit do hotfix 4.2.1"  
[3]: https://github.com/jeanvicen/car.pend/commit/fa6c78c "Commit do registro de validação pública"  
[4]: https://car-pend.vercel.app/version.json "Manifesto público de versão 4.2.1"  
[5]: https://car-pend.vercel.app/sw.js "Service worker público drifin-slot-v8"
