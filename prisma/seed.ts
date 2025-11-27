import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed...');

  // Limpa tudo
  await prisma.workoutExercise.deleteMany({});
  await prisma.workoutTemplate.deleteMany({});
  await prisma.exercise.deleteMany({});

  // Cria Exercícios
  console.log('Criando exercícios...');
  await prisma.exercise.createMany({
    data: [
      // Peito
      { name: 'Supino Reto com Barra', muscleGroup: 'PEITO' },
      { name: 'Supino Inclinado com Halteres', muscleGroup: 'PEITO' },
      { name: 'Crucifixo (Peck Deck)', muscleGroup: 'PEITO' },
      { name: 'Flexão de Braço', muscleGroup: 'PEITO' },
      // Costas
      { name: 'Puxada Alta', muscleGroup: 'COSTAS' },
      { name: 'Remada Curvada', muscleGroup: 'COSTAS' },
      { name: 'Remada Baixa', muscleGroup: 'COSTAS' },
      { name: 'Barra Fixa (Graviton)', muscleGroup: 'COSTAS' },
      // Pernas
      { name: 'Agachamento Livre', muscleGroup: 'QUADRICEPS' },
      { name: 'Leg Press 45', muscleGroup: 'QUADRICEPS' },
      { name: 'Cadeira Extensora', muscleGroup: 'QUADRICEPS' },
      { name: 'Cadeira Flexora', muscleGroup: 'POSTERIOR' },
      { name: 'Stiff', muscleGroup: 'POSTERIOR' },
      { name: 'Panturrilha no Leg', muscleGroup: 'PANTURRILHA' },
      // Ombros
      { name: 'Desenvolvimento com Halteres', muscleGroup: 'OMBROS' },
      { name: 'Elevação Lateral', muscleGroup: 'OMBROS' },
      { name: 'Elevação Frontal', muscleGroup: 'OMBROS' },
      // Braços
      { name: 'Rosca Direta', muscleGroup: 'BICEPS' },
      { name: 'Rosca Martelo', muscleGroup: 'BICEPS' },
      { name: 'Tríceps na Polia (Corda)', muscleGroup: 'TRICEPS' },
      { name: 'Tríceps Testa', muscleGroup: 'TRICEPS' },
      // Cardio / Core
      { name: 'Esteira (Corrida Leve)', muscleGroup: 'CARDIO' },
      { name: 'Esteira (Caminhada Inclinada)', muscleGroup: 'CARDIO' },
      { name: 'Bicicleta Ergométrica', muscleGroup: 'CARDIO' },
      { name: 'Prancha Abdominal', muscleGroup: 'ABDOMEN' },
      { name: 'Abdominal Supra', muscleGroup: 'ABDOMEN' },
      { name: 'Burpees', muscleGroup: 'CARDIO' },
    ],
  });

  console.log('Criando templates de treino...');

  // --- GANHAR MASSA (Hipertrofia) ---

  // Iniciante
  await createWorkout('Full Body A - Iniciante', 'GANHAR_MASSA', 'INICIANTE', 'SEGUNDA', [
    { name: 'Supino Reto com Barra', sets: '3', reps: '12', rest: '60s' },
    { name: 'Puxada Alta', sets: '3', reps: '12', rest: '60s' },
    { name: 'Agachamento Livre', sets: '3', reps: '12', rest: '90s' },
    { name: 'Desenvolvimento com Halteres', sets: '3', reps: '12', rest: '60s' },
    { name: 'Prancha Abdominal', sets: '3', reps: '30s', rest: '45s' },
  ]);
  await createWorkout('Full Body A - Iniciante', 'GANHAR_MASSA', 'INICIANTE', 'QUARTA', [
    { name: 'Supino Reto com Barra', sets: '3', reps: '12', rest: '60s' },
    { name: 'Puxada Alta', sets: '3', reps: '12', rest: '60s' },
    { name: 'Agachamento Livre', sets: '3', reps: '12', rest: '90s' },
    { name: 'Desenvolvimento com Halteres', sets: '3', reps: '12', rest: '60s' },
    { name: 'Prancha Abdominal', sets: '3', reps: '30s', rest: '45s' },
  ]);
  await createWorkout('Full Body A - Iniciante', 'GANHAR_MASSA', 'INICIANTE', 'SEXTA', [
    { name: 'Supino Reto com Barra', sets: '3', reps: '12', rest: '60s' },
    { name: 'Puxada Alta', sets: '3', reps: '12', rest: '60s' },
    { name: 'Agachamento Livre', sets: '3', reps: '12', rest: '90s' },
    { name: 'Desenvolvimento com Halteres', sets: '3', reps: '12', rest: '60s' },
    { name: 'Prancha Abdominal', sets: '3', reps: '30s', rest: '45s' },
  ]);

  // Intermediário
  await createWorkout('Treino A (Superior) - Intermediário', 'GANHAR_MASSA', 'INTERMEDIARIO', 'SEGUNDA', [
    { name: 'Supino Reto com Barra', sets: '4', reps: '8-10', rest: '90s' },
    { name: 'Supino Inclinado com Halteres', sets: '3', reps: '10-12', rest: '60s' },
    { name: 'Remada Curvada', sets: '4', reps: '8-10', rest: '90s' },
    { name: 'Puxada Alta', sets: '3', reps: '10-12', rest: '60s' },
    { name: 'Desenvolvimento com Halteres', sets: '3', reps: '10-12', rest: '60s' },
  ]);
  await createWorkout('Treino B (Inferior) - Intermediário', 'GANHAR_MASSA', 'INTERMEDIARIO', 'TERCA', [
    { name: 'Agachamento Livre', sets: '4', reps: '8-10', rest: '120s' },
    { name: 'Leg Press 45', sets: '3', reps: '10-12', rest: '90s' },
    { name: 'Cadeira Extensora', sets: '3', reps: '12-15', rest: '60s' },
    { name: 'Stiff', sets: '3', reps: '10-12', rest: '90s' },
    { name: 'Panturrilha no Leg', sets: '4', reps: '15', rest: '45s' },
  ]);
  await createWorkout('Treino A (Superior) - Intermediário', 'GANHAR_MASSA', 'INTERMEDIARIO', 'QUINTA', [
    { name: 'Supino Reto com Barra', sets: '4', reps: '8-10', rest: '90s' },
    { name: 'Supino Inclinado com Halteres', sets: '3', reps: '10-12', rest: '60s' },
    { name: 'Remada Curvada', sets: '4', reps: '8-10', rest: '90s' },
    { name: 'Puxada Alta', sets: '3', reps: '10-12', rest: '60s' },
    { name: 'Desenvolvimento com Halteres', sets: '3', reps: '10-12', rest: '60s' },
  ]);
  await createWorkout('Treino B (Inferior) - Intermediário', 'GANHAR_MASSA', 'INTERMEDIARIO', 'SEXTA', [
    { name: 'Agachamento Livre', sets: '4', reps: '8-10', rest: '120s' },
    { name: 'Leg Press 45', sets: '3', reps: '10-12', rest: '90s' },
    { name: 'Cadeira Extensora', sets: '3', reps: '12-15', rest: '60s' },
    { name: 'Stiff', sets: '3', reps: '10-12', rest: '90s' },
    { name: 'Panturrilha no Leg', sets: '4', reps: '15', rest: '45s' },
  ]);

  // Avançado
  await createWorkout('Push (Empurrar) - Avançado', 'GANHAR_MASSA', 'AVANCADO', 'SEGUNDA', [
    { name: 'Supino Reto com Barra', sets: '5', reps: '5-8', rest: '120s' },
    { name: 'Supino Inclinado com Halteres', sets: '4', reps: '8-10', rest: '90s' },
    { name: 'Crucifixo (Peck Deck)', sets: '3', reps: '12-15', rest: '60s' },
    { name: 'Desenvolvimento com Halteres', sets: '4', reps: '8-10', rest: '90s' },
    { name: 'Elevação Lateral', sets: '3', reps: '15', rest: '45s' },
    { name: 'Tríceps Testa', sets: '3', reps: '10-12', rest: '60s' },
  ]);
  await createWorkout('Pull (Puxar) - Avançado', 'GANHAR_MASSA', 'AVANCADO', 'TERCA', [
    { name: 'Puxada Alta', sets: '4', reps: '8-10', rest: '90s' },
    { name: 'Remada Curvada', sets: '4', reps: '8-10', rest: '90s' },
    { name: 'Remada Baixa', sets: '3', reps: '10-12', rest: '60s' },
    { name: 'Barra Fixa (Graviton)', sets: '3', reps: 'Falha', rest: '90s' },
    { name: 'Rosca Direta', sets: '3', reps: '10-12', rest: '60s' },
    { name: 'Rosca Martelo', sets: '3', reps: '10-12', rest: '60s' },
  ]);
  await createWorkout('Legs (Pernas) - Avançado', 'GANHAR_MASSA', 'AVANCADO', 'QUARTA', [
    { name: 'Agachamento Livre', sets: '5', reps: '5-8', rest: '120s' },
    { name: 'Leg Press 45', sets: '4', reps: '8-10', rest: '90s' },
    { name: 'Cadeira Extensora', sets: '3', reps: '12-15', rest: '60s' },
    { name: 'Stiff', sets: '4', reps: '8-10', rest: '90s' },
    { name: 'Cadeira Flexora', sets: '3', reps: '12-15', rest: '60s' },
    { name: 'Panturrilha no Leg', sets: '4', reps: '15', rest: '45s' },
  ]);
  await createWorkout('Push (Empurrar) - Avançado', 'GANHAR_MASSA', 'AVANCADO', 'QUINTA', [
    { name: 'Supino Reto com Barra', sets: '5', reps: '5-8', rest: '120s' },
    { name: 'Supino Inclinado com Halteres', sets: '4', reps: '8-10', rest: '90s' },
    { name: 'Crucifixo (Peck Deck)', sets: '3', reps: '12-15', rest: '60s' },
    { name: 'Desenvolvimento com Halteres', sets: '4', reps: '8-10', rest: '90s' },
    { name: 'Elevação Lateral', sets: '3', reps: '15', rest: '45s' },
    { name: 'Tríceps Testa', sets: '3', reps: '10-12', rest: '60s' },
  ]);
  await createWorkout('Pull (Puxar) - Avançado', 'GANHAR_MASSA', 'AVANCADO', 'SEXTA', [
    { name: 'Puxada Alta', sets: '4', reps: '8-10', rest: '90s' },
    { name: 'Remada Curvada', sets: '4', reps: '8-10', rest: '90s' },
    { name: 'Remada Baixa', sets: '3', reps: '10-12', rest: '60s' },
    { name: 'Barra Fixa (Graviton)', sets: '3', reps: 'Falha', rest: '90s' },
    { name: 'Rosca Direta', sets: '3', reps: '10-12', rest: '60s' },
    { name: 'Rosca Martelo', sets: '3', reps: '10-12', rest: '60s' },
  ]);

  // --- PERDER PESO (Definição/Cardio) ---

  // Iniciante
  await createWorkout('Circuito Leve - Iniciante', 'PERDER_PESO', 'INICIANTE', 'SEGUNDA', [
    { name: 'Esteira (Caminhada Inclinada)', sets: '1', reps: '20min', rest: '0s' },
    { name: 'Agachamento Livre', sets: '3', reps: '15', rest: '45s' },
    { name: 'Flexão de Braço', sets: '3', reps: '10-12', rest: '45s' },
    { name: 'Abdominal Supra', sets: '3', reps: '15', rest: '30s' },
  ]);
  await createWorkout('Circuito Leve - Iniciante', 'PERDER_PESO', 'INICIANTE', 'QUARTA', [
    { name: 'Esteira (Caminhada Inclinada)', sets: '1', reps: '20min', rest: '0s' },
    { name: 'Agachamento Livre', sets: '3', reps: '15', rest: '45s' },
    { name: 'Flexão de Braço', sets: '3', reps: '10-12', rest: '45s' },
    { name: 'Abdominal Supra', sets: '3', reps: '15', rest: '30s' },
  ]);
  await createWorkout('Circuito Leve - Iniciante', 'PERDER_PESO', 'INICIANTE', 'SEXTA', [
    { name: 'Esteira (Caminhada Inclinada)', sets: '1', reps: '20min', rest: '0s' },
    { name: 'Agachamento Livre', sets: '3', reps: '15', rest: '45s' },
    { name: 'Flexão de Braço', sets: '3', reps: '10-12', rest: '45s' },
    { name: 'Abdominal Supra', sets: '3', reps: '15', rest: '30s' },
  ]);

  // Intermediário
  await createWorkout('HIIT & Full Body - Intermediário', 'PERDER_PESO', 'INTERMEDIARIO', 'SEGUNDA', [
    { name: 'Esteira (Corrida Leve)', sets: '1', reps: '10min', rest: '60s' },
    { name: 'Burpees', sets: '3', reps: '12', rest: '60s' },
    { name: 'Agachamento Livre', sets: '3', reps: '15-20', rest: '45s' },
    { name: 'Remada Baixa', sets: '3', reps: '15', rest: '45s' },
    { name: 'Prancha Abdominal', sets: '3', reps: '45s', rest: '30s' },
    { name: 'Bicicleta Ergométrica', sets: '1', reps: '15min', rest: '0s' },
  ]);
  await createWorkout('HIIT & Full Body - Intermediário', 'PERDER_PESO', 'INTERMEDIARIO', 'QUARTA', [
    { name: 'Esteira (Corrida Leve)', sets: '1', reps: '10min', rest: '60s' },
    { name: 'Burpees', sets: '3', reps: '12', rest: '60s' },
    { name: 'Agachamento Livre', sets: '3', reps: '15-20', rest: '45s' },
    { name: 'Remada Baixa', sets: '3', reps: '15', rest: '45s' },
    { name: 'Prancha Abdominal', sets: '3', reps: '45s', rest: '30s' },
    { name: 'Bicicleta Ergométrica', sets: '1', reps: '15min', rest: '0s' },
  ]);
  await createWorkout('HIIT & Full Body - Intermediário', 'PERDER_PESO', 'INTERMEDIARIO', 'SEXTA', [
    { name: 'Esteira (Corrida Leve)', sets: '1', reps: '10min', rest: '60s' },
    { name: 'Burpees', sets: '3', reps: '12', rest: '60s' },
    { name: 'Agachamento Livre', sets: '3', reps: '15-20', rest: '45s' },
    { name: 'Remada Baixa', sets: '3', reps: '15', rest: '45s' },
    { name: 'Prancha Abdominal', sets: '3', reps: '45s', rest: '30s' },
    { name: 'Bicicleta Ergométrica', sets: '1', reps: '15min', rest: '0s' },
  ]);

  // Avançado
  await createWorkout('Metabolic Conditioning - Avançado', 'PERDER_PESO', 'AVANCADO', 'SEGUNDA', [
    { name: 'Burpees', sets: '4', reps: '20', rest: '30s' },
    { name: 'Agachamento Livre', sets: '4', reps: '20', rest: '30s' },
    { name: 'Flexão de Braço', sets: '4', reps: '20', rest: '30s' },
    { name: 'Puxada Alta', sets: '4', reps: '20', rest: '30s' },
    { name: 'Esteira (Corrida Leve)', sets: '1', reps: '20min', rest: '0s' },
  ]);
  await createWorkout('Metabolic Conditioning - Avançado', 'PERDER_PESO', 'AVANCADO', 'TERCA', [
    { name: 'Burpees', sets: '4', reps: '20', rest: '30s' },
    { name: 'Agachamento Livre', sets: '4', reps: '20', rest: '30s' },
    { name: 'Flexão de Braço', sets: '4', reps: '20', rest: '30s' },
    { name: 'Puxada Alta', sets: '4', reps: '20', rest: '30s' },
    { name: 'Esteira (Corrida Leve)', sets: '1', reps: '20min', rest: '0s' },
  ]);
  await createWorkout('Metabolic Conditioning - Avançado', 'PERDER_PESO', 'AVANCADO', 'QUINTA', [
    { name: 'Burpees', sets: '4', reps: '20', rest: '30s' },
    { name: 'Agachamento Livre', sets: '4', reps: '20', rest: '30s' },
    { name: 'Flexão de Braço', sets: '4', reps: '20', rest: '30s' },
    { name: 'Puxada Alta', sets: '4', reps: '20', rest: '30s' },
    { name: 'Esteira (Corrida Leve)', sets: '1', reps: '20min', rest: '0s' },
  ]);
  await createWorkout('Metabolic Conditioning - Avançado', 'PERDER_PESO', 'AVANCADO', 'SEXTA', [
    { name: 'Burpees', sets: '4', reps: '20', rest: '30s' },
    { name: 'Agachamento Livre', sets: '4', reps: '20', rest: '30s' },
    { name: 'Flexão de Braço', sets: '4', reps: '20', rest: '30s' },
    { name: 'Puxada Alta', sets: '4', reps: '20', rest: '30s' },
    { name: 'Esteira (Corrida Leve)', sets: '1', reps: '20min', rest: '0s' },
  ]);

  // --- MANTER SAÚDE (Bem-estar) ---

  // Todos os níveis (foco em mobilidade e força geral)
  await createWorkout('Funcional & Saúde - Geral', 'MANTER_SAUDE', 'INICIANTE', 'SEGUNDA', [
    { name: 'Esteira (Caminhada Inclinada)', sets: '1', reps: '15min', rest: '0s' },
    { name: 'Agachamento Livre', sets: '3', reps: '12', rest: '60s' },
    { name: 'Remada Baixa', sets: '3', reps: '12', rest: '60s' },
    { name: 'Prancha Abdominal', sets: '3', reps: '30s', rest: '30s' },
  ]);
  await createWorkout('Funcional & Saúde - Geral', 'MANTER_SAUDE', 'INICIANTE', 'QUARTA', [
    { name: 'Esteira (Caminhada Inclinada)', sets: '1', reps: '15min', rest: '0s' },
    { name: 'Agachamento Livre', sets: '3', reps: '12', rest: '60s' },
    { name: 'Remada Baixa', sets: '3', reps: '12', rest: '60s' },
    { name: 'Prancha Abdominal', sets: '3', reps: '30s', rest: '30s' },
  ]);

  await createWorkout('Força & Mobilidade - Intermediário', 'MANTER_SAUDE', 'INTERMEDIARIO', 'SEGUNDA', [
    { name: 'Agachamento Livre', sets: '3', reps: '10', rest: '60s' },
    { name: 'Supino Reto com Barra', sets: '3', reps: '10', rest: '60s' },
    { name: 'Puxada Alta', sets: '3', reps: '10', rest: '60s' },
    { name: 'Esteira (Corrida Leve)', sets: '1', reps: '20min', rest: '0s' },
  ]);
  await createWorkout('Força & Mobilidade - Intermediário', 'MANTER_SAUDE', 'INTERMEDIARIO', 'QUINTA', [
    { name: 'Agachamento Livre', sets: '3', reps: '10', rest: '60s' },
    { name: 'Supino Reto com Barra', sets: '3', reps: '10', rest: '60s' },
    { name: 'Puxada Alta', sets: '3', reps: '10', rest: '60s' },
    { name: 'Esteira (Corrida Leve)', sets: '1', reps: '20min', rest: '0s' },
  ]);

  // Avançado
  await createWorkout('Performance & Longevidade - Avançado', 'MANTER_SAUDE', 'AVANCADO', 'SEGUNDA', [
    { name: 'Agachamento Livre', sets: '4', reps: '8', rest: '90s' },
    { name: 'Supino Reto com Barra', sets: '4', reps: '8', rest: '90s' },
    { name: 'Remada Curvada', sets: '4', reps: '8', rest: '90s' },
    { name: 'Desenvolvimento com Halteres', sets: '3', reps: '10', rest: '60s' },
    { name: 'Esteira (Corrida Leve)', sets: '1', reps: '25min', rest: '0s' },
  ]);
  await createWorkout('Performance & Longevidade - Avançado', 'MANTER_SAUDE', 'AVANCADO', 'QUINTA', [
    { name: 'Agachamento Livre', sets: '4', reps: '8', rest: '90s' },
    { name: 'Supino Reto com Barra', sets: '4', reps: '8', rest: '90s' },
    { name: 'Remada Curvada', sets: '4', reps: '8', rest: '90s' },
    { name: 'Desenvolvimento com Halteres', sets: '3', reps: '10', rest: '60s' },
    { name: 'Esteira (Corrida Leve)', sets: '1', reps: '25min', rest: '0s' },
  ]);

  console.log('Seed concluído!');
}

// Helper para criar treinos de forma mais limpa
async function createWorkout(
  name: string,
  goal: string,
  level: string,
  dayOfWeek: string,
  exercises: { name: string, sets: string, reps: string, rest: string }[]
) {
  await prisma.workoutTemplate.create({
    data: {
      name,
      goal,
      level,
      dayOfWeek,
      exercises: {
        create: exercises.map(ex => ({
          sets: ex.sets,
          reps: ex.reps,
          rest: ex.rest,
          exercise: { connect: { name: ex.name } }
        }))
      }
    }
  });
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });