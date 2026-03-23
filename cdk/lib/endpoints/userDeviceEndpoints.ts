import * as apigw from "aws-cdk-lib/aws-apigateway";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";


export const userDeviceEndpoints = (api: apigw.RestApi, lambda: Record<string, NodejsFunction>) => {
    const userDevice = api.root.addResource("device");

    // Get user device endpoint
    userDevice.addResource("get-device").addResource("{userId}").addMethod("GET", new apigw.LambdaIntegration(lambda.getOneUserDeviceLambda, {proxy: true}), {authorizationType: apigw.AuthorizationType.NONE});

    // get all users devices
    userDevice.addResource("get-devices").addMethod("GET", new apigw.LambdaIntegration(lambda.getAllUsersDeviceLambda, {proxy: true}), {authorizationType: apigw.AuthorizationType.NONE});
};