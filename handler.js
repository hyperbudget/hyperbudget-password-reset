'use strict';
const queueWrapper = require('./lib/sqs-wrapper');

module.exports.addToQueue = async (event, context) => {
  const queue = process.env.SQS_QUEUE_URL;
  const region = process.env.AWS_REGION;

  await queueWrapper.addToQueue({
    queue,
    region,
    message: {
      "email": event.body.email,
      "name": event.body.name,
      "type": event.body.type || 'reset-password'
    },
  });

  return {
    statusCode: 200,
    body: 'OK',
  };
};
