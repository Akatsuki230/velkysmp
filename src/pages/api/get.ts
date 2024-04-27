import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

// Function to set a key-value pair
async function kv_set_value(client: MongoClient, key: string, value: string) {
    try {
        await client.connect();
        const db = client.db(process.env.MONGODB_DATABASE!);
        const collection = db.collection("KV");
        await collection.updateOne({ key: key }, { $set: { value: value } }, { upsert: true });
    } finally {
        await client.close();
    }
}

// Function to get the value for a given key
async function kv_get_value(client: MongoClient, key: string) {
    try {
        await client.connect();
        const db = client.db(process.env.MONGODB_DATABASE!);
        const collection = db.collection("KV");
        const result = await collection.findOne({ key: key });
        return result ? result.value : null;
    } finally {
        await client.close();
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db(process.env.MONGODB_DATABASE!);
    const playersCollection = db.collection("Playtimes");

    const players = await playersCollection.find({}, { sort: { seconds: -1 } }).toArray();

    const motd = await kv_get_value(client, "motd");
    const online = await kv_get_value(client, "online");
    const max = await kv_get_value(client, "max");
    const ping = await kv_get_value(client, "ping");

    await client.close();

    res.status(200).json({
        motd,
        online,
        max,
        ping,
        players: players
            .filter(x => !x.banned)
            .map((x) => {
            return {
                name: x.name,
                humantime: x.humantime,
                seconds: x.seconds,
                online: x.online,
                profileStyle: x.profileStyle,
            };
        }),
    });
}