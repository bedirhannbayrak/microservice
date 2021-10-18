const mongoose = require('mongoose');

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

createPostConsumer();
