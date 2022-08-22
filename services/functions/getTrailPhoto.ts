import { APIGatewayProxyHandlerV2 } from "aws-lambda"
import { S3 } from "@aws-sdk/client-s3"

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  
  const bareBonesS3 = new S3({})
  const params = { Bucket: process.env.BUCKET_NAME, Key: req.params.imageId };
  await bareBonesS3.getObject(params)

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `Hello, World! Your request was received at ${event.requestContext.time}.`,
  }
}
