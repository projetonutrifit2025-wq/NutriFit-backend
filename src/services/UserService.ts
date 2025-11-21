

export function calculateUserLevel(age: number, weight: number, height: number): string {
  // Retornamos strings puras agora
  if (age < 18 || weight < 60) return "INICIANTE";
  if (age > 40 || weight > 90) return "INTERMEDIARIO";
  return "AVANCADO";
}