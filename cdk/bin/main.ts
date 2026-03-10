import * as cdk from "aws-cdk-lib";
import {BackendStack} from "../lib/backendStack.js";


const app = new cdk.App();
new BackendStack(app, "BackendStack", {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    },
    envVars: {
        DB_NAME: process.env.DB_NAME!,
        DB_HOST: process.env.DB_HOST!,
        DB_PASSWORD: process.env.DB_PASSWORD!,
        DB_USER: process.env.DB_USER!,
        PORT: process.env.PORT!,
        SECRET_KEY: process.env.SECRET_KEY!,
        RESET_PASSWORD: process.env.RESET_PASSWORD!
    }
});