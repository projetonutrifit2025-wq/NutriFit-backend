"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const UserRoutes_1 = require("./routes/UserRoutes");
const WorkoutRoutes_1 = require("./routes/WorkoutRoutes");
const ProgressRoutes_1 = require("./routes/ProgressRoutes");
const FeedRoutes_1 = require("./routes/FeedRoutes");
const app = (0, express_1.default)();
const port = process.env.PORT || 3333;
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '50mb' }));
app.use('/api/users', UserRoutes_1.userRoutes);
app.use('/api/workouts', WorkoutRoutes_1.workoutRoutes);
app.use('/api/progress', ProgressRoutes_1.progressRoutes);
app.use('/api/feed', FeedRoutes_1.feedRoutes);
app.get('/', (req, res) => {
    res.send(`
    <h1>Backend NutriFit Online 🚀</h1>
    <p>O servidor está a funcionar corretamente.</p>
    <p>Use os endpoints /api/users, /api/workouts, etc.</p>
  `);
});
app.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map