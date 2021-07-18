import { Router } from 'express';

abstract class Controller {
  public readonly path: string;

  /**
   * @param path
   */
  public constructor(path: string) {
    this.path = '/' + path;
  }

  abstract router(): Router;
}

export default Controller;