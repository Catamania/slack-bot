import request = require("request");

export class KrakenPublicRequest {

  public get(grain: string) {

    let options = {
      url: "http://localhost:8181/AlerteMACD?grain=" + grain,
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
