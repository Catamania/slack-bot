import request = require("request");

export class KrakenPublicRequest {

  public get(grain: string) {

    let options = {
      url: "http://78.212.193.11:8182/AlerteMACD?grain=" + grain,
      method: "GET",
      timeout: 30000
    };

    console.log("options.url " + options.url)

    return new Promise(function(onSuccess, onError) {
      request.get(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          let jsonBody = JSON.parse(body);
          onSuccess(jsonBody);
        } else {
          onError(error);
        }
      });
    });
  }

}
