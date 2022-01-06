import NextAuth from "next-auth"
// import GithubProvider from "next-auth/providers/github"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify"

const customRefreshAccessToken = async (token) => {
    try {
        spotifyApi.setAccessToken( token.accessToken );
        spotifyApi.setRefreshToken( token.refreshToken );

        const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
        console.log("REFRESHED TOKEN IS", refreshedToken);

        return {
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000, //one hour from now
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken
        }
    }
    catch(error) {
        console.error(error.message);

        return {
            ...token,
            error: 'RefreshAccessTokenError'
        }
    }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),

    SpotifyProvider({
        // Environment variables:
        clientId: spotifyApi.getCredentials().clientId,
        clientSecret: spotifyApi.getCredentials().clientSecret,
        authorization: LOGIN_URL
    })
  ],

  // How do I encrypt the JWT token I get back from Spotify?
  secret: process.env.JWT_SECRET,
  pages: {
      signIn: '/login'
  },
  callbacks: {
    async jwt({ token, account, user }) {

        // if initial sign-in
        if( account && user ) {
            return {
                ...token,
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                username: account.providerAccountId,
                accessTokenExpires: account.expires_at * 1000 // we are
                    // handling the expiration in Milliseconds
            }
        }

        // Return previous token if the access token has not expired yetr
        if(Date.now() < token.accessTokenExpires ) {
            return token;
            // in this case, the token is still valid, hence we return it
            // for following sign-in actions
        }

        // Access Token has expired, so we need to refresh it...
        console.log("ACCESS TOKEN HAS EXPIRED, REFRESHING...");
        return await customRefreshAccessToken(token);
    },

    async session({ session, token }) {
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
        session.user.userName = token.username;

        return session;
    }
  }
})