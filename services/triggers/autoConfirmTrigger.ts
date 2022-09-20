
export const handler = (event, context, callback) => {
   event.response.autoConfirmUser = true

   if (event.request.userAttributes.hasOwnProperty("email")) {
      event.response.autoVerifyEmail = true;
  }
  callback(null, event)

}