import { APIGatewayProxyEventV2WithRequestContext, APIGatewayProxyHandlerV2 } from "aws-lambda"
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb"
import { unmarshall } from "@aws-sdk/util-dynamodb"
import { IAMAuthorizer } from "lib/types"

interface EventBody {
  level: string
}

export const handler = async (event: APIGatewayProxyEventV2WithRequestContext<IAMAuthorizer>) => {
  const eventBody: EventBody = JSON.parse(event.body ?? "")
  const { level } = eventBody

  const identityId =
  event.requestContext.authorizer.iam.cognitoIdentity.identityId

  const dbClient = new DynamoDBClient({})
  const input = {
    Key: { level: { S: "" + level } },
    TableName: process.env.LEVELS_TABLE,
  }
  const command = new GetItemCommand(input)
  const itemRes = await dbClient.send(command)

  if (!itemRes.Item) {
    return { statusCode: 500 }
  }

  const idArray = unmarshall(itemRes.Item)
  
  const imageArray = idArray.ids.map((id: string) => {
    return {
      id: id,
      url: "https://" + process.env.S3_CLOUDFRONT + "/public/" + id,
    }
  })

  const levelData = {
    level: level,
    images: imageArray,
  }

  return {
    statusCode: 200,
    body: JSON.stringify(levelData),
  }
}
