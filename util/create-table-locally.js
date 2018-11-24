const AWS = require('aws-sdk');

AWS.config.update({
  endpoint: 'http://localhost:8000',
  region: 'eu-west-1'
});

const client = new AWS.DynamoDB();

client.createTable({
 TableName: 'hyperbudget-password-reset3-dev',
     KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10,
    },
 }, (err, res) => console.log(err, res)
);
