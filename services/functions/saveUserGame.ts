
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb"
import { APIGatewayProxyEventV2WithRequestContext } from "aws-lambda"
import { IAMAuthorizer } from "../lib/types"

interface EventBody {
  level: string
}

export const handler = async (
  event: APIGatewayProxyEventV2WithRequestContext<IAMAuthorizer>
) => {
  const identityId =
    event.requestContext.authorizer.iam.cognitoIdentity.identityId
  const dbClient = new DynamoDBClient({})
  const getInput = {
    Key: { id: { S: identityId } },
    TableName: process.env.USER_GAMES,
  }
  const getCommand = new UpdateItemCommand(getInput)
  try {
    const itemRes = await dbClient.send(getCommand)
    const res = JSON.stringify(itemRes.Item)
    return {
      statusCode: 200,
      body: res,
    }
  } catch {
    try {
      const putInput = {
        Item: { id: { S: identityId }, levels: { L: [] } },
        TableName: process.env.USER_GAMES,
      }
      const putCommand = new PutItemCommand(putInput)
      await dbClient.send(putCommand)
      return {
        statusCode: 200,
        body: null,
      }
    } catch {
      return {
        statusCode: 500,
      }
    }
  }
}
