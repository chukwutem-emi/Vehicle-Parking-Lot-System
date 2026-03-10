import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Stack } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as apigw from "aws-cdk-lib/aws-apigateway";
export class BackendStack extends Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const createUserLambda = new NodejsFunction(this, "createUserLambda", {
            runtime: lambda.Runtime.NODEJS_20_X,
            entry: "src/handlers/auth/createUser.ts",
            handler: "handler",
            environment: props === null || props === void 0 ? void 0 : props.envVars,
            bundling: {
                externalModules: ["aws-sdk", "pg", "pg-hstore", "bcryptjs"],
                nodeModules: ["bcryptjs"],
                minify: true
            }
        });
        // Api Gateway =>
        const api = new apigw.RestApi(this, "ParkingAPI");
        api.root.addResource("auth").addResource("register").addMethod("POST", new apigw.LambdaIntegration(createUserLambda));
    }
    ;
}
;
