import {
  APIGatewayProxyEventV2WithRequestContext,
  APIGatewayProxyHandlerV2,
} from "aws-lambda"
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb"
import { unmarshall } from "@aws-sdk/util-dynamodb"
import { IAMAuthorizer } from "lib/types"

interface photoData {
  id: string
  trailName: string
  location?: string
}
interface ImageData {
  id: string
  imgUrl: string
  time: number
}



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
      ? "33b41206-f92b-4554-8cdf-af49afe41450"
      : "c0acce29-dc9c-4382-b268-d747c7edb22a"

  if (identityId === adminId) {
    const err = { statusCode: 500 }
    const dbClient = new DynamoDBClient({})
    const input = {
      TableName: process.env.PHOTO_TABLE,
    }
    const command = new ScanCommand(input)
    const itemRes = await dbClient.send(command)
    if (!itemRes.Items) {
      return err
    }

    const res = itemRes.Items.reduce((acc, cur) => {
      const unmarshalled = unmarshall(cur)
      const imgUrl =
        "https://" + process.env.S3_CLOUDFRONT + "/public/" + unmarshalled.id
      // i need to sort by time

      acc.push({ id: unmarshalled.id, imgUrl: imgUrl, time: unmarshalled.time ? unmarshalled.time : 1663464240000 })
      return acc
    }, [] as ImageData[])

    res.sort((a, b) => {
      return b.time - a.time
    })
    // console.log('res', res)

    return {
      statusCode: 200,
      body: JSON.stringify(res),
    }
  } else {
    return {
      statusCode: 403,
    }
  }
}
