"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedRoutes = void 0;
const express_1 = require("express");
const FeedController_1 = require("../controllers/FeedController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const feedRoutes = (0, express_1.Router)();
exports.feedRoutes = feedRoutes;
const feedController = new FeedController_1.FeedController();
feedRoutes.post('/', authMiddleware_1.authMiddleware, feedController.createPost);
feedRoutes.get('/', authMiddleware_1.authMiddleware, feedController.getFeed);
feedRoutes.delete('/:id', authMiddleware_1.authMiddleware, feedController.deletePost);
//# sourceMappingURL=FeedRoutes.js.map