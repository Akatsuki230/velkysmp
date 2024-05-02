import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";
import { getCodes } from "@/components/Countries";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    if (req.headers["content-type"] !== "application/json") {
        res.status(400).json({ error: "Invalid content type" });
        return;
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const playersCollection = client.db(process.env.MONGODB_DATABASE!).collection("Playtimes");

    let { newNameColor, newDisplayName, newPrideFlags, newCountryCode, newHideStar, newShowLastJoinDate, token } = req.body;

    if (newNameColor === undefined) {
        res.status(400).json({ error: "Missing newNameColor field" });
        return;
    }

    if (newDisplayName === undefined) {
        res.status(400).json({ error: "Missing newDisplayName field" });
        return;
    }

    if (newPrideFlags === undefined) {
        res.status(400).json({ error: "Missing newPrideFlags field" });
        return;
    }

    if (newCountryCode === undefined) {
        res.status(400).json({ error: "Missing newCountryCode field" });
        return;
    }

    if (newHideStar === undefined) {
        res.status(400).json({ error: "Missing newHideStar field" });
        return;
    }

    if (newShowLastJoinDate === undefined) {
        res.status(400).json({ error: "Missing newShowLastJoinDate field" });
        return;
    }

    if (token === undefined) {
        res.status(400).json({ error: "Missing token field" });
        return;
    }

    // if countryCode is none, set it to undefined
    if (newCountryCode.toUpperCase() === "NONE") {
        newCountryCode = undefined;
    }

    // if newCountryCode is set, verify it exists
    if (newCountryCode !== undefined) {
        if (!getCodes().includes(newCountryCode)) {
            res.status(400).json({ error: "Invalid country code" });
            return;
        }
    }

    const result = await playersCollection.updateOne({ token }, {
        $set: {
            "profileStyle.displayName": newDisplayName,
            "profileStyle.nameColour": newNameColor,
            "profileStyle.prideFlags": newPrideFlags || [],
            "profileStyle.countryCode": newCountryCode,
            "profileStyle.hideStar": newHideStar,
            "profileStyle.showLastJoinedDate": newShowLastJoinDate
        }
    });

    await client.close();

    res.status(200).json({
        success: result.modifiedCount === 1
    });
}
