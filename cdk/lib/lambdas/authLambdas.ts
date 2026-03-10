import {createLambda} from "./lambdaFactory.js";
import * as iam from "aws-cdk-lib/aws-iam";
import {Stack} from "aws-cdk-lib";


export const createAuthLambdas = (stack: Stack, envVars: Record<string, string>) => {
    const  createUserLambda = createLambda({stack, envVars}, "createUserLambda", "src/handlers/auth/createUser.ts", "createUserHandler", ["bcryptjs", "aws-lambda", "sequelize"]);
    createUserLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const loginLambda = createLambda({stack, envVars}, "loginLambda", "src/handlers/auth/login.ts", "loginHandler", ["ua-parser-js", "jsonwebtoken", "bcryptjs", "geoip-lite", "aws-lambda", "sequelize"]);
    loginLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const getUserLambda = createLambda({stack, envVars}, "getUserLambda", "src/handlers/auth/getUser.ts", "getUserHandler", ["aws-lambda", "sequelize"]);
    getUserLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const getAllUserLambda = createLambda({stack, envVars}, "getAllUserLambda", "src/handlers/auth/getAllUsers.ts", "getAllUsersHandler", ["aws-lambda", "sequelize"]);
    getAllUserLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const updateUserDetailsLambda = createLambda({stack, envVars}, "updateUserDetailsLambda", "src/handlers/auth/updateUserDetails.ts", "updateUserDetailsHandler", ["aws-lambda", "sequelize"]);
    updateUserDetailsLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const promoteUserLambda = createLambda({stack, envVars}, "promoteUserLambda", "src/handlers/auth/promoteUser.ts", "promoteUserHandler", ["aws-lambda", "sequelize"]);
    promoteUserLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const demoteUserLambda = createLambda({stack, envVars}, "demoteUserLambda", "src/handlers/auth/demoteUser.ts", "demoteUserHandler", ["aws-lambda", "sequelize"]);
    demoteUserLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const deleteUserLambda = createLambda({stack, envVars}, "deleteUserLambda", "src/handlers/auth/deleteUser.ts", "deleteUserHandler", ["aws-lambda", "sequelize"]);
    deleteUserLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const resetPasswordLambda = createLambda({stack, envVars}, "resetPasswordLambda", "src/handlers/auth/resetPassword.ts", "resetPasswordHandler", ["sequelize", "aws-lambda"]);
    resetPasswordLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const updatePasswordLambda = createLambda({stack, envVars}, "updatePasswordLambda", "src/handlers/auth/updatePassword.ts", "updatePasswordHandler", ["sequelize", "aws-lambda"]);
    updatePasswordLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));
    
    const authLambdas = {
        createUserLambda: createUserLambda,
        loginLambda: loginLambda,
        getUserLambda: getUserLambda,
        getAllUserLambda: getAllUserLambda,
        updateUserDetailsLambda: updateUserDetailsLambda,
        promoteUserLambda: promoteUserLambda,
        demoteUserLambda: demoteUserLambda,
        deleteUserLambda: deleteUserLambda,
        resetPasswordLambda: resetPasswordLambda,
        updatePasswordLambda: updatePasswordLambda
    };

    return authLambdas;
};