import {
  APIGatewayProxyEventV2WithRequestContext,
  APIGatewayProxyHandlerV2,
} from "aws-lambda"
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb"
import { unmarshall } from "@aws-sdk/util-dynamodb"
import { IAMAuthorizer } from "lib/types"

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

export const handler = async (
  event: APIGatewayProxyEventV2WithRequestContext<IAMAuthorizer>
) => {

  const identityId =
    event.requestContext.authorizer.iam.cognitoIdentity.amr[0] ===
    "authenticated"
      ? event.requestContext.authorizer.iam.cognitoIdentity.amr[2].split(":")[2]
      : null

  const adminId =
    process.env.STAGE === "prod"
      ? "33b41206-f92b-4554-8cdf-af49afe41450"
      : "c0acce29-dc9c-4382-b268-d747c7edb22a"

  if (identityId === adminId) {
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
  } else {
    return {
      statusCode: 403
    }
  }
}
