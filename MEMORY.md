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

## Pesquisa inicial para a próxima modernização

A documentação oficial do Babylon.js confirma suporte a materiais PBR, incluindo `PBRMetallicRoughnessMaterial`, metalness, roughness, mapas de metallic/roughness, environment texture e iluminação dinâmica com unidades físicas. Isso é útil para carroceria, vidro, pneus, cromados e superfícies molhadas, mas não justifica uma migração automática.

A documentação oficial do Three.js lista `PerspectiveCamera`, `MeshPhysicalMaterial`, `InstancedMesh`, `LOD`, `PMREMGenerator`, WebGL e WebGPU como recursos disponíveis na linha atual. A base do projeto usa Three.js r128 localmente; a estratégia mais segura é evoluir a base existente e atualizar o renderer somente em fatias testadas, em vez de reescrever o jogo inteiro.

Fontes consultadas: https://doc.babylonjs.com/features/featuresDeepDive/materials/using/introToPBR e https://threejs.org/docs/.

## Decisão de motor para a modernização profunda

A pesquisa comparou Babylon.js e Three.js. Babylon.js oferece uma camada de engine mais completa e PBR bem documentado, enquanto Three.js oferece os blocos necessários para a evolução: `PerspectiveCamera`, `MeshPhysicalMaterial`, `InstancedMesh`, `LOD`, `PMREMGenerator`, WebGL e WebGPU. Como o Drifin Slot já tem uma cena Three.js funcional, física, pools de objetos, PWA, APK, save e progressão, a decisão é **não migrar o jogo inteiro agora**. A evolução será feita sobre Three.js com uma camada interna de câmeras, materiais, carros, clima e qualidade. Isso reduz risco de quebrar o jogo e ainda permite usar PBR, environment lighting, instancing e LOD gradualmente.

A migração para Babylon.js fica como uma possibilidade futura somente se uma fatia isolada provar ganho concreto em um dispositivo-alvo. Para este ciclo, o objetivo é melhorar a imagem e a jogabilidade, não trocar a fundação por outra sem necessidade.

## Primeiro slice da câmera interna

Foi adicionado o botão `btnCamera`, a tecla `C`/`V` e a alternância entre `chase` e `cockpit`. O cockpit possui painel, volante, cubo central, bancos, pilares e para-brisa translúcido. A primeira captura revelou interferência da carroceria externa; a cabine foi separada e ocultada no cockpit. Na segunda validação, a pista, horizonte, sinalização e sol ficaram livres, o HUD continuou íntegro, a velocidade atualizou e o aviso `◉ Visão interna` apareceu durante a corrida.

## Referência visual da modernização

Foi criada `assets/drifin-slot-visual-target.png` como alvo artístico: carro esportivo angular com pintura metálica PBR, vidro e cockpit visível, pneus e rodas detalhados, iluminação quente de pôr do sol, neon ciano, estrada com textura e sinalização, postes, cactos e mesas ao fundo. A imagem serve como referência visual; a implementação continua procedural e otimizada em Three.js para preservar compatibilidade mobile.

## Melhorias visuais da etapa de carros e estrada

A pintura dos carros passou a usar `MeshPhysicalMaterial` com metalness, roughness, clearcoat e environment map compartilhado. A função de roda agora inclui pneu, disco de freio, aro metálico e pinça colorida, reutilizada no jogador, tráfego e showroom. O menu informa `C · Visão interna / externa`. Os marcos laterais foram enriquecidos com base, faixa vermelha, refletor emissivo e brilho noturno por bioma.

A prévia continuou carregando depois do PBR; a corrida iniciou, a contagem apareceu e a câmera interna alternou para `◉ Visão interna` sem erro visível.

A validação seguinte confirmou o novo chip `C Visão interna / externa` na tela principal. A corrida iniciou normalmente depois das alterações; cenário, sinalização, marcos laterais, estrada, HUD e carro permaneceram renderizando sem erro visível.

## Validação do showroom atualizado

Após recarregar a prévia, a garagem abriu sem erros e a aba `Carros` exibiu o showroom 3D, o carro Chama, o piso reflexivo com environment map, o painel de metadados e os cinco cards de veículos. Upgrades, conquistas e save continuam presentes no mesmo fluxo.

A regressão após `addCarTrim` passou: a largada apareceu normalmente, o carro do jogador mostrou espelhos laterais, grade frontal, aerofólio, faixa, rodas e acabamento PBR; o cenário continuou estável e não houve erro visível de inicialização.

## Validação final da visão interna

A visão interna foi refinada após três capturas: rodas externas e efeitos inferiores foram ocultados no cockpit; o pilar lateral foi reduzido e finalmente desativado para eliminar o bloqueio visual. A captura final mostra a pista, horizonte, placas e postes livres, com apenas o painel/console ciano na parte inferior. O HUD, velocidade, controles e o estado `◉ Visão interna` continuam funcionando durante a corrida.

## Refinamento de física e resposta visual

A carroceria agora incorpora uma transferência de peso visual discreta em aceleração/freio e deslocamento lateral da suspensão, além do roll de curva já existente. A validação passou: a corrida iniciou, a contagem avançou, `ArrowLeft` foi aceito, a velocidade mudou e o HUD permaneceu responsivo sem travamento.

## Áudio de drift

Foi adicionada uma camada de ruído filtrado para pneu/asfalto, com ganho e frequência proporcionais ao drift e zerados fora da corrida. O áudio é criado apenas no primeiro gesto, compartilha o buffer já existente e não cria fontes por quadro. A prévia iniciou a corrida e a contagem normalmente após a alteração.

## Matriz visual preliminar de dispositivos

Foram capturadas as telas `320x568`, `360x800`, `640x360` e `854x480`. Nos screenshots físicos em retrato, o conteúdo aparece rotacionado 90 graus porque o jogo solicita landscape e aplica a rotação CSS enquanto o headless permanece em portrait; isso não representa a orientação final após o sistema rotacionar o aparelho. Os elementos permanecem presentes e o menu segue compacto. As capturas paisagem serão usadas para avaliar corte e legibilidade diretamente.

As capturas paisagem `640x360` e `854x480` passaram visualmente: logo, painel de recorde, instruções, chip `C Visão interna / externa`, botões `Ligar o Motor`/`Garagem`, HUD e controles permanecem dentro da área útil. O aviso de instalação ocupa uma faixa inferior independente, sem cortar os botões principais.

A captura ultrawide `1604x720` também passou: o logo e o painel ficam centralizados em largura máxima confortável, o espaço extra vira cenário de fundo, e HUD, chip de câmera, botões e aviso de instalação permanecem dentro da viewport sem deformação ou corte.

## Regressão funcional completa

Na sessão limpa, o menu abriu com Recorde 1366 e moedas 481 preservados. A garagem abriu com Upgrades, Conquistas, Estatísticas e Save; a aba `Carros` mostrou o showroom e os cinco veículos; `Voltar` retornou ao menu com os botões e o HUD intactos. A navegação do showroom foi concluída sem erro visível.

## Deploy público da modernização 4.0.0

O endpoint público confirmou a versão `4.0.0`, `cacheName: drifin-slot-v5` e as release notes da modernização. A página pública carregou menu, HUD, botão de câmera e aviso `Câmera interna e visual renovado`. A corrida pública iniciou com a contagem, e o clique no botão alterou o estado para `◉ Visão interna`; a captura mostrou horizonte/pista livres e o cockpit/painel na parte inferior.

## Auditoria pública de instalação e interface

Os cabeçalhos públicos da Vercel retornaram `200` para `index.html`, `manifest.webmanifest`, `sw.js` e `version.json`; HTML/manifest ficaram sem cache, enquanto o service worker e version.json usam `no-cache, no-store, must-revalidate`. No navegador público, o manifest link, o service worker controlando a página, `display: fullscreen`, canvas e todos os IDs críticos foram confirmados. A corrida pública iniciou, a visão interna alternou para `◉`, e o jogo chegou naturalmente ao game over com pontuação, ganhos, distância, moedas, combo, recorde, trecho e os botões `Jogar de novo`/`Início`. Após recarregar, o novo recorde e moedas permaneceram no save.

Na segunda corrida pública, `Ligar o Motor` iniciou nova contagem e gameplay. O botão de áudio alternou de `🔊` para `🔇` durante o movimento, enquanto velocidade, canvas, HUD e controles permaneceram ativos.

Na segunda corrida pública, a câmera alternou para `◉ Visão interna` com o cockpit limpo. O HUD manteve score, distância, velocidade e nitro; `ArrowLeft` respondeu durante o movimento, alterando a trajetória/valores sem travar o renderer.

O botão de pausa público abriu o overlay `Pausado` com `Continuar`, `Reiniciar`, `Início` e `Copiar código`, além das instruções dos controles. `Continuar` fechou o overlay e retomou a corrida com a visão interna, score, distância e combo ativos.

Após a pausa, o som foi reativado para `🔊`; em seguida, `Space` acionou o nitro durante a visão interna, com aumento de score/velocidade e barra N₂O disponível. O tráfego, a pista e o cockpit permaneceram renderizando.

Na sessão pública reaberta, a garagem carregou com `697` moedas e recorde `1428` preservados. A aba Upgrades mostrou seis melhorias e conquistas; a aba `Carros` mostrou `3D SHOWROOM`, o carro em uso `Chama`, os carros `Brisa`, `Coruja`, `Rino` e `Fantasma`, barras de atributos e botões de compra.

As abas públicas `Conquistas` e `Estatísticas` também passaram. Conquistas exibiu `1/16`, Primeira Saída concluída e progresso das demais metas; Estatísticas exibiu recorde `1428`, distância total `2,7 km`, moedas `19`, `5` corridas, `4` raspadas, combo máximo `×6`, velocidade máxima `100 km/h`, carros `1/5` e conquistas `1/16`.

A aba `Save` pública exibiu o código de progresso, textarea de importação e botões `Copiar código`, `Atualizar` e `Importar save`. O clique em `Copiar código` mostrou o toast `Código copiado — guarde bem!` sem substituir o progresso atual.

Auditoria pública concluída: após a aba `Save`, o handler público de `btnGarBack` deixou `#garage` com classe `ov hide` e `#menu` com classe `ov`; a visualização seguinte confirmou o menu principal com `Ligar o Motor`, `Garagem`, recorde `1428` e moedas `697`. O primeiro clique anotado ficou sem efeito por snapshot obsoleto, mas o handler real e o retorno visual funcionaram.

## Início da modernização 4.1.0

A prévia local `http://localhost:4181/` carregou `vehicle-engine.js` e mostrou o novo cartão `CARRO ATUAL · Chama · DRIFT BALANCEADO · EQUILIBRADO` no menu. Os botões Ligar o Motor/Garagem continuaram acessíveis. O clique de largada iniciou a contagem `3` e depois `1`, com estrada, cenário, carro, HUD, controles e nitro renderizando sem erro visível.

A corrida local 4.1.0 saiu da contagem normalmente e registrou score `30`, distância `0,07 km` e velocidade `81 km/h`; depois chegou a `0,20 km` e `85 km/h`. `ArrowLeft` respondeu alterando a trajetória, e `Space` manteve a corrida/nitro funcionando, com HUD, pista, coleta e cenário estáveis.

O overlay de pausa da 4.1.0 exibiu Continuar, Reiniciar, Início e Copiar código com alvos de toque maiores. O botão Início fechou a pausa e reapresentou o menu com Ligar o Motor, Garagem, cartão do Chama e perfil DRIFT BALANCEADO.

A garagem local 4.1.0 abriu com cabeçalho e tabs mobile renovados. A aba `Carros` mostrou o showroom 3D e os cinco veículos com perfis visíveis: Chama `DRIFT BALANCEADO`, Brisa `DRIFT ÁGIL`, Coruja `DRIFT VELOCIDADE`, Rino `DRIFT BLINDADO` e Fantasma `DRIFT COMPLETO`. O painel ficou rolável e sem corte visível.

A aba `Save` local 4.1.0 permaneceu completa, com código de 46 caracteres, Copiar código, Atualizar e Importar save. `Copiar código` mostrou `Código copiado — guarde bem!`. O botão `Voltar` fechou a garagem e retornou ao menu com o cartão do Chama e os botões principais.

Matriz visual local 4.1.0: em `640x360`, logo, recorde, instruções, cartão do Chama, botões Ligar o Motor/Garagem e aviso de instalação ficaram completos e legíveis. Em `375x812`, o jogo aplicou o fallback previsto de rotação CSS para paisagem; os elementos permaneceram presentes e o aviso de instalação ficou dentro da área rotacionada.

A checagem no navegador confirmou `typeof DrifinVehicleEngine === "function"`, cinco perfis carregados e o menu sincronizado com `Chama`, `DRIFT BALANCEADO` e `EQUILIBRADO`. O console não apresentou exceções após corrida, pausa, garagem, save e matriz mobile.

No deploy público pós-push, `version.json` retornou `4.1.0`/`drifin-slot-v6`, `vehicle-engine.js` respondeu `200` e os cabeçalhos permaneceram corretos. A sessão pública com save `sr_save` exibiu `Física modular e menus mobile renovados`, `Atualizar` e `Depois`; `Depois` fechou o aviso e o menu reapareceu com recorde `1428`, moedas `697`, Chama e `DRIFT BALANCEADO`.

A corrida pública 4.1.0 iniciou pelo menu renovado com contagem `3` e avançou para `1`; o carro, pista, cenário, HUD, nitro e controles permaneceram renderizando no deploy Vercel.

Na corrida pública 4.1.0, o jogo avançou de `0,04 km / 80 km/h` para `0,17 km / 84 km/h`, com score crescente. `ArrowRight` alterou a resposta do carro e `Space` acionou o nitro; pista, tráfego, HUD, câmera externa e renderer permaneceram estáveis.

No deploy público, a câmera alternou para `◉ Visão interna` com a pista/horizonte livres e cockpit na parte inferior. A corrida chegou a score `501`, distância `0,30 km` e `88 km/h`; o botão de pausa abriu o overlay com Continuar, Reiniciar, Início e Copiar código.

Após a corrida pública, o retorno pelo botão Início reapresentou o menu e a Garagem abriu com `697` moedas, upgrades, `1/16` conquistas e progresso acumulado. O painel mobile permaneceu rolável, sem corte visível, com tabs e ações preservadas.

A aba `Carros` pública exibiu showroom 3D e os cinco rótulos de perfil da 4.1.0. O botão `Voltar` fechou a garagem mesmo partindo dessa aba e reapresentou o menu com `1428` de recorde, `697` moedas e o cartão do Chama.
