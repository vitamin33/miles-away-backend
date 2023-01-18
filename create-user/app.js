const AWS = require('aws-sdk')
const ethers = require('ethers')

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

    if (event.request.userAttributes.email) {
        // Get email from the Cognito event
        const email = event.request.userAttributes.email
        const wallet = ethers.Wallet.createRandom()

        var params = {
            TableName : tableName,
            Item: {
                'PublicKey': wallet.address ,
                'Email': email,
                'PrivateKey': wallet.privateKey
            }
        };
        return putItem(params);
    } else {
        // Nothing to do, the user's email ID is unknown
        response = {
            statusCode: 400,
            body: JSON.stringify("User's email is empty. Can't generate Wallet keypair.")
        };
        return response;
    }
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