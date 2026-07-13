'use strict';

// Vercel serverless entry: the DB tables are created once per cold start
// (ready), then every request runs through the same handler as local/Render.
const requestHandler = require('../server');
const { ready } = require('../db');

module.exports = async (req, res) => {
  await ready;
  return requestHandler(req, res);
};
