import fs from 'fs';
import path from 'path';
import DebuggingProblem from '../models/DebuggingProblem.js';

export const seedDebuggingProblems = async () => {
  try {
    const jsonPath = path.resolve(__dirname, 'data/debugging.json');
    if (!fs.existsSync(jsonPath)) {
      console.warn('debugging.json not found at:', jsonPath);
      return;
    }
    const problems = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    // Synchronize fresh assessment-grade multi-language problems
    await DebuggingProblem.deleteMany({});
    await DebuggingProblem.insertMany(problems);
    console.log(`Seeded ${problems.length} multi-language debugging problems successfully.`);
  } catch (err: any) {
    console.error('Error seeding debugging problems:', err.message);
  }
};

export default seedDebuggingProblems;
