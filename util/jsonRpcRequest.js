const axios = require('axios');

const jsonRpcRequest = async ({ method, params, token = null, url = '' }) => {
  const headers = {
    'Content-Type': 'application/json',
    'X-Company-Login': process.env.SIMPLYBOOK_COMPANY_LOGIN,
  };

  if (token) {
    headers['X-Token'] = token;
  }

  const requestData = {
    jsonrpc: '2.0',
    method: method,
    params: params,
    id: 1,
  };

  try {
    const response = await axios.post(
      `${process.env.SIMPLYBOOK_BASE_URL}${url}`,
      requestData,
      { headers }
    );
    console.info(
      `SimplyBook: JSON-RPC request successful for method ${method}`
    );

    return response.data.result;
  } catch (error) {
    throw new Error(
      `SimplyBook: JSON-RPC request for method ${method} failed: ${error}`
    );
  }
};

module.exports = jsonRpcRequest;
