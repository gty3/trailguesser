import { LevelObj } from "../lib/types"

const AdminLevels = ({ levelsState }: { levelsState: LevelObj[] }) => {
  console.log("eve", Array.isArray(levelsState))
  return (
    <div>
      {levelsState.map((level) => (
        <div className="mt-10">
          {level.level}
          <div className="flex flex-row">
            {level.images.map((image) => (
              <div className="">
                <img className="h-40 object-scale-down" src={image.url}></img>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AdminLevels
