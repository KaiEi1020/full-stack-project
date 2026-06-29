import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { ReflectMetadataProvider } from '@mikro-orm/decorators/legacy';

export const createMikroOrmConfig = (options: {
  host: string;
  port: number;
  user: string;
  password: string;
  dbName: string;
  debug: boolean;
}) => {
  return defineConfig({
    driver: PostgreSqlDriver,
    host: options.host,
    port: options.port,
    user: options.user,
    password: options.password,
    dbName: options.dbName,
    debug: options.debug,
    metadataProvider: ReflectMetadataProvider,
    migrations: {
      path: './migrations',
      pathTs: './migrations',
      glob: '!(*.d).{js,ts}',
      transactional: true,
      disableForeignKeys: true,
      allOrNothing: true,
      dropTables: false,
      safe: false,
      snapshot: true,
      emit: 'ts',
      fileName: (timestamp: string, name?: string) => {
        const formattedName = name || 'migration';
        return `${timestamp}-${formattedName}`;
      },
    },
  });
};
