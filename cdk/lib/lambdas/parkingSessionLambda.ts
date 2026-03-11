import * as iam from "aws-cdk-lib/aws-iam";
import {Stack} from "aws-cdk-lib";
import {createLambda} from "./lambdaFactory.js"



export const createSessionLambda = (stack: Stack, envVars: Record<string, string>) => {
    const createParkingSessionLambda = createLambda({stack, envVars}, "createParkingSessionLambda", "src/handlers/parkingSession/createParkingSession.ts", "createParkingSessionHandler");
    createParkingSessionLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const getAllParkingSessionLambda = createLambda({stack, envVars}, "getAllParkingSessionLambda", "src/handlers/parkingSession/getAllParkingSession.ts", "getAllParkingSessionHandler");
    getAllParkingSessionLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const getParkingSessionLambda = createLambda({stack, envVars}, "getParkingSessionLambda", "src/handlers/parkingSession/getParkingSession.ts", "getParkingSessionHandler");
    getParkingSessionLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const vehicleExitTimeLambda = createLambda({stack, envVars}, "vehicleExitTimeLambda", "src/handlers/parkingSession/vehicleExitTime.ts", "vehicleExitTimeHandler");
    vehicleExitTimeLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));


    const parkingSessionLambda = {
        createParkingSessionLambda: createParkingSessionLambda,
        getAllParkingSessionLambda: getAllParkingSessionLambda,
        getParkingSessionLambda: getParkingSessionLambda,
        vehicleExitTimeLambda: vehicleExitTimeLambda
    };

    return parkingSessionLambda;
};