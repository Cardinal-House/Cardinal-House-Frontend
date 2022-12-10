import clientPromise from '../../util/mongodb';

export async function getProjects() {
    const client = await clientPromise;
    const db = client.db("CardinalHouseDB");

    const projects = await db
        .collection("EducationCenterProjects")
        .find({})
        .toArray();

    return JSON.parse(JSON.stringify(projects));
}

export default async (req, res) => {
    const client = await clientPromise;
    const db = client.db("CardinalHouseDB");

    const projects = await db
        .collection("EducationCenterProjects")
        .find({})
        .toArray();

    res.json(projects);
};