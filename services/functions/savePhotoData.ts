import {
  APIGatewayProxyEventV2WithRequestContext,
  APIGatewayProxyHandlerV2,
} from "aws-lambda"
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb"
import { IAMAuthorizer } from "lib/types"

interface EventBody {
  id: string
  trailName?: string
  latLng: {
    lat: number
    lng: number
  }
}

export const handler = async (
  event: APIGatewayProxyEventV2WithRequestContext<IAMAuthorizer>
) => {
  const err = { statusCode: 500 }
  const eventBody: EventBody = JSON.parse(event.body ?? "")
  const { id, trailName, latLng } = eventBody
  const identityId =
    event.requestContext.authorizer.iam.cognitoIdentity.identityId

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
        time: { N: "" + Date.now() },
        userId: { S: identityId },
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
  }
}
