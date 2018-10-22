// import { SlackBot } from "slackbots"; TODO types
let SlackBot = require("slackbots");
import { CronJob } from "cron";
import  { Talk } from "../services/Talk";
import krakenPublicRequest = require("../services/KrakenPublicRequest");

export class Bot {
  static readonly botName = 'Catia';

  private static globalId: number = 0;
  private _id: number;
  private slackUser: string;
  private currencyPair: string;
  private intervalle: string;
  /* TODO enum 1, 5, 15, 30, 60, 240, 1440, 10080, 21600 */
  private cronJob: CronJob;

  // private bot: SlackBot;

  constructor(slackUser: string, currencyPair: string, intervalle: string) {
    this._id = Bot.globalId++;
    this.slackUser = slackUser;
    this.currencyPair = currencyPair;
    this.intervalle = intervalle;
    this.start();
  }

  get id(): number {
    return this._id;
  }

  public start() {
    let bot = new SlackBot({
      token: "xoxb-xxxx", // Add a bot https://my.slack.com/services/new/bot and put the token
      name: Bot.botName
    });
    let krakenRequest = new krakenPublicRequest.KrakenPublicRequest();
    let botState = {
      firstCall: true,
      isBullish: false,
      acceleration: 0
    };
    let urlGraph = "http://78.212.193.11:8182/macd/?grain=" + this.intervalle;
    let talker = new Talk();

    let params = {
          icon_url : "https://www.bruno-faugeroux.fr/images/catia-transparant.png",
          attachments: [
              {
                  "fallback": "TODO",
                  "color": "#3AA3E3",
                  "actions": [
                      {
                          "text": "Acheter 1 eth",
                          "type": "button",
                          "url": "https://www.cat-amania.com",
                          "confirm": {
                              "title": "Confirmer l'achat",
                              "text": "Êtes-vous vraiment sur de vouloir acheter 1 eth ?",
                              "ok_text": "J'en suis sur",
                              "dismiss_text": "Annuler"
                          }
                      },
                      {
                          "text": "Ventre 1 eth",
                          "type": "button",
                          "url": "https://www.google.fr",
                          "confirm": {
                              "title": "Confirmer la vente",
                              "text": "Êtes-vous vraiment sur de vouloir vendre 1 eth ?",
                              "ok_text": "J'en suis sur",
                              "dismiss_text": "Annuler"
                          }
                      },
                      {
                          "text": "Afficher l'analyse",
                          "type": "button",
                          "url": urlGraph,
                      }
                  ]
              }]
      };

      let params_light = {
          icon_url : "https://www.bruno-faugeroux.fr/images/catia-transparant.png",
      };

    console.log("urlGraph " + urlGraph);

    console.log("postMessageToUser bot started " + this.slackUser + " " + this.intervalle);

    //bot.postMessageToUser(this.slackUser, "bot started", Bot.params);
    //bot.postEphemeral(this.slackUser, "bot started", Bot.params);
    bot.postMessageToChannel("smart-dev-niort-1-bot", Talk.generateHelloMessage(Bot.botName),params_light);

// https://stackoverflow.com/questions/40353503/how-to-access-this-inside-a-callback-function-in-typescript

    let cronJob = new CronJob("*/5 * * * * *", () => {
      krakenRequest
        .get(this.intervalle)
        .then((jsonBody) => {
          let message = "*[MACD " + this.intervalle + " minutes]* ";
          if (botState.firstCall) {
            botState.firstCall = false;
            message =
              message +
              "Premier appel, pas de signal... " +
              "{bullish: " +
              jsonBody["isBullish"] +
              ", acceleration: " +
              jsonBody["acceleration"] +
              "}";
            //message = message + " (" + urlGraph + ")";
            //bot.postMessageToChannel("smart-dev-niort-1-bot", message, Bot.params);
          } else if (botState.isBullish !== jsonBody["isBullish"]) {
            message = talker.generateMessage(jsonBody["isBullish"],jsonBody["acceleration"]);
            // this.bot.postMessageToChannel("random", message, Bot.params);
            // bot.postMessageToUser(this.slackUser, message, Bot.params);

            bot.postMessageToChannel("smart-dev-niort-1-bot", message, params);
          }
          botState.isBullish = jsonBody["isBullish"];
          botState.acceleration = jsonBody["acceleration"];
        })
        .catch(function(error) {
          console.log("Promise Rejected " + error);
        });
    });
    this.cronJob = cronJob;
    cronJob.start();
  }

  public stop() {
    this.cronJob.stop();
  }
}
