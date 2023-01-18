const AWS = require('aws-sdk')
require('dotenv').config()

const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");

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

    await Moralis.start({
        apiKey: process.env.MORALIS_KEY,
      });

    const email = event.queryStringParameters.email

    return await getItemByEmail(email);
};

async function getItemByEmail(email){
    try {
        const params = {
            Key: {'Email': email },
            TableName: tableName
        };
    
        const item = (await dynamoClient.get(params).promise()).Item
        //const address = item.PublicKey
        console.log("NFT contract: ", process.env.NFT_CONTRACT_ADRESS)

        const address = '0x5019682dee09FB5B53cD48BA6458728b85826B87'
        const chain = EvmChain.MUMBAI;
        const tokenAddresses = [ process.env.NFT_CONTRACT_ADRESS ]

        const nftResult = await Moralis.EvmApi.nft.getWalletNFTs({
            address: address,
            chain: chain,
            tokenAddresses: tokenAddresses
        })

        console.info("Nft results: ", nftResult?.result)

        response = {
            statusCode: 200,
            body: JSON.stringify(nftResult)
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
