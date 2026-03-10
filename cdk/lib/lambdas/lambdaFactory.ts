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
    handler: string,
    nodeModules: string[]
) => {
    const commonBundling = {
        externalModules: ["aws-sdk", "pg", "pg-hstore"],
        minify: true
    };
    return new NodejsFunction(stack, id, {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: entry,
        handler: handler,
        environment: envVars,
        bundling: {
            ...commonBundling,
            nodeModules: nodeModules
        }
    });
};