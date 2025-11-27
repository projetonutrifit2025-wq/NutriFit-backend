"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressController = void 0;
const prisma_1 = require("../prisma");
class ProgressController {
    async addProgress(req, res) {
        const userId = req.userId;
        const { weight } = req.body;
        try {
            const newProgress = await prisma_1.prisma.userProgress.create({
                data: { weight: Number(weight), userId }
            });
            return res.status(201).json(newProgress);
        }
        catch {
            return res.status(500).json({ error: 'Erro ao salvar progresso.' });
        }
    }
    async getProgressHistory(req, res) {
        const userId = req.userId;
        const history = await prisma_1.prisma.userProgress.findMany({
            where: { userId },
            orderBy: { date: 'desc' }
        });
        return res.status(200).json(history);
    }
}
exports.ProgressController = ProgressController;
//# sourceMappingURL=ProgressController.js.map