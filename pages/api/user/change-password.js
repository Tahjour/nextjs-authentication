// import { unstable_getServerSession } from "next-auth/next";
import { getSession } from "next-auth/react";
import { comparePasswords, hashPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";

async function changePasswordHandler(req, res) {
    if (req.method === 'PATCH') {
        // const session = await unstable_getServerSession(req, res, authOptions);
        const session = await getSession({ req: req });
        console.log(session);
        if (!session) {
            res.status(401).json({ message: "Not authenticated!" });
            return;
        }

        const userEmail = session.user.email;
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const mongoClient = await connectToDatabase();
        const db = process.env.mongodbDatabase;
        const col = process.env.mongodbCollection;
        const authUsersCollection = mongoClient.db(db).collection(col);
        const userDocument = await authUsersCollection.findOne({ email: userEmail });
        if (!userDocument) {
            res.status(404).json({ message: "User not found for some reason!" });
            mongoClient.close();
            return;
        }
        const currentHashedPassword = userDocument.password;
        const passwordsMatch = await comparePasswords(oldPassword, currentHashedPassword);
        if (!passwordsMatch) {
            mongoClient.close();
            res.status(403).json({ message: "Old password was incorrect!" });
            return;
        }
        const newHashedPassword = await hashPassword(newPassword);
        const result = await authUsersCollection.updateOne({ email: userEmail }, { $set: { password: newHashedPassword } });
        console.log(result);
        mongoClient.close();
        res.status(200).json({ message: "Password updated successfully" });
    }
}
export default changePasswordHandler;