const AWS = require('aws-sdk');
const wrapper = require('./aws-wrapper');

const queueWrapper = {
  addToQueue(params) {
    const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
    return sqs.sendMessage({
      MessageBody: JSON.stringify(params.message),
      QueueUrl: params.queue,
    }).promise();
  }
};

module.exports = wrapper(queueWrapper);
