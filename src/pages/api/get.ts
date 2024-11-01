import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    res.status(200).json({
        motd: "The tracking service shut down on 2024/10/31.",
        online: 0,
        max: 0,
        ping: 0,
        players: []
    });
}
