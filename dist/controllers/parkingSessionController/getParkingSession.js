// Models
import { ParkingSession } from "../../models/parking-sessions.js";
import { User, userRole } from "../../models/user.js";
export const getParkingSession = async (req, res, next) => {
    const sessionId = Number(req.params.sessionId);
    try {
        if (isNaN(sessionId)) {
            return res.status(400).json({ message: "Invalid session ID. Session ID must be a number." });
        }
        ;
        const currentUser = await User.findByPk(req.userId);
        if (!currentUser) {
            return res.status(404).json({ message: "We couldn't find the current logged-in user. Please ensure you are logged in and try again." });
        }
        ;
        if (!currentUser.isAdmin && currentUser.userRole !== userRole.ADMIN) {
            return res.status(403).json({ message: "You do not have permission to access this parking session. Please ensure you are an admin user and try again. If you believe this is an error, please contact support." });
        }
        ;
        const parkingSession = await ParkingSession.findByPk(sessionId);
        if (!parkingSession) {
            return res.status(404).json({ message: "Parking session not found. Please check the session ID and try again." });
        }
        return res.status(200).json({ message: "Parking session retrieved successfully.", parkingSession });
    }
    catch (err) {
        next(err);
    }
};
