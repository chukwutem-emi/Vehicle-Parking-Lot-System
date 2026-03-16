import { Stack } from "aws-cdk-lib";
import {createLambda} from "./lambdaFactory.js";


export const testConnectionLambda = (stack: Stack, envVars: Record<string, string>) => {
    const testConnection = createLambda({ stack, envVars}, "TestConnectionLambda", "src/handlers/test-connection.ts", "handler");

    const testConnect = {
        testConnection: testConnection
    }

    return testConnect;
};