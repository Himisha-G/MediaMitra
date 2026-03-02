import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "ap-southeast-2_xiAAfJCfO",
      userPoolClientId: "r2k35irak8b33c7aqi4b2djla",
      loginWith: {
        email: true
      }
    }
  }
});