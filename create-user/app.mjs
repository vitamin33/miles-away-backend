import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid';

const REGION = 'eu-central-1'

const client = new DynamoDBClient({
    region: REGION,
    endpoint: "http://127.0.0.1:8000",
    credentials: {
      accessKeyId: "z76jr",
      secretAccessKey: "ayb6a",
    },
});

const ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({
    region: REGION,
    endpoint: "http://127.0.0.1:8000",
    credentials: {
      accessKeyId: "z76jr",
      secretAccessKey: "ayb6a",
    },
}))

// Get the DynamoDB table name from environment variables
const tableName = process.env.USERS_TABLE;

export const lambdaHandler = async (event, context) => {

    //console.info('received:', event);

    console.info('Table name to insert:', tableName);

    // Get id and name from the body of the request
    const body = JSON.parse(event.body);
    const username = body.username;
    const userUUID = uuidv4();

    var params = {
        TableName : tableName,
        Item: {
            PublicKey: { S: userUUID },
            Username: { S: username },
          }
    };

    try {
        //const data = await ddbDocClient.send(new PutItemCommand(params));
        const data = await client.send(new PutItemCommand(params));


        console.log("Success - item added or updated", data);
        context.succed
    } catch (err) {
        console.log("Error", err.stack);
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify(body)
    };

    // All log statements are written to CloudWatch
    //console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
