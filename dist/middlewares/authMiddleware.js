"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = require("jsonwebtoken");
function authMiddleware(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: 'Token não enviado.' });
    }
    const [, token] = authorization.split(' ');
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret)
            throw new Error('JWT_SECRET não definido');
        const decoded = (0, jsonwebtoken_1.verify)(token, secret);
        const { id } = decoded;
        req.userId = id;
        return next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Token inválido.' });
    }
}
//# sourceMappingURL=authMiddleware.js.map