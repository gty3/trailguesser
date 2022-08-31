import { APIGatewayProxyHandlerV2 } from "aws-lambda"
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb"
import { unmarshall } from "@aws-sdk/util-dynamodb"

interface EventBody {
  level: string
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const eventBody: EventBody = JSON.parse(event.body ?? "")
  const { level } = eventBody

  const dbClient = new DynamoDBClient({})
  const input = {
    Key: { level: { S: "" + level } },
    TableName: process.env.LEVELS_TABLE,
  }
  const command = new GetItemCommand(input)
  const itemRes = await dbClient.send(command)
  console.log('wtf itemRes', itemRes)
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
