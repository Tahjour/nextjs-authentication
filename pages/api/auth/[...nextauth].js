import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { comparePasswords } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";

export const authOptions = {
    session: {
        strategy: "jwt"
    },
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                const mongoClient = await connectToDatabase();
                const database = process.env.mongodbDatabase;
                const collection = process.env.mongodbCollection;
                const authUsersCollection = mongoClient.db(database).collection(collection);
                const user = await authUsersCollection.findOne({ email: credentials.email });
                if (!user) {
                    mongoClient.close();
                    throw new Error("No user found");
                }
                const isValid = await comparePasswords(credentials.password, user.password);
                if (!isValid) {
                    mongoClient.close();
                    throw new Error("Invalid password");
                }
                mongoClient.close();
                return { email: user.email };
            }
        })
    ]
};
export default NextAuth(authOptions);