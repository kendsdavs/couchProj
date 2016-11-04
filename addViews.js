var dalNoSQL = require('./DAL/no-sql.js');

var ddoc = {
    _id: '_design/food',
    views: {
        food: {
            map: function(doc) {
                if (doc.type === 'food') {
                    emit(doc.name + doc._id);
                }
            }.toString()
        }
    }
};

var ddoc2 = {
    _id: '_design/beverage',
    views: {
        beverage: {
            map: function(doc) {
                if (doc.type === 'beverage') {
                    emit(doc.name + doc._id)
                }
            }.toString()
        }
    }
};

var ddoc3 = {
    _id: '_design/ingredients',
    views: {
        ingredients: {
            map: function(doc) {
                if (doc.type === 'food' || doc.type === 'beverage') {
                    doc.ingredients.forEach(function(ingredient) {
                        emit(ingredient, doc.name);
                    });
                }
            }.toString()
        }
    }
}
var ddoc4 = {
    _id: '_design/subtype',
    views: {
        subtype: {
            map: function(doc) {
                if (doc.type === 'food' || doc.type === 'beverage') {
                        emit(doc.subtype, doc.name);
                }
            }.toString()
        }
    }
}

// db.query('emailView', {
//   include_docs: true
// }).then(function (res) {
//   // index was built!
//   console.log(res)
// }).catch(function (err) {
//   // some error
//   console.log(err)
// });

//createView(ddoc)
// dalNoSQL.createView(ddoc, function(err, data) {
//   if (err) return console.log(err)
//   if (data) {
//     console.log(data)
//   }
// })
// dalNoSQL.createView(ddoc3, function(err, data) {
//     if (err)
//         return console.log(err)
//     if (data) {
//         console.log(data)
//     }
// })
dalNoSQL.createView(ddoc4, function(err, data) {
    if (err)
        return console.log(err)
    if (data) {
        console.log(data)
    }
})
// dalNoSQL.createView(ddoc, function(err, data) {
//     if (err)
//         return console.log(err)
//     if (data) {
//         console.log(data)
//     }
// })
// dalNoSQL.createView(ddoc2, function(err, data) {
//     if (err)
//         return console.log(err)
//     if (data) {
//         console.log(data)
//     }
// })
