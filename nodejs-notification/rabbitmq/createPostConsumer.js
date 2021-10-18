const amqp = require('amqplib/callback_api');
const Notification = require('../models/Notification');

module.exports = () =>
  amqp.connect(
    'amqp://guest:guest@localhost:5672/',
    function (error0, connection) {
      if (error0) {
        throw error0;
      }
      connection.createChannel(function (error1, channel) {
        if (error1) {
          throw error1;
        }
        var queue = 'create-post';

        channel.assertQueue(queue, {
          durable: false,
        });

        channel.consume(
          queue,
          function (msg) {
            let msgString = msg.content.toString();
            console.log(' [x] Received %s', msgString);
            let msgJson = JSON.parse(msgString);

            let newMsg = {
              userId: msgJson.user_id,
              description: `${msgJson.title} isimli yazınız yayınlandı`,
              link: msgJson.title,
            };
            console.log(newMsg);
            const notification = new Notification(newMsg);
            notification
              .save()
              .then((data) => console.log(data))
              .catch((e) => console.log(e));
          },
          {
            noAck: true,
          }
        );
      });
    }
  );
