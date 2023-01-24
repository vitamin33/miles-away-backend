const AWS = require('aws-sdk')
const S3 = new AWS.S3({region: 'eu-central-1'});
const mergeImages = require('merge-images')
const { Canvas, Image } = require('canvas')
const  path = require('path')
const  fs = require('fs')
const fsPromise = require('fs').promises;
const { MersenneTwister19937, bool, real } = require('random-js')
const content = require('./content')

const layersPath = path.join(process.cwd(), 'tmp/layers')

const BUCKET_NAME = 'serbyn-vitalii-2222'

const generateNFT = async (outputPath) => {
    try
    {
        let data = await listDirectory('layers', BUCKET_NAME)
        data.Contents?.forEach( async(element) => {
            await writeFileToTemp(element.Key, BUCKET_NAME)
        });

        let selection = await randomlySelectLayers(layersPath, content.layers)
 
        let imgPath = path.join(outputPath, `0.png`)
        ensureDirectoryExistence(imgPath)

        await mergeLayersAndSave(
            selection.images, 
            imgPath
        )

        let metadataPath = path.join(outputPath, `0`)
        let metadata = generateMetadata(content, '0', selection.selectedTraits)

        fs.writeFileSync(metadataPath, JSON.stringify(metadata))
     
        return { imgPath, metadataPath }
    }
    catch (err) // if an error occured
    {
        console.error(err);
    }
}

function generateMetadata(content, tokenId, traits) {
    attributes = []
    for (const [trait_type, value] of Object.entries(traits)) {
        attributes.push({trait_type, value})
    }

    return content.metadataTemplate(tokenId, attributes)
}

async function randomlySelectLayers(layersPath, layers) {
    const mt = MersenneTwister19937.autoSeed()

    let images = []
    let selectedTraits = {}

    for (const layer of layers) {
        if (bool(layer.probability)(mt)) {
            let selected = pickWeighted(mt, layer.options)
            selectedTraits[layer.name] = selected.name
            images.push(path.join(layersPath, selected.file))
        }
    }

    return {
        images,
        selectedTraits
    }
}

function pickWeighted(mt, options) {
    const weightSum = options.reduce((acc, option) => {
        return acc + (option.weight ?? 1.0)
    }, 0)

    const r = real(0.0, weightSum, false)(mt)

    let summedWeight = 0.0;
    for (const option of options) {
        summedWeight += option.weight ?? 1.0
        if (r <= summedWeight) {
            return option
        }
    }
}

async function mergeLayersAndSave(layers, outputFile) {
    console.log(`Output file: ${JSON.stringify(outputFile)}, layers: ${JSON.stringify(layers)}`)

    const image = await mergeImages(layers, { Canvas: Canvas, Image: Image })
    console.log("Output image file: ", image)
    saveBase64Image(image, outputFile)
}

function saveBase64Image(base64PngImage, filename) {
    let base64 = base64PngImage.split(',')[1]
    let imageBuffer = Buffer.from(base64, 'base64')
    fs.writeFileSync(filename, imageBuffer)
}

const listDirectory = async (path, bucketName) => {
    const params = {
        Prefix: path,
        Bucket: bucketName
    };
    try {
        const results = await S3.listObjectsV2(params).promise().then(data => {
            return data;
        }).catch(function (err) {
            console.warn('Not exist folder exception is not catch here!' );
            return false;
        });
        return results;
    } catch (e) {
        console.warn('Error listing meta directory ' + path);
    }
}

const writeFileToTemp = async (key, bucketName) => {
    try {
        const params = {
            Bucket: bucketName,
            Key: key,
        };
    
        const data = await S3.getObject(params).promise();
        const filePath = path.join(layersPath, key)
        ensureDirectoryExistence(filePath)
        fs.writeFileSync(filePath, data.Body);
    } catch(err) {
        console.log(err);
    }
}

function ensureDirectoryExistence(filePath) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

module.exports = { generateNFT }