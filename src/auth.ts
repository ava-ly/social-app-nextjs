import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from './db';

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Missing github oauth credentials');
}

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(db),
    providers: [
        GitHub({
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET
        })
    ],
    callbacks: {
        // Usually not needed, here we are fixing a bug in nextauth
        async session({ session, user }: any) {
            if (session && user) {
                session.user.id = user.id;
            }
        
            return session;
        },
    },
})