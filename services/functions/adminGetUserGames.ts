import { APIGatewayProxyHandlerV2 } from "aws-lambda"
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb"
import { unmarshall } from "@aws-sdk/util-dynamodb"

interface UserGames {
  id: string
  levels: any
}

interface Level {
  [id: string]: {
    distance: number
  }
}
type Levels = { [id: string]: Level } | {}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  // console.log('adminGetUesrgaemes hit')
  const err = { statusCode: 500 }
  const dbClient = new DynamoDBClient({})
  const input = {
    TableName: process.env.USER_GAMES,
  }
  const command = new ScanCommand(input)
  const itemRes = await dbClient.send(command)
  if (!itemRes.Items) {
    return err
  }
  let i = 0
  const res = itemRes.Items.reduce((acc, cur) => {
    const unmarshalled = unmarshall(cur)
    // console.log(Object.values(unmarshalled.levels),'unmarshed')
    if (Object.keys(unmarshalled.levels).length === 0) {
      acc.push({
        userId: unmarshalled.id,
        photoIdsCompleted: 0,
      })
    } else {
      Object.values(unmarshalled.levels).forEach((photoIds) => {
        // console.log(photoIds, 'photoId')
        i++
      })
      console.log("LAST I", i)

      acc.push({
        userId: unmarshalled.id,
        photoIdsCompleted: i,
      })
    }
    return acc
  }, [] as {}[])

  console.log(res, "@res")

  return {
    statusCode: 200,
    body: JSON.stringify(res),
  }
}
