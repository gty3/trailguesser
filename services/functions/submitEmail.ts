import { DynamoDB, SES } from "aws-sdk"
import { APIGatewayProxyEventV2WithRequestContext } from "aws-lambda"
import { IAMAuthorizer } from "../lib/types"
const dynamoDb = new DynamoDB.DocumentClient()
const ses = new SES({ region: 'us-east-1' })

export const handler = async (
  event: APIGatewayProxyEventV2WithRequestContext<IAMAuthorizer>
  ) => {
    const unauthId =
      event.requestContext.authorizer.iam.cognitoIdentity.identityId

  console.log("emailsTable", process.env.EMAILS_TABLE)
  if (!event.body) {
    return {
      statusCode: 500,
      body: "No event body",
    }
  }
  if (!process.env.EMAILS_TABLE) {
    return {
      statusCode: 500,
      body: "No table env",
    }
  }

  const email: string = JSON.parse(event.body)

  const newEmailParams = {
    Item: { email: email, unauthId: unauthId },
    TableName: process.env.EMAILS_TABLE,
  }
  await dynamoDb.put(newEmailParams).promise()

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: "success",
  }
}
