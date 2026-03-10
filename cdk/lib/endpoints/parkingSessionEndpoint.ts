import * as apigw from "aws-cdk-lib/aws-apigateway";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";


export const parkingSessionEndpoints = (api: apigw.RestApi, lambda: Record<string, NodejsFunction>) => {
    const session = api.root.addResource("session");

    // CreateParkingSession endpoint

    session.addResource("create").addMethod("POST", new apigw.LambdaIntegration(lambda.createParkingSessionLambda, {proxy: true}));

    // getAllParkingSessions endpoint

    session.addResource("get-sessions").addMethod("GET", new apigw.LambdaIntegration(lambda.getAllParkingSessionLambda, {proxy: true}));

    // getParkingSession endpoint

    session.addResource("get-session").addMethod("GET", new apigw.LambdaIntegration(lambda.getParkingSessionLambda, {proxy: true}));

    // vehicleExitTime endpoint

    session.addResource("update").addMethod("PUT", new apigw.LambdaIntegration(lambda.vehicleExitTimeLambda, {proxy: true}));
};