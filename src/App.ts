import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import BotsRouter from './routes/BotsRouter';

// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public express: express.Application;

  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.set('port', 3002)
  }

  // Configure API endpoints.
  private routes(): void {
    /* This is just to get up and running, and to make sure what we've got is
     * working so far. This function will change when we start to add more
     * API endpoints */
    let router = express.Router();
    // placeholder route handler
    // router.get('/', (req, res, next) => {
    //   res.json({
    //     message: 'Hello World!'
    //   });
    // });
    // this.express.use('/', router);
    this.express.use(express.static(path.join(__dirname, 'public')));
    this.express.use('/api/v1/bots', BotsRouter);
  }

}

let app: App = new App();
let port = 3002;
app.express.listen(port, (err) => {
  if (err) {
      return console.log(err);
  }

  return console.log(`server is listening on ${port}`);
});

export default new App().express;