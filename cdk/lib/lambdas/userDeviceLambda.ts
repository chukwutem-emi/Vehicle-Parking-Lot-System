import * as iam from "aws-cdk-lib/aws-iam";
import {Stack} from "aws-cdk-lib";
import {createLambda} from "./lambdaFactory.js"



export const getUserDeviceLambda = (stack: Stack, envVars: Record<string, string>) => {
    const getOneUserDeviceLambda = createLambda({stack, envVars}, "getOneUserDeviceLambda", "src/handlers/usersDevice/user-device.ts", "getLoggedInUserDeviceHandler");
    getOneUserDeviceLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const getAllUsersDeviceLambda = createLambda({stack, envVars}, "getAllUsersDeviceLambda", "src/handlers/usersDevice/user-device.ts", "getAllLoggedInUserDevices");
    getAllUsersDeviceLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const userDeviceLambda = {
        getOneUserDeviceLambda: getOneUserDeviceLambda,
        getAllUsersDeviceLambda: getAllUsersDeviceLambda
    };

    return userDeviceLambda;
};