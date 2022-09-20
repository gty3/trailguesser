import { APIGatewayProxyEventV2WithRequestContext } from "aws-lambda"
import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"
import { IAMAuthorizer } from "../lib/types"

interface EventBody {
  latLng: {
    lat: number
    lng: number
  }
  id: string
  level: string
}

export const handler = async (
  event: APIGatewayProxyEventV2WithRequestContext<IAMAuthorizer>
) => {
  const err = { statusCode: 500 }
  const eventBody: EventBody = JSON.parse(event.body ?? "")
  const { latLng, id, level } = eventBody
  const { lat, lng } = latLng

  const identityId =
    event.requestContext.authorizer.iam.cognitoIdentity.identityId

  if (!process.env.PHOTO_TABLE) {
    console.log("no table env")
    return err
  }

  const dbClient = new DynamoDBClient({})

  const input = {
    Key: { id: { S: id } },
    TableName: process.env.PHOTO_TABLE,
  }
  const getCommand = new GetItemCommand(input)
  const itemRes = await dbClient.send(getCommand)
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
      Math.sin(photoLatRadian) * Math.sin(guessLatRadian) +
        Math.cos(photoLatRadian) *
          Math.cos(guessLatRadian) *
          Math.cos(guessLngRadian - photoLngRadian)
    )

  let x =
    (Math.cos(photoLatRadian) * Math.cos(photoLngRadian) +
      Math.cos(guessLatRadian) * Math.cos(guessLngRadian)) /
    2

  let y =
    (Math.cos(photoLatRadian) * Math.sin(photoLngRadian) +
      Math.cos(guessLatRadian) * Math.sin(guessLngRadian)) /
    2
  let z = (Math.sin(photoLatRadian) + Math.sin(guessLatRadian)) / 2
  let centralLongitude = Math.atan2(y, x)
  let centralSquareRoot = Math.sqrt(x * x + y * y)
  let centralLatitude = Math.atan2(z, centralSquareRoot)
  const centerLatLng = {
    lat: (centralLatitude * 180) / Math.PI,
    lng: (centralLongitude * 180) / Math.PI,
  }

  const points =
    5000 - Math.floor(distance) > 0 ? 5000 - Math.floor(distance) : 0
  // const score = Math.floor((50000 / Math.ceil(distance)) * 10)

  const zoom =
    distance < 20
      ? 9
      : distance < 80
      ? 8
      : distance < 400
      ? 6
      : distance < 750
      ? 5
      : distance < 1500
      ? 4
      : distance < 3000
      ? 3
      : distance < 6000
      ? 2
      : 1

  const timeNow = Date.now()
  try {
    const updateLevel = new UpdateItemCommand({
      ExpressionAttributeNames: {
        "#PH": id,
        "#LS": "levels",
        "#LE": level,
        "#DI": "distance",
        "#EN": "end",
      },
      Key: {
        id: {
          S: identityId,
        },
      },
      ExpressionAttributeValues: marshall({
        ":di": distance,
        ":ti": timeNow,
      }),
      UpdateExpression: "SET #LS.#LE.#PH.#DI = :di, #LS.#LE.#PH.#EN = :ti",
      TableName: process.env.USER_GAMES,
    })
    const putRes = await dbClient.send(updateLevel)
  } catch (err) {
    /* now that I added newGame api, this should never occur but ill leave it, this will overwrite start time tho */
    console.log("/guessLocation Error", err)
  //   const updateCommand = new UpdateItemCommand({
  //     ExpressionAttributeNames: {
  //       "#LS": "levels",
  //       "#LE": level,
  //     },
  //     Key: {
  //       id: {
  //         S: identityId,
  //       },
  //     },
  //     ExpressionAttributeValues: marshall({
  //       ":ld": { [id]: { distance: distance, end: timeNow } },
  //     }),
  //     UpdateExpression: "SET #LS.#LE = :ld",
  //     TableName: process.env.USER_GAMES,
  //   })
  //   const updateRes = await dbClient.send(updateCommand)
  //   console.log("updateREs", updateRes)
  }

  const res = {
    guessLocation: latLng,
    actualLocation: trailObj.latLng,
    distance: distance,
    points: points,
    center: centerLatLng,
    zoom: zoom,
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(res),
  }
}
