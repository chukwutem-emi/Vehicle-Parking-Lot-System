import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs"
import {Stack} from "aws-cdk-lib"
import * as lambda from "aws-cdk-lib/aws-lambda"
import path from "path";

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
            nodeModules: ["ua-parser-js", "jsonwebtoken", "bcryptjs", "geoip-lite", "sequelize", "mysql2"],
            commandHooks: {
                beforeBundling(inputDir: string, outputDir: string): string[] {
                    return [`cp -r ${path.join(inputDir, "src/certificate")} ${outputDir}/`];
                },
                afterBundling(inputDir: string, outputDir: string): string[] {
                return [];
                },
                beforeInstall(inputDir: string, outputDir: string): string[] {
                    return [];
                }
            }
        }
    });
};