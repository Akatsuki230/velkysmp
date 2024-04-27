import { getSuggestions } from "@/components/Countries";

export default async function handler(req: any, res: any) {
    const { name } = req.query;

    const suggestions = await getSuggestions(name);

    res.status(200).json(suggestions);
}