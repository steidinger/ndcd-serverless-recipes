// const apiId = ''
// export const apiEndpoint = `https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev`
export const apiEndpoint = 'http://localhost:3000/api';

export const authConfig = {
    domain: 'dev-383jvs9k.eu.auth0.com',            // Auth0 domain
    clientId: 'rEeCcWeMVupbByFsaApHQhzMvVYkoq5y',   // Auth0 client id
    callbackUrl: 'http://localhost:3000/',
    // API identifier for auth0's access token
    audience: 'https://serverless-recipes-api.execute-api.eu-central-1.amazonaws.com',
  }
  