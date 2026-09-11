import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });

import { connectDB } from '../config/db.js';
import { createAdmin } from './createAdmin.js';
import { Question } from '../models/Question.js';
import { PseudocodeQuestion } from '../models/PseudocodeQuestion.js';
import { CodingProblem } from '../models/CodingProblem.js';
import { DebuggingProblem } from '../models/DebuggingProblem.js';
import { AssessmentProfile } from '../models/AssessmentProfile.js';
import { AITask } from '../models/AITask.js';

function loadJson(fileName: string) {
  const fullPath = path.resolve(__dirname, 'data', fileName);
  if (fs.existsSync(fullPath)) {
    return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  }
  return null;
}

async function runAllSeeds() {
  console.log('🌱 Starting Capgemini 2026/2027 Master Database Seeder...\n');

  try {
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // 1. Seed Admin
    console.log('👤 Seeding Admin user...');
    await createAdmin();

    // 2. Seed Assessment Profiles
    const profiles = loadJson('assessment-profiles.json');
    if (profiles && Array.isArray(profiles)) {
      console.log(`\n📋 Seeding ${profiles.length} Assessment Profiles...`);
      for (const p of profiles) {
        await AssessmentProfile.findOneAndUpdate(
          { profileId: p.profileId },
          p,
          { upsert: true, new: true }
        );
      }
      console.log(`  ✅ Successfully seeded ${profiles.length} Assessment Profiles (Profiles A, B, C)`);
    }

    // 3. Seed Technical MCQs (OOP, DSA, DBMS, OS, Networks, Cloud, Git)
    const techMCQs = loadJson('technical-mcq.json');
    if (techMCQs && Array.isArray(techMCQs)) {
      console.log(`\n📝 Seeding ${techMCQs.length} Technical MCQs...`);
      await Question.deleteMany({ category: { $in: ['oops', 'dsa', 'dbms', 'os', 'networks', 'cloud', 'git', 'software-engineering'] } });
      await Question.insertMany(techMCQs);
      console.log(`  ✅ Successfully inserted ${techMCQs.length} Technical MCQs`);
    }

    // 4. Seed AI Literacy Questions
    const aiLiteracy = loadJson('ai-literacy.json');
    if (aiLiteracy && Array.isArray(aiLiteracy)) {
      console.log(`\n🤖 Seeding ${aiLiteracy.length} AI Literacy Questions...`);
      await Question.deleteMany({ category: 'ai-literacy' });
      await Question.insertMany(aiLiteracy);
      console.log(`  ✅ Successfully inserted ${aiLiteracy.length} AI Literacy Questions`);
    }

    // 5. Seed Communication Questions
    const commQuestions = loadJson('communication.json');
    if (commQuestions && Array.isArray(commQuestions)) {
      console.log(`\n🗣️ Seeding ${commQuestions.length} Communication Questions...`);
      await Question.deleteMany({ category: 'communication' });
      await Question.insertMany(commQuestions);
      console.log(`  ✅ Successfully inserted ${commQuestions.length} Communication Questions`);
    }

    // 6. Seed Pseudocode Questions
    const pseudocodeQs = loadJson('pseudocode.json');
    if (pseudocodeQs && Array.isArray(pseudocodeQs)) {
      console.log(`\n💻 Seeding ${pseudocodeQs.length} Pseudocode Questions...`);
      await PseudocodeQuestion.deleteMany({});
      await PseudocodeQuestion.insertMany(pseudocodeQs);
      console.log(`  ✅ Successfully inserted ${pseudocodeQs.length} Pseudocode Questions`);
    }

    // 7. Seed Debugging Problems (including all 6 required candidate problems)
    const debuggingPs = loadJson('debugging.json');
    if (debuggingPs && Array.isArray(debuggingPs)) {
      console.log(`\n🐛 Seeding ${debuggingPs.length} Debugging Problems...`);
      await DebuggingProblem.deleteMany({});
      await DebuggingProblem.insertMany(debuggingPs);
      console.log(`  ✅ Successfully inserted ${debuggingPs.length} Debugging Problems`);
    }

    // 8. Seed Coding Problems (Tier 1, 2, 3)
    const codingPs = loadJson('coding-problems.json');
    if (codingPs && Array.isArray(codingPs)) {
      console.log(`\n💻 Seeding ${codingPs.length} Coding Problems...`);
      await CodingProblem.deleteMany({});
      await CodingProblem.insertMany(codingPs);
      console.log(`  ✅ Successfully inserted ${codingPs.length} Coding Problems`);
    }

    // 9. Seed AI-Assisted Tasks (including Bipartite Graph BFS 2-coloring)
    const aiTasks = loadJson('ai-assisted-tasks.json');
    if (aiTasks && Array.isArray(aiTasks)) {
      console.log(`\n⚡ Seeding ${aiTasks.length} AI-Assisted Tasks & Debugging Challenges...`);
      await AITask.deleteMany({});
      await AITask.insertMany(aiTasks);
      console.log(`  ✅ Successfully inserted ${aiTasks.length} AI-Assisted Tasks`);
    }

    // 10. Report Grand Totals
    const totalQuestions = await Question.countDocuments();
    const totalPseudo = await PseudocodeQuestion.countDocuments();
    const totalDebugging = await DebuggingProblem.countDocuments();
    const totalCoding = await CodingProblem.countDocuments();
    const totalAITasks = await AITask.countDocuments();
    const totalProfiles = await AssessmentProfile.countDocuments();

    console.log('\n==================================================');
    console.log('🎉 CAPGEMINI 2026/2027 QUESTION BANK SEEDED:');
    console.log(`  • Assessment Profiles:     ${totalProfiles}`);
    console.log(`  • General & Tech MCQs:     ${totalQuestions}`);
    console.log(`  • Pseudocode Output Traces:${totalPseudo}`);
    console.log(`  • Debugging Challenges:    ${totalDebugging}`);
    console.log(`  • Coding Judge Problems:   ${totalCoding}`);
    console.log(`  • AI-Assisted Tasks:       ${totalAITasks}`);
    console.log(`  • TOTAL VERIFIED ITEMS:    ${totalQuestions + totalPseudo + totalDebugging + totalCoding + totalAITasks}`);
    console.log('==================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

runAllSeeds();
