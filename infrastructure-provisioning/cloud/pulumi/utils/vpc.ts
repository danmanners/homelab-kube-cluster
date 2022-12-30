import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

// Create an AWS S3 Bucket Resource
async function bucketMaker(bucketName: string) {
    const bucket = new aws.s3.Bucket(bucketName);
    return {
        "name": bucket.id,
        "arn": bucket.arn
    }
}

// Export the bucketMaker function
export {bucketMaker}
