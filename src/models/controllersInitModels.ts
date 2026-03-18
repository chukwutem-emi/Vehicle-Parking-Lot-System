import { getSequelize } from "../utils/db_helpers.js";
import { initConversation} from "./conversation.js";
import { initMessageModel} from "./message.js";
import { initParkingSessionModel } from "./parking-sessions.js";
import { initParkingSlotModel} from "./parking-slots.js";
import { initUserDevicesModel} from "./user-devices.js";
import { initUserModel} from "./user.js";
import { initVehicleTypeModel} from "./vehicle-types.js";

let initialized = false;
let sequelize: ReturnType<typeof getSequelize> | null = null;

export const initModels = () => {
    if (!sequelize) {
        sequelize = getSequelize();
    };

    if (initialized) return sequelize;
    if (!sequelize) throw new Error("Sequelize instance is not available");

    initUserModel(sequelize);
    initParkingSlotModel(sequelize);
    initParkingSessionModel(sequelize);
    initVehicleTypeModel(sequelize);
    initMessageModel(sequelize);
    initUserDevicesModel(sequelize);
    initConversation(sequelize);

    initialized = true;

    return sequelize;
};