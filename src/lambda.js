const serverlessExpress = require('@codegenie/serverless-express');
const app = require('./app');

let serverlessExpressInstance;

const handler = async (event, context) => {
  serverlessExpressInstance = serverlessExpressInstance ?? serverlessExpress({ app });
  return serverlessExpressInstance(event, context);
};

module.exports = { handler };
