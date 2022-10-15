import { API, Auth } from "aws-amplify"
import { useEffect, useState } from "react"

interface User {
  id: string
  levels: Record<string, Level>
}

interface Level {
  [id: string]: {
    distance: number
    end?: number
    start?: number
  }
}

interface DayMap {
  [day: string]: User[]
}

const AdminDaily = () => {
  const [dailyData, setDailyData] = useState<Record<string, User[]>>()

  useEffect(() => {
    ;(async () => {
      try {
        console.log(await Auth.currentCredentials())
        const userLevels = await API.get(
          import.meta.env.VITE_APIGATEWAY_NAME,
          "/adminGetUserGames",
          {}
        )
        console.log("userLevels:", userLevels)
        const dayMap = usersIntoDays(userLevels)
        const days = Object.entries(dayMap).sort((a, b) => {
          const timeDiff = new Date(b[0]).getTime() - new Date(a[0]).getTime()
          return timeDiff
        })
        setDailyData(Object.fromEntries(days))
      } catch (err) {
        console.log(err)
      }
    })()
  }, [])

  const dayToString = (jsTime: number) => {
    const date = new Date(jsTime)
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return year + "-" + month + "-" + day
  }

  const usersIntoDays = (users: User[]) => {
    return users.reduce((acc, cur) => {
      if (!Object.keys(cur.levels)) {
        return acc
      }
      const firstlvlObj = Object.values(cur.levels)[0]
      if (!firstlvlObj) {
        return acc
      }
      const firstImgObj = Object.values(firstlvlObj)[0]
      if (!firstImgObj.start) {
        return acc
      }
      const firstImgObjDate = dayToString(firstImgObj.start)
      if (acc[firstImgObjDate]) {
        acc[firstImgObjDate].push(cur)
      } else {
        acc[firstImgObjDate] = [cur]
      }
      return acc
    }, {} as Record<string, User[]>)
  }

  if (!dailyData) {
    return <div>Not authorized</div>
  } else {
    return (
      <div>
        {Object.entries(dailyData).map(([key, value]) => {
          return (
            <div className="ml-4">
              <div className="text-2xl mt-10">{key}</div>
              <div>
                {value.map((user) => (
                  <div className="mt-4">
                    {user.id.substring(10, 15)} -{" "}
                    {Object.entries(user.levels).map(
                      ([levelKey, photoObjArr]) => (
                        <div>
                          <div>
                            <div className="flex flex-row">{levelKey + ": "}{Object.values(photoObjArr).map((photoLevel) => (
                              <div className="ml-1">{"d: " + Math.round(photoLevel.distance) + ", "}</div>
                            )
                            )}</div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}

export default AdminDaily
