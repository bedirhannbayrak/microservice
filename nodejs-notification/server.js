const mongoose = require('mongoose');
const { Server } = require('socket.io');
const createPostConsumer = require('./rabbitmq/createPostConsumer');

mongoose
  .connect('mongodb://localhost:27017/notifications', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB Connection Successfull'))
  .catch((err) => {
    console.error(err);
  });

const io = new Server({
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('connected');
  socket.on('disconnect', () => {
    console.log('disconnected');
  });
});

createPostConsumer(io);

io.listen(5000);
