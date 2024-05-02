import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    if (req.headers["content-type"] !== "application/json") {
        return res.status(400).json({ error: "Invalid request" });
    }

    const { name, feedback } = req.body;

    if (typeof name !== "string" || typeof feedback !== "string") {
        return res.status(400).json({ error: "Invalid request" });
    }

    if (name.length < 4 || name.length > 32) {
        return res.status(400).json({ error: "Name must be between 4 and 32 characters" });
    }

    if (feedback.length < 4 || feedback.length > 1024) {
        return res.status(400).json({ error: "Feedback must be between 4 and 1024 characters" });
    }

    const mongoClient = new MongoClient(process.env.MONGODB_URI!);
    await mongoClient.connect();

    const feedbackCollection = mongoClient.db(process.env.MONGODB_DATABASE!).collection("UserFeedback");
    await feedbackCollection.insertOne({ name, feedback });

    await fetch(process.env.DISCORD_WEBHOOK!, {
        method: 'POST',
        headers: {
            "User-Agent": "VelkySMPStatusMonitor/1.6",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "content": `**New feedback from ${name}**:\n${feedback}`
        })
    })

    res.status(200).json({ success: true, message: "Feedback submitted" });
}