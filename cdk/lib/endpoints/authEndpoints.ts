import * as apigw from "aws-cdk-lib/aws-apigateway";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";


export const addAuthEndpoints = (api: apigw.RestApi, lambda: Record<string, NodejsFunction>) => {
    const auth = api.root.addResource("auth");
    // create user endpoint
    auth.addResource("signup").addMethod("POST", new apigw.LambdaIntegration(lambda.createUserLambda, {proxy: true}));
    // login endpoint
    auth.addResource("login").addMethod("POST", new apigw.LambdaIntegration(lambda.loginLambda, {proxy: true}));
    // get User endpoint
    auth.addResource("user").addMethod("GET", new apigw.LambdaIntegration(lambda.getUserLambda, {proxy: true}), {authorizationType: apigw.AuthorizationType.NONE});
    // get all Users endpoint
    auth.addResource("users").addMethod("GET", new apigw.LambdaIntegration(lambda.getAllUserLambda, {proxy: true}), {authorizationType: apigw.AuthorizationType.NONE});
    // update user details endpoint
    auth.addResource("update").addResource("{userId}").addMethod("PUT", new apigw.LambdaIntegration(lambda.updateUserDetailsLambda, {proxy: true}), {authorizationType: apigw.AuthorizationType.NONE});
    // promote user endpoint
    auth.addResource("promote").addResource("{userId}").addMethod("PUT", new apigw.LambdaIntegration(lambda.promoteUserLambda, {proxy: true}), {authorizationType: apigw.AuthorizationType.NONE});
    // Demote user endpoint
    auth.addResource("demote").addResource("{userId}").addMethod("PUT", new apigw.LambdaIntegration(lambda.demoteUserLambda, {proxy: true}), {authorizationType: apigw.AuthorizationType.NONE});
    // Delete user endpoint
    auth.addResource("delete").addResource("{userId}").addMethod("DELETE", new apigw.LambdaIntegration(lambda.deleteUserLambda, {proxy: true}), {authorizationType: apigw.AuthorizationType.NONE});
    // reset password
    auth.addResource("reset").addMethod("POST", new apigw.LambdaIntegration(lambda.resetPasswordLambda, {proxy: true}));
    // update password
    auth.addResource("update-password").addMethod("PUT", new apigw.LambdaIntegration(lambda.updatePasswordLambda, {proxy: true}));
};