import { app } from './app';

app
  .listen({
    host: '0.0.0.0',
    port: 8080
  })
  .then(url => {
    console.log(`Server is running on ${url}`);
  });
