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
    if (event.httpMethod !== 'GET') {
        throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    return scan();
};

async function scan(){
    try {
        const params = {
            TableName: tableName,
        };
    
        const scanResults = [];
        var items;
        do{
            items =  await dynamoClient.scan(params).promise();
            items.Items.forEach((item) => scanResults.push(item));
            params.ExclusiveStartKey  = items.LastEvaluatedKey;
        }while(typeof items.LastEvaluatedKey !== "undefined");
    
        
        console.log(scanResults);
        response = {
            statusCode: 200,
            body: JSON.stringify(scanResults)
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
