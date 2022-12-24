import { hashPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";

async function signUpHandler(req, res) {
    if (req.method !== 'POST') {
        return;
    }
    const data = req.body;
    const { email, password } = data;

    if (!email || !password || !email.includes('@') || password.trim().length < 7) {
        res.status(422).json({ message: "Invalid email or password" });
        return;
    }
    const mongoClient = await connectToDatabase();
    const db = mongoClient.db(process.env.mongodbDatabase);
    const collection = db.collection(process.env.mongodbCollection);

    const existingUser = await collection.findOne({ email: email });

    if (existingUser) {
        res.status(422).json({ message: "User already exists!" });
        return;
    }

    const hashedPassword = await hashPassword(password);
    const result = await collection.insertOne({
        email: email,
        password: hashedPassword,
    });
    mongoClient.close();
    res.status(201).json({ message: "User added successfully!", result: result });
}

export default signUpHandler;