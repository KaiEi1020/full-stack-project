import * as dotenv from 'dotenv';
import { JobSchema } from './src/modules/recruitment/infrastructure/persistence/schemas/job.schema';
// import { UserEntity } from './src/modules/user/infrastructure/persistence/entities/user.entity';
// import { JobEntity } from './src/modules/recruitment/infrastructure/persistence/entities/job.entity';
// import { ResumeEntity } from './src/modules/recruitment/infrastructure/persistence/entities/resume.entity';
// import { JobApplicationEntity } from './src/modules/recruitment/infrastructure/persistence/entities/job-application.entity';
import { createMikroOrmConfig } from './src/core/database/mikro-orm.config';

dotenv.config();

export default {
  ...createMikroOrmConfig({
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 5432,
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || '',
    dbName: process.env.DATABASE_NAME || 'app_db',
    debug: process.env.NODE_ENV !== 'production',
  }),
  entities: [JobSchema],
};
