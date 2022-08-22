import { APIGatewayProxyHandlerV2 } from "aws-lambda"
import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb"
import { S3 } from "@aws-sdk/client-s3"

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  
  const dbClient = new DynamoDBClient({})
  const input = {
    Key: { id: { S: '1' } },
    TableName: process.env.PHOTO_TABLE
  }
  const command = new GetItemCommand(input)
  const itemRes = await dbClient.send(command)
  const res = JSON.stringify(itemRes.Item) ?? ""
  console.log("ITEMRES", itemRes)

  return {
    statusCode: 200,
    body: res,
  }
}
