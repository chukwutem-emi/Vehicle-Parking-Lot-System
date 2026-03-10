import * as apigw from "aws-cdk-lib/aws-apigateway";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";


export const parkingSlotEndpoints = (api: apigw.RestApi, lambda: Record<string, NodejsFunction>) => {
    const slot = api.root.addResource("slot");

    // create Parking-slot endpoint
    slot.addResource("create-slot").addMethod("POST", new apigw.LambdaIntegration(lambda.createParkingSlotLambda, {proxy: true}));

    // get all parkingSlots
    slot.addResource("get-slots").addMethod("GET", new apigw.LambdaIntegration(lambda.getAvailableSlotLambda, {proxy: true}));

    // get parking slot with ID endpoint
    slot.addResource("get-slot").addResource("{vehicleTypeId}").addMethod("GET", new apigw.LambdaIntegration(lambda.getAvailableSlotWithIdLambda, {proxy: true}));

    // update parking slot endpoint
    slot.addResource("update-slot").addMethod("PUT", new apigw.LambdaIntegration(lambda.updateParkingSlotLambda, {proxy: true}));
};