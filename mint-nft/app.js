const AWS = require('aws-sdk')
const nft = require('./generateNfts')
require('dotenv').config()

const  path = require('node:path');
const outputPath = path.join(process.cwd(), 'tmp/output')
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

 const handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`getAllItems only accept POST method, you tried: ${event.httpMethod}`);
    }

    console.log('Start generating...')

    const result = await nft.generateNFT(outputPath)

    console.log('Generated result: ', result)
    console.log('Start uploading to infura...')

    const uploadImageToIpfs = (await import('./uploadImageToIpfs.mjs')).default
    const ipfsDataUri = await uploadImageToIpfs(result.imgPath, result.metadataPath)

    console.log('Uploaded data URI: ', ipfsDataUri)

    // const mintNft = (await import('./mintNft.mjs')).default
    // const tx = await mintNft(
    //     '0x5019682dee09FB5B53cD48BA6458728b85826B87',
    //     process.env.PRIVATE_KEY,
    //     ipfsDataUri)

    return ""
};

//exports.lambdaHandler = handler

const event = require('../events/event.json');

handler(event, {})

async function mintNft() {
    try {
        response = {
            statusCode: 200,
            body: JSON.stringify("")
        };
        return response;
    } catch (error) {
        console.info("Received error: ", error);
        response = {
            statusCode: 500,
            body: JSON.stringify(error)
        };
        return response;
    }
} 
