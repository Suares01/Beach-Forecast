const { PORT, DB_PROD_URL, CACHE_ENDPOINT, CACHE_PASS } = process.env;

module.exports = {
  App: {
    port: PORT || 8080,
    database: {
      url: DB_PROD_URL,
    },
    cache: {
      url: CACHE_ENDPOINT,
      pass: CACHE_PASS,
    },
  },
};
