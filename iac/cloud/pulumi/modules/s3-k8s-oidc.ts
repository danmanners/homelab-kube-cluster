import * as aws from "@pulumi/aws";

export function createOidcBucket(config: any) {
  // Create Bucket
  const bucket = new aws.s3.BucketV2(config.general.bucket_name, {
    // Set all tags for the bucket
    tags: config.tags,
    bucketPrefix: config.general.bucket_name, // a unique bucket name beginning with the specified prefix will be generated
    forceDestroy: true, // This allows pulumi to delete the s3 bucket even if it has contents
  });

  const ownership = new aws.s3.BucketOwnershipControls(
    `${config.general.bucket_name}-ownership`,
    {
      bucket: bucket.id,
      rule: {
        objectOwnership: "BucketOwnerPreferred",
      },
    }
  );

  const exampleBucketAclV2 = new aws.s3.BucketAclV2(
    `${config.general.bucket_name}-acl`,
    {
      bucket: bucket.id,
      acl: "public-read",
    },
    {
      dependsOn: [ownership],
    }
  );

  const corsConfig = new aws.s3.BucketCorsConfigurationV2(
    `${config.general.bucket_name}-cors`,
    {
      bucket: bucket.id,
      corsRules: [
        {
          allowedHeaders: ["*"],
          allowedMethods: ["GET", "HEAD"],
          allowed_origins: ["*"],
          expose_headers: ["ETag"],
          max_age_seconds: 3000,
        },
        {
          allowedMethods: ["GET"],
          allowedOrigins: ["*"],
        },
      ],
    }
  );
}
