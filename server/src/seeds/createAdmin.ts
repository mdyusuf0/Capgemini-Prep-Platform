import { User } from '../models/User.js';
import { env } from '../config/env.js';

export const createAdmin = async () => {
  const adminEmail = env.ADMIN_EMAIL;
  const adminPassword = env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log('  ⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not set, skipping admin creation.');
    return;
  }

  const existingAdmin = await User.findOne({ email: adminEmail });

  if (existingAdmin) {
    console.log(`  ℹ️  Admin user "${adminEmail}" already exists.`);
  } else {
    const admin = new User({
      email: adminEmail,
      passwordHash: adminPassword,
      displayName: 'Admin',
      role: 'admin',
    });

    await admin.save();
    console.log(`  ✅ Admin user created: ${adminEmail}`);
  }
};

// Allow running standalone: tsx src/seeds/createAdmin.ts
const isMainModule = process.argv[1]?.includes('createAdmin');
if (isMainModule) {
  import('../config/db.js').then(async ({ connectDB }) => {
    await connectDB();
    await createAdmin();
    process.exit(0);
  }).catch(err => {
    console.error('Failed:', err);
    process.exit(1);
  });
}
