import { Amplify } from '@aws-amplify/core'

try {
  const auth = {
    region: import.meta.env.VITE_REGION,
    userPoolId: import.meta.env.VITE_USER_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_APP_CLIENT_ID,
    identityPoolId: import.meta.env.VITE_IDENTITY
  }

  Amplify.configure({
    Auth: auth,
    API: {
      endpoints: [{ 
        name: import.meta.env.VITE_APIGATEWAY_NAME, 
        endpoint: import.meta.env.VITE_API_URL,
      }]
    },
    Storage: {
      AWSS3: {
        bucket: import.meta.env.VITE_BUCKET_NAME,
        region: import.meta.env.VITE_REGION
      }
    }
    // ssr: true
  })

} catch (err) {
  console.log('amplifyConfigErr', err)
}
