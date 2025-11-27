"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutController = void 0;
const prisma_1 = require("../prisma");
class WorkoutController {
    async getMyWorkouts(req, res) {
        const userId = req.userId;
        try {
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: userId },
                select: { goal: true, level: true }
            });
            if (!user)
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            const workouts = await prisma_1.prisma.workoutTemplate.findMany({
                where: { goal: user.goal, level: user.level },
                include: {
                    exercises: {
                        include: { exercise: true }
                    }
                }
            });
            return res.status(200).json(workouts);
        }
        catch {
            return res.status(500).json({ error: 'Erro ao buscar treinos.' });
        }
    }
}
exports.WorkoutController = WorkoutController;
//# sourceMappingURL=WorkoutController.js.map