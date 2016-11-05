const express = require('express')
const app = express()
const port = process.env.PORT || 4000;
const HTTPError = require('node-http-error');
const dal = require('../DAL/no-sql.js');
var bodyParser = require('body-parser');
app.use(bodyParser.json())

app.get('/', function(req, res) {
    res.send('hello world')
})

app.get('/food/:id', function(req, res, next) {
    const foodID = req.params.id;

    dal.getFood(foodID, function(err, data) {
        if (err) {
            var responseError = BuildResponseError(err)
            //console.log("Error calling dal.getReliefEffort", err)
            return next(new HTTPError(responseError.status, responseError.message))
        }
        if (data) {
            res.append('Content-type', 'application/json')
            res.send(data);
        }
    })
})

app.get('/food', function(req, res, next) {
    const sortByParam = req.query.sortby || 'food';
    //const sortBy = getReliefEffortSortBy(sortByParam, dalModule);
    const sortBy = sortByParam
    const sortToken = req.query.sorttoken || '';
    const limit = req.query.limit || 5;

    dal.listFood(sortBy, sortToken, limit, function callback(err, data) {
        if (err) {
            var responseError = BuildResponseError(err)
            return next(new HTTPError(responseError.status, responseError.message))
        }
        if (data) {
            console.log("HERE is the list from " + req.path, data)
            res.append('Content-type', 'application/json')
            res.status(200).send(data)
        }
    })
})

app.get('/beverage/:id', function(req, res) {
    const beverageID = req.params.id;

    dal.getFood(beverageID, function(err, data) {
        if (err) {
            var responseError = BuildResponseError(err)
            //console.log("Error calling dal.getReliefEffort", err)
            return next(new HTTPError(responseError.status, responseError.message))
        }
        if (data) {
            res.append('Content-type', 'application/json')
            res.send(data);
        }
    })
})

app.get('/beverage', function(req, res, next) {
    const sortByParam = req.query.sortby || 'beverage';
    const sortBy = sortByParam;
    const sortToken = req.query.sorttoken || '';
    const limit = req.query.limit || 5;

    dal.listBeverage(sortBy, sortToken, limit, function callback(err, data) {
        if (err) {
            var responseError = BuildResponseError(err)
            return next(new HTTPError(responseError.status, responseError.message))
        }
        if (data) {
            console.log("HERE is the list from " + req.path, data)
            res.append('Content-type', 'application/json')
            res.status(200).send(data)
        }
    })
})

app.put('/food/:id', function(req, res, next) {
    const foodID = req.params.id;

    dal.getFood(foodID, function callback(err, data) {
        if (err) {
            var responseError = BuildResponseError(err)
            return next(new HTTPError(responseError.status, responseError.message))
        }
        if (data) {
            //data["name"] !== req.body["name"]
            dal.updateFood(req.body, function callback(updateerror, updateddata) {
                if (updateerror) {
                    var responseError = BuildResponseError(err)
                    return next(new HTTPError(responseError.status, responseError.message))
                }
                if (updateddata) {
                    updateddata.body["name"]
                    console.log('You updated ', updateddata)
                    res.append('Content-type', 'application/json')
                    res.status(200).send(updateddata)
                }
            })
        }
    })
})

app.get('/ingredients/:id', function(req, res, next) {
    dal.queryIngredients(req.params.id, function(err, data) {
        if (err) {
            var responseError = BuildResponseError(err)
            return next(new HTTPError(responseError.status, responseError.message))
        }
        if (data) {
            console.log('You updated ', data)
            res.append('Content-type', 'application/json')
            res.status(200).send(data)
        }
    })
})

app.get('/subtype/:id', function(req, res, next) {
    dal.querySubtype(req.params.id, function(err, data) {
        if (err) {
            var responseError = BuildResponseError(err)
            return next(new HTTPError(responseError.status, responseError.message))
        }
        if (data) {
            console.log('Here are your subtype recipies ', data)
            res.append('Content-type', 'application/json')
            res.status(200).send(data)
        }
    })
})

app.put('/beverage/:id', function(req, res, next) {
    dal.getBeverage(req.params.id, function(err, data) {
        if (err) {
            var responseError = BuildResponseError(err)
            return next(new HTTPError(responseError.status, responseError.message))
        }
        if (data)
        dal.updateBeverage(req.body, function callback(updatederror, updateddata) {
            if (updatederror) {
                var responseError = BuildResponseError(err)
                return next(new HTTPError(responseError.status, responseError.message))
            }
            if (updateddata) {
                console.log("You updated a beverage " + updateddata)
                res.append('Content-type', 'application/json')
                res.status(200).send(updateddata)
            }
        })

    })
})

app.post('/beverage', function(req, res, next) {
    console.log(req.body)
    dal.createBeverage(req.body, function callback(err, data) {
        if (err) {
            var responseError = BuildResponseError(err)
            return next(new HTTPError(responseError.status, responseError.message))
        }
        if (data) {
            //req.body["name"] = data["name"]
            console.log("You created the beverage ", req.body["name"])
            res.append('Content-type', 'application/json')
            res.status(200).send(data)
        }
    })

})

app.post('/food', function(req, res, next) {
    //console.log(req.body)
    dal.createFood(req.body, function callback(err, data) {
        if(err) {
            var responseError = BuildResponseError(err)
            return next(new HTTPError(responseError.status, responseError.message))
        }
        if(data) {
            console.log("You created the food", req.body["name"])
            res.append('Content-type', 'application/json')
            res.status(200).send(data)
        }
    })
})

app.delete('/food/:id', function(req, res, next) {
    dal.getFood(req.params.id, function callback(err, data) {
        if (err) {
            var responseError = BuildResponseError(err)
            return next(new HTTPError(responseError.status, responseError.message))
        }
        if (data)
            dal.deleteFood(data, function callback(deletederror, deleteddata) {
            if (deletederror) {
                var responseError = BuildResponseError(err)
                //console.log("Error calling dal.getReliefEffort", err)
                return next(new HTTPError(responseError.status, responseError.message))
            }
            if (deleteddata) {
              console.log("DELETE " + req.path, deleteddata)
              res.append('Content-type', 'application/json')
              res.status(200).send(deleteddata)
            }
        })
    })
})

app.delete('/beverage/:id', function(req, res, next) {
    dal.getBeverage(req.params.id, function callback(err, data) {
        if (err) {
            var responseError = BuildResponseError(err)
            return next(new HTTPError(responseError.status, responseError.message))
        }
        if (data)
        dal.deleteBeverage(data, function callback(deletederror, deleteddata) {
        if (deletederror) {
            var responseError = BuildResponseError(err)
            //console.log("Error calling dal.getReliefEffort", err)
            return next(new HTTPError(responseError.status, responseError.message))
        }
        if (deleteddata) {
          console.log("DELETE " + req.path, deleteddata)
          res.append('Content-type', 'application/json')
          res.status(200).send(deleteddata)
        }
    })
    })
})

function BuildResponseError(err) {

    // no sql error message example
    //     { id: 'person_jackiekennedyo1922@gmail.org',
    // error: 'conflict',
    // reason: 'Document update conflict.',
    // name: 'conflict',
    // status: 409,
    // message: 'Document update conflict.',
    // ok: true }
    //
    // // custom DAL validation message example
    //
    // {
    // error: 'Bad Request',
    // reason: 'Unnecessary _id property within data.'
    // name: 'Bad Request',
    // status: 400,
    // message: 'Unnecessary _id property within data.',
    // ok: true }

    // if the first three characters are a number then return the error code otherwise
    //  default to 400 (bad request)
    const statuscheck = isNaN(err.message.substring(0, 3)) === true
        ? "400"
        : err.message.substring(0, 3)
    const status = err.status
        ? Number(err.status)
        : Number(statuscheck)
    const message = err.status
        ? err.message
        : err.message.substring(3)
    const reason = message
    const error = status === 400
        ? "Bad Request"
        : err.name
    const name = error

    var errormsg = {}
    errormsg.error = error
    errormsg.reason = reason
    errormsg.name = name
    errormsg.status = status
    errormsg.message = message

    //   { error: 'Bad Request',
    // reason: 'Missing email property within data',
    // name: 'Bad Request',
    // status: 400,
    // message: 'Missing email property within data' }
    console.log("BuildResponseError-->", errormsg)
    return errormsg
}
// middleware for errors
app.use(function(err, req, res, next) {
    console.log(req.method, " ", req.path, " err: ", err)
    res.status(err.status || 500)
    res.send(err)
})
app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});
