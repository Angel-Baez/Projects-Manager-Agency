import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { migrationClient } from './index';

async function main() {
  console.log('🚀 Running migrations...');

  const db = drizzle(migrationClient);

  await migrate(db, {
    migrationsFolder: './drizzle',
  });

  console.log('✅ Migrations completed successfully!');

  await migrationClient.end();
}

main().catch((error) => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});
