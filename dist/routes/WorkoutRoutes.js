"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workoutRoutes = void 0;
const express_1 = require("express");
const WorkoutController_1 = require("../controllers/WorkoutController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const workoutRoutes = (0, express_1.Router)();
exports.workoutRoutes = workoutRoutes;
const workoutController = new WorkoutController_1.WorkoutController();
workoutRoutes.get('/my-workouts', authMiddleware_1.authMiddleware, workoutController.getMyWorkouts);
//# sourceMappingURL=WorkoutRoutes.js.map