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
  id: string
  level: string
}

export const handler = async (
  event: APIGatewayProxyEventV2WithRequestContext<IAMAuthorizer>
) => {
  const err = { statusCode: 500 }
  const eventBody: EventBody = JSON.parse(event.body ?? "")
  const { id, level } = eventBody

  const identityId =
    event.requestContext.authorizer.iam.cognitoIdentity.identityId

  if (!process.env.PHOTO_TABLE) {
    console.log("no table env")
    return err
  }

  const dbClient = new DynamoDBClient({})

  // const input = {
  //   Key: { id: { S: id } },
  //   TableName: process.env.PHOTO_TABLE,
  // }
  // const getCommand = new GetItemCommand(input)
  // const itemRes = await dbClient.send(getCommand)
  // if (!itemRes.Item) {
  //   console.log("no itemRes.Item")
  //   return err
  // }

  const timeNow = Date.now()
  try {
    const putCommand = new UpdateItemCommand({
      ExpressionAttributeNames: {
        "#PH": id,
        "#LS": "levels",
        "#LE": level,
      },
      Key: {
        id: {
          S: identityId,
        },
      },
      ExpressionAttributeValues: marshall({
        ":di": { start: timeNow },
      }),
      UpdateExpression: "SET #LS.#LE.#PH = :di",
      TableName: process.env.USER_GAMES,
    })
    await dbClient.send(putCommand)
  } catch (err) {
    console.log('newGame level doesnt exist OR ERROR,', err)
    const updateCommand = new UpdateItemCommand({
      ExpressionAttributeNames: {
        "#LS": "levels",
        "#LE": level,
      },
      Key: {
        id: {
          S: identityId,
        },
      },
      ExpressionAttributeValues: marshall({
        ":ld": { [id]: { start: timeNow } },
      }),
      UpdateExpression: "SET #LS.#LE = :ld",
      TableName: process.env.USER_GAMES,
    })
    await dbClient.send(updateCommand)
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify("success"),
  }
}
