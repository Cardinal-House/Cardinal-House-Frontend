import clientPromise from '../../util/mongodb';

export default async (req, res) => {
    const client = await clientPromise;
    const db = client.db("CardinalHouseDB");

    try {
        const code = req.body.code;
        const title = req.body.title;
        const type = req.body.type;
        const link = req.body.link;
        const description = req.body.description;
        const category = req.body.category;
        const subCategory = req.body.subCategory;
        const videoOrder = req.body.videoOrder;
        const categoryOrder = req.body.categoryOrder;
        const subCategoryOrder = req.body.subCategoryOrder;
        const minutes = req.body.minutes;

        if (code != process.env.CODE) {
            res.json({"success": "false", "reason": "Incorrect Code"});
            return;
        }

        const result = await db.collection("Videos").insertOne({
            "title": title,
            "type": type,
            "link": link,
            "description": description,
            "category": category,
            "subCategory": subCategory,
            "videoOrder": videoOrder,
            "categoryOrder": categoryOrder,
            "subCategoryOrder": subCategoryOrder,
            "minutes": minutes
        });
    }
    catch (error) {
        res.json({"success": "false", "reason": error.toString()});
        return;
    }

    res.json({"success": "true"});
};