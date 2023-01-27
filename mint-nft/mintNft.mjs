import milesAwayNFT from './contracts/MilesAwayNft.json'
import { ethers } from 'ethers'
import * as dotenv from 'dotenv'
dotenv.config()

const nftContractAddress = '0xb3216a6ac47B075000B744004fD81F6173d242C6'

export default async function mintNft(publicKey, privateKey, tokenUri) {
    // Configuring the connection to an Ethereum node
    const network = process.env.NETWORK;
    const provider = new ethers.providers.InfuraProvider(
        network,
        process.env.INFURA_API_KEY
    );
    // Creating a signing account from a private key
    const signer = new ethers.Wallet(privateKey, provider);
	const nftContract = new ethers.Contract(
		nftContractAddress,
		milesAwayNFT.abi,
		signer
	)

	let nftTx = await nftContract.safeMint(publicKey, tokenUri)
	console.log('Mining....', nftTx.hash)

    let tx = await nftTx.wait()
	console.log('Mined!', tx)
    return tx
}