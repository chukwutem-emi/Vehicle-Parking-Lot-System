import * as iam from "aws-cdk-lib/aws-iam";
import {Stack} from "aws-cdk-lib";
import {createLambda} from "./lambdaFactory.js"



export const createSlotLambda = (stack: Stack, envVars: Record<string, string>) => {
    const createParkingSlotLambda = createLambda({stack, envVars}, "createParkingSlotLambda", "src/handlers/parkingSlot/createParkingSlot.ts", "createParkingSlotHandler");
    createParkingSlotLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const getAvailableSlotLambda = createLambda({stack, envVars}, "getAvailableSlotLambda", "src/handlers/parkingSlot/fetchParkingSlot.ts", "getAvailableSlotHandler");
    getAvailableSlotLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const getAvailableSlotWithIdLambda = createLambda({stack, envVars}, "getAvailableSlotWithIdLambda", "src/handlers/parkingSlot/fetchWithID.ts", "getAvailableSlotWithIdHandler");
    getAvailableSlotWithIdLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const updateParkingSlotLambda = createLambda({stack, envVars}, "updateParkingSlotLambda", "src/handlers/parkingSlot/updateParkingSlot.ts", "updateParkingSlotHandler");
    updateParkingSlotLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const parkingSlotLambda = {
        createParkingSlotLambda: createParkingSlotLambda,
        getAvailableSlotLambda: getAvailableSlotLambda,
        getAvailableSlotWithIdLambda: getAvailableSlotWithIdLambda,
        updateParkingSlotLambda: updateParkingSlotLambda
    };

    return parkingSlotLambda;
};