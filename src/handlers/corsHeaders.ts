/**
 * CORS headers to allow cross-origin requests from any domain.
 * This is useful for APIs that need to be accessed from different origins.
 * Note: In a production environment, you should restrict the allowed origins to enhance security.
 */
export const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE, PATCH",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
};