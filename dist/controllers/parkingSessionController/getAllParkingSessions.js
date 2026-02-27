// Model
import { ParkingSession } from '../../models/parking-sessions.js';
import { User, userRole } from '../../models/user.js';
export const getAllParkingSessions = async (req, res, next) => {
    try {
        const currentUser = await User.findByPk(req.userId);
        if (!currentUser) {
            return res.status(404).json({ message: "We couldn't find the current logged-in user. Please ensure you are logged in and try again." });
        }
        ;
        if (!currentUser.isAdmin && currentUser.userRole !== userRole.SUPER) {
            return res.status(403).json({ message: "You do not have permission to create parking sessions. Please ensure you are an admin user and try again. If you believe this is an error, please contact support." });
        }
        ;
        const parkingSessions = await ParkingSession.findAll();
        return res.status(200).json({ message: "Parking sessions retrieved successfully.", parkingSessions });
    }
    catch (err) {
        next(err);
    }
};
