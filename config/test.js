require('dotenv/config');

const {
  DB_USER, DB_PASS, DB_NAME, DB_PORT,
} = process.env;

module.exports = {
  App: {
    database: {
      uri: `mongodb://${DB_USER}:${DB_PASS}@localhost:${DB_PORT}/${DB_NAME}?authSource=admin`,
    },
    resources: {
      StormGlass: {
        endpoint: 'https://api.stormglass.io/v2',
        apiKey: 'test',
      },
    },
  },
};
