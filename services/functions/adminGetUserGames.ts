import {
  APIGatewayProxyEventV2WithRequestContext,
  APIGatewayProxyHandlerV2,
} from "aws-lambda"
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb"
import { unmarshall } from "@aws-sdk/util-dynamodb"
import { IAMAuthorizer } from "lib/types"

interface UserGames {
  id: string
  levels: Record<string, Level>
}

interface Level {
  distance: number
  end?: number
  start?: number
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
      ? process.env.PROD_IDENTITY
      : process.env.DEV_IDENTITY

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

    const userData = itemRes.Items.map((user) => {
      return unmarshall(user)
    })


    // const res = itemRes.Items.reduce((acc, cur) => {
    //   const unmarshalled = unmarshall(cur)

    //   if (Object.keys(unmarshalled.levels).length === 0) {
    //     acc.push({
    //       userId: unmarshalled.id,
    //       photoIdsCompleted: 0,
    //     })
    //   } else {
    //     Object.values(unmarshalled.levels).forEach((photoIds) => {

    //       i++
    //     })
    //     acc.push({
    //       userId: unmarshalled.id,
    //       photoIdsCompleted: i,
    //       // time:
    //     })
    //   }
    //   return acc
    // }, [] as {}[])

    return {
      statusCode: 200,
      body: JSON.stringify(userData),
    }
  } else {
    return {
      statusCode: 403,
    }
  }
}
