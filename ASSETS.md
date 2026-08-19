# Drifin Slot — Inventário de assets

## Assets existentes

| Asset | Uso atual | Decisão |
| --- | --- | --- |
| `icons/icon-192.png`, `icons/icon-512.png` | PWA, favicon e APK | Substituir pela nova logo Drifin Slot após geração e derivar tamanhos. |
| `vendor/three.min.js` | Motor 3D local | Preservar e atualizar somente após teste de compatibilidade. |
| Texturas geradas no código | Céu, estrada, faixas, sinais, brilho e materiais | Reaproveitar e melhorar com presets/contraste antes de adicionar peso. |
| Geometrias procedurais | Player, tráfego, cenário e props | Preservar como fallback e base para a garagem 3D. |

## Assets planejados

1. Referência de direção visual Drifin Slot, sem texto obrigatório, para definir paleta, materiais, iluminação e densidade.
2. Logo simples e escalável de carro esportivo quadradinho com símbolo reconhecível em 32–512 px.
3. Textura/placa de marca para o menu, se a geração tiver qualidade suficiente; textos críticos continuarão em HTML para legibilidade.
4. Pequenos fundos/gradientes e detalhes de interface, preferindo CSS/SVG leve.
5. Elementos de garagem 3D produzidos por meshes procedurais e materiais compartilhados; não há necessidade de GLB nesta etapa.

## Regras de entrega

Assets grandes não devem ser adicionados diretamente ao pacote web. Se forem gerados, manter originais fora do repositório e usar versões comprimidas e leves. Cada asset será testado em fundo claro/escuro e em tela pequena antes de entrar no jogo.

## Direção visual Drifin Slot

A referência `assets/drifin-slot-visual-target.png` define a identidade base: corrida 3D em estrada desértica ao pôr do sol, céu navy/violeta, faixa quente laranja no horizonte, asfalto reflexivo, luzes ciano e roxo, carros compactos angulares, HUD escuro translúcido e controles circulares de alto contraste. A composição principal é uma câmera baixa de perseguição, com o carro do jogador no centro inferior, tráfego legível à frente, score no canto superior esquerdo, distância/recorde no canto superior direito, velocímetro no centro inferior e nitro no canto inferior direito.

A referência da evolução 4.2 está em `assets/drifin-slot-visual-target-4.2.jpg`. Ela acrescenta uma autoestrada de quatro faixas realmente estruturada, shoulder/rumble strips, postes refletivos, cones, placas específicas, mesas vermelhas, cactos, um skyline neon distante, três silhuetas de tráfego diferentes, chuva fina, poças controladas e reflexos do pôr do sol. O carro do jogador deve manter a silhueta compacta quadrada, mas ganhar postura mais larga, painéis angulares, difusor traseiro, lanternas contínuas, rodas com pinças e uma faixa ciano reconhecível.

A qualidade desejada é estilizada e nítida, com efeitos implementáveis no Three.js atual: gradientes, materiais emissivos, reflexos simples, partículas limitadas e iluminação de baixo custo. Evitar depender de motion blur, volumetric lighting, depth of field ou texturas pesadas. Cada detalhe novo deve ter uma versão reduzida ou ser desligável no perfil Econômico.

## Critérios de identidade visual 4.2

| Área | Critério não genérico | Implementação prevista |
| --- | --- | --- |
| Carro do jogador | Silhueta baixa e larga, stripe ciano, difusor, lanternas contínuas, rodas e trim coerentes | Meshes procedurais compartilhados, materiais PBR por perfil e detalhes condicionais por qualidade |
| Tráfego | Hatchback, van e coupe com proporções e acessórios diferentes | Construtores específicos reutilizando materiais/geometrias base |
| Estrada | Quatro faixas, centro duplo amarelo, rumble strips, postes e cones | Segmentos/pools de props com gap adaptativo |
| Bioma | Deserto vermelho, cactos, mesas e transição para skyline neon | Pools decorativos por bioma com LOD de densidade |
| Clima | Chuva fina, pista molhada, poças e splash de pneu | Partículas limitadas, material wetAsphalt e respingos apenas perto do player |
| Iluminação | Sol baixo, luzes de postes e emissivos cyan/amber | Presets de fase com custo reduzido em Mobile/Econômico |
