import server, { listSockets } from '../src/server';
import * as config from './config/config';
   
let url = `${config.endpoint}:${config.port}`;

// Create clients connected at url
let client1 = require('socket.io-client')(url);
let client2 = require('socket.io-client')(url);
let client3 = require('socket.io-client')(url);

// Run Server
beforeAll((done) => {
  server.listen(process.env.PORT, function() {
    console.log(`Server listening on port test ${process.env.PORT}`);
    done();
  });
});

test(`Test return True if user (client1) is connected`, (done) => {
  
  client1.on('connect', function(data: any){
    console.log('user connected, ', client1.connected);
    expect(client1.connected).toBe(true);
    done();
  });

  client1.on('disconnect', function(){
    console.log('user disconnect, ', client1.connected);
    done();
  }); 
});

test(`Test return True if message is in broadcast ( from client1, to 2,3)`, (done) => {
  
  let message = 'Hello'

  client2.on('message', function(data: any) {
    expect(data).toBe(message);
    done();
  });

  client3.on('message', function(data: any) {
    expect(data).toBe(message);
    done();
  });

  client1.emit('message', message);

});

afterAll((done) => {
  client1.disconnect();
  client2.disconnect();
  client3.disconnect();

  server.close(()=> {
    // Check no sockets in pending (in array/DB)
    expect(listSockets().length).toBe(0);
    done()
  });
});