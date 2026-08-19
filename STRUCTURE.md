# Drifin Slot — Estrutura técnica

## Estado atual

O jogo é uma página única em `index.html`, com HTML, CSS e JavaScript incorporados. O motor 3D é Three.js carregado primeiro de `vendor/three.min.js`, com fallback CDN. A cena, materiais, veículos, tráfego, biomas, efeitos, áudio Web Audio, controles, garagem, save, HUD e loop `requestAnimationFrame` vivem no mesmo arquivo.

## Camadas preservadas

| Camada | Responsabilidade |
| --- | --- |
| Estado | Corrida atual, progressão, seleção de carro, moedas, recorde e save. |
| Simulação | Velocidade, direção, tráfego, colisão, nitro, combo, obstáculos e biomas. |
| Renderização | Cena Three.js, câmera, meshes, materiais, céu, estrada, partículas e pós-efeitos leves. |
| Interface | Menu, HUD, garagem, upgrades, carros, conquistas, estatísticas, save e overlays. |
| Plataforma | PWA, service worker, manifesto, ícones e embalagem Capacitor Android. |

## Arquitetura alvo incremental

A primeira modernização continuará compatível com a página única para reduzir risco. O código será separado internamente por responsabilidades quando cada alteração exigir isso, sem uma migração de framework que possa destruir o jogo. Os módulos prioritários serão `Brand`, `QualityManager`, `CarShowroom`, `AudioManager`, `PhysicsTuning`, `InputManager` e `PerformancePools`.

A interface continuará sendo uma camada HTML/CSS sobre o canvas Three.js. A garagem receberá uma prévia 3D que reutiliza a linguagem visual e os mesmos dados de `CARS`, evitando uma segunda fonte de verdade. A qualidade será escolhida por preset e poderá reduzir pixel ratio, sombras, partículas e densidade de tráfego em aparelhos fracos.

## Regras de compatibilidade

- Preservar as chaves de `localStorage` e o formato de save.
- Preservar IDs de controles usados pelo JavaScript ou criar aliases compatíveis.
- Preservar eventos de toque, teclado, pausa, mute e orientação.
- Não remover o fallback do Three.js sem garantir uma cópia local funcional.
- Não adicionar assets grandes ao pacote web; preferir SVG/Canvas/geração leve e compressão.
