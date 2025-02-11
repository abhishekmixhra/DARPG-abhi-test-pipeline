const axios = require('axios');

async function sendUserQuery(userQuery) {
  try {
    const response = await axios.post('http://3.110.154.251/bedrock.php', {
      user_query: userQuery,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(response.data); // Logs the response from the server
    return response.data;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

module.exports = { sendUserQuery };
