"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const prisma_1 = require("../prisma");
const UserService_1 = require("../services/UserService");
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserController {
    async register(req, res) {
        try {
            console.log('Register Request Body:', req.body); // DEBUG
            const schema = zod_1.z.object({
                name: zod_1.z.string(),
                email: zod_1.z.string().email(),
                password: zod_1.z.string().min(6),
                birthDate: zod_1.z.string(), // ISO string
                weight: zod_1.z.number(),
                height: zod_1.z.number(),
                goal: zod_1.z.string(),
                profileImage: zod_1.z.string().optional(),
            });
            const { name, email, password, birthDate, weight, height, goal, profileImage } = schema.parse(req.body);
            const userExists = await prisma_1.prisma.user.findUnique({ where: { email } });
            if (userExists)
                return res.status(400).json({ error: 'User already exists' });
            const hashedPassword = await bcryptjs_1.default.hash(password, 6);
            const birthDateObj = new Date(birthDate);
            if (isNaN(birthDateObj.getTime())) {
                return res.status(400).json({ error: 'Invalid birthDate format' });
            }
            const level = (0, UserService_1.calculateUserLevel)(birthDateObj, weight, height);
            const user = await prisma_1.prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    birthDate: birthDateObj,
                    weight,
                    height,
                    goal,
                    level,
                    profileImage,
                },
            });
            // Registrar peso inicial
            await prisma_1.prisma.userProgress.create({
                data: {
                    userId: user.id,
                    weight: user.weight,
                }
            });
            const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            return res.json({ user, token });
        }
        catch (error) {
            console.error('Register Error:', error); // DEBUG
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({ error: error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ') });
            }
            return res.status(400).json({ error: error.message || 'Registration failed' });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await prisma_1.prisma.user.findUnique({ where: { email } });
            if (!user)
                return res.status(400).json({ error: 'User not found' });
            const validPassword = await bcryptjs_1.default.compare(password, user.password);
            if (!validPassword)
                return res.status(400).json({ error: 'Invalid password' });
            const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            return res.json({ user, token });
        }
        catch (error) {
            return res.status(400).json({ error });
        }
    }
    async followUser(req, res) {
        const followerId = req.userId;
        const { id: followingId } = req.params;
        if (followerId === followingId)
            return res.status(400).json({ error: 'Não pode seguir a si mesmo.' });
        try {
            await prisma_1.prisma.follows.create({ data: { followerId, followingId } });
            return res.status(201).json({ message: 'Seguindo.' });
        }
        catch {
            return res.status(400).json({ error: 'Erro ao seguir.' });
        }
    }
    async unfollowUser(req, res) {
        const followerId = req.userId;
        const { id: followingId } = req.params;
        try {
            await prisma_1.prisma.follows.delete({ where: { followerId_followingId: { followerId, followingId } } });
            return res.status(200).json({ message: 'Deixou de seguir.' });
        }
        catch {
            return res.status(400).json({ error: 'Erro ao deixar de seguir.' });
        }
    }
    async me(req, res) {
        try {
            const userId = req.userId;
            console.log('Me Endpoint - UserID:', userId); // DEBUG
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: userId },
                include: {
                    _count: {
                        select: { followers: true }
                    }
                }
            });
            console.log('Me Endpoint - User Found:', user ? 'Yes' : 'No'); // DEBUG
            if (!user)
                return res.status(404).json({ error: 'User not found' });
            const treinos = await prisma_1.prisma.workoutTemplate.count({
                where: {
                    goal: user.goal,
                    level: user.level
                }
            });
            console.log('Me Endpoint - Treinos Count:', treinos); // DEBUG
            // Calcular idade
            const today = new Date();
            const birthDate = new Date(user.birthDate);
            console.log('Me Endpoint - BirthDate:', birthDate); // DEBUG
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            console.log('Me Endpoint - Calculated Age:', age); // DEBUG
            return res.json({
                ...user,
                age, // Retorna idade calculada para o frontend
                stats: {
                    treinos,
                    seguidores: user._count.followers,
                    peso: `${user.weight}kg`
                }
            });
        }
        catch (error) {
            console.error('Me Endpoint Error:', error); // DEBUG
            return res.status(500).json({ error: 'Internal server error', details: error.message });
        }
    }
    async updateProfile(req, res) {
        try {
            const userId = req.userId;
            const { name, goal, height, birthDate, profileImage } = req.body;
            const user = await prisma_1.prisma.user.update({
                where: { id: userId },
                data: {
                    name,
                    goal,
                    height: Number(height),
                    birthDate: birthDate ? new Date(birthDate) : undefined,
                    profileImage
                }
            });
            return res.json(user);
        }
        catch (error) {
            return res.status(500).json({ error: 'Error updating profile' });
        }
    }
    async addWeight(req, res) {
        try {
            const userId = req.userId;
            const { weight } = req.body;
            if (!weight)
                return res.status(400).json({ error: 'Weight is required' });
            const user = await prisma_1.prisma.user.update({
                where: { id: userId },
                data: { weight: Number(weight) }
            });
            await prisma_1.prisma.userProgress.create({
                data: {
                    userId: userId,
                    weight: Number(weight)
                }
            });
            return res.json(user);
        }
        catch (error) {
            return res.status(500).json({ error: 'Error adding weight' });
        }
    }
    async getWeightHistory(req, res) {
        try {
            const userId = req.userId;
            const history = await prisma_1.prisma.userProgress.findMany({
                where: { userId },
                orderBy: { date: 'desc' }
            });
            return res.json(history);
        }
        catch (error) {
            return res.status(500).json({ error: 'Error fetching history' });
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map