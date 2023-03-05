# HercBot é um bot de código aberto para Discord.

### 

### Compilando e rodando o bot:

```bash
$ npm run build # Compila o código
$ npm run dev   # Roda o código compilado

# Para fazer isso com um único comando:

$ npm run go    # Compila e roda o código
```

###

#### Exemplo de .env:
```env
# O ID da sua aplicação
CLIENT_ID=

# O Token do seu bot
BOT_TOKEN=

# URI para conectar na database da mongoDB
MONGO_URI=

# O ID da última nota de atualização (src/utils/notas.json)
AID=

# ID do canal onde os reports dos usuários (src/comandos/reportar.ts) serão enviados
CANAL_REPORTS=

# API KEY da OpenAI para src/comandos/inteligencia-artificial.ts
OPENAI_API_KEY=
```

Se quiser contribuir com o projeto você será muito bem-vindo! 🤗

Clique [aqui](https://discord.com/api/oauth2/authorize?client_id=998826027117719694&permissions=8&scope=bot%20applications.commands) para convidar o bot para o seu servidor.

Versão 1.6.0
