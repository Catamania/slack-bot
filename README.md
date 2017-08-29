gulp

npm start

curl -X PUT -H "Content-Type:application/json" -d '{ "slackUser":"avergnaud", "currencyPair":"XETHZEUR", "intervalle":"5" }' http://localhost:3000/api/v1/bots

curl -X PUT -H "Content-Type:application/json" -d '{ "slackUser":"ppavia", "currencyPair":"XETHZEUR", "intervalle":"15" }' http://localhost:3000/api/v1/bots

http://localhost:3000/api/v1/bots


curl -X DELETE http://localhost:3000/api/v1/bots/1