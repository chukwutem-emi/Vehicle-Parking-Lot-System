import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs"
import {Stack} from "aws-cdk-lib"
import * as lambda from "aws-cdk-lib/aws-lambda"


interface LambdaFactoryProps {
    stack: Stack,
    envVars: Record<string, string>
};

export const createLambda = (
    {stack, envVars} : LambdaFactoryProps,
    id: string,
    entry: string,
    handler: string
) => {
    return new NodejsFunction(stack, id, {
        runtime: lambda.Runtime.NODEJS_24_X,
        entry: entry,
        handler: handler,
        environment: envVars,
        bundling: {
            minify: true,
            externalModules: ["aws-sdk"],
            nodeModules: ["ua-parser-js", "jsonwebtoken", "bcryptjs", "geoip-lite", "sequelize", "mysql2"]
        }
    });
};