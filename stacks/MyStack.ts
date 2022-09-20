import {
  Bucket,
  StackContext,
  ViteStaticSite,
  Api,
  Auth,
  Table,
} from "@serverless-stack/resources"
import * as cloudfront from "aws-cdk-lib/aws-cloudfront"
import * as iam from "aws-cdk-lib/aws-iam"
import * as origins from "aws-cdk-lib/aws-cloudfront-origins"
import { aws_cognito as cognito } from "aws-cdk-lib"

export function MyStack({ stack }: StackContext) {
  const bucket = new Bucket(stack, "Bucket", {
    cors: [
      {
        allowedHeaders: ["*"],
        exposedHeaders: ["ETag"],
        allowedMethods: ["GET", "PUT", "HEAD", "POST", "DELETE"],
        allowedOrigins: ["*"],
      },
    ],
  })

  const dist = new cloudfront.Distribution(stack, "myDist", {
    defaultBehavior: {
      origin: new origins.S3Origin(bucket.cdk.bucket),
      allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
    },
  })

  const emailsTable = new Table(stack, "EmailsTable", {
    fields: {
      email: "string",
    },
    primaryIndex: { partitionKey: "email" },
  })

  const userGames = new Table(stack, "UserGames", {
    fields: {
      id: "string",
    },
    primaryIndex: { partitionKey: "id" },
  })

  const levelsTable = new Table(stack, "LevelsTable", {
    fields: {
      level: "string",
    },
    primaryIndex: { partitionKey: "level" },
  })

  const photoTable = new Table(stack, "PhotoTable", {
    fields: {
      id: "string",
    },
    primaryIndex: { partitionKey: "id" },
  })

  const auth = new Auth(stack, "Auth2", {
    triggers: { preSignUp: "triggers/autoConfirmTrigger.handler" },
    cdk: {
      userPool: {
        signInAliases: { email: true },
        passwordPolicy: {
          minLength: 7,
          requireSymbols: false,
          requireUppercase: false,
        },
      },
    },
  })

  const cfnUserPoolGroup = new cognito.CfnUserPoolGroup(
    stack,
    "UserPoolGroup",
    {
      userPoolId: auth.userPoolId,
      groupName: "admin",
    }
  )

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        environment: {
          BUCKET_NAME: bucket.bucketName,
          PHOTO_TABLE: photoTable.tableName,
          S3_CLOUDFRONT: dist.domainName,
          S3_BUCKET: bucket.cdk.bucket.bucketDomainName,
          LEVELS_TABLE: levelsTable.tableName,
          USER_GAMES: userGames.tableName,
          EMAILS_TABLE: emailsTable.tableName,
        },
      },
      authorizer: "iam",
    },
    routes: {
      "POST /guessLocation": "functions/guessLocation.handler",
      "POST /retrieveLevel": "functions/retrieveLevel.handler",
      "GET /getUserGames": "functions/getUserGames.handler",
      "GET /getTrailPhoto": "functions/getTrailPhoto.handler",
      "POST /savePhotoData": "functions/savePhotoData.handler",
      // "GET /getAllPhotos": {
      //   function: {
      //     handler: "functions/getAllPhotos.handler",
      //   },
      // },
      // "GET /adminGetUserGames": "functions/adminGetUserGames.handler",
      "POST /submitEmail": "functions/submitEmail.handler",
    },
  })

  api.attachPermissions([
    bucket,
    photoTable,
    levelsTable,
    userGames,
    emailsTable,
  ])

  const iamResource = `arn:aws:execute-api:${stack.region}:${stack.account}:${api.httpApiId}`

  auth.attachPermissionsForAuthUsers(stack, [bucket, api])
  auth.attachPermissionsForUnauthUsers(stack, [
    api,
    bucket,
    // new iam.PolicyStatement({
    //   actions: ["execute-api:Invoke"],
    //   effect: iam.Effect.ALLOW,
    //   resources: [
    //     iamResource + "/guessLocation",
    //     iamResource + "/retrieveLevel",
    //     iamResource + "/getUserGames",
    //     iamResource + "/getTrailPhoto",
    //     iamResource + "/savePhotoData",
    //   ],
    // }),
  ])

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
      VITE_STAGE: stack.stage,
      VITE_FATHOM_ID: process.env.FATHOM_ID ?? "",
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
