# Drifin Slot para Android

Esta pasta prepara o empacotamento do jogo web em um aplicativo Android usando **Capacitor**. O arquivo principal do jogo continua em `../index.html`; a pasta `www/` é apenas uma cópia gerada para o projeto nativo. Assim, a jogabilidade não precisa ser reescrita nem duplicada.

## Requisitos

Para criar e compilar o APK, use um computador com Node.js, Java, Android Studio e Android SDK configurados. O projeto suporta Android 7 ou superior pela configuração atual do Capacitor. O ambiente desta tarefa possui Java e Node.js, mas não possui Android SDK/Android Studio; por isso o APK assinado não é gerado automaticamente aqui.

## Primeiro preparo

Dentro desta pasta, instale as dependências e crie a plataforma Android:

```bash
npm install
npm run add-android
```

Depois, sincronize o jogo e abra o projeto no Android Studio:

```bash
npm run sync
npm run open
```

O script de sincronização copia `index.html`, `manifest.webmanifest`, `sw.js`, `vendor/three.min.js` e `icons/` para `www/`, executa `cap sync` e fixa a activity Android em orientação paisagem.

## Gerar APK de teste

Com o Android SDK configurado, execute:

```bash
npm run build-debug
```

O APK de teste será criado em `android/app/build/outputs/apk/debug/app-debug.apk`. Para instalar em um aparelho Android conectado, use o Android Studio ou:

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

## Publicar na Google Play

Para distribuição pública, gere um Android App Bundle assinado:

```bash
npm run build-release
```

Antes do primeiro envio, configure uma chave de assinatura no Android Studio e preencha a identidade do aplicativo, política de privacidade, classificação etária, imagens e ficha da Google Play. Não coloque senhas ou chaves de assinatura no GitHub.

## Atualizar o APK quando o jogo mudar

Altere somente os arquivos web na raiz do projeto. Depois, dentro de `apk/`, execute novamente:

```bash
npm run sync
npm run build-debug
```

Para uma nova versão pública, aumente `versionCode` e `versionName` no projeto Android e gere o bundle assinado. A versão instalada como PWA pelo navegador continuará sendo atualizada pelo GitHub/Vercel; o APK é um pacote separado e precisa ser recompilado e reenviado à Google Play quando o jogo mudar.

## Observação sobre o aviso de instalação

No Chrome Android, o jogo mostra o aviso **Instalar Drifin Slot** quando o navegador oferece o evento oficial de instalação. Ao tocar em **Instalar**, o prompt nativo do Chrome é aberto. Em iPhone/iPad, o botão mostra a instrução equivalente do Safari, porque o iOS não expõe o mesmo prompt automático do Chrome.
