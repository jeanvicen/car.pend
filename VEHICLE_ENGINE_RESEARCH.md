# Pesquisa de arquitetura de veículos — Drifin Slot 4.1.0

## Decisão

O Drifin Slot é uma corrida arcade em pista com quatro faixas, colisões e progressão já funcionais. A cena usa Three.js r128 local, não possui mundo físico rígido completo e precisa continuar leve, offline e compatível com PWA/APK. Por isso, não será adicionada uma dependência pesada de física rígida nesta etapa.

Será criado um módulo local `vehicle-engine.js`, sem dependências, com uma classe `DrifinVehicleEngine` e perfis de dinâmica por carro. O módulo separará aceleração, freio, direção, aderência, drift, chuva, suspensão visual e transferência de peso dos dados de progressão. A simulação continuará determinística e compatível com `S.pvx`, `S.speed`, `S.py`, `S.vy`, `SAVE.upg` e `SAVE.carSel`.

A decisão usa os conceitos comprovados de veículos por ray cast, mas mantém a escala apropriada do jogo: controlador de rodas, força de motor, freio, friction slip, side friction e suspensão são parâmetros comuns de uma simulação de carro. A implementação completa de um rigid body seria desnecessária para o tipo de pista atual e poderia aumentar o pacote, alterar colisões e exigir novos colliders.

## Fontes consultadas

1. A documentação oficial do `@dimforge/rapier3d` descreve `DynamicRayCastVehicleController` como controlador de veículo por raios nas rodas, com força de motor, freio, direção, aderência lateral, friction slip, suspensão, compressão e relaxamento. [1]
2. A documentação do `cannon-es` o descreve como um motor 3D leve em JavaScript e lista exemplos de `raycast vehicle` e `rigid vehicle`, confirmando que esse tipo de controlador existe, mas também adicionaria uma cadeia de integração física ao projeto. [2]
3. O exemplo oficial do Three.js apresenta um controlador de veículo baseado em Rapier, com controles de aceleração, direção e freio, validando a compatibilidade conceitual com Three.js. [3]

## Aplicação no projeto

| Problema atual | Nova solução |
| --- | --- |
| Parâmetros de carro misturados a score/progressão | `CARS` mantém dados públicos; `physics` recebe tuning dedicado. |
| Fórmulas de aceleração e direção diretamente no loop | `DrifinVehicleEngine.step()` calcula alvo, aceleração, frenagem e lateralidade. |
| Roll/pitch/yaw visuais acoplados ao loop | `DrifinVehicleEngine.visuals()` devolve alvos de transferência de peso, suspensão e direção. |
| Troca de carro exige alterar lógica | `SAVE.carSel` seleciona o perfil; `rebuildPlayer()` reconfigura o mesmo motor. |
| Ajuste futuro difícil | Um arquivo único de tuning permite alterar os cinco carros sem procurar fórmulas no loop. |
| Offline/APK | O módulo é local, entra no app shell do service worker e é copiado pelo script Capacitor. |

## Referências

[1]: https://rapier.rs/javascript3d/classes/DynamicRayCastVehicleController.html "Rapier DynamicRayCastVehicleController"
[2]: https://pmndrs.github.io/cannon-es/ "cannon-es — lightweight 3D physics engine"
[3]: https://threejs.org/examples/physics_rapier_vehicle_controller.html "Three.js Rapier vehicle controller example"
