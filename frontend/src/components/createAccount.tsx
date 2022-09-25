import React, { useState, useRef, useEffect, createRef } from "react"
import { Auth } from "@aws-amplify/auth"
import Spinner from "../components/spinner"
import "../configureAmplify"

const createAccount = ({
  setPageState,
}: {
  setPageState: ({ page }: { page: string }) => void
}) => {
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const [state, setState] = useState({
    err: "",
    accountCreated: false,
    submitting: false,
  })

  const userAddHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!emailRef.current?.value || !passwordRef.current?.value) {
      setState({ ...state, err: "No email or password" })
      return
    }
    setState({ ...state, submitting: true })
    const email = emailRef.current.value.replace(/\s/g, "")
    console.log('email', email)
    try {
      const signup = await Auth.signUp({
        username: email,
        password: passwordRef.current.value,
      })
      const signin = await Auth.signIn(
        email,
        passwordRef.current.value
      )
      setState({ err: "", accountCreated: true, submitting: false })
    } catch (err) {
      let message, name
      if (err instanceof Error) (message = err.message), (name = err.name)
      else (message = String(err)), (name = String(err))
      if (name === "InvalidPasswordException") {
        const shortenedError = message.replace(
          "Password did not conform with policy:",
          ""
        )
        setState({ ...state, err: shortenedError, submitting: false })
      } else if (name === "InvalidParameterException") {
        setState({ ...state, err: message, submitting: false })
      } else {
        setState({ ...state, err: message, submitting: false })
      }
    }
  }

  const continueToUpload = () => {
    setPageState({ page: "upload" })
  }

  if (!state.accountCreated) {
    // put ! to switch back
    return (
      <div className="pt-32 flex items-center flex-col">
        <div className="mb-16 text-3xl">Create an account</div>
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
          {state.submitting ? (
            <Spinner />
          ) : (
            <button
              onClick={userAddHandler}
              className="flex bg-blue-600 text-white justify-center mx-8 p-1.5 cursor-pointer rounded-md px-3 text-2xl text-thin"
            >
              Submit
            </button>
          )}
        </div>
        <div className="my-2">{state.err}</div>
      </div>
    )
  } else {
    return (
      <div className="pt-32 flex items-center flex-col">
        <div className="mb-16 text-3xl mx-6 flex">Account created</div>
        <div className="mt-6 mb-5">
          <button
            onClick={continueToUpload}
            className="flex bg-blue-600 text-white justify-center mx-8 p-1.5 cursor-pointer rounded-md px-3 text-2xl text-thin"
          >
            Continue to upload
          </button>
        </div>
      </div>
    )
  }
}

export default createAccount
