module.exports = {
    metadataTemplate: (tokenId, attributes) => ({
        image: '<image_url>',
        name: `NFT #${tokenId}`,
        external_url: 'https://www.miles.away/',
        description: 'Fly-to-Earn NFT game!',
        attributes: attributes,
    }),
    layers: [
        {
            name: "Body",
            probability: 1.0,
            options: [
                {
                    name: "Body Blue",
                    file: "body/body_blue.png",
                    weight: 0.25
                },
                {
                    name: "Body Green",
                    file: "body/body_green.png",
                    weight: 0.1
                },
                {
                    name: "Body Green Green",
                    file: "body/body_green_green.png",
                    weight: 0.1
                },
                {
                    name: "Body Green Pink",
                    file: "body/body_green_pink.png",
                    weight: 1
                },
                {
                    name: "Body Pink Green",
                    file: "body/body_pink_green.png",
                    weight: 0.1
                },
                {
                    name: "Body Pink Pink",
                    file: "body/body_pink_pink.png",
                    weight: 0.1
                }
            ]
        },
        {
            name: "Handle",
            probability: 1.0,
            options: [
                {
                    name: "Handle Blue",
                    file: "handle/handle_blue.png",
                    weight: 0.2
                },
                {
                    name: "Handle Pink",
                    file: "handle/handle_pink.png",
                    weight: 0.4
                },
                {
                    name: "Handle Violet",
                    file: "handle/handle_violet.png",
                    weight: 1
                },
            ]
        },
        {
            name: "Wheels",
            probability: 1,
            options: [
                {
                    name: "Wheels Blue",
                    file: "wheels/wheels_blue.png",
                    weight: 1
                },
                {
                    name: "Wheels Green",
                    file: "wheels/wheels_green.png",
                    weight: 0.5
                },
                {
                    name: "Wheels Pink",
                    file: "wheels/wheels_pink.png",
                    weight: 0.1
                }
            ]
        }
    ]
}