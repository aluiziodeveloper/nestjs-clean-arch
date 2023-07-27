import { execSync } from 'node:child_process'

export function setupPrismaTests() {
  execSync(
    'npx dotenv-cli -e .env.test -- npx prisma migrate deploy --schema ./src/shared/infrastructure/database/prisma/schema.prisma',
  )
}
