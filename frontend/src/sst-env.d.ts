/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REGION: string
  readonly VITE_API_URL: string
  readonly VITE_USER_POOL_ID: string
  readonly VITE_APP_CLIENT_ID: string
  readonly VITE_IDENTITY: string
  readonly VITE_APIGATEWAY_NAME: string
  readonly VITE_BUCKET_NAME: string
  readonly VITE_S3_CLOUDFRONT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}