const { DB_NAME, DB_USER, DB_PASS, PORT } = process.env;

module.exports = {
  App: {
    port: PORT,
    database: {
      uri: `mongodb+srv://${DB_USER}:${DB_PASS}@surfapi.h3qnx.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
    },
  },
};
