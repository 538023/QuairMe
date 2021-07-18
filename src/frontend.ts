import { join } from 'path';
import StaticController from './staticcontroller';

/**
 *
 */
export class Frontend extends StaticController {
  /**
   * @param path
   */
  public constructor(path: string) {
    super(path, [
      'app',
      join('..', 'public')
    ]);
  }
}

export default Frontend;