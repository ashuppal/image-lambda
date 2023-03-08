const AWS = require('aws-sdk');
const s3 = new AWS.S3();

// import * as AWS from "@aws-sdk/client-s3";
exports.handler = async (event, context) => {
    
    console.log(event);

    const bucketName = event.Records[0].s3.bucket.name;
    const key = event.Records[0].s3.object.key;
    const params = {
        Bucket: bucketName,
        Key: key
    };
    const file = await s3.getObject(params).promise();
 
    const name = key; 
    const size = file.ContentLength;
    const metadata = {
        name,
        size,
    };
    const images = await getImages();
    const index = images.findIndex(image => image.name === name);
    if (index === -1) {
        images.push(metadata);
    } else {
        images[index] = metadata;
    }
    await uploadImages(images);
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'uploaded successfully!',
        }),
    };
}

const getImages = async () => {

    const params = {
        Bucket: 'ashnew',
        Key: 'images.json'
    };
    try {
        const file = await s3.getObject(params).promise();
        return JSON.parse(file.Body.toString());
    } catch (error) {
        return [];
    }
}

const uploadImages = async (images) => {
    const params = {
        Bucket: 'ashnew',
        Key: 'images.json',
        Body: JSON.stringify(images)
    };
    return s3.upload(params).promise();
}


