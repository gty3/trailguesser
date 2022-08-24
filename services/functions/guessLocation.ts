import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb"


interface EventBody {
  latLng: {
    lat: number
    lng: number
  },
  id: string
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const err = { statusCode: 500 }
  const eventBody: EventBody = JSON.parse(event.body ?? '')
  const { latLng, id } = eventBody
  const { lat, lng } = latLng
  if (!process.env.PHOTO_TABLE) { console.log('no table env'); return err }

  const dbClient = new DynamoDBClient({})

  const input = {
    Key: { id: { S: id } },
    TableName: process.env.PHOTO_TABLE
  }
  const command = new GetItemCommand(input)

  const itemRes = await dbClient.send(command)
  console.log('itemResItem', itemRes.Item)
  if (!itemRes.Item) { console.log('no itemRes.Item'); return err }
  const photoLocation = itemRes.Item.location
  const res = {
    guessLocation: latLng,

  }
  

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `Hello, World! Your request was received at ${event.requestContext.time}.`,
  };
};
