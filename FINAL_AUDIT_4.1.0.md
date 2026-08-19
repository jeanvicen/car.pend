# Relatório final — Drifin Slot 4.1.0

**Data:** 19 de agosto de 2026  
**Deploy:** [car-pend.vercel.app](https://car-pend.vercel.app/) [1]  
**Repositório:** [jeanvicen/car.pend](https://github.com/jeanvicen/car.pend) [2]  
**Commit publicado:** `453b02a — Release Drifin Slot 4.1.0 vehicle engine and mobile menus`

## Resultado

A release **4.1.0** foi implementada, compilada, publicada na branch `main` e validada localmente e no deploy público. O Drifin Slot agora possui um **motor modular de dinâmica arcade para veículos**, separado em `vehicle-engine.js`, e uma reforma dos menus com prioridade para celular. A corrida, a progressão, o save, as conquistas, os upgrades, as câmeras, o áudio, o PWA e o APK foram preservados.

A decisão técnica foi não inserir um rigid-body externo completo nesta etapa. O jogo é uma corrida arcade de quatro faixas, com física lateral, colisões e pools já estabelecidos; um motor rígido exigiria colliders, integração de mundo físico e alterações de balanceamento. O novo módulo usa os mesmos conceitos de força de motor, freio, aderência, drift, chuva e suspensão, mas em uma camada pequena, local, determinística e fácil de atualizar.

## O novo motor de veículos

O arquivo `vehicle-engine.js` concentra cinco perfis editáveis: Chama, Brisa, Coruja, Rino e Fantasma. Cada perfil pode controlar multiplicador de velocidade, aceleração, desaceleração, eficiência de nitro, força e ganho de direção, aderência seca/molhada, damping lateral, escala de drift, roll/pitch/yaw visual, transferência de peso e curso/resposta da suspensão.

O `index.html` continua controlando save, moedas, upgrades, conquistas, pontuação, colisões, tráfego, biomas e renderização. O módulo recebe o estado da corrida e retorna velocidade, alvo, nitro, direção lateral, grip e drift; em seguida, também retorna alvos visuais para carroceria, rodas e suspensão. Assim, alterar o comportamento de um carro não exige procurar fórmulas dentro do loop principal.

> Para balancear um veículo, edite somente o objeto correspondente em `PROFILES` dentro de `vehicle-engine.js`. Não altere `sr_save`, `drifin_installed_version`, `drifin_update_complete`, o formato do código de save ou os IDs dos controles.

| ID | Carro | Perfil visível | Intenção |
|---:|---|---|---|
| 0 | Chama | DRIFT BALANCEADO | Resposta equilibrada para iniciar. |
| 1 | Brisa | DRIFT ÁGIL | Mais direção e resposta lateral. |
| 2 | Coruja | DRIFT VELOCIDADE | Velocidade e nitro com controle mais exigente. |
| 3 | Rino | DRIFT BLINDADO | Maior estabilidade, frenagem e aderência. |
| 4 | Fantasma | DRIFT COMPLETO | Perfil avançado sem ponto fraco evidente. |

## Menus renovados para celular

O menu inicial recebeu um cartão do carro atual com nome, perfil de drift e sensação de condução, sem remover os botões `Ligar o Motor` e `Garagem`. Os botões principais passaram a ter alvos de toque maiores, os chips de instruções se reorganizam em duas colunas e os painéis respeitam safe areas, alturas curtas, paisagem e o fallback de rotação em retrato.

A garagem recebeu cabeçalho mais compacto, tabs roláveis, ações com altura mínima de toque, cards de carros com perfil de condução, painel de showroom preservado, estatísticas em uma coluna em telas estreitas e Save com botões maiores. O overlay de pausa e o game over também receberam dimensionamento mobile consistente.

## Matriz de testes

| Teste | Resultado | Evidência |
|---|---:|---|
| Sintaxe do novo módulo | Aprovado | `node --check vehicle-engine.js` passou. |
| Sintaxe dos scripts inline | Aprovado | Sete blocos inline do `index.html` foram extraídos e passaram em `node --check`. |
| Perfis de veículo | Aprovado | Teste determinístico dos cinco perfis retornou valores finitos de velocidade, nitro, lateralidade, drift e suspensão. |
| Menu local | Aprovado | Cartão `Chama · DRIFT BALANCEADO · EQUILIBRADO` apareceu com Ligar o Motor/Garagem. |
| Corrida local | Aprovado | Contagem, score, distância, velocidade, carro, estrada e HUD funcionaram. |
| Direção local | Aprovado | `ArrowLeft` respondeu durante o movimento. |
| Nitro local | Aprovado | `Space` acionou nitro e manteve a corrida estável. |
| Pausa local | Aprovado | Continuar, Reiniciar, Início e Copiar código permaneceram acessíveis. |
| Garagem local | Aprovado | Upgrades, Carros, Conquistas, Estatísticas e Save abriram. |
| Showroom local | Aprovado | Preview 3D e cinco cards renderizaram. |
| Save local | Aprovado | Código exibido e `Copiar código` mostrou o toast correto. |
| Voltar local | Aprovado | A garagem fechou e o menu reapareceu. |
| Paisagem curta 640×360 | Aprovado | Menu completo e legível, sem corte. |
| Retrato 375×812 | Aprovado | Rotação CSS de fallback preservada; conteúdo permaneceu na área rotacionada. |
| Deploy público | Aprovado | `version.json` retornou 4.1.0 e `vehicle-engine.js` respondeu 200. |
| Atualização pública | Aprovado | Jogador com save viu o prompt de 4.1.0 e o botão Depois fechou o aviso. |
| Corrida pública | Aprovado | Contagem, score, distância e velocidade avançaram no Vercel. |
| Controles públicos | Aprovado | `ArrowRight` e `Space` responderam durante a corrida. |
| Câmera pública | Aprovado | `◉ Visão interna` mostrou pista livre e cockpit. |
| Pausa pública | Aprovado | Overlay abriu com quatro ações. |
| Garagem pública | Aprovado | Recorde 1428, moedas 697, upgrades, conquistas e tabs preservados. |
| Perfis públicos | Aprovado | Os cinco rótulos apareceram na aba Carros. |
| Voltar público | Aprovado | Funcionou partindo da aba Carros e restaurou o menu. |
| APK debug | Aprovado | Build concluído com versionCode 3/versionName 4.1.0. |
| AAB release | Aprovado | Bundle release compilado com sucesso. |
| APK offline | Aprovado | O APK contém `index.html`, `sw.js`, `version.json` e `vehicle-engine.js`. |

## Publicação e atualização

O service worker passou para `drifin-slot-v6`, incluindo `vehicle-engine.js` no app shell. O script `apk/scripts/copy-web.mjs` também copia o módulo para o Capacitor. O endpoint público está servindo:

| Arquivo | Política verificada |
|---|---|
| `index.html` | `no-cache, must-revalidate` |
| `vehicle-engine.js` | `public, max-age=0, must-revalidate` |
| `sw.js` | `no-cache, no-store, must-revalidate` |
| `version.json` | `no-cache, no-store, must-revalidate` |

Jogadores que já possuem save recebem o aviso **Física modular e menus mobile renovados**. O PWA atualiza automaticamente pela lógica já existente; o APK nativo recebe o novo conteúdo pela nova compilação e, para distribuição em loja, deve ser assinado e publicado com versionCode maior.

## Artefatos Android

| Artefato | Caminho | Tamanho aproximado |
|---|---|---:|
| APK debug | `apk/android/app/build/outputs/apk/debug/app-debug.apk` | 4,8 MB |
| AAB release | `apk/android/app/build/outputs/bundle/release/app-release.aab` | 3,6 MB |

O `applicationId` continua `com.klipzastudio.sunsetrush`, permitindo continuidade da instalação existente. A nova compilação usa `versionCode 3` e `versionName 4.1.0`.

## Como atualizar os carros no futuro

Para um ajuste de dirigibilidade, altere os números do perfil em `vehicle-engine.js`, teste localmente e não mexa no save. Para uma nova release web, incremente `version.json`, use um novo cache em `sw.js` e faça push na branch `main`. A Vercel fará o deploy automaticamente.

```bash
cd /home/ubuntu/car.pend-work
git add index.html vehicle-engine.js sw.js version.json README.md apk/
git commit -m "Release Drifin Slot 4.2.0"
git push origin main
```

Para uma nova versão Android, aumente `versionCode` e `versionName` em `apk/android/app/build.gradle`, execute `npm run sync`, gere `build-debug`/`build-release` e assine o AAB para a loja.

## Referências

[1]: https://car-pend.vercel.app/ "Deploy público do Drifin Slot"  
[2]: https://github.com/jeanvicen/car.pend "Repositório GitHub do Drifin Slot"  
[3]: https://rapier.rs/javascript3d/classes/DynamicRayCastVehicleController.html "Documentação do controlador de veículo por ray cast do Rapier"  
[4]: https://pmndrs.github.io/cannon-es/ "Documentação do cannon-es"  
[5]: https://threejs.org/examples/physics_rapier_vehicle_controller.html "Exemplo oficial de veículo Three.js + Rapier"
