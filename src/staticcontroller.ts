import express from 'express';
import { Router } from 'express';
import { join } from 'path';
import Controller from './controller';

class StaticController extends Controller {
  private folders: string[];
  /**
   * @param path
   * @param folders
   */
  public constructor(path: string, folders: string[]) {
  	super(path);

  	this.folders = folders;
  }
  /**
   *
   */
  router(): Router {
  	const router: Router = Router();

  	this.folders.forEach((folder) => {
  		router.use(
  			'/',
  			express.static(
  				join(__dirname, folder)
  			)
  		);
  	});
    
  	return router;
  }
}

export default StaticController;