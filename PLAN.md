# Drifin Slot — Plano de modernização

## Objetivo

Transformar o jogo atual em **Drifin Slot**, mantendo a base de corrida, progressão, save, upgrades, carros, conquistas, biomas e controles, mas modernizando identidade, interface, apresentação visual, desempenho, áudio, animações e física de forma progressiva.

## Linha de segurança

- Baseline funcional: commit `3f3c485`.
- Tag de rollback: `drifin-slot-baseline-3f3c485`.
- O jogo deve continuar abrindo como PWA e como APK Capacitor durante todas as etapas.

## Ordem de execução

1. Renomear identidade, metadados, manifesto, ícones e cópia Android.
2. Criar direção visual Drifin Slot e assets leves para marca, HUD e garagem.
3. Reorganizar a interface em camadas adaptativas para celular horizontal, retrato de fallback e desktop.
4. Reduzir custo de renderização, atualizar Three.js local, limitar pixel ratio, reutilizar objetos e evitar trabalho por frame desnecessário.
5. Melhorar carro do jogador, tráfego, loja e cards com uma prévia 3D reutilizando geometrias e materiais.
6. Melhorar cenário, iluminação, pós-processamento leve, partículas e transições sem sobrecarregar aparelhos fracos.
7. Evoluir áudio, suspensão visual, inclinação, drift, colisão e resposta de direção sem quebrar controles nem progressão.
8. Testar menu, garagem, compra, seleção, save/importação, início, pausa, corrida, nitro, colisão, game over, PWA, APK e múltiplas telas.

## Riscos e contenções

| Risco | Contenção |
| --- | --- |
| Alterar save antigo | Manter chaves e formato existentes; adicionar migração somente quando necessário. |
| Queda de FPS em celular | Presets de qualidade, `devicePixelRatio` limitado, pools e redução adaptativa. |
| Loja 3D pesada | Uma cena de prévia compartilhada, geometrias reutilizadas e fallback para imagem estilizada. |
| Física quebrar o balanceamento | Ajustar apenas parâmetros de resposta e manter as regras de pontuação/progressão. |
| Áudio falhar em iOS/Android | Manter Web Audio com desbloqueio por gesto e fallback silencioso. |
| Cache servir versão antiga | Incrementar cache e manter update seguro do service worker. |

## Critérios de aceite

A versão será considerada pronta quando o jogo carregar sem erro em celular e PC, a corrida iniciar e terminar normalmente, a garagem preservar compras e seleção, o save antigo continuar importando, a loja mostrar os carros de maneira clara, a interface se adaptar à tela, o modo instalável continuar disponível e os testes de build PWA/Android passarem sem regressão visível.
