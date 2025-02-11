const { MongoClient } = require('mongodb');
const AWS = require('aws-sdk');

async function invokeClaude() {
    const prompt = "my mobile is not working";

    // MongoDB Connection
    try {
        const uri = "mongodb://darpg:darpg%40123@65.2.150.148:27017/?authMechanism=DEFAULT";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        
        const database = client.db('darpg');
        const collection = database.collection('category');
        
        // Get distinct categories
        const categories = await collection.distinct('category');
        console.log('Categories:', categories);
        
        await client.close();
    } catch (err) {
        console.error("MongoDB Error:", err.message);
        return;
    }

    // AWS Bedrock Invocation
    const credentials = new AWS.Credentials({
        accessKeyId: 'AKIAV7ES6SHZC4ZMLKG6',
        secretAccessKey: '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',
    });

    const bedrockClient = new AWS.BedrockRuntime({
        region: 'ap-south-1',
        credentials: credentials,
    });

    const body = {
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 2000,
        messages: [
            {
                role: 'user',
                content: `Now, answer the following:

1. Answer the question '${prompt}'
2. Provide multiple categories for the question '${prompt}'

Respond in the following JSON format:
{
  "answer": "Your answer here",
  "categories": [
    "Category 1",
    "Category 2",
    "Category 3"
  ]
}`
            }
        ]
    };

    const params = {
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify(body),
        modelId: 'anthropic.claude-3-sonnet-20240229-v1:0'
    };

    try {
        const result = await bedrockClient.invokeModel(params).promise();
        const response = JSON.parse(result.body);

        if (!response) {
            console.log("Error decoding response from Bedrock model.");
            return;
        }

        if (response.content && response.content[0] && response.content[0].text) {
            const responseData = response.content[0].text;
            const responseJson = JSON.parse(responseData);

            if (responseJson.answer && responseJson.categories) {
                const answer = responseJson.answer;
                const selectedCategories = responseJson.categories;
                console.log(`Answer: ${answer}`);
                console.log(`Selected Categories Are: ${selectedCategories.join(", ")}`);
            } else {
                console.log("Error: Response does not contain expected 'answer' or 'categories'.");
            }
        } else {
            console.log("Error: Response does not contain expected 'content'.");
        }

    } catch (err) {
        console.error("AWS Error:", err.message);
    }
}

// Invoke the function
invokeClaude();
