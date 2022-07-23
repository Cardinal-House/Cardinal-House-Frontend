import clientPromise from '../../util/mongodb';

export default async (req, res) => {
    const client = await clientPromise;
    const db = client.db("CardinalHouseDB");

    try {
        const discordUserName = req.body.discordUserName;
        const forwarded = req.headers["x-forwarded-for"];
        const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;

        const userNameSearch = await db.collection("EducationCenterCompletions").findOne({discordUserName: discordUserName});

        if (userNameSearch) {
            res.json({"success": "false", "reason": "You've already submitted this Discord username."});
            return;
        }

        const options = {
            sort: { timestamp: -1 },
        };

        const currTimeStamp = (new Date()).toISOString();

        const ipSearch = await db.collection("EducationCenterCompletions").findOne({ip: ip}, options);

        if (ipSearch && (new Date(currTimeStamp)) - (new Date(ipSearch.timestamp)) < 1000000) {
            res.json({"success": "false", "reason": "You've submitted a Discord username too recently! Try again after a while."});
            return;
        }

        const result = await db.collection("EducationCenterCompletions").insertOne({
            "discordUserName": discordUserName,
            "ip": ip,
            "timestamp": currTimeStamp
        });
    }
    catch (error) {
        res.json({"success": "false", "reason": error.toString()});
        return;
    }

    res.json({"success": "true"});
};