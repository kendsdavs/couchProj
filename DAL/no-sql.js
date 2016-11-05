/*jshint esversion: 6 */
const path = require('path');
const PouchDB = require('pouchdb-http'); //adapter
PouchDB.plugin(require('pouchdb-mapreduce'));
const fetchConfig = require('zero-config'); // this and the next line are connected

var config = fetchConfig(path.join(__dirname, '..'), {dcValue: 'test'});
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
    listFood: listFood,
    queryIngredients: queryIngredients,
    querySubtype: querySubtype
};


//  ---------  UTILITY  ----------  //

function queryDB(sortBy, startKey, limit, callback) {
    if (typeof startKey == "undefined" || startKey === null) {
        return callback(new Error('Missing search parameter'));
    } else if (typeof limit == "undefined" || limit === null || limit === 0) {
        return callback(new Error('Missing limit parameter'));
    } else {
        limit = startKey === ''
            ? Number(limit)
            : Number(limit) + 1;
        console.log("sortBy: ", sortBy, " startKey: ", startKey, " limit: ", limit)

        db.query(sortBy, {
            startkey: startKey,
            limit: limit,
            include_docs: true
        }).then(function(result) {
            if (startKey !== '' && result.rows.length > 0) {
                result.rows.shift();
            }
            return callback(null, result.rows);
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
            if (err)
                return callback(err);
            if (data)
                return callback(null, data);
            }
        );
    }
}

function createView(designDoc, callback) {
    if (typeof designDoc == "undefined" || designDoc === null) {
        return callback(new Error('400Missing design document.'));
    } else {
        db.put(designDoc, function(err, response) {
            if (err)
                return callback(err);
            if (response)
                return callback(null, response);
            }
        );
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
            if (err)
                return callback(err);
            if (response)
                return callback(null, response);
            }
        );
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
            if (err)
                return callback(err);
            if (response)
                return callback(null, response);
            }
        );
    }
}

//  -----------  BEVERAGES  ------------  //
function getBeverage(id, callback) {
    getDocByID(id, callback)
}
function updateBeverage(data, callback) {
    updateDoc(data, callback);
}

function deleteBeverage(data, callback) {
    deleteDoc(data, callback);
}
function listBeverage(sortBy, startKey, limit, callback) {
    queryDB(sortBy, startKey, limit, callback)
}
function createBeverage(data, callback) {
    if (data.hasOwnProperty('name') !== true) {
        return callback(new Error('400Missing name property within data'));
    }
    if (data.hasOwnProperty('subtype') !== true) {
        return callback(new Error('400Missing subtype property within data'));
    }
    if (data.hasOwnProperty('ingredients') !== true) {
        return callback(new Error('400Missing ingredents property within data'));
    }
    if (data.hasOwnProperty('_id') === true) {
        return callback(new Error('400 ID is not allowed within data'));
    }
    if (data.hasOwnProperty('_rev') === true) {
        return callback(new Error('400 Rev is not allowed within data'));
    }

    data._id = 'beverage_' + data.name
    data.type = 'beverage'

    db.put(data, function(err, response) {
        if (err) {
            console.log(err)
            return callback(err)
        }
        console.log("you created a beverage" + response)
        return callback(null, response)
    })
}

//  -----------  FOOD  --------------  ///
function getFood(id, callback) {
    getDocByID(id, callback)
}
function updateFood(data, callback) {
    updateDoc(data, callback);
}

function deleteFood(data, callback) {
    deleteDoc(data, callback);
}

function createFood(data, callback) {
    if (data.hasOwnProperty('name') !== true) {
        return callback(new Error('400Missing name property within data'));
    }
    if (data.hasOwnProperty('subtype') !== true) {
        return callback(new Error('400Missing subtype property within data'));
    }
    if (data.hasOwnProperty('ingredients') !== true) {
        return callback(new Error('400Missing ingredents property within data'));
    }
    if (data.hasOwnProperty('_id') === true) {
        return callback(new Error('400 ID is not allowed within data'));
    }
    if (data.hasOwnProperty('_rev') === true) {
        return callback(new Error('400 Rev is not allowed within data'));
    }

    data._id = 'food_' + data.name
    data.type = 'food'

    db.put(data, function(err, response) {
        if (err) {
            console.log(err)
            return callback(err)
        }
        console.log("you created a food" + response)
        return callback(null, response)
    })
}

function listFood(sortBy, startKey, limit, callback) {
    queryDB(sortBy, startKey, limit, callback)
}
function queryIngredients(ing, callback) {
        db.query('ingredients', {
            startkey: ing,
            endkey: ing + "\uffff",
            include_docs: true
        }, function (err, data) {
            if (err) return callback(err)
            callback(null, data)
        })
    }

function querySubtype(subt, callback) {
        db.query('subtype', {
            startkey: subt,
            endkey: subt + "\uffff",
            include_docs: true
        }, function (err, data) {
            if (err) return callback(err)
            callback(null, data)
        })
    }


module.exports = dal
