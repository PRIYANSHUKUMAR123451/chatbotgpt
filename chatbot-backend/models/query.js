const mongoose = require('mongoose');

const QuerySchema = new mongoose.Schema({
  query: { type: String, required: true },
  response: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Query = mongoose.model('Query', QuerySchema);

module.exports = Query;
