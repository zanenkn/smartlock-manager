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
    console.log(`SimplyBook JSON-RPC request successful for method ${method}`);
    return response.data.result;
  } catch (error) {
    console.error(
      'Error with JSON-RPC request:',
      error.response?.data || error.message
    );
    throw new Error('SimplyBook JSON-RPC request failed');
  }
};

module.exports = jsonRpcRequest;
