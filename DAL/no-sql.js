/*jshint esversion: 6 */
const path = require('path');
const PouchDB = require('pouchdb-http');
PouchDB.plugin(require('pouchdb-mapreduce'));
const fetchConfig = require('zero-config');

var config = fetchConfig(path.join(__dirname, '..'), {
    dcValue: 'test'
});
const urlFormat = require('url').format;
const db = new PouchDB(urlFormat(config.get("couch")));

var dal = {
    getBeverage: getBeverage,
    updateBeverage: updateBeverage,
    createBeverage: createBeverage,
    deleteBeverage: deleteBeverage,
    listBeverage: listBeverage,
    createView: createView,
    getFood: getFood,
    updateFood: updateFood,
    createFood: createFood,
    deleteFood: deleteFood,
    listFood: listFood
};

//  ---------  UTILITY  ----------  //
function queryDB(sortBy, startKey, limit, callback) {
    if (typeof startKey == "undefined" || startKey === null) {
        return callback(new Error('Missing search parameter'));
    } else if (typeof limit == "undefined" || limit === null || limit === 0) {
        return callback(new Error('Missing limit parameter'));
    } else {
        limit = startKey === '' ? Number(limit) : Number(limit) + 1;
        console.log("sortBy: ", sortBy, " startKey: ", startKey, " limit: ", limit)

        db.query(sortBy, {
            startkey: startKey,
            limit: limit,
            include_docs: true
        }).then(function(result) {
            if (startKey !== '' && result.rows.length > 0) { result.rows.shift(); }
            return callback(null, result.rows.map(convertPersons));
        }).catch(function(err) {
            return callback(err);
        });
    }
}

function getDocByID(id, callback) {
    // Call to couch retrieving a document with the given _id value.
    if (typeof id == "undefined" || id === null) {
        return callback(new Error('400Missing id parameter'));
    } else {
        db.get(id, function(err, data) {
            if (err) return callback(err);
            if (data) return callback(null, data);
        });
    }
}

function createView(designDoc, callback) {
    if (typeof designDoc == "undefined" || designDoc === null) {
        return callback(new Error('400Missing design document.'));
    } else {
        db.put(designDoc, function(err, response) {
            if (err) return callback(err);
            if (response) return callback(null, response);
        });
    }
}

function updateDoc(data, callback) {
    // Call to couch retrieving a document with the given _id value.
    if (typeof data == "undefined" || data === null) {
        return callback(new Error('400Missing data for update'));
    } else if (data.hasOwnProperty('_id') !== true) {
        return callback(new Error('400Missing id property from data'));
    } else if (data.hasOwnProperty('_rev') !== true) {
        return callback(new Error('400Missing rev property from data'));
    } else {
        db.put(data, function(err, response) {
            if (err) return callback(err);
            if (response) return callback(null, response);
        });
    }
}

function deleteDoc(data, callback) {
    if (typeof data == "undefined" || data === null) {
        return callback(new Error('400Missing data for delete'));
    } else if (data.hasOwnProperty('_id') !== true) {
        return callback(new Error('400Missing _id property from data'));
    } else if (data.hasOwnProperty('_rev') !== true) {
        return callback(new Error('400Missing _rev property from data'));
    } else {
        db.remove(data, function(err, response) {
            if (err) return callback(err);
            if (response) return callback(null, response);
        });
    }
}

//  -----------  BEVERAGES  ------------  //
function getBeverage() {
  
}

//  -----------  FOOD  --------------  ///
function getFood(id, callback) {
  getDocByID(id, callback)
}

module.exports = dal