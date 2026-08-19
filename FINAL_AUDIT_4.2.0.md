# Relatório final de auditoria — Drifin Slot 4.2.0

**Projeto:** Drifin Slot — Neon Drift  
**Repositório:** <https://github.com/jeanvicen/car.pend>  
**Deploy público:** <https://car-pend.vercel.app/>  
**Commit publicado:** `bf3431d` — `Release Drifin Slot 4.2.0 cockpit terrain climate`  
**Cache PWA:** `drifin-slot-v7`  
**Data:** 19 de agosto de 2026

## Resumo executivo

A release **4.2.0** foi implementada sobre a base Three.js local já funcional, sem migração arriscada de engine e sem alterar o contrato do save. O jogo recebeu uma estrada procedural segmentada, com curvas suaves, subidas e lombadas leves; uma câmera interna com volante, raios, mãos e antebraços; cinco assinaturas visuais de carro; guardrails e balizadores refletivos; neve no bioma Montanhas Nevadas; e redução adaptativa de partículas, props e impactos para hardware mais limitado.

A decisão de manter o Three.js local foi deliberada. O jogo já dependia de pools, PWA offline, APK Capacitor, progressão e colisões aprovadas. Introduzir um rigid-body completo ou migrar toda a cena poderia aumentar o pacote e alterar a sensação de direção. A camada `vehicle-engine.js` continua sendo o ponto de atualização dos parâmetros de condução, enquanto o HTML mantém progressão, colisões, pontuação e renderização.

> **Resultado:** a release 4.2.0 está publicada, o deploy público serve o novo código, o fluxo de atualização aparece para jogadores com save, e a auditoria interativa passou para menu, corrida, câmera, pausa, garagem, showroom, Save e persistência.

## Melhorias implementadas

| Área | Resultado da release 4.2.0 |
| --- | --- |
| Veículos | Cinco assinaturas visuais procedurais: hatch, coupe, blindado, GT e Phantom. As variantes são usadas no jogador, no tráfego e no showroom. |
| Física de curva | O motor usa slip angle, yaw rate, carga lateral, entre-eixos, largura, altura, aderência, damping, aerodinâmica e transferência de peso visual. |
| Câmera interna | Cockpit com painel, display, para-brisa, volante com raios, mãos e antebraços. O aro gira com a direção real. |
| Câmera externa | Mantida e conectada ao yaw e à inclinação da estrada, com roll sutil de curva. |
| Estrada | Faixas segmentadas com centro deslocável, curvas, elevação, inclinação e lombadas suaves. |
| Coerência do cenário | Carro, tráfego, props, moedas, nitro, escudo, cones, rampas e balizadores usam o mesmo ponto lógico de estrada. |
| Clima | Chuva, reflexos e respingos preservados; neve adicionada às Montanhas Nevadas com densidade adaptativa. |
| Cenários | Guardrails e marcadores refletivos adicionados sem texturas pesadas nem downloads externos. |
| Otimização | Perfil Econômico/Mobile reduz densidade de props, partículas, streaks, impactos e neve; o perfil Alto mantém a apresentação completa. |
| Showroom | Loop do showroom é interrompido ao sair da aba Carros, evitando disputa de frames com a corrida. |
| Compatibilidade | O módulo é local, entra no app shell do PWA e é copiado para o APK. |

## Matriz de validação

| Teste | Ambiente | Resultado |
| --- | --- | --- |
| Sintaxe dos scripts inline | Node.js, scripts extraídos do `index.html` | Aprovado; `index.html` e `vehicle-engine.js` passaram em `node --check`. |
| Integridade do diff | Repositório local | Aprovado; `git diff --check` sem erros antes do push. |
| Preview inicial | `http://127.0.0.1:4182/` | Aprovado; menu, canvas, cartão do Chama, HUD e controles carregaram. |
| Largada local | Preview interativo | Aprovado; contagem 3/1/GO!!, score, distância e velocidade atualizaram. |
| Direção local | Preview interativo | Aprovado; `ArrowLeft` respondeu durante a corrida. |
| Câmera interna local | Preview interativo | Aprovado; `◉ Visão interna`, volante, mãos e painel apareceram. |
| Garagem local | Preview interativo | Aprovado; Upgrades, Carros, Conquistas, Estatísticas e Save permaneceram acessíveis. |
| Showroom local | Preview interativo | Aprovado; canvas 3D e cinco perfis de direção apareceram. |
| Console local | Após corrida, câmera e garagem | Aprovado; sem exceções visíveis. |
| Build Android | Capacitor, Gradle | Aprovado; `assembleDebug` e `bundleRelease` concluídos. |
| Conteúdo Android | APK debug | Aprovado; `vehicle-engine.js`, `version.json` e `sw.js` presentes no pacote. |
| Deploy público | `https://car-pend.vercel.app/` | Aprovado; versão 4.2.0 e cache v7 entregues. |
| Headers públicos | Vercel | Aprovado; `index.html` com `no-cache, must-revalidate`; `sw.js` com `no-cache, no-store, must-revalidate`. |
| Atualização PWA | Deploy público com save | Aprovado; o aviso de 4.2.0 apareceu como alteração grande e `Depois` fechou o painel. |
| Corrida pública | Vercel | Aprovado; contagem, score, distância e velocidade avançaram. |
| Cockpit público | Vercel | Aprovado; `◉ Visão interna`, volante/mãos, estrada e HUD renderizaram. |
| Direção pública | Vercel | Aprovado; `ArrowLeft` respondeu no cockpit; a sessão chegou a score 72, distância 0,15 km e 84 km/h. |
| Pausa pública | Vercel | Aprovado; Continuar, Reiniciar, Início e Copiar código apareceram; Continuar retomou a corrida. |
| Garagem pública | Vercel | Aprovado; retorno por Início, Upgrades, Conquistas, Estatísticas e Save passaram. |
| Save público | Vercel | Aprovado; código exibido e toast `Código copiado — guarde bem!` confirmado. |
| Captura 640×360 | Chromium headless | Layout completo; fallback 3D esperado porque o modo headless não forneceu WebGL. |
| Captura 1604×720 | Chromium headless | Layout ultrawide completo; fallback 3D esperado pelo mesmo motivo. |

## Otimização e limites conhecidos

A implementação preserva os perfis adaptativos existentes e reduz apenas o custo que não prejudica a leitura da pista. O perfil Econômico usa menos objetos e partículas; o Mobile mantém identidade visual com quantidade intermediária; e o Alto mantém PBR, partículas e densidade completa. O DPR e o backbuffer continuam sujeitos ao ajuste progressivo já existente.

A estratégia segue as recomendações de desempenho WebGL: controlar o tamanho efetivo do backbuffer, evitar crescimento desnecessário de draw calls, usar pools e tratar a memória por pixel [1]. O `WebGLRenderer` permanece como ponto central para pixel ratio, tamanho, sombras, preferência de energia e recursos da GPU [2].

As capturas headless não foram usadas para julgar a qualidade 3D, porque o Chromium desse modo reportou `Falha ao iniciar o motor 3D`. A validação de renderização foi realizada no navegador interativo com WebGL funcional e no deploy público. Em um aparelho real, a qualidade efetiva depende da GPU, memória, temperatura, navegador e sistema operacional; os perfis adaptativos existem justamente para reduzir risco de travamento.

## Artefatos Android

| Artefato | Caminho | Resultado |
| --- | --- | --- |
| APK debug | `apk/android/app/build/outputs/apk/debug/app-debug.apk` | 4,8 MB, versionCode 4, versionName 4.2.0 |
| AAB release | `apk/android/app/build/outputs/bundle/release/app-release.aab` | 3,6 MB, pronto para assinatura/publicação |
| Application ID | `com.klipzastudio.sunsetrush` | Preservado para permitir atualização da instalação anterior |

## Como atualizar no futuro

Para ajustar dirigibilidade, edite os objetos de perfil em `vehicle-engine.js`. Para alterar a câmera ou o cockpit, use o construtor `buildPlayerCar` e o bloco de câmera de `index.html`. Para alterar curvas, subidas e lombadas, ajuste `roadSample`; a função `roadPoint` deve continuar sendo a fonte comum de posição para carro, tráfego, props e pickups.

Em uma próxima release, aumente a versão em `version.json`, avance o cache em `sw.js`, avance `versionCode` e `versionName` no Android, sincronize o Capacitor e faça o push:

```bash
cd /home/ubuntu/car.pend-work/apk
npm run sync
npm run build-debug
npm run build-release

cd /home/ubuntu/car.pend-work
git add .
git commit -m "Release Drifin Slot 4.3.0"
git push origin main
```

Use o próximo par de versão/cache, por exemplo **4.3.0** e **drifin-slot-v8**. Não altere `sr_save`, `drifin_installed_version`, `drifin_update_complete`, `applicationId`, os IDs dos controles ou o formato do save.

## Referências

[1]: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices "MDN WebGL best practices"
[2]: https://threejs.org/docs/#WebGLRenderer "Three.js WebGLRenderer documentation"
