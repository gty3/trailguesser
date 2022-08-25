import { APIGatewayProxyHandlerV2 } from "aws-lambda"
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb"
import { unmarshall } from "@aws-sdk/util-dynamodb"

interface photoData {
  id: string
  trailName: string
  location?: string
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const err = { statusCode: 500 }
  const dbClient = new DynamoDBClient({})
  const input = {
    TableName: process.env.PHOTO_TABLE
  }
  const command = new ScanCommand(input)
  const itemRes = await dbClient.send(command)
  if (!itemRes.Items) { return err }
  
  const res = itemRes.Items.reduce((acc, cur) => {
    const unmarshalled = unmarshall(cur)
    const imgUrl = 'https://' + process.env.S3_CLOUDFRONT + '/public/' + unmarshalled.id
    acc.push({id: unmarshalled.id, imgUrl: imgUrl})
    return acc
  }, [] as {}[])

  return {
    statusCode: 200,
    body: JSON.stringify(res),
  }
}
