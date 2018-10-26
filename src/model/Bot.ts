// import { SlackBot } from "slackbots"; TODO types
let SlackBot = require("slackbots");
import * as moment from 'moment';
moment.locale('fr');

import { CronJob } from "cron";
import  { Talk } from "../services/Talk";
import { Alert } from './Alert';
import { MessageBuilder } from '../services/MessageBuilder';
import krakenPublicRequest = require("../services/KrakenPublicRequest");

const token = process.env.SLACK_BOT_TOKEN || null;
if (token == null) {
  throw Error("Token du bot manquant.");
}

export class Bot {
  static readonly botName = 'Catia';

  private static globalId: number = 0;
  private _id: number;
  private slackUser: string;
  private currencyPair: string;
  private intervalle: string;
  private lastAlert: Alert;
  
  /* TODO enum 1, 5, 15, 30, 60, 240, 1440, 10080, 21600 */
  private cronJob: CronJob;

  public getLastAlert() {
    return this.lastAlert;
  }

  constructor(slackUser: string, currencyPair: string, intervalle: string) {
    this._id = Bot.globalId++;
    this.slackUser = slackUser;
    this.currencyPair = currencyPair;
    this.intervalle = intervalle;
    this.lastAlert = null;

    this.start();
  }

  get id(): number {
    return this._id;
  }

  private saveAlert(isBullish: boolean, acceleration: number) {
    this.lastAlert = new Alert(isBullish, acceleration);
  }

  private displayIntervalle() {
    let duration = moment.duration(parseInt(this.intervalle), 'minutes');
    return duration.humanize();
  }


  public start() {
    const botFullName = `${Bot.botName} [Paire : ${this.currencyPair} | Grain : ${this.displayIntervalle()}]`;
    console.log('bot FullName is : ' + botFullName);
    
    let bot = new SlackBot({
      token: process.env.SLACK_BOT_TOKEN, // Add a bot https://my.slack.com/services/new/bot and put the token
      name: botFullName
    });
    let krakenRequest = new krakenPublicRequest.KrakenPublicRequest();
    let botState = {
      firstCall: true,
      isBullish: false,
      acceleration: 0
    };
    
    let messageBuilder = new MessageBuilder(this.intervalle);

    let talker = new Talk();

      let params_light = {
          icon_url : "https://www.bruno-faugeroux.fr/images/catia-transparant.png",
      };

    console.log("urlGraph " + messageBuilder.getGraphUrl());
    console.log("postMessageToUser bot started " + this.slackUser + " " + this.intervalle);

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
          } else if (botState.isBullish !== jsonBody["isBullish"]) {
            message = talker.generateMessage(jsonBody["isBullish"],jsonBody["acceleration"]);
            
            this.saveAlert(jsonBody["isBullish"], jsonBody['acceleration']);
            bot.postMessageToChannel("smart-dev-niort-1-bot", message, messageBuilder.buildParams(jsonBody["isBullish"]));
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
