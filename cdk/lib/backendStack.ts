import {Stack, type StackProps, CfnOutput} from "aws-cdk-lib"
import {Construct} from "constructs";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import {addAuthEndpoints} from "../lib/endpoints/authEndpoints.js";
import {parkingSessionEndpoints} from "../lib/endpoints/parkingSessionEndpoint.js";
import {parkingSlotEndpoints} from "../lib/endpoints/parkingSlotEndpoint.js";
import {vehicleTypeEndpoints} from "../lib/endpoints/vehicleTypeEndpoint.js"
import {createAuthLambdas} from "./lambdas/authLambdas.js"
import {createSessionLambda} from "./lambdas/parkingSessionLambda.js";
import {createSlotLambda} from "./lambdas/parkingSlotLambda.js";
import {createVehicleTypeLambda} from "./lambdas/vehicleTypeLambda.js";
import { testConnectionLambda } from "./lambdas/testConnectionLambda.js";
import { connectionEndpoint } from "./endpoints/testConnectionEndpoint.js";


interface BackendStackProps extends StackProps {
    envVars: {
        DB_NAME: string;
        DB_HOST: string;
        DB_PASSWORD: string;
        DB_USER: string;
        DB_PORT:  string;
        SECRET_KEY: string;
        RESET_PASSWORD: string;
    };
};
export class BackendStack extends Stack {
    constructor(scope: Construct, id: string, props: BackendStackProps) {
        super(scope, id, props);
        const env = props.envVars;

        
        // authLambda
        const authLambdas = createAuthLambdas(this, env);

        // parkingSessionLambda
        const parkingSessionLambda = createSessionLambda(this, env);

        // parkingSlotLambda
        const parkingSlotLambda = createSlotLambda(this, env);

        // vehicleTypeLambda
        const vehicleTypeLambda = createVehicleTypeLambda(this, env);
        
        // connection
        const connectionLambda = testConnectionLambda(this, env);
        // create API
        const api = new apigw.RestApi(this, "ParkingAPIEndpoint", {
            defaultCorsPreflightOptions: {
                allowOrigins: apigw.Cors.ALL_ORIGINS,
                allowMethods: apigw.Cors.ALL_METHODS,
                allowHeaders: ["Content-Type", "Authorization"]
            }
        });
        // Add endpoints
        addAuthEndpoints(api, authLambdas);
        parkingSessionEndpoints(api, parkingSessionLambda);
        parkingSlotEndpoints(api, parkingSlotLambda);
        vehicleTypeEndpoints(api, vehicleTypeLambda);
        connectionEndpoint(api, connectionLambda)

        // Output API URL
        new CfnOutput(this, `${api.node.id}Output`, {
            value: api.url,
            exportName: "ParkingAPIEndpoint"
        });
    };
};