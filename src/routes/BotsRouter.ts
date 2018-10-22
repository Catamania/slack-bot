import { Router, Request, Response, NextFunction } from "express";
import { Bot } from "../model/Bot";
import { Alert } from '../model/Alert';

/*
https://stackoverflow.com/questions/37233735/typescript-interfaces-vs-types
https://stackoverflow.com/questions/42211175/typescript-hashmap-dictionary-interface
https://stackoverflow.com/questions/40976536/how-to-define-typescript-map-of-key-value-pair-where-key-is-a-number-and-value
http://2ality.com/2015/01/es6-maps-sets.html
*/

function replacer(key,value)
{
    if (key=="cronJob") return undefined;
    else return value;
}

export class BotsRouter {

  router: Router;
  bots: Map<number, Bot>;
  
  constructor() {
    this.router = Router();
    this.router.put("/", this.putOne);
    this.router.get('/', this.getAll);
    this.router.get('/:id', this.getOne);
    this.router.delete('/:id', this.deleteOne);
    this.router.get('/alert/:id', this.getLastAlert);
    this.bots = new Map<number, Bot>();
    
    console.log(this.bots);
  }

  public putOne = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    
    // let jsonObj = JSON.parse(req.body);
    let jsonObj = req.body;
    
    let newOne = new Bot(jsonObj['slackUser'], jsonObj['currencyPair'], jsonObj['intervalle']);

    this.bots.set(newOne.id, newOne);

    res.send(req.body);
  }

  public getAll = (req: Request, res: Response, next: NextFunction) => {
    console.log("hello");
    console.log(this.bots);
    res.send(this.mapToJson(this.bots));
}

public getOne = (req: Request, res: Response, next: NextFunction) => {
  let id = parseInt(req.params.id);
  if (this.bots.has(id)) {
    res.send(JSON.stringify(this.bots.get(id), replacer));
  }
  else {
    res.send(JSON.stringify("id introuvable"));
  }
}

public getLastAlert = (req: Request, res: Response, next: NextFunction) => {
  let id = parseInt(req.params.id);
  if (this.bots.has(id)) {
    let bot = this.bots.get(id);
    let alert = bot.getLastAlert();

    console.log(alert);
    res.send(JSON.stringify(alert));
  }
}


public deleteOne = (req: Request, res: Response, next: NextFunction) => {
  let id = parseInt(req.params.id);
  if(this.bots.has(id)) {
    this.bots.get(id).stop();
  }
  res.send("deleted " + id);
}


  public mapToJson(map): string {
    if(typeof map == 'undefined') {
        return '???'
    }
    return JSON.stringify([...map], replacer);
  }
}

const botsRoutes = new BotsRouter();

export default botsRoutes.router;
