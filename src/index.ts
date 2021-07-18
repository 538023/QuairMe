import Api from './api';
import Frontend from './frontend';
import Server from './server';

(
  async function () {
    const server = new Server(
      [
        new Api('api'),
        new Frontend('')
      ],
      5000,
    );
    
    server.listen();

    console.log('http://localhost:5000');
  }
)();