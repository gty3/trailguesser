import { APIGatewayProxyHandlerV2 } from "aws-lambda"
import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb"
import { S3 } from "@aws-sdk/client-s3"

interface EventBody {
  level: string
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const eventBody: EventBody = JSON.parse(event.body ?? "")
  const { level } = eventBody
  const dbClient = new DynamoDBClient({})
  const input = {
    Key: { id: { S: level } },
    TableName: process.env.LEVELS_TABLE
  }
  const command = new GetItemCommand(input)
  const itemRes = await dbClient.send(command)
  const res = JSON.stringify(itemRes.Item) ?? ""
  console.log("LEVEL ITEMRES", itemRes)

  return {
    statusCode: 200,
    body: res,
  }
}
