import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "ap-southeast-2_xIAAfJCfO",
      userPoolClientId: "r2k35irak8b33c7aqi4b2djla",
      loginWith: {
        oauth: {
          domain: "mediamitra-auth.auth.ap-southeast-2.amazoncognito.com",
          scopes: ["openid", "email", "phone"], // Changed 'profile' to 'phone' to match Console
          redirectSignIn: ["http://localhost:3000/"], // Added trailing slash
          redirectSignOut: ["http://localhost:3000/"], // Added trailing slash
          responseType: "code"
        }
      }
    }
  }
}, { ssr: true }); // Adding SSR support is recommended for Next.js