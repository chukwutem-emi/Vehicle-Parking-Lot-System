import {corsHeaders} from "./corsHeaders";
import {APIGatewayProxyEvent} from "aws-lambda";
import jwt from "jsonwebtoken";


export const refreshHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const cookies = event.headers.Cookie || event.headers.cookie;

    if (!cookies) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ message: "No refresh token" })
      };
    }

    const refreshToken = cookies.split("; ").find(c => c.startsWith("refreshToken="))?.split("=")[1];

    if (!refreshToken) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Invalid refresh token" })
      };
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET as string
    ) as any;

    const newAccessToken = jwt.sign(
      {email: decoded.email, userId: decoded.userId },
      process.env.SECRET_KEY as string,
      { expiresIn: "1h" }
    );

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        accessToken: newAccessToken
      })
    };
  } catch (err: any) {
    console.error("Error refreshing token:", err);
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ message: err.message || "Failed to refresh token" })
    };
  }
};