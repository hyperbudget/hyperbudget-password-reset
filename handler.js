'use strict';

const awsArgs = {
  region: process.env.REGION,
  endpoint: null || process.env.DBD_ENDPOINT,
}

const queueWrapper = require('./lib/sqs-wrapper')(awsArgs);
const ddbWrapper = require('./lib/ddb-wrapper')(awsArgs)(process.env.DYNAMODB_TABLE);

module.exports.sendPasswordReset = async (event, context) => {
  const queue = process.env.SQS_QUEUE_URL;
  const body = JSON.parse(event.body);

  const token = 'test2';

  try {
    await Promise.all([
      queueWrapper.addToQueue({
        queue,
        message: {
          "email": body.email,
          "userId": body.userId,
          "name": body.name,
          "type": "reset_password",
          token,
        },
      }),
      ddbWrapper.addToTable(
        {
          "id": body.userId,
          token,
        }
      )
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ 'error': 'Something went wrong' })
    };
  }
};

module.exports.checkToken = async (event, context) => {
  const body = JSON.parse(event.body);
  try {
    const data = await ddbWrapper.getItem({
      id: body.userId
    });

    if (
      !data ||
      !data.Item ||
      !data.Item.token ||
      data.Item.token !== body.token
    ) {
      return {
        statusCode: 422,
        body: JSON.stringify({
          error: 'Could not verify token',
          errorCode: 1,
        }),
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        correct: true,
      }),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ 'error': 'Something went wrong' })
    };
  }
};
