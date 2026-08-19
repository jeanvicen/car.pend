# Relatório final de auditoria — Drifin Slot 4.0.0

**Data da auditoria:** 19 de agosto de 2026  
**Deploy verificado:** [car-pend.vercel.app](https://car-pend.vercel.app/) [1]  
**Repositório:** [jeanvicen/car.pend](https://github.com/jeanvicen/car.pend) [2]  
**Commit final de documentação:** `c3bb067 — Complete public audit of Drifin Slot 4.0.0`

## Conclusão executiva

A release pública **4.0.0** foi auditada no deploy da Vercel e aprovada no escopo funcional solicitado. A corrida, o modo mobile, a câmera interna/externa, o áudio, a pausa, o nitro, o game over, a garagem, o showroom 3D, as melhorias, as conquistas, as estatísticas, o save e o retorno ao menu funcionaram sem regressão observável. O código da corrida e as chaves de progresso foram preservados.

A branch `main` está sincronizada com o GitHub e o repositório local está limpo. A Vercel continua entregando a versão `4.0.0` com `cacheName: drifin-slot-v5` e políticas de cache adequadas para que novas versões sejam detectadas.

> **Resultado:** publicação web/PWA aprovada. O APK debug está disponível para instalação direta; o AAB release está disponível para o fluxo de publicação Android, sujeito à assinatura e às exigências da loja.

## Matriz de validação

| Área auditada | Resultado | Evidência observada |
|---|---:|---|
| Deploy Vercel | Aprovado | `https://car-pend.vercel.app/` carregou a interface e a cena 3D públicas. |
| Versão pública | Aprovado | `version.json` retornou `4.0.0`, `Drifin Slot`, `drifin-slot-v5` e `changeSize: média`. |
| `vercel.json` e cache | Aprovado | `index.html`/manifest com `no-cache, must-revalidate`; `sw.js`/`version.json` com `no-cache, no-store, must-revalidate`. |
| Manifest PWA | Aprovado | `display: fullscreen`, `display_override` com fullscreen/standalone/minimal-ui, orientação landscape e ícones PWA. |
| Service worker | Aprovado | Service worker registrado e controlando a página pública; arquivos locais para funcionamento offline. |
| Instalação PWA | Aprovado com comportamento esperado | O botão usa `beforeinstallprompt` quando o navegador fornece o evento; sem evento nativo, mostra instruções manuais do Chrome ou Safari. |
| Atualização automática | Aprovado | O fluxo consulta `version.json`, só oferece update a quem possui `sr_save`, mostra o tamanho da alteração, baixa via service worker e preserva o save. |
| Conclusão de update | Aprovado | A lógica grava `drifin_installed_version`/`drifin_update_complete` e mostra a confirmação da nova versão após recarregar. |
| Menu e responsividade | Aprovado | Logo, recorde, moedas, instruções, qualidade, `Ligar o Motor` e `Garagem` permaneceram acessíveis em paisagem curta, ultrawide e retrato rotacionado. |
| Corrida | Aprovado | Largada, contagem regressiva, HUD, pista, carro, tráfego, cenário e controles renderizaram normalmente. |
| Câmera | Aprovado | Botão `◌/◉` e teclas `C`/`V` alternaram perseguição externa e cockpit interno; a visão interna manteve pista e horizonte livres. |
| Controles | Aprovado | `t-left`, `t-right`, `t-brake`, `t-nitro`, setas, freio e nitro por Espaço responderam durante a corrida. |
| Áudio | Aprovado | O mute alternou `🔊`/`🔇`; o áudio de motor e pneu/asfalto permaneceu integrado ao gesto e ao drift. |
| Pausa | Aprovado | Overlay com Continuar, Reiniciar, Início e Copiar código; Continuar retomou a corrida. |
| Game over | Aprovado | Estatísticas, ganhos, distância, moedas, combo, recorde, trecho e botões Jogar de novo/Início apareceram sem corte. |
| Persistência | Aprovado | Recorde e moedas permaneceram após recarregar; a chave `sr_save` continuou preservando o progresso. |
| Garagem | Aprovado | Upgrades, Carros, Conquistas, Estatísticas e Save abriram corretamente. |
| Showroom | Aprovado | Preview 3D e os cinco carros — Chama, Brisa, Coruja, Rino e Fantasma — foram exibidos. |
| Upgrades | Aprovado | As seis melhorias e estados/preços permaneceram acessíveis. |
| Conquistas | Aprovado | Indicador `1/16`, conquista inicial e progressos das demais metas foram exibidos. |
| Estatísticas | Aprovado | Recorde `1428`, distância total `2,7 km`, corridas, raspadas, combo, velocidade, carros e conquistas foram exibidos. |
| Save/exportação | Aprovado | Código foi exibido; `Copiar código` mostrou `Código copiado — guarde bem!`; importação permaneceu disponível. |
| Retorno da garagem | Aprovado | O handler de `btnGarBack` fechou `#garage`, reabriu `#menu` e preservou recorde `1428` e moedas `697`. |

## Instalação no celular

No Android Chrome, quando o navegador emitir `beforeinstallprompt`, o painel **Instalar Drifin Slot** aparece e o botão abre o prompt nativo. Em ambientes desktop, Chromium headless, preview, aba anônima ou navegadores que não emitem esse evento, o botão não consegue abrir um prompt nativo — esse é um limite do navegador, não uma falha do jogo. Nesses casos, o fallback orienta abrir o menu `⋮` do Chrome e escolher **Instalar aplicativo**. No Safari iOS, a orientação é usar **Compartilhar → Adicionar à Tela de Início**.

O manifest está configurado para abrir em tela inteira e paisagem. No APK Android, a `MainActivity` reaplica o modo imersivo nativo em `onCreate`, `onResume` e quando a janela recupera foco.

## Artefatos Android

| Artefato | Local | Uso |
|---|---|---|
| APK debug | `apk/android/app/build/outputs/apk/debug/app-debug.apk` | Instalação direta e testes em aparelho Android. |
| AAB release | `apk/android/app/build/outputs/bundle/release/app-release.aab` | Base para publicação na Google Play, após assinatura/configuração da conta. |

O `applicationId` permanece `com.klipzastudio.sunsetrush`, conforme solicitado, e a cópia web para o projeto Capacitor inclui `index.html`, manifest, service worker, `version.json`, ícones e Three.js local.

## Como publicar futuras alterações

As próximas versões devem atualizar a versão em `version.json`, criar o novo cache — por exemplo `drifin-slot-v6` para a versão `4.1.0` — e ajustar as release notes e `changeSize`. Depois, basta enviar as alterações para a branch `main`:

```bash
cd /home/ubuntu/car.pend-work
git add index.html sw.js version.json manifest.webmanifest vercel.json icons/ apk/ README.md
git commit -m "Release Drifin Slot 4.1.0"
git push origin main
```

O deploy da Vercel será acionado automaticamente pelo push. Jogadores que já possuem `sr_save` receberão a mensagem **Nova atualização e melhorias**; o tamanho indicado será pequena, média ou grande conforme `changeSize`. Não altere as chaves `sr_save`, `drifin_installed_version` e `drifin_update_complete`.

## Referências

[1]: https://car-pend.vercel.app/ "Deploy público do Drifin Slot"  
[2]: https://github.com/jeanvicen/car.pend "Repositório GitHub do Drifin Slot"
