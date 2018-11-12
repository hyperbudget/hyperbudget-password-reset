const AWS = require('aws-sdk');

const addToQueue = params => {
  AWS.config.region = params.region;
  const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

  return sqs.sendMessage({
    MessageBody: JSON.stringify(params.message),
    QueueUrl: params.queue,
  }).promise();
}

module.exports = {
  addToQueue,
};
