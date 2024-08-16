import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";
import { getCodes } from "@/components/Countries";
import { closest, RGBColor } from "color-diff";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        console.log("Method not allowed");
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    if (req.headers["content-type"] !== "application/json") {
        console.log("Invalid content type");
        res.status(400).json({ error: "Invalid content type" });
        return;
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const playersCollection = client.db(process.env.MONGODB_DATABASE!).collection("Playtimes");

    let { newNameColor, newDisplayName, newPrideFlags, newCountryCode, newHideStar, newShowLastJoinDate, token } = req.body;

    if (newNameColor === undefined) {
        console.log("Missing newNameColor field");
        res.status(400).json({ error: "Missing newNameColor field" });
        return;
    }

    if (newDisplayName === undefined) {
        console.log("Missing newDisplayName field");
        res.status(400).json({ error: "Missing newDisplayName field" });
        return;
    }

    if (newPrideFlags === undefined) {
        console.log("Missing newPrideFlags field");
        res.status(400).json({ error: "Missing newPrideFlags field" });
        return;
    }

    if (newCountryCode === undefined) {
        console.log("Missing newCountryCode field");
        res.status(400).json({ error: "Missing newCountryCode field" });
        return;
    }

    if (newHideStar === undefined) {
        console.log("Missing newHideStar field");
        res.status(400).json({ error: "Missing newHideStar field" });
        return;
    }

    if (newShowLastJoinDate === undefined) {
        console.log("Missing newShowLastJoinDate field");
        res.status(400).json({ error: "Missing newShowLastJoinDate field" });
        return;
    }

    if (token === undefined) {
        console.log("Missing token field");
        res.status(400).json({ error: "Missing token field" });
        return;
    }

    // if countryCode is none, set it to undefined
    if (newCountryCode.toUpperCase() === "NONE") {
        console.log("Country code set to none, setting to undefined");
        newCountryCode = undefined;
    }

    // if newCountryCode is set, verify it exists
    if (newCountryCode !== undefined) {
        if (!getCodes().includes(newCountryCode)) {
            console.log("Invalid country code");
            res.status(400).json({ error: "Invalid country code" });
            return;
        }
    }

    // Determine ComputerCraft color
    const ccColors: { [key: string]: RGBColor } = {
        "white": { R: 240, G: 240, B: 240 },
        "orange": { R: 242, G: 178, B: 51 },
        "magenta": { R: 229, G: 127, B: 216 },
        "lightBlue": { R: 153, G: 178, B: 242 },
        "yellow": { R: 222, G: 222, B: 108 },
        "lime": { R: 127, G: 204, B: 25 },
        "pink": { R: 242, G: 178, B: 204 },
        "gray": { R: 76, G: 76, B: 76 },
        "lightGray": { R: 153, G: 153, B: 153 },
        "cyan": { R: 76, G: 153, B: 178 },
        "purple": { R: 178, G: 102, B: 229 },
        "blue": { R: 51, G: 102, B: 204 },
        "brown": { R: 127, G: 102, B: 76 },
        "green": { R: 87, G: 166, B: 78 },
        "red": { R: 204, G: 76, B: 76 },
        "black": { R: 25, G: 25, B: 25 }
    }

    const ccColorNames = Object.keys(ccColors);
    const ccColorValues = Object.values(ccColors);

    const newColor = closest({ R: parseInt(newNameColor.substr(1, 2), 16), G: parseInt(newNameColor.substr(3, 2), 16), B: parseInt(newNameColor.substr(5, 2), 16) }, ccColorValues);
    const newColorName = ccColorNames[ccColorValues.indexOf(newColor)];

    console.log("Sending to DB...");

    const result = await playersCollection.updateOne({ token }, {
        $set: {
            "profileStyle.displayName": newDisplayName,
            "profileStyle.nameColour": newNameColor,
            "profileStyle.prideFlags": newPrideFlags || [],
            "profileStyle.countryCode": newCountryCode,
            "profileStyle.hideStar": newHideStar,
            "profileStyle.showLastJoinedDate": newShowLastJoinDate,
            "profileStyle.ccColor": newColorName
        }
    });

    await client.close();

    console.log("DB modified count: " + result.modifiedCount);

    res.status(200).json({
        success: result.modifiedCount === 1
    });
}
