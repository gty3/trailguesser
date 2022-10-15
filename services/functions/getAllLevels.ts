import { APIGatewayProxyHandlerV2 } from "aws-lambda"
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb"
import { unmarshall } from "@aws-sdk/util-dynamodb"

interface EventBody {
  screenSize: number
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const eventBody: EventBody = JSON.parse(event.body ?? "")
  const { screenSize } = eventBody
  const isMobile = screenSize < 768
  console.log("screenSize", screenSize)
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
    if (!unmarshalled.active) return acc

    const imageArray = unmarshalled.ids.map((id: string) => {
      const blurryImage = {
        bucket: process.env.BUCKET_NAME,
        key: "public/" + id,
        edits: {
          resize: {
            width: 40,
            // "height": 160,
            fit: "cover",
          },
        },
      }
      const blurry = Buffer.from(JSON.stringify(blurryImage)).toString("base64")
      const blurryUrl = process.env.SERVERLESS_IMAGE_HANDLER + blurry
      const imageBody = isMobile
        ? {
            bucket: process.env.BUCKET_NAME,
            key: "public/" + id,
            edits: {
              resize: {
                // width: 1920,
                "height": 768,
                fit: "inside",
              },
            },
          }
        : {
            bucket: process.env.BUCKET_NAME,
            key: "public/" + id,
            edits: {
              resize: {
                width: 1920,
                // "height": 160,
                fit: "cover",
              },
            },
          }
      const converting = Buffer.from(JSON.stringify(imageBody)).toString(
        "base64"
      )
      const convertedUrl = process.env.SERVERLESS_IMAGE_HANDLER + converting
      const thumbnailBody = {
        bucket: process.env.BUCKET_NAME,
        key: "public/" + id,
        edits: {
          resize: {
            // width: 1920,
            "height": 200,
            fit: "cover",
          },
        },
      }
      const thumbnailConverting = Buffer.from(JSON.stringify(thumbnailBody)).toString(
        "base64"
      )
      const thumbnailUrl = process.env.SERVERLESS_IMAGE_HANDLER + thumbnailConverting
      return {
        id: id,
        url: convertedUrl,
        blurryUrl: blurryUrl,
        thumbnailUrl: thumbnailUrl
      }
    })

    return {
      ...acc,
      [unmarshalled.level]: imageArray,
    }
  }, {})

  return {
    statusCode: 200,
    body: JSON.stringify(res),
  }
}
