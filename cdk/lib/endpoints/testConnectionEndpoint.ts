import * as apigw from "aws-cdk-lib/aws-apigateway";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";


export const connectionEndpoint = (api: apigw.RestApi, lambda: Record<string, NodejsFunction>) => {
    api.root.addResource("test").addResource("connection").addMethod("GET", new apigw.LambdaIntegration(lambda.testConnection, {proxy: true}), {authorizationType: apigw.AuthorizationType.NONE});
};