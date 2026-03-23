import * as apigw from "aws-cdk-lib/aws-apigateway";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";


export const parkingSessionEndpoints = (api: apigw.RestApi, lambda: Record<string, NodejsFunction>) => {
    const session = api.root.addResource("session");

    // CreateParkingSession endpoint

    session.addResource("create").addMethod("POST", new apigw.LambdaIntegration(lambda.createParkingSessionLambda, {proxy: true}), {authorizationType: apigw.AuthorizationType.NONE});

    // getAllParkingSessions endpoint

    session.addResource("get-sessions").addMethod("GET", new apigw.LambdaIntegration(lambda.getAllParkingSessionLambda, {proxy: true}), {authorizationType: apigw.AuthorizationType.NONE});

    // getParkingSession endpoint

    session.addResource("get-session").addResource("{sessionId}").addMethod("GET", new apigw.LambdaIntegration(lambda.getParkingSessionLambda, {proxy: true}), {authorizationType: apigw.AuthorizationType.NONE});

    // vehicleExitTime endpoint

    session.addResource("update").addMethod("PUT", new apigw.LambdaIntegration(lambda.vehicleExitTimeLambda, {proxy: true}), {authorizationType: apigw.AuthorizationType.NONE});
};