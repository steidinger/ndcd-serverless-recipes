import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import {createLogger} from "../utils/logger";

const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({ signatureVersion: 'v4' });
const bucketName = process.env.IMAGES_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;

const logger = createLogger("business-layer");


export function getImageUrl(imageId: string): string {
    return `https://${bucketName}.s3.amazonaws.com/${imageId}`;
}

export function getUploadUrl(imageId: string): string {
    const expires = (typeof urlExpiration === 'string' ? Number.parseInt(urlExpiration) : urlExpiration);
    logger.debug(`Creating signedUrl for bucket ${bucketName}, key ${imageId}, expires ${expires}`);
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: imageId,
        Expires: expires,
    });
}

export async function deleteImage(imageId: string): Promise<void> {
    await s3.deleteObject({
        Bucket: bucketName,
        Key: imageId,
    }).promise();
}