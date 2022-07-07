import clientPromise from '../../util/mongodb';

export default async (req, res) => {
    const client = await clientPromise;
    const db = client.db("CardinalHouseDB");

    const videos = await db
        .collection("Videos")
        .find({})
        .toArray();

    res.json(videos);
};