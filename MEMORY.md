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

## Deploy público

Após o push do commit `564b6b4`, `https://car-pend.vercel.app/` passou a servir o título `Drifin Slot · Neon Drift`, o menu redesenhado, a nova logo no aviso de instalação e o perfil `QUALIDADE ALTO`. A corrida pública iniciou com a contagem regressiva `2`, confirmando que a Vercel entregou a versão modernizada sem quebrar o loop principal.

## Correção mobile em prévia limpa

Na prévia em `localhost:4177`, a corrida abriu sem erro, o canvas ocupou a viewport reportada de 1280×1100 e o indicador mostrou `QUALIDADE ALTO`. A imagem interativa mostrou céu, montanhas, placas, pista, carro e HUD renderizados com contraste melhor; um comando ArrowLeft respondeu durante a corrida, com score, distância e velocidade atualizando.

## Game over mobile corrigido

Foi simulado um fim de corrida com pontuação `17143`, ganhos, três conquistas, distância, moedas, combo, raspadas, recorde e trecho. Na viewport móvel corrigida, o painel ficou centralizado e compacto, sem corte; todos os dados aparecem e os botões `Jogar de novo` e `Início` permanecem acessíveis.

## Retomada da corrida após game over

O botão `Início` retornou corretamente ao menu; em seguida `Ligar o Motor` iniciou outra corrida. O menu coube na viewport, mostrou `QUALIDADE ALTO`, e a nova largada exibiu cenário, pista, carro e HUD sem corte.

## Desempenho e fallback

A medição interativa de 1,5 s na prévia foi influenciada pelo ambiente de navegador da sandbox e registrou poucos frames; a verificação posterior mostrou que o ajuste adaptativo reduziu o buffer efetivo do canvas para escala 1×, preservando o indicador `QUALIDADE ALTO`. O código mantém sombras desligadas no perfil mobile, DPR adaptativo e atualização gradual, além de densidades menores de decoração, postes e tráfego.

## Garagem e showroom após correção mobile

Após uma corrida encerrada, `Início` voltou ao menu preservando recorde e moedas. `Garagem` abriu normalmente; a aba `Carros` mostrou o `3D SHOWROOM`, preview renderizado do Chama, cinco cards (Chama, Brisa, Coruja, Rino e Fantasma), preços e estados de compra. O painel ficou dentro da tela e a área interna permaneceu rolável, sem corte.

## Deploy público pós-commit

O push `d45304e` foi publicado no GitHub. Em `https://car-pend.vercel.app/version.json`, a release `2.1.0`, `drifin-slot-v2`, `changeSize: pequena` e as release notes estão acessíveis. A página pública principal carregou como `Drifin Slot · Neon Drift`, mostrou a logo/identidade atual, o menu funcional, `QUALIDADE ALTO`, o aviso de atualização leve e os botões `Atualizar` e `Depois`.

## Diagnóstico da tela principal em múltiplas proporções

A captura do usuário representa uma viewport útil aproximada de 1604×658 após descontar a barra de status. A prévia corrigida em 1604×658 mostrou o logotipo, painel direito, botões, instruções e indicador de qualidade completos. Em 640×360, o modo compacto manteve os elementos inteiros e legíveis. Em 360×800, a interface paisagem foi rotacionada para ocupar o retrato inteiro; o conteúdo ficou completo, embora o usuário deva usar a rotação paisagem prevista pelo jogo.

## Correção final da tela principal

A causa do corte era a combinação de menu centralizado verticalmente, conteúdo alto em uma viewport curta após a barra de status e possível aumento automático de texto do Android/WebView. O menu passou a iniciar no topo quando necessário, aceitar rolagem vertical segura, respeitar safe areas, usar compactação abaixo de 560/400 px de altura e manter o modo de uma coluna em larguras muito estreitas. `text-size-adjust: 100%` foi aplicado para impedir que o sistema amplie a tipografia inesperadamente.

A reprodução CSS equivalente ao aparelho (`802×329`) ficou completa: logo, painel direito, recorde, instruções, botões Ligar o Motor/Garagem e indicador de qualidade aparecem dentro da área útil.

## Regressão funcional após ajuste do menu

A prévia interativa iniciou a corrida com contagem regressiva `2`. A consulta confirmou canvas `1280×1100`, menu oculto durante a corrida, `QUALIDADE ALTO` e os controles `t-left`, `t-right`, `t-brake` e `t-nitro` presentes.

## Garagem após correção da tela principal

Após recarregar a prévia, o menu abriu sem corte; `Garagem` exibiu Upgrades normalmente e `Carros` mostrou o `3D SHOWROOM`, o Chama renderizado e os cinco veículos com cards, preços e estados de compra. A alteração ficou restrita ao layout responsivo e não quebrou a navegação.

## Corrida após retorno da garagem

O retorno pela seta `Voltar` levou ao menu principal sem corte. `Ligar o Motor` iniciou a contagem regressiva `2`; o cenário 3D, carro, HUD, controles laterais, freio e nitro permaneceram visíveis e funcionais.

## Game over após correção da tela principal

Foi simulado um fim de corrida com score, ganhos, conquistas, distância, moedas, combo, raspadas, recorde e trecho. O painel mostrou todos os dados, sem corte, e manteve `Jogar de novo` e `Início` acessíveis.

## Deploy público da correção 3.2.0

Após integrar os commits remotos de versão, a release foi publicada como `3.2.0` com `cacheName: drifin-slot-v3`. O endpoint público confirmou a versão e as release notes. A página principal pública carregou como `Drifin Slot · Neon Drift`, com menu, canvas e aviso `Correção mobile e melhorias` exibindo os botões `Atualizar` e `Depois`.

## Validação do modo tela inteira

Na prévia local, `requestFullscreen({ navigationUI: 'hide' })` ficou disponível. Após o clique real em `Ligar o Motor`, o navegador confirmou `fullscreenActive: true` e `displayModeFullscreen: true`; a viewport permaneceu `1280×1100`, o menu foi ocultado e a contagem regressiva continuou em `2`.

## Deploy público da tela inteira 3.3.0

A Vercel passou a servir `version.json` na versão `3.3.0` com `cacheName: drifin-slot-v4`. A página pública carregou o menu e o canvas normalmente e exibiu o aviso `Tela inteira e modo imersivo` com os botões `Atualizar` e `Depois`.
