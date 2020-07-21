const Sequelize = require('sequelize');

// import your models here 
const ExampleModel = require('./example');


const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

const setupDatabase = () => {
  const connection = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: false,
  });

  const Example = ExampleModel(connection, Sequelize);

  connection.sync({ alter: true });
  return {
    Example
  };
};

module.exports = setupDatabase();