const AWS = require('aws-sdk');
const wrapper = require('./aws-wrapper');

const dbdWrapper = table => {{
  const client = new AWS.DynamoDB.DocumentClient();

  return {
    addToTable(item) {
      console.log(table);
      const params = {
        TableName: table,
        Item: item
      };

      return new Promise((resolve, reject) => (
        client.put(params, (err, data) => err ? reject(err) : resolve(data))
      ));
    },
    getItem(item) {
      return new Promise((resolve, reject) => (
        client.get(
          {
            TableName: table,
            Key: item,
          },
          (err, data) => err ? reject(err) : resolve(data)
        )
      ));
    },
  };
}};

module.exports = wrapper(dbdWrapper);
