import {createLambda} from "./lambdaFactory.js";
import * as iam from "aws-cdk-lib/aws-iam";
import {Stack} from "aws-cdk-lib";


export const createAuthLambdas = (stack: Stack, envVars: Record<string, string>) => {
    const  createUserLambda = createLambda({stack, envVars}, "createUserLambda", "src/handlers/auth/createUser.ts", "createUserHandler");
    createUserLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const loginLambda = createLambda({stack, envVars}, "loginLambda", "src/handlers/auth/login.ts", "loginHandler");
    loginLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const getUserLambda = createLambda({stack, envVars}, "getUserLambda", "src/handlers/auth/getUser.ts", "getUserHandler");
    getUserLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const getAllUserLambda = createLambda({stack, envVars}, "getAllUserLambda", "src/handlers/auth/getAllUsers.ts", "getAllUsersHandler");
    getAllUserLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const updateUserDetailsLambda = createLambda({stack, envVars}, "updateUserDetailsLambda", "src/handlers/auth/updateUserDetails.ts", "updateUserDetailsHandler");
    updateUserDetailsLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const promoteUserLambda = createLambda({stack, envVars}, "promoteUserLambda", "src/handlers/auth/promoteUser.ts", "promoteUserHandler");
    promoteUserLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const demoteUserLambda = createLambda({stack, envVars}, "demoteUserLambda", "src/handlers/auth/demoteUser.ts", "demoteUserHandler");
    demoteUserLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const deleteUserLambda = createLambda({stack, envVars}, "deleteUserLambda", "src/handlers/auth/deleteUser.ts", "deleteUserHandler");
    deleteUserLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const resetPasswordLambda = createLambda({stack, envVars}, "resetPasswordLambda", "src/handlers/auth/resetPassword.ts", "resetPasswordHandler");
    resetPasswordLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));

    const updatePasswordLambda = createLambda({stack, envVars}, "updatePasswordLambda", "src/handlers/auth/updatePassword.ts", "updatePasswordHandler");
    updatePasswordLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));
    const logoutLambda = createLambda({stack, envVars}, "logoutLambda", "src/handlers/auth/logout.ts", "logoutHandler");
    logoutLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));
    const refreshTokenLambda = createLambda({stack, envVars}, "refreshTokenLambda", "src/handlers/auth/refreshToken.ts", "updatePasswordHandler");
    refreshTokenLambda.addToRolePolicy(new iam.PolicyStatement({actions: ["ses:SendEmail", "ses:SendRawEmail"], resources: ["*"]}));
    
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
        updatePasswordLambda: updatePasswordLambda,
        logoutLambda: logoutLambda,
        refreshTokenLambda: refreshTokenLambda
    };

    return authLambdas;
};