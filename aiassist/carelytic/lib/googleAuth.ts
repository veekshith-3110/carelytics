import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

// Complete the auth session in the browser
WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = '862611167571-l7fevev7mq9v53n3isbohghp3emlkjng.apps.googleusercontent.com';

export interface GoogleUser {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

export async function signInWithGoogle(): Promise<GoogleUser | null> {
  try {
    const redirectUri = AuthSession.makeRedirectUri({
      useProxy: true,
      scheme: 'carelytic',
    });

    const request = new AuthSession.AuthRequest({
      clientId: GOOGLE_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.Token,
      redirectUri,
      usePKCE: false,
    });

    const discovery = {
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
      revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
    };

    const result = await request.promptAsync(discovery);

    if (result.type === 'success' && result.params.access_token) {
      // Get user info from Google
      const userInfoResponse = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${result.params.access_token}`
      );
      
      if (userInfoResponse.ok) {
        const userInfo = await userInfoResponse.json();

        return {
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          sub: userInfo.id,
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Google sign-in error:', error);
    return null;
  }
}

