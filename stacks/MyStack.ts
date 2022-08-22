import {
  Bucket,
  StackContext,
  ViteStaticSite,
  Api,
  Auth,
  Table,
} from "@serverless-stack/resources"

export function MyStack({ stack }: StackContext) {
  const bucket = new Bucket(stack, "Bucket", {
    cors: true,
  })

  const photoTable = new Table(stack, 'PhotoTable', {
    fields: {
      id: "string",
    },
    primaryIndex: { partitionKey: "id" }
  })

  const auth = new Auth(stack, "Auth")

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        environment: {
          BUCKET_NAME: bucket.bucketName,
          PHOTO_TABLE: photoTable.tableName
        }
      },
      authorizer: "iam",
    },
    routes: {
      "GET /": "functions/lambda.handler",
      "GET /getTrailPhoto": "functions/getTrailPhoto.handler",
      "POST /savePhotoData": "functions/savePhotoData.handler",
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
  })
}
