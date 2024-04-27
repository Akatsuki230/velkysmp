import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    if (req.headers["content-type"] !== "application/json") {
        res.status(400).json({ error: "Invalid content type" });
        return;
    }

    const { name, token: adminToken } = req.body;

    if (!name || !adminToken) {
        res.status(400).json({ error: "Missing name or token" });
        return;
    }

    if (adminToken !== process.env.ADMIN_TOKEN) {
        res.status(401).json({ error: "Invalid token" });
        return;
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const playersCollection = client.db(process.env.MONGODB_DATABASE!).collection("Playtimes");

    const user = await playersCollection.findOne({ name });
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }

    const codesCollection = client.db(process.env.MONGODB_DATABASE!).collection("OneTimeCodes");

    const code = Math.floor(100000 + Math.random() * 999999).toString();

    await codesCollection.insertOne({
        name,
        code,
        token: user.token,
        expiry: Date.now() + 1000 * 60 * 30
    });

    res.status(200).json({ code });
}
