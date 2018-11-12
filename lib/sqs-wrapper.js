const AWS = require('aws-sdk');

const addToQueue = params => {
  AWS.config.region = params.region;
  const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

  return sqs.sendMessage({
    MessageBody: params.body,
    QueueUrl: params.queue,
  }).promise();
}

module.exports = {
  addToQueue,
};
