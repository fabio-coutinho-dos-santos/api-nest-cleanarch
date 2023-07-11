export function ormConfig(): any {
  const NODE_ENV = process.env.NODE_ENV;

  return {
    type: process.env.DATABASE_TYPE,
    url:
      NODE_ENV === 'test'
        ? process.env.DATABASE_TEST_URL_CONNECTION
        : process.env.DATABASE_URL_CONNECTION,
    synchronize: true,
    logging: false,
    autoLoadEntities: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    connectTimeout: parseInt(process.env.DATABASE_CONNECTION_TIME_OUT),
    acquireTimeout: parseInt(process.env.DATABASE_ACQUIRE_TIME_OUT),
    extra: {
      connectionLimit: parseInt(process.env.DATABASE_CONNECTION_LIMIT),
    },
    entities: ['dist/**/entity/*.entity.js'],
    migrations: ['dist/database/migrations/*.js'],
    subscribers: ['dist/observers/subscribers/*.subscriber.js'],
    cli: {
      entitiesDir: 'src/components/**/entity',
      migrationsDir: 'src/database/migrations',
      subscribersDir: 'src/observers/subscribers',
    },
  };
}
