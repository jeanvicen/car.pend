# Drifin Slot — Memória de implementação

## Descobertas do baseline

O jogo já possui uma base funcional robusta para uma página única: cena 3D, estrada com biomas, tráfego, moedas, rampas, nitro, escudo, combos, colisões, garagem com upgrades/carros/conquistas/estatísticas/save, controles de toque e teclado, pausa, mute, orientação paisagem e PWA.

A interface atual usa a identidade Sunset Rush, uma placa verde grande, painéis escuros e botões âmbar/ciano. A garagem mostra carros com cards estilizados e silhuetas CSS; ainda não existe uma prévia 3D dedicada do carro selecionado.

O loop principal usa `requestAnimationFrame`, limita `clock.getDelta()` a `0.05` e tem vários pools de objetos para tráfego, moedas, partículas, cones, rampas e elementos decorativos. A modernização deve aproveitar essa base em vez de trocar o motor ou reescrever a simulação.

## Decisões

A nova marca será **Drifin Slot**. A identidade visual seguirá uma direção de corrida noturna/neon com azul profundo, ciano, roxo e âmbar, mantendo contraste alto para telas pequenas. A palavra `Slot` será tratada como nome de marca, sem transformar o jogo em aposta ou alterar seu loop de corrida.

A prioridade é preservar o funcionamento. Melhorias físicas serão aplicadas como ajustes graduais e testáveis, sem apagar regras de pontuação ou progressão. Qualidade gráfica será adaptativa, com fallback visual para hardware limitado.

## Pendências de validação

Ainda precisam ser validados após a implementação: o novo nome em todos os metadados e telas; o fluxo completo da garagem; visualização 3D dos carros; desempenho em presets; áudio após gesto; colisões e drift; importação do save do baseline; PWA; APK debug; e publicação no endereço público.

## Verificação visual inicial

A prévia local `http://localhost:4174/` carregou com o título **Drifin Slot · Neon Drift**, menu glass neon, logo nova, indicador `QUALIDADE ALTO` e aviso de instalação atualizado. A garagem abriu sem erro; a aba Carros exibiu o cabeçalho `3D SHOWROOM`, o canvas de prévia renderizou o carro selecionado e os cinco cards mantiveram nomes, atributos, preços e botões de compra/seleção. O console do navegador não apresentou erros.

## Regressão de navegação e corrida

O botão Voltar retornou da garagem ao menu Drifin Slot sem perder o HUD. O botão Ligar o Motor iniciou a contagem regressiva normalmente, exibindo `2` na captura, com estrada, carro, controles e nitro renderizando. O showroom não interferiu no loop principal.

## Verificação após áudio, física e performance

Após recarregar o jogo com as últimas alterações, o navegador mostrou novamente o título Drifin Slot, o menu neon e o perfil `QUALIDADE ALTO`. A corrida iniciou pelo botão principal, liberou o áudio por gesto e exibiu a contagem regressiva `2`; a estrada, placas, cenário, carro e controles permaneceram íntegros.

## Perfil de renderização

A consulta no navegador confirmou `Drifin Slot · Neon Drift`, `QUALIDADE ALTO`, pixel ratio 1, 6 cores reportados e 4 GB de memória reportados. O canvas recebeu dimensões CSS 1280×1100, coerentes com o viewport interno rotacionado do jogo, sem erro de inicialização.

## Garagem após o build Android

Após recompilar debug e release, a prévia local abriu a garagem e a aba Carros sem alterações de progressão. O showroom 3D renderizou o Chama, os cards mostraram Chama, Brisa, Coruja, Rino e Fantasma com a nova paleta ciano/violeta/âmbar, e os preços e estados de compra permaneceram iguais.

## Teste de áudio e física

O fluxo normal de saída da garagem e início da corrida funcionou novamente, com contagem regressiva `2`. Uma consulta externa ao console não encontrou `AC`, `eng` e `S` porque o jogo declara esses estados como bindings privados do script, não como propriedades globais; isso não representa erro de runtime. A confirmação observável continua sendo o desbloqueio pelo gesto, o HUD e a corrida iniciando normalmente.

## Diagnóstico interno

A corrida continuou iniciando e a contagem `2` apareceu após o gesto. A função opcional `window.__DRIFIN_DIAGNOSTICS__` não ficou acessível no console desta sessão, portanto não será usada como critério de aceitação; a validação confiável permanece o verificador de sintaxe, a ausência de erros no console e os testes visuais/funcionais.

## Matriz headless de telas

Foram geradas capturas em 1280×720, 1920×1080, 812×375 e 375×812. O Chromium headless usado nessa etapa não habilitou WebGL, portanto as imagens exibiram corretamente a estrutura do menu e os controles, mas também mostraram o fallback `Falha ao iniciar o motor 3D`. Esse fallback é esperado nessa modalidade sem aceleração WebGL; a validação interativa no navegador de sandbox já confirmou o canvas 3D, a corrida e a garagem funcionando.
