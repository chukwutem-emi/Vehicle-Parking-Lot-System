import * as iam from "aws-cdk-lib/aws-iam";
import {Stack} from "aws-cdk-lib";
import {createLambda} from "./lambdaFactory.js";



export const createVehicleTypeLambda = (stack: Stack, envVars: Record<string, string>) => {
    const uploadVehicleTypeLambda = createLambda({stack, envVars}, "uploadVehicleTypeLambda", "src/handlers/vehicleType/createVehicleType.ts", "uploadVehicleTypeHandler");
    uploadVehicleTypeLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const fetchVehicleTypeLambda = createLambda({stack, envVars}, "fetchVehicleTypeLambda", "src/handlers/vehicleType/fetchVehicleType.ts", "fetchVehicleTypeHandler");
    fetchVehicleTypeLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const updateVehicleTypeLambda = createLambda({stack, envVars}, "updateVehicleTypeLambda", "src/handlers/vehicleType/updateVehicleType.ts", "updateVehicleTypeHandler");
    updateVehicleTypeLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const vehicleTypeLambda = {
        uploadVehicleTypeLambda: uploadVehicleTypeLambda,
        fetchVehicleTypeLambda: fetchVehicleTypeLambda,
        updateVehicleTypeLambda: updateVehicleTypeLambda
    };

    return vehicleTypeLambda;
};