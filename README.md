# Teste de performance para servidor http(s)

Um teste simples para verificar quantas requisições um servidor suporta responder por segundo.
Você pode definir a duração do teste e quantas conexões e threads serão utilizados. Quanto maior a duração do teste melhor será a precisão do resultado.

## Instalação

execute na pasta do código: ```npm install```

## Uso

```node bin/httpbench.js [PARÂMETROS] URL```

## Parâmetros

| Argumento | Valor |Def.|Função|
| ------ | ------ |------|------|
|-t, --threads|NUM|5|Quantidade máxima de threads/workers|
|-c, --connections|NUM|25|Quantidade de conexões simultâneas|
|-s, --seconds|NUM|10|Tempo de duração das requisições em segundos|
|--url|URL||URL que será testada|
|--disable-keepalive|||Desativa o recurso keepalive das conexões (forçará uma nova conexão para cada requisição)|

## Observações

1. ***USE UMA URL QUE NÃO CAUSE UM REDIRECIONAMENTO PARA OUTRA URL***. Se for um servidor local e em algum momento do teste a taxa de erro ficar muito alta, então provávelmente a url está sendo redirecionada, neste caso, abra o url em um browser e copie a url de lá.
2. Usar uma quantidade muito grande de conexões simultâneas poderá sobrecarregar a disponibilidade das portas do computador e o sistema operacional não aceitará conexãos novas (independente da origem) até as portas sejam recicladas.
3. Se a url de destino for redirecionada, ocorrera o mesmo problema da sobrecarga das portas (2) mesmo com poucas conexões simultâneas.
4. Existe alguns exemplos de servidores prontos na pasta **testserver**.

## Uso dos códigos de teste

Os códigos de teste para o servidor possuem a mesma saída.

**php**:

```copie a pasta phptest para o servidor```

>URL: http://SERVIDOR/phptest/?num=QUANTIDADE_DE_ITENS

**express, fastify, koa**:

execute os comandos abaixo na pasta do servidor escolhido:
```
yarn install
node .
```

>URL: http://localhost:5000/?num=QUANTIDADE_DE_ITENS
