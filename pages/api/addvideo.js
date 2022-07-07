import clientPromise from '../../util/mongodb';

export default async (req, res) => {
    const client = await clientPromise;
    const db = client.db("CardinalHouseDB");

    // try {
        const code = req.query.code;
        const title = req.query.title;
        const link = req.query.link;
        const description = req.query.description;
        const category = req.query.category;

        if (code != process.env.CODE) {
            res.json({"success": "false", "reason": "incorrect contract address"});
            return;
        }

        const result = await db.collection("Videos").insertOne({
            "title": title,
            "link": link,
            "description": description,
            "category": category
        });
    // }
    // catch (error) {
    //     res.json({"success": "false", "reason": "test"});
    //     return;
    // }

    res.json({"query": req.query, "success": "true"});
};