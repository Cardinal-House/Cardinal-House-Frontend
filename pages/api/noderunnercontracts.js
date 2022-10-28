import clientPromise from '../../util/mongodb';

export default async (req, res) => {
    const client = await clientPromise;
    const db = client.db("CardinalHouseDB");

    const noderunnercontractcs = await db
        .collection("NodeRunnerContracts")
        .find({})
        .toArray();

    res.json(noderunnercontractcs);
};