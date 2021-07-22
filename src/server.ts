import express from 'express';
import {Application} from 'express';
import { promisify } from 'util';
import Controller from './controller';

class Server {
  public app: Application;
  public port: number;
 
  /**
   * @param controllers
   * @param port
   */
  constructor(controllers: Controller[], port: number) {
    this.app = express();
    this.port = port;
    
    controllers.forEach((controller) => {
      this.app.use(
        controller.path,
        controller.router()
      );
    });
  }
 
  /**
   *
   */
  public listen() {
    this.app.listen(this.port);
  }
}
 
export default Server;