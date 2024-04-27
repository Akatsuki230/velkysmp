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

    const { oneTimeCode } = req.body;

    if (!oneTimeCode) {
        res.status(400).json({ error: "Missing oneTimeCode field" });
        return;
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const codesCollection = client.db(process.env.MONGODB_DATABASE!).collection("OneTimeCodes");

    // first delete expired codes

    const expiredCodes = await codesCollection.deleteMany({
        expires: { $lt: Date.now() }
    })

    const code = await codesCollection.findOne({ code: oneTimeCode });

    if (!code) {
        res.status(404).json({ error: "Not found" });
        return;
    }

    await codesCollection.deleteOne({ code: oneTimeCode });

    res.status(200).json({ name: code.name, token: code.token });
}