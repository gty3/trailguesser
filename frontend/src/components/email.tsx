import { saveEmail } from "../lib/api"
import { useRef, useState, createRef } from "react"
import Spinner from "./spinner"

const Email = () => {
  const [state, setState] = useState("")

  const emailRef = createRef<HTMLInputElement>()

  const submitEmail = async () => {
    if (!emailRef.current?.value) {
      setState("noEmail")
      return
    }
    setState("loading")
    const stringRes = await saveEmail(emailRef.current.value)
    setState(stringRes)
  }

  return (
    <>
      <div className="pt-10 md:mt-32 flex justify-center">
        <div className="flex flex-col w-96 mb-10">
          <div className="m-2">
            ⚠️ TrailGuesser is brand new! Get informed about new gameplay:
          </div>
          <div className="flex">
            <input
              ref={emailRef}
              className="p-2 m-2 outline outline-1 rounded outline-black"
              placeholder="Email address"
              type="text"
            ></input>
            <div
              onClick={submitEmail}
              className="bg-blue-600 m-2 ml-4 rounded p-2 text-white"
            >
              Submit
            </div>


          </div>
          <div className="flex justify-center m-1">
            { state === "success" ? "saved" : state === "loading" ? <Spinner className="m-2" /> : ''}
            </div>
        </div>
      </div>
    </>
  )
}

export default Email
