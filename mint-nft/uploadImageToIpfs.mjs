import { create } from 'ipfs-http-client'
import { Buffer } from 'buffer'

import * as path from 'path'
import * as fs from 'fs'

export default async function uploadImageToIpfs(imgPath, metadataPath) {
    let client = createInfuraClient()

    /* upload the image file */
    let imgFile = fs.readFileSync(imgPath)
    const addedImg = await client.add(imgFile)
    const ipfsImgUrl = `https://infura-ipfs.io/ipfs/${addedImg.path}`

    let metadataContent = fillMetadataContent(metadataPath, ipfsImgUrl)

    /* upload the metadata file */
    const addedMeta = await client.add(metadataContent)
    const ipfsMetaUrl = `https://infura-ipfs.io/ipfs/${addedMeta.path}`

    return ipfsMetaUrl
}

function fillMetadataContent(metadataPath, ipfsImgUrl) {
  var metadataContent = fs.readFileSync(metadataPath)
  let metadataJson = JSON.parse(metadataContent)
  metadataJson.image = ipfsImgUrl
  let metadataString = JSON.stringify(metadataJson)
  try {
    fs.writeFileSync(metadataPath, metadataString)
    console.log('JSON metadata is saved.')
  } catch (error) {
    console.error(err)
  }
  metadataContent = fs.readFileSync(metadataPath)

  return metadataContent
}

function createInfuraClient() {
      /* configure Infura auth settings */
      const projectId = "2J2EcVANAs4yTjWh28m2ef2XFuf"
      const projectSecret = "11bbbf033eabf15cd50ed8d6d987b294"
      const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')
  
      /* Create an instance of the client */
      return create({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        headers: {
            authorization: auth,
        }
      })
}

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });