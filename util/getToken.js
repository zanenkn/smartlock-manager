const jsonRpcRequest = require('./jsonRpcRequest');

async function getToken() {
  const params = {
    company_login: process.env.SIMPLYBOOK_COMPANY_LOGIN,
    api_key: process.env.SIMPLYBOOK_API_KEY,
  };

  return await jsonRpcRequest({
    method: 'getToken',
    params,
    url: '/login',
  });
}

module.exports = getToken;
