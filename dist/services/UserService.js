"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateUserLevel = calculateUserLevel;
function calculateUserLevel(birthDate, weight, height) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    // Retornamos strings puras agora
    if (age < 18 || weight < 60)
        return "INICIANTE";
    if (age > 40 || weight > 90)
        return "INTERMEDIARIO";
    return "AVANCADO";
}
//# sourceMappingURL=UserService.js.map