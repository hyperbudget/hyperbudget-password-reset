'use strict';

const randomString = require('random-string');
const bcryptPromise = require('./lib/bcrypt-promise');

const awsArgs = {
  region: process.env.REGION,
  endpoint: null || process.env.DBD_ENDPOINT,
}

const queueWrapper = require('./lib/sqs-wrapper')(awsArgs);
const ddbWrapper = require('./lib/ddb-wrapper')(awsArgs)(process.env.DYNAMODB_TABLE);

module.exports.sendPasswordReset = async (event, context) => {
  const queue = process.env.SQS_QUEUE_URL;
  const body = JSON.parse(event.body);

  let token = randomString({ length: 20 });
  console.log(token);

  try {
    const hashedToken = await bcryptPromise.bcryptHash(token, 10);

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
          token: hashedToken,
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
    const token = body.token;
    const data = await ddbWrapper.getItem({
      id: body.userId
    });

    if (
      !data ||
      !data.Item ||
      !data.Item.token ||
      !await bcryptPromise.checkHash(token, data.Item.token)
    ) {
      return {
        statusCode: 422,
        body: JSON.stringify({
          error: 'Could not verify token',
          errorCode: 1,
        }),
      }
    }

    await ddbWrapper.deleteItem({ id: body.userId });

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
