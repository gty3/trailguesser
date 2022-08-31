import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb"
import { APIGatewayProxyEventV2WithRequestContext } from "aws-lambda"
import { IAMAuthorizer } from "../lib/types"
import { unmarshall } from "@aws-sdk/util-dynamodb"

interface ReturnBody {
  id: string
  levels: []
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
  const getCommand = new GetItemCommand(getInput)
  try {
    const itemRes = await dbClient.send(getCommand)
    console.log("itemRes getUserGames get", itemRes)

    if (itemRes.Item) {
      const unmarshalledItem = unmarshall(itemRes.Item)
      const res = JSON.stringify(unmarshalledItem)
      return {
        statusCode: 200,
        body: res,
      }
    } else {
      const putInput = {
        Item: { id: { S: identityId }, levels: { L: [] } },
        TableName: process.env.USER_GAMES,
      }
      const putCommand = new PutItemCommand(putInput)
      console.log("pur res")
      await dbClient.send(putCommand)
      return {
        statusCode: 200,
        body: JSON.stringify({
          id: identityId,
          levels: []
        }),
      }
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 500,
    }
  }
}
