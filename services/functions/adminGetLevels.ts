import { APIGatewayProxyHandlerV2 } from "aws-lambda"
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb"
import { unmarshall } from "@aws-sdk/util-dynamodb"

export const handler: APIGatewayProxyHandlerV2 = async () => {
  const dbClient = new DynamoDBClient({})
  try {
    const input = {
      TableName: process.env.LEVELS_TABLE,
    }
    console.log('input', input)
    const command = new ScanCommand(input)
    const itemRes = await dbClient.send(command)

    if (!itemRes.Items) {
      console.log(itemRes)
      return { statusCode: 500 }
    }

    const levels = itemRes.Items.map((level) => {
      const levelObj = unmarshall(level)

      return {
        level: levelObj.level,
        images: levelObj.ids.map((id: string) => {
          return {
            id: id,
            url: "https://" + process.env.S3_CLOUDFRONT + "/public/" + id,
          }
        }),
      }
    })
    return {
      statusCode: 200,
      body: JSON.stringify(levels),
    }
  } catch (err) {
    console.log("err", err)
    return {
      statusCode: 500,
    }
  }
}
