import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed...');
  
  // Limpa tudo
  await prisma.workoutExercise.deleteMany({});
  await prisma.workoutTemplate.deleteMany({});
  await prisma.exercise.deleteMany({});

  // Cria Exercícios (Usando String no muscleGroup)
  await prisma.exercise.createMany({
    data: [
      { name: 'Supino Reto com Barra', muscleGroup: 'PEITO' },
      { name: 'Supino Inclinado com Halteres', muscleGroup: 'PEITO' },
      { name: 'Crucifixo (Peck Deck)', muscleGroup: 'PEITO' },
      { name: 'Tríceps na Polia (Corda)', muscleGroup: 'TRICEPS' },
      { name: 'Agachamento Livre', muscleGroup: 'QUADRICEPS' },
      { name: 'Leg Press 45', muscleGroup: 'QUADRICEPS' },
      { name: 'Cadeira Extensora', muscleGroup: 'QUADRICEPS' },
      { name: 'Cadeira Flexora', muscleGroup: 'POSTERIOR' },
    ],
   
  });

  // Cria Templates (Usando Strings em goal e level)
  console.log('Criando treinos...');

  // Molde 1
  await prisma.workoutTemplate.create({
    data: {
      name: 'Treino A: Peito e Tríceps',
      goal: 'GANHAR_MASSA',
      level: 'INICIANTE',
      exercises: {
        create: [
          { sets: '3', reps: '8-12', rest: '60s', exercise: { connect: { name: 'Supino Reto com Barra' } } },
          { sets: '3', reps: '10-12', rest: '60s', exercise: { connect: { name: 'Supino Inclinado com Halteres' } } },
          { sets: '3', reps: '10-12', rest: '90s', exercise: { connect: { name: 'Tríceps na Polia (Corda)' } } },
        ],
      },
    },
  });

  // Molde 2
  await prisma.workoutTemplate.create({
    data: {
      name: 'Treino B: Pernas (Foco Quadríceps)',
      goal: 'GANHAR_MASSA',
      level: 'INICIANTE',
      exercises: {
        create: [
          { sets: '3', reps: '8-10', rest: '90s', exercise: { connect: { name: 'Agachamento Livre' } } },
          { sets: '3', reps: '10-12', rest: '60s', exercise: { connect: { name: 'Leg Press 45' } } },
        ],
      },
    },
  });

  console.log('Seed concluído!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });