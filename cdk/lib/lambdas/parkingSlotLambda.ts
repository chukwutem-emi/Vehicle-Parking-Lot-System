import * as iam from "aws-cdk-lib/aws-iam";
import {Stack} from "aws-cdk-lib";
import {createLambda} from "./lambdaFactory.js"



export const createSlotLambda = (stack: Stack, envVars: Record<string, string>) => {
    const createParkingSlotLambda = createLambda({stack, envVars}, "createParkingSlotLambda", "handlers/parkingSlot/createParkingSlot.ts", "createParkingSlotHandler", ["aws-lambda", "sequelize"]);
    createParkingSlotLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const getAvailableSlotLambda = createLambda({stack, envVars}, "getAvailableSlotLambda", "handlers/parkingSlot/fetchParkingSlot.ts", "getAvailableSlotHandler", ["aws-lambda", "sequelize"]);
    getAvailableSlotLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const getAvailableSlotWithIdLambda = createLambda({stack, envVars}, "getAvailableSlotWithIdLambda", "handlers/parkingSlot/fetchWithID.ts", "getAvailableSlotWithIdHandler", ["aws-lambda", "sequelize"]);
    getAvailableSlotWithIdLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const updateParkingSlotLambda = createLambda({stack, envVars}, "updateParkingSlotLambda", "handlers/parkingSlot/ updateParkingSlot.ts", "updateParkingSlotHandler", ["aws-lambda", "sequelize"]);
    updateParkingSlotLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const parkingSlotLambda = {
        createParkingSlotLambda: createParkingSlotLambda,
        getAvailableSlotLambda: getAvailableSlotLambda,
        getAvailableSlotWithIdLambda: getAvailableSlotWithIdLambda,
        updateParkingSlotLambda: updateParkingSlotLambda
    };

    return parkingSlotLambda;
};