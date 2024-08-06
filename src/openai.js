const { AzureOpenAI } = require("openai");
require('dotenv').config();

// Retrieve environment variables for OpenAI API configuration
const endpoint = process.env.AZURE_OPENAI_BASE_PATH;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION;
const deployment = process.env.AZURE_GPT4_DEPLOYMENT_NAME;

/**
 * Fetches a response from the OpenAI API based on user input.
 *
 * @param {string} userInput - The user's input text.
 * @returns {Promise<string>} - The response from the OpenAI API.
 */
async function fetchOpenAI(userInput) {
  console.log("== Chat Completions Sample ==");

  const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });
  
  try {
    const result = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant, that is a pirate, and likes to think that he is a real person." },
        { role: "user", content: userInput }
      ]
    });

    console.log('API Response:', result);
    return result.choices[0].message.content;
  } catch (error) {
    console.error("Error in OpenAI API request:", error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = { fetchOpenAI };
