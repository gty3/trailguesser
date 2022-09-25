import React, { useRef, useState } from "react"
import { Auth } from "@aws-amplify/auth"
import Spinner from "../components/spinner"

const LogIn = () => {
  const [submittingState, setSubmittingState] = useState("")
  const [errState, setErrState] = useState("")

  const passwordRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  const userLoginHandler = async (e: any) => {
    setSubmittingState("loading")
    e.preventDefault()

    if (!emailRef.current?.value || !passwordRef.current?.value) {
      setErrState("No email or password")
      return
    }

    try {
      await Auth.signIn(emailRef.current.value, passwordRef.current.value)
      setSubmittingState("success")
    } catch (err: any) {
      setErrState("" + err)

      setSubmittingState("failed")
    }
  }

  return (
    <div className="pt-32 flex items-center flex-col">
      <div className="mb-16 text-3xl">Login</div>
      <div className="flex flex-col">
        <div className="">
          <input
            className="px-2 py-1  text-xl bg-blue-100 rounded"
            ref={emailRef}
            placeholder="Email"
          ></input>
        </div>
      </div>
      <div className="my-10">
        <div className="container-fluid row">
          <input
            className="px-2 py-1 bg-blue-100 text-xl rounded"
            type="password"
            ref={passwordRef}
            placeholder="Password"
          ></input>
        </div>
      </div>
      <div className="mt-6 mb-5">
        {submittingState === "loading" ? (
          <Spinner />
        ) : submittingState === "success" ? (
          <div>Success</div>
        ) : (
          <button
            onClick={userLoginHandler}
            className="flex bg-blue-600 text-white justify-center mx-8 p-1.5 cursor-pointer rounded-md px-3 text-2xl text-thin"
          >
            Submit
          </button>
        )}
      </div>
      <div className="my-2">{errState}</div>
    </div>
  )
}

export default LogIn
