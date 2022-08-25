import { APIGatewayProxyHandlerV2 } from "aws-lambda"
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb"

interface EventBody {
  id: string
  trailName?: string
  latLng: {
    lat: number
    lng: number
  }
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const err = { statusCode: 500 }
  const eventBody: EventBody = JSON.parse(event.body ?? "")
  const { id, trailName, latLng } = eventBody
  if (!process.env.PHOTO_TABLE) {
    console.log("no table env")
    return err
  }
  try {
    const dbClient = new DynamoDBClient({})
    const input = {
      Item: {
        id: { S: id },
        latLng: {
          M: {
            lat: { N: "" + latLng.lat },
            lng: { N: "" + latLng.lng },
          },
        },
        ...(trailName && { trailName: { S: trailName } })
      },
      TableName: process.env.PHOTO_TABLE,
    }
    const command = new PutItemCommand(input)
    const itemRes = await dbClient.send(command)
  } catch (error) {
    console.log(error)
    return err
  }



  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `Hello, World! Your request was received at ${event.requestContext.time}.`,
  }
}
