"use client";

import React, { useEffect } from "react";
import { Amplify } from "aws-amplify";

// We configure it here to ensure it initializes on the client side 
// before any 'use client' pages (like your login page) execute.
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "ap-southeast-2_xIAAfJCfO",
      userPoolClientId: "r2k35irak8b33c7aqi4b2djla",
      loginWith: {
        oauth: {
          domain: "ap-southeast-2xiaafjcfo.auth.ap-southeast-2.amazoncognito.com",
          // Matches the 'OpenID Connect scopes' in your AWS Console screenshot
          scopes: ["openid", "email", "phone"], 
          // Matches the 'Allowed callback/sign-out URLs' in your AWS Console screenshot
          redirectSignIn: ["http://localhost:3000/"], 
          redirectSignOut: ["http://localhost:3000/"],
          responseType: "code"
        }
      }
    }
  }
}, { ssr: true }); // Enables SSR support for Next.js compatibility

export default function AmplifyCognitoConfig({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}