import * as cdk from "aws-cdk-lib";
import { BackendStack } from "../lib/backendStack.js";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env"), override: true });
const app = new cdk.App();
new BackendStack(app, "BackendStack", {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    },
    envVars: {
        DB_NAME: process.env.DB_NAME,
        DB_HOST: process.env.DB_HOST,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_USER: process.env.DB_USER,
        PORT: process.env.PORT
    }
});
