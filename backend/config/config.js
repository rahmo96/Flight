module.exports = {
  development: process.env.DATABASE_URL 
    ? {
        use_env_variable: 'DATABASE_URL',
        dialect: 'postgres',
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      }
    : {
        username: 'postgres',
        password: 'yourpassword',
        database: 'flight_app_dev',
        host: '127.0.0.1',
        dialect: 'postgres'
      },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
