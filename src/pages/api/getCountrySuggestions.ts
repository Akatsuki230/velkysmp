export default async function handler(req: any, res: any) {
    res.status(400).json({error: "Service shut down"});
}