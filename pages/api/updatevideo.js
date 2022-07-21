import clientPromise from '../../util/mongodb';
import { ObjectId } from 'mongodb';

export default async (req, res) => {
    const client = await clientPromise;
    const db = client.db("CardinalHouseDB");

    try {
        const code = req.body.code;
        const id = req.body.id;
        const title = req.body.title;
        const type = req.body.type;
        const link = req.body.link;
        const description = req.body.description;
        const category = req.body.category;
        const videoOrder = req.body.videoOrder;
        const categoryOrder = req.body.categoryOrder;
        const minutes = req.body.minutes;

        if (code != process.env.CODE) {
            res.json({"success": "false", "reason": "Incorrect Code"});
            return;
        }

        const filter = { _id: ObjectId(id) };

        const updateDoc = {
            $set: {
                "title": title,
                "type": type,
                "link": link,
                "description": description,
                "category": category,
                "videoOrder": videoOrder,
                "categoryOrder": categoryOrder,
                "minutes": minutes
            },
        };

        const result = await db.collection("Videos").updateOne(filter, updateDoc, {});
    }
    catch (error) {
        res.json({"success": "false", "reason": error.toString()});
        return;
    }

    res.json({"success": "true"});
};