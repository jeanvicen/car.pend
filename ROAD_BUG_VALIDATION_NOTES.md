# Validação do hotfix 4.2.1 — reprodução local

Data: 2026-08-19

## Evidências observadas

- Preview local: `http://127.0.0.1:4183/`.
- O modo temporário `window.__drifinNoCollision=true` foi ativado apenas para a reprodução longa.
- Capturas com pista visível: aproximadamente 0,43 km, 0,59 km, 0,70 km e 0,91 km.
- Em 0,91–0,92 km, a captura mostrou o carro e objetos de cenário sobre uma área de areia, sem o asfalto/guardrails ocupando o quadro. Isso pode ser o carro saindo lateralmente da faixa durante a curva, ou outra falha de atualização/posicionamento da estrada; ainda não é possível classificar como desaparecimento definitivo sem inspecionar a geometria e o estado de `roadSample()`/`roadPoint()`.
- O cenário, score, distância, HUD e avisos continuaram atualizando normalmente.
- A transição para chuva/noite (aprox. 1,3 km) ainda não foi alcançada.

## Próxima investigação

1. Inspecionar o código de geração/atualização das ribbons e a relação entre posição do carro, câmera e centro da estrada.
2. Verificar em runtime `roadRibbons`, `roadSample`, `roadPoint`, `car.x`, `car.z`, `worldDistance` e valores de `fog` próximo do trecho suspeito.
3. Se necessário, reiniciar a corrida e testar com carro mantido no centro para distinguir saída de faixa de desaparecimento da geometria.
4. Remover a chave de diagnóstico antes de publicar.

## Segunda rodada após ajuste do terreno

- Foi aplicado `y=-1.15` nos planos `groundMesh` e `sideGround`; a estrada continua em torno de `y≈0`.
- Preview recarregado com `?hotfix=ground-depth-2`.
- Capturas em 0,08 km, 0,23 km, 0,32–0,43 km mostram o asfalto, faixas, tráfego e pickups normalmente.
- O teste continua em andamento; ainda falta alcançar o trecho de chuva/noite (~1,3 km) e confirmar se o chão não volta a cobrir a pista.

## Validação até a transição de bioma

- A estrada permaneceu visível e contínua em 0,53 km, 0,62 km, 0,78 km, 0,98 km, 1,07 km e 1,17 km.
- Em 1,34 km ocorreu a transição para `Deserto / DESERT ROUTE`; as faixas, acostamentos, pickups, tráfego e iluminação continuaram desenhados.
- A pista não foi coberta pelo plano de terreno nessa faixa de distância após o ajuste para `y=-1.15`.
- A partir daqui o teste deve avançar até aproximadamente 1,8–2,0 km, quando `rainF` passa a dominar a fase de chuva, e depois até a noite.

## Validação da fase de chuva/neblina

- Em 1,60 km e 1,71–1,82 km, a pista permaneceu completamente visível sob partículas, faróis e neblina, com faixas centrais, acostamentos e tráfego desenhados.
- O novo intervalo `fog.far = 240→185` não encurtou o horizonte a ponto de apagar o asfalto.
- O ajuste dos planos de terreno para `y=-1.15` também evitou que a superfície do solo cobrisse a estrada nas ondulações.
- Ainda será feita uma checagem após o pico de chuva e na noite seguinte; depois disso, a chave temporária de diagnóstico será removida antes de qualquer publicação.
