import Credentials from "next-auth/providers/credentials";
import axios from "axios";
import baseUrl from "../utils/baseUrl";


export const user = [];

async function fetchUserByEmail(data) {
  try {
    const response = await axios.post(
        `${baseUrl}/api/auth/login`,
        data,
        {
          headers: {
            'Referer': baseUrl,
            'Origin': baseUrl,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
    );
    console.log(response);
    return response.data.user;
  } catch (error) {
    console.log(error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || error.message);
  }
}



export const authOptions = {
  providers: [
    // GoogleProvider({
    //   clientId: process.env.AUTH_GOOGLE_ID,
    //   clientSecret: process.env.AUTH_GOOGLE_SECRET,
    // }),
    // GithubProvider({
    //   clientId: process.env.AUTH_GITHUB_ID,
    //   clientSecret: process.env.AUTH_GITHUB_SECRET,
    // }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const foundUser = await fetchUserByEmail(credentials);
        if (!foundUser) {
          throw new Error("Email or Password is incorrect");
        }

        return {
          id: foundUser.id,
          user_id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
          profile_image:foundUser.profile_image,
          image: foundUser.profile_image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        // Debugging log
        token.role = user.role;
        token.profile_image = user.profile_image;
        console.log("Account object:", account);

      }
      return token;
    },
    async session({ session, token }) {
      // Pass accessToken to the client
      session.user.role = token.role || session.user.role;
      session.user.image = token.profile_image || session.user.image;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV !== "production",
};
