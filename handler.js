'use strict';
const queueWrapper = require('./lib/sqs-wrapper');

module.exports.addToQueue = async (event, context) => {
  const queue = process.env.SQS_QUEUE_URL;
  const region = process.env.REGION;
  const body = JSON.parse(event.body);

  await queueWrapper.addToQueue({
    queue,
    region,
    message: {
      "email": body.email,
      "name": body.name,
      "type": body.type || 'reset_password'
    },
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true })
  };
};
