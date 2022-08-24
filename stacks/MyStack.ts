import {
  Bucket,
  StackContext,
  ViteStaticSite,
  Api,
  Auth,
  Table,
} from "@serverless-stack/resources"
import * as cloudfront from "aws-cdk-lib/aws-cloudfront"
import * as origins from "aws-cdk-lib/aws-cloudfront-origins"
import * as iam from "aws-cdk-lib/aws-iam"
import { BucketAccessControl } from "aws-cdk-lib/aws-s3"

export function MyStack({ stack }: StackContext) {
  
  const bucket = new Bucket(stack, "Bucket", {
    cors: true,
    cdk: { bucket: { publicReadAccess: true }}
  })
  
  const dist = new cloudfront.Distribution(stack, "myDist", {
    defaultBehavior: {
      origin: new origins.S3Origin(bucket.cdk.bucket),
      allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
    },
  })
  // const newPolicy =  new iam.PolicyStatement({
  //   actions: ["s3:*"],
  //   effect: iam.Effect.ALLOW,
  //   resources: [
  //     bucket.bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*",
  //   ],
  // })

  bucket.attachPermissions([dist])

  const photoTable = new Table(stack, "PhotoTable", {
    fields: {
      id: "string",
    },
    primaryIndex: { partitionKey: "id" },
  })

  const auth = new Auth(stack, "Auth")

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        environment: {
          BUCKET_NAME: bucket.bucketName,
          PHOTO_TABLE: photoTable.tableName,
          S3_CLOUDFRONT: dist.domainName,
          S3_BUCKET: bucket.cdk.bucket.bucketDomainName
        },
      },
      authorizer: "iam",
    },
    routes: {
      "GET /getTrailPhoto": "functions/getTrailPhoto.handler",
      "POST /savePhotoData": "functions/savePhotoData.handler",
      "GET /getAllPhotos": "functions/getAllPhotos.handler",
    },
  })
  api.attachPermissions([bucket, photoTable])

  auth.attachPermissionsForUnauthUsers(stack, [bucket, api])
  auth.attachPermissionsForAuthUsers(stack, [bucket])

  new ViteStaticSite(stack, "ReactSite", {
    path: "frontend",
    environment: {
      VITE_REGION: stack.region,
      VITE_API_URL: api.url,
      VITE_USER_POOL_ID: auth.userPoolId,
      VITE_APP_CLIENT_ID: auth.userPoolClientId,
      VITE_IDENTITY: auth.cognitoIdentityPoolId ?? "",
      VITE_APIGATEWAY_NAME: api.httpApiId,
      VITE_BUCKET_NAME: bucket.bucketName,
      VITE_S3_CLOUDFRONT: dist.domainName,
      VITE_GOOGLE_MAPS: process.env.GOOGLE_MAPS ?? "",
    },
    customDomain:
      stack.stage === "prod"
        ? {
            domainName: "trailguesser.com",
            domainAlias: "www.trailguesser.com",
          }
        : undefined,
  })

  stack.addOutputs({
    ApiEndpoint: api.url,
    dist: dist.domainName,
  })
}
