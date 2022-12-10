import clientPromise from '../../util/mongodb';

export async function getProjectById(projectId) {
    const client = await clientPromise;
    const db = client.db("CardinalHouseDB");

    const projects = await db
        .collection("EducationCenterProjects")
        .findOne({id: projectId})

    return JSON.parse(JSON.stringify(projects));
}

export default async (req, res) => {
    const client = await clientPromise;
    const db = client.db("CardinalHouseDB");
    const projectId = req.body.projectId;

    const projects = await db
        .collection("EducationCenterProjects")
        .findOne({id: projectId})

    res.json(projects);
};