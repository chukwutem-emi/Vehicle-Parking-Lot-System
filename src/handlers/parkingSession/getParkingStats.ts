import {withAuth} from "../lambdaAuth.js";
import {corsHeaders} from "../corsHeaders.js";
import {ParkingSession, initModels} from "../../models/index.js"


const sequelize = initModels();
export const getParkingStatsHandler = withAuth( async (event, _context) => {
    try {
        if (!sequelize) throw new Error("Sequelize instance not initialized");
        if (event.httpMethod === "OPTIONS") {
            return {
                statusCode: 204,
                headers: corsHeaders,
                body: ""
            }
        };
        const currentUser = event.userId;
        if (currentUser === undefined || currentUser === null) {
            return {
                statusCode: 401,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Unauthorized. Please login"
                })
            };
        };
        const statistics = await ParkingSession.findAll({
            attributes: [
                [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
                [sequelize.fn("COUNT", sequelize.col("id")), "entries"],
                [sequelize.fn("COUNT", sequelize.col("exitTime")), "exits"]
            ],
            group: ["date"],
            order: [[sequelize.literal("date"), "ASC"]]
        });
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                data: statistics
            })
        };
    } catch (err: any) {
        console.log("ERROR:", err);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                message: err.message
            })
        };
    };
});