import clientPromise from '../../util/mongodb';
import { ObjectId } from 'mongodb';

export default async (req, res) => {
    const client = await clientPromise;
    const db = client.db("CardinalHouseDB");

    try {
        const code = req.body.code;
        const id = req.body.id;

        if (code != process.env.CODE) {
            res.json({"success": "false", "reason": "Incorrect Code"});
            return;
        }

        const query = { _id: ObjectId(id) };

        const result = await db.collection("Videos").deleteOne(query);
    }
    catch (error) {
        res.json({"success": "false", "reason": error.toString()});
        return;
    }

    res.json({"success": "true"});
};