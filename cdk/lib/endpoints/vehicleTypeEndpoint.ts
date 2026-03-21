import * as apigw from "aws-cdk-lib/aws-apigateway";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";



export const vehicleTypeEndpoints = (api: apigw.RestApi, lambda: Record<string, NodejsFunction>) => {
    const vehicle = api.root.addResource("vehicle");

    // create Vehicle-types Endpoint
    vehicle.addResource("create").addMethod("POST", new apigw.LambdaIntegration(lambda.uploadVehicleTypeLambda, {proxy: true}), {authorizationType: apigw.AuthorizationType.NONE});

    // fetchVehicleType endpoint
    vehicle.addResource("get-vehicle").addMethod("GET", new apigw.LambdaIntegration(lambda.fetchVehicleTypeLambda, {proxy: true}), {authorizationType: apigw.AuthorizationType.NONE});

    // update vehicle-type endpoint
    vehicle.addResource("update-vehicle").addResource("{vehicleId}").addMethod("PUT", new apigw.LambdaIntegration(lambda.updateVehicleTypeLambda, {proxy: true}), {authorizationType: apigw.AuthorizationType.NONE});
};