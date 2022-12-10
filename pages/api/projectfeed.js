import clientPromise from '../../util/mongodb';

export async function getProjectFeed(collectionName, skipNum) {
    const client = await clientPromise;
    const db = client.db("CardinalHouseDB");

    const projects = await db
        .collection(collectionName)
        .find({})
        .sort({timestamp: -1})
        .skip(skipNum)
        .limit(5)
        .toArray();

    return JSON.parse(JSON.stringify(projects));
}

export default async (req, res) => {
    const client = await clientPromise;
    const db = client.db("CardinalHouseDB");

    const collectionName = req.query.collectionName;
    const mainSkipNum = parseInt(req.query.mainSkipNum);
    const socialSkipNum = parseInt(req.query.socialSkipNum);
    const socialSelected = req.query.socialSelected;

    let projects = [];

    if (socialSelected == "all") {
        projects = await db
            .collection(collectionName)
            .find({})
            .sort({timestamp: -1})
            .skip(mainSkipNum)
            .limit(5)
            .toArray();
    }
    else {
        projects = await db
            .collection(collectionName)
            .find({social: socialSelected})
            .sort({timestamp: -1})
            .skip(socialSkipNum)
            .limit(5)
            .toArray();
    }

    res.json(projects);
};