import React, { useRef, useState } from "react"
import { Auth } from "@aws-amplify/auth"
import Spinner from "./spinner"

interface CreateAccountProps {
  changePageState: (e: string) => void
}

const LogIn = ({loggedIn}: any) => {
  const [hiddenPassState, setHiddenPassState] = useState(true)
  const [isSubmitting, setSubmitting] = useState(false)
  const [errState, setErrState] = useState("")
  const emailInputRef = useRef<HTMLInputElement>(null)
  const passInputRef = useRef<HTMLInputElement>(null)

  const userLoginHandler = async (e: any) => {
    setSubmitting(true)
    e.preventDefault()
    try {
      if (emailInputRef.current && passInputRef.current) {
        const signedIn = await Auth.signIn(
          emailInputRef.current.value,
          passInputRef.current.value
        )
        console.log('signedIn', signedIn)
        setSubmitting(false)
        loggedIn()
      }
    } catch (err: any) {
      if (err.code === "UserNotFoundException") {
        setErrState("emailErr")
      }
      if (err.code === "NotAuthorizedException") {
        setErrState("passErr")
      }
      console.log(err)
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="flex justify-center ml-10 mt-28">
        <div className="w-85ch">
          <div className="my-5">
            <div>
              <input
                className="px-2 py-1 bg-blue-50"
                type="email"
                ref={emailInputRef}
                placeholder="email"
              ></input>
              {errState === "emailErr" && " ❌"}
            </div>
          </div>

          <div className="mb-5">
            <div>
              <input
                className="px-2 py-1 bg-blue-50"
                type={hiddenPassState ? "password" : "text"}
                ref={passInputRef}
                placeholder="password"
              ></input>
              <span
                className="ml-2"
                style={{ cursor: "pointer" }}
                onClick={() => setHiddenPassState(!hiddenPassState)}
              >
                <span></span>
              </span>
              {errState === "passErr" && " ❌"}
            </div>
          </div>

          <div className="flex flex-row mt-6 mb-10">
            <button
              onClick={userLoginHandler}
              disabled={isSubmitting}
              className="px-1 m-1 mr-2 outline-black outline outline-1"
            >
              Log In{" "}
            </button>
            <div className="mx-2 mt-1">{isSubmitting && <Spinner />}</div>
          </div>

        </div>
      </div>
    </>
  )
}

export default LogIn
