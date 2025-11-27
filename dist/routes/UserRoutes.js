"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const userRoutes = (0, express_1.Router)();
exports.userRoutes = userRoutes;
const userController = new UserController_1.UserController();
userRoutes.post('/register', userController.register);
userRoutes.post('/login', userController.login);
userRoutes.post('/:id/follow', authMiddleware_1.authMiddleware, userController.followUser);
userRoutes.delete('/:id/unfollow', authMiddleware_1.authMiddleware, userController.unfollowUser);
userRoutes.get('/me', authMiddleware_1.authMiddleware, userController.me);
userRoutes.put('/me', authMiddleware_1.authMiddleware, userController.updateProfile);
userRoutes.post('/weight', authMiddleware_1.authMiddleware, userController.addWeight);
userRoutes.get('/weight/history', authMiddleware_1.authMiddleware, userController.getWeightHistory);
//# sourceMappingURL=UserRoutes.js.map