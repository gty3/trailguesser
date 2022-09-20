import { Auth } from "aws-amplify"
import React, { useEffect, useRef, useState } from "react"
import Spinner from "../components/spinner"
import Upload from "../components/upload"
import CreateAccount from "../components/createAccount"
interface State {
  page: string
}

export default function UploadPage() {
  const [state, setState] = useState<State>()


  useEffect(() => {
    ;(async () => {
      try {
        const user = await Auth.currentAuthenticatedUser()
        console.log('user', user)
        setState({ page: "upload" })
      } catch (err) {
        setState({ page: "noAuth" })
        console.log(err)
      }
    })()
  }, [])

  const createAccount = () => {
    setState({page: "createAccount"})
  }

  if (!state) {
    return (
      // <div className="h-full flex flex-col">
      <div className="flex justify-center mt-60">
        <Spinner className=""/>
      </div>
      // </div>
    )
  } else if (state.page === "upload") {
    return <Upload />
  } else if (state.page === "createAccount") {
    return <CreateAccount setPageState={setState}/>
  } else {
    return (
      <div className="">
      <div className="pt-10 flex justify-center flex-col items-center">
        <div className="m-16 text-2xl">Popular photos may receive compensation in the future</div>
      <button onClick={createAccount} className="flex bg-blue-600 text-white justify-center mx-8 p-1.5 cursor-pointer rounded-md px-3 text-2xl text-thin">
          Create an account before uploading photos
      </button>
      <div className="m-12 text-2xl"> Or </div>
    <button onClick={() => setState({page: "upload"})} className="flex bg-blue-600 text-white justify-center p-1.5 cursor-pointer rounded-md px-3 text-2xl text-thin">Upload photos anyway</button></div>
      </div>
    )
  }


}
