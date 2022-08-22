import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb"
interface EventBody {
  id: string
  trailName: string
  location?: string
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const err = { statusCode: 500 }
  const eventBody: EventBody = JSON.parse(event.body ?? '')
  const { id, trailName } = eventBody
  if (!process.env.PHOTO_TABLE) { console.log('no table env'); return err }

  const dbClient = new DynamoDBClient({})
  const input = {
    Item: { id: { S: id }, trailName: { S: trailName }},
    TableName: process.env.PHOTO_TABLE
  }
  const command = new PutItemCommand(input)
  const itemRes = await dbClient.send(command)

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `Hello, World! Your request was received at ${event.requestContext.time}.`,
  };
};
