npm install

gulp


cp .env.exemple .env
> Renseigner le token slack dans le fichier .env

npm start

curl -X PUT -H "Content-Type:application/json" -d '{ "slackUser":"adrien", "currencyPair":"XETHZEUR", "intervalle":"1" }' http://localhost:3002/api/v1/bots

> attention j'ai mis en dur dans le code un nom de channel donc on ne se sert plus du slackUser

http://localhost:3002/api/v1/bots


curl -X DELETE http://localhost:3002/api/v1/bots/1

curl -X PUT -H "Content-Type:application/json" -d '{ "slackUser":"adrien", "currencyPair":"XETHZEUR", "intervalle":"1" }' http://78.212.193.11:3002/api/v1/bots