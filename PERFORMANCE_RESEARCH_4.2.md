# Pesquisa técnica de desempenho — Drifin Slot 4.2

## Fontes consultadas

[1]: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices "MDN WebGL best practices"
[2]: https://threejs.org/docs/#WebGLRenderer "Three.js WebGLRenderer documentation"

## Critérios aplicáveis ao jogo

A documentação da MDN destaca que reduzir o backbuffer e manter o tamanho visual constante é uma troca válida entre qualidade e velocidade; isso se conecta diretamente ao DPR adaptativo já existente no jogo. A mesma fonte recomenda agrupar draw calls, usar mipmaps em texturas 3D, tratar limites de memória por pixel e evitar operações WebGL bloqueantes [1].

A documentação do Three.js mantém o `WebGLRenderer` como o ponto de controle para pixel ratio, tamanho do backbuffer, sombras, tone mapping, preferência de energia e recursos da GPU [2]. Para o Drifin Slot, a próxima otimização deve continuar no renderer WebGL local, pois isso preserva o PWA offline, o APK Capacitor e o Three.js r128 já distribuído.

## Implicações para a release seguinte

A qualidade visual não será reduzida de forma indiscriminada. O plano é manter modelagem, iluminação e clima completos no perfil Alto; controlar resolução, sombras, densidade de partículas, distância de cenário e frequência de decoração nos perfis Mobile/Econômico; e reduzir somente o custo que não prejudica a leitura da pista.

O maior risco atual não é a geometria procedural isolada, mas a soma de materiais físicos, sombras, texturas 512×512, partículas de chuva, showroom e loops de objetos. A verificação deverá medir FPS/frame time, DPR efetivo, draw calls e memória quando possível, além de repetir a corrida em 640×360, 894×632 e retrato 375×812.

## Referências

[1] MDN, *WebGL best practices*.  
[2] Three.js, *WebGLRenderer*.
