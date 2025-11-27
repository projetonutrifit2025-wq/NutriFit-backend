"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.progressRoutes = void 0;
const express_1 = require("express");
const ProgressController_1 = require("../controllers/ProgressController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const progressRoutes = (0, express_1.Router)();
exports.progressRoutes = progressRoutes;
const progressController = new ProgressController_1.ProgressController();
progressRoutes.post('/', authMiddleware_1.authMiddleware, progressController.addProgress);
progressRoutes.get('/', authMiddleware_1.authMiddleware, progressController.getProgressHistory);
//# sourceMappingURL=ProgressRoutes.js.map