import { OAuth2Client } from 'google-auth-library';

let client: OAuth2Client | undefined;

function getClient() {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID is not defined in the environment variables.');
  }

  if (!client) {
    client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  return client;
}

class GoogleAuthService {
  static async verifyIdToken(idToken: string) {
    try {
      const ticket = await getClient().verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (!payload || !payload.email || !payload.sub) {
        throw new Error('Invalid Google token payload');
      }

      return {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name || payload.email.split('@')[0],
      };
    } catch (error: any) {
      console.error(error);
      throw new Error('Invalid or expired Google token');
    }
  }
}

export default GoogleAuthService;
