import { APIGatewayProxyHandlerV2 } from "aws-lambda"
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb"
import { unmarshall } from "@aws-sdk/util-dynamodb"

interface EventBody {
  level: string
}

export const handler: APIGatewayProxyHandlerV2 = async () => {
  const dbClient = new DynamoDBClient({})
  const input = {
    TableName: process.env.LEVELS_TABLE,
  }
  const command = new ScanCommand(input)
  const itemRes = await dbClient.send(command)

  if (!itemRes.Items) {
    return { statusCode: 500 }
  }
  const res = itemRes.Items.reduce((acc, cur) => {
    const unmarshalled = unmarshall(cur)
    return {
      ...acc,
      [unmarshalled.level]: unmarshalled.ids.map((id: string) => {
        return {
          id: id,
          url: "https://" + process.env.S3_CLOUDFRONT + "/public/" + id,
        }
      }),
    }
  }, {})

  return {
    statusCode: 200,
    body: JSON.stringify(res),
  }
}
