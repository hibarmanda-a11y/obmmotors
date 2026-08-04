// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import AppleProvider from 'next-auth/providers/apple';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { connectDB, clientPromise } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

// Temporary social login credentials (replace with actual in production)
const socialCredentials = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || 'fake-google-client-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'fake-google-secret',
  },
  facebook: {
    clientId: process.env.FACEBOOK_CLIENT_ID || 'fake-facebook-client-id',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET || 'fake-facebook-secret',
  },
  apple: {
    clientId: process.env.APPLE_CLIENT_ID || 'fake-apple-client-id',
    clientSecret: process.env.APPLE_CLIENT_SECRET || 'fake-apple-secret',
  },
};

// Create authOptions object
export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    // Credentials provider for email/password login
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide email and password');
        }

        const db = await connectDB();
        const user = await db.collection('users').findOne({ email: credentials.email });

        if (!user) {
          throw new Error('No user found with this email');
        }

        // Check if user signed up with social provider
        if (user.socialProvider !== 'credentials' && !user.password) {
          throw new Error(`Please sign in with ${user.socialProvider}`);
        }

        // Verify password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        };
      },
    }),
    // Social providers with fake credentials for testing
    GoogleProvider({
      clientId: socialCredentials.google.clientId,
      clientSecret: socialCredentials.google.clientSecret,
    }),
    FacebookProvider({
      clientId: socialCredentials.facebook.clientId,
      clientSecret: socialCredentials.facebook.clientSecret,
    }),
    AppleProvider({
      clientId: socialCredentials.apple.clientId,
      clientSecret: socialCredentials.apple.clientSecret,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // For social login - create or update user
      if (account?.provider !== 'credentials') {
        const db = await connectDB();
        let existingUser = await db.collection('users').findOne({ email: user.email });

        if (!existingUser) {
          // Create new user with social provider
          const newUser = {
            name: user.name || profile?.name || 'User',
            email: user.email,
            image: user.image || profile?.picture || '',
            socialProvider: account.provider,
            socialId: account.providerAccountId,
            emailVerified: new Date(),
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date()
          };
          const result = await db.collection('users').insertOne(newUser);
          user.id = result.insertedId.toString();
          user.role = 'user';
        } else {
          // Update existing user's social info if needed
          if (!existingUser.socialId) {
            await db.collection('users').updateOne(
              { _id: existingUser._id },
              {
                $set: {
                  socialProvider: account.provider,
                  socialId: account.providerAccountId,
                  updatedAt: new Date()
                }
              }
            );
          }
          user.id = existingUser._id.toString();
          user.role = existingUser.role || 'user';
        }
      }
      return true;
    },
  },
  pages: {
    signIn: '/login',
    signUp: '/signup',
    error: '/login',
    verifyRequest: '/login',
    newUser: '/profile',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Create handler using authOptions
const handler = NextAuth(authOptions);

// Export both the handler and authOptions
export { handler as GET, handler as POST, authOptions };