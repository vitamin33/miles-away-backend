const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk')
const REGION = 'eu-central-1'

const settings = {
    region: process.env.AWS_REGION || REGION,
}
if (process.env.AWS_SAM_LOCAL) {
    settings.endpoint = 'http://dynamo:8000'
}
const dynamoClient = new AWS.DynamoDB.DocumentClient(settings)

// Get the DynamoDB table name from environment variables
const tableName = process.env.USERS_TABLE;

exports.lambdaHandler = async (event, context) => {

    // Get id and name from the body of the request
    const body = JSON.parse(event.body);
    const username = body.username;
    const userUUID = uuidv4();

    var params = {
        TableName : tableName,
        Item: {
            'PublicKey': userUUID ,
            'Username': username,
          }
    };

    return putItem(params);
};

const insertToDb = async item => {
    await dynamoClient.put(item).promise();
    return item;
};

async function putItem(data){
    try {
        const result = await insertToDb(data);
        console.log(result);
        response = {
            statusCode: 200,
            body: JSON.stringify(result)
        };
        return response;
    } catch (error) {
        response = {
            statusCode: 500,
            body: JSON.stringify(error)
        };
        return response;
    }
}