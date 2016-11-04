var dalNoSQL = require('./DAL/no-sql.js');

var sortBy = 'reliefEffortsView'
var startkey = ""
var limit = 3

var personCallback = function (err, results) {
  if (err) {
    return console.log(err.message)
  }
  console.log(JSON.stringify(results.rows, null, 2))
}

// console.log(dalNoSQL.listPersons(sortBy, startkey, limit, personCallback))
// console.log(sortBy)
console.log(dalNoSQL.searchByLastName("jo", personCallback))
