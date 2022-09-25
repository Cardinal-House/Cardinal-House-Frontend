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
        const section = req.body.section;
        const subCategory = req.body.subCategory;
        const videoOrder = req.body.videoOrder;
        const categoryOrder = req.body.categoryOrder;
        const subCategoryOrder = req.body.subCategoryOrder;
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
                "section": section,
                "subCategory": subCategory,
                "videoOrder": videoOrder,
                "categoryOrder": categoryOrder,
                "subCategoryOrder": subCategoryOrder,
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