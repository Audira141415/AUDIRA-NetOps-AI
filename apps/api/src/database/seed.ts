import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';
import dotenv from 'dotenv';

// Resolve project root dynamically
function findProjectRoot(): string {
  let curr = process.cwd();
  for (let i = 0; i < 5; i++) {
    if (fs.existsSync(path.join(curr, 'pnpm-workspace.yaml'))) {
      return curr;
    }
    const parent = path.dirname(curr);
    if (parent === curr) break;
    curr = parent;
  }
  return process.cwd();
}

const rootDir = findProjectRoot();
dotenv.config({ path: path.join(rootDir, '.env') });

const { Client } = pg;

async function runSeed(): Promise<void> {
  const sqlPath = path.resolve(rootDir, 'database/seeds/seed.sql');

  if (!fs.existsSync(sqlPath)) {
    console.error(`[SEED ERROR] Seed file not found at: ${sqlPath}`);
    process.exit(1);
  }

  const connectionString =
    process.env['DATABASE_URL'] ||
    `postgresql://${process.env['DB_USER'] || 'audira_user'}:${process.env['DB_PASSWORD'] || ''}@${process.env['DB_HOST'] || 'localhost'}:${process.env['DB_PORT'] || '5432'}/${process.env['DB_NAME'] || 'audira_netops'}`;

  console.log(`[SEED] Connecting to PostgreSQL database...`);
  console.log(`[SEED] Target: ${connectionString.replace(/:([^:@]+)@/, ':********@')}`);

  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log(`[SEED] Connection established successfully.`);

    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log(`[SEED] Applying baseline data seeds from database/seeds/seed.sql (${(sql.length / 1024).toFixed(1)} KB)...`);

    const start = Date.now();
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    const elapsed = Date.now() - start;

    console.log(`[SEED SUCCESS] Baseline seed data successfully applied in ${elapsed}ms.`);
  } catch (err: any) {
    console.error(`\n[SEED FAILED] ${err.message}`);
    if (err.code === 'ECONNREFUSED') {
      console.error(`\n[HINT] PostgreSQL server is not running or unreachable.`);
      console.error(`To start the development PostgreSQL service with Docker Compose:`);
      console.error(`  pnpm docker:dev  OR  docker compose -f docker-compose.dev.yml up -d postgres\n`);
    }
    process.exit(1);
  } finally {
    await client.end().catch(() => {});
  }
}

runSeed().catch((err) => {
  console.error('[FATAL]', err);
  process.exit(1);
});
