import * as iam from "aws-cdk-lib/aws-iam";
import {Stack} from "aws-cdk-lib";
import {createLambda} from "./lambdaFactory.js"



export const createSessionLambda = (stack: Stack, envVars: Record<string, string>) => {
    const createParkingSessionLambda = createLambda({stack, envVars}, "createParkingSessionLambda", "handlers/parkingSession/createParkingSession.ts", "createParkingSessionHandler", ["sequelize", "aws-lambda"]);
    createParkingSessionLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const getAllParkingSessionLambda = createLambda({stack, envVars}, "getAllParkingSessionLambda", "handlers/parkSession/getAllParkingSession.ts", "getAllParkingSessionHandler", ["aws-lambda", "sequelize"]);
    getAllParkingSessionLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const getParkingSessionLambda = createLambda({stack, envVars}, "getParkingSessionLambda", "handlers/parkingSession/getParkingSession.ts", "getParkingSessionHandler", ["aws-lambda", "sequelize"]);
    getParkingSessionLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const vehicleExitTimeLambda = createLambda({stack, envVars}, "vehicleExitTimeLambda", "handlers/parkingSession/vehicleExitTime.ts", "vehicleExitTimeHandler", ["aws-lambda", "sequelize"]);
    vehicleExitTimeLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));


    const parkingSessionLambda = {
        createParkingSessionLambda: createParkingSessionLambda,
        getAllParkingSessionLambda: getAllParkingSessionLambda,
        getParkingSessionLambda: getParkingSessionLambda,
        vehicleExitTimeLambda: vehicleExitTimeLambda
    };

    return parkingSessionLambda;
};