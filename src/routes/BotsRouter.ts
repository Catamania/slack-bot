import { Router, Request, Response, NextFunction } from "express";
import { Bot } from "../model/Bot";

/*
https://stackoverflow.com/questions/37233735/typescript-interfaces-vs-types
https://stackoverflow.com/questions/42211175/typescript-hashmap-dictionary-interface
https://stackoverflow.com/questions/40976536/how-to-define-typescript-map-of-key-value-pair-where-key-is-a-number-and-value
http://2ality.com/2015/01/es6-maps-sets.html
*/

export class BotsRouter {

  router: Router;
  bots: Map<number, Bot>;

  constructor() {
    this.router = Router();
    this.router.put("/", this.putOne);
    this.router.get('/', this.getAll);
    this.router.delete('/:id', this.deleteOne);
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

public deleteOne = (req: Request, res: Response, next: NextFunction) => {
  let id = parseInt(req.params.id);
  if(this.bots.has(id)) {
    this.bots.delete(id);
  }
  res.send("deleted " + id);
}

//   public getAll(req: Request, res: Response, next: NextFunction) {
//       console.log("hello");
//       console.log(this.bots);
//       res.send(this.mapToJson(this.bots));
//   }

  public mapToJson(map): string {
    if(typeof map == 'undefined') {
        return '???'
    }
    return JSON.stringify([...map]);
  }
}

const botsRoutes = new BotsRouter();

export default botsRoutes.router;
