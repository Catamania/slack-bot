// import { SlackBot } from "slackbots"; TODO types
let SlackBot = require("slackbots");
import { CronJob } from "cron";
import krakenPublicRequest = require("../services/KrakenPublicRequest");

export class Bot {
  private static globalId: number = 0;
  private _id: number;
  private slackUser: string;
  private currencyPair: string;
  private intervalle: string;
  /* TODO enum 1, 5, 15, 30, 60, 240, 1440, 10080, 21600 */

  // private bot: SlackBot;
  private static params = {
    icon_emoji: ":robot_face:"
  };

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
      token: "", // Add a bot https://my.slack.com/services/new/bot and put the token
      name: "bot MACD"
    });
    let krakenRequest = new krakenPublicRequest.KrakenPublicRequest();
    let botState = {
      firstCall: true,
      isBullish: false,
      acceleration: 0
    };
    let urlGraph = "http://78.212.193.11:8182/macd/?grain=" + this.intervalle;

    console.log("urlGraph " + urlGraph);

    console.log("postMessageToUser bot started " + this.slackUser + " " + this.intervalle);

    //bot.postMessageToUser(this.slackUser, "bot started", Bot.params);
    //bot.postEphemeral(this.slackUser, "bot started", Bot.params);
    bot.postMessageToChannel("smart-dev-niort-1-bot", "bot started", Bot.params);

// https://stackoverflow.com/questions/40353503/how-to-access-this-inside-a-callback-function-in-typescript

    let cronJob = new CronJob("*/5 * * * * *", () => {
      krakenRequest
        .get(this.intervalle)
        .then((jsonBody) => {
          let message = "*[TEST MACD 1min]* ";
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
            message = message + " (" + urlGraph + ")";
            // this.bot.postMessageToChannel("random", message, Bot.params);
            //bot.postMessageToUser(this.slackUser, message, Bot.params);
            bot.postMessageToChannel("smart-dev-niort-1-bot", message, Bot.params);
          } else if (botState.isBullish !== jsonBody["isBullish"]) {
            message =
              message +
              "MACD SIGNAL ! " +
              "{bullish : " +
              jsonBody["isBullish"] +
              ", acceleration : " +
              jsonBody["acceleration"] +
              "}";
            message = message + " (" + urlGraph + ")";
            // this.bot.postMessageToChannel("random", message, Bot.params);
            // bot.postMessageToUser(this.slackUser, message, Bot.params);
            bot.postMessageToChannel("smart-dev-niort-1-bot", message, Bot.params);
          }
          botState.isBullish = jsonBody["isBullish"];
          botState.acceleration = jsonBody["acceleration"];
        })
        .catch(function(error) {
          console.log("Promise Rejected " + error);
        });
    });
    cronJob.start();
  }
}
