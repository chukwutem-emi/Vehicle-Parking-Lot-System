import type {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {corsHeaders} from "../corsHeaders";


export const logoutHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 204,
            headers: corsHeaders,
            body: ""
        };
    };
    return {
        statusCode: 200,
        headers: {
            ...corsHeaders,
            "Set-Cookie": `refreshToken=; HttpOnly; Secure; SameSite=None; path=/; Max-Age=0`
        },
        body: JSON.stringify({
            message: "Logged out successfully"
        })
    };
};