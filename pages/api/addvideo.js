import clientPromise from '../../util/mongodb';

export default async (req, res) => {
    const client = await clientPromise;
    const db = client.db("CardinalHouseDB");

    // try {
        const code = req.body.code;
        const title = req.body.title;
        const link = req.body.link;
        const description = req.body.description;
        const category = req.body.category;
        const videoOrder = req.body.videoOrder;
        const categoryOrder = req.body.categoryOrder;
        const minutes = req.body.minutes;

        if (code != process.env.CODE) {
            res.json({"success": "false", "reason": "incorrect contract address"});
            return;
        }

        const result = await db.collection("Videos").insertOne({
            "title": title,
            "link": link,
            "description": description,
            "category": category,
            "videoOrder": videoOrder,
            "categoryOrder": categoryOrder,
            "minutes": minutes
        });
    // }
    // catch (error) {
    //     res.json({"success": "false", "reason": "test"});
    //     return;
    // }

    res.json({"query": req.query, "success": "true"});
};