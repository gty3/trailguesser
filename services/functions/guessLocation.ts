import { APIGatewayProxyHandlerV2 } from "aws-lambda"
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb"
import { unmarshall } from "@aws-sdk/util-dynamodb"
import { CostExplorer } from "aws-sdk"

interface EventBody {
  latLng: {
    lat: number
    lng: number
  }
  id: string
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const err = { statusCode: 500 }
  const eventBody: EventBody = JSON.parse(event.body ?? "")
  const { latLng, id } = eventBody
  const { lat, lng } = latLng

  if (!process.env.PHOTO_TABLE) {
    console.log("no table env")
    return err
  }

  const dbClient = new DynamoDBClient({})

  const input = {
    Key: { id: { S: id } },
    TableName: process.env.PHOTO_TABLE,
  }
  const command = new GetItemCommand(input)

  const itemRes = await dbClient.send(command)
  if (!itemRes.Item) {
    console.log("no itemRes.Item")
    return err
  }
  const trailObj = unmarshall(itemRes.Item)
  const photoLatRadian = trailObj.latLng.lat / (180 / Math.PI)
  const photoLngRadian = trailObj.latLng.lng / (180 / Math.PI)
  const guessLatRadian = lat / (180 / Math.PI)
  const guessLngRadian = lng / (180 / Math.PI)
  const distance =
    3963 *
    Math.acos(
      (Math.sin(photoLatRadian) * Math.sin(guessLatRadian)) +
        Math.cos(photoLatRadian) * Math.cos(guessLatRadian) * Math.cos(guessLngRadian - photoLngRadian)
    )
  const points = distance < 10 ? 5000 :
  distance < 50 ? 4750 :
  distance < 100 ? 4250 :
  distance < 150 ? 3750 :
  distance < 200 ? 3250 :
  distance < 400 ? 2000 :
  distance < 800 ? 750 :
  distance < 2000 ? 400 :
  distance < 3000 ? 200 :
  0


  const res = {
    guessLocation: latLng,
    actualLocation: trailObj.latLng,
    distance: distance,
    points: points,
    center: null
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(res),
  }
}
