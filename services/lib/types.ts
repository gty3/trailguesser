
export interface IAMAuthorizer {
  authorizer: {
    jwt?: {
      claims: {
        claim1: string,
        claim2: string
      },
      scopes: [
        string,
        string
      ]
    },
    iam: {
      cognitoIdentity: {
        identityId: string,
        amr: string[]
      }
    }
  }
}