const { DB_NAME, PORT, DB_PASS, DB_USER, CACHE_ENDPOINT, CACHE_PASS } =
  process.env;

module.exports = {
  App: {
    port: PORT || 8080,
    database: {
      url: `mongodb+srv://${DB_USER}:${DB_PASS}@surfapi.h3qnx.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
    },
    cache: {
      url: CACHE_ENDPOINT,
      pass: CACHE_PASS,
    },
  },
};
