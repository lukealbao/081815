var util = require('util');
var url = require('url');
var qs = require('querystring');

function getMany (req, res, next) {
  if (!req.authenticated) {
    res.send(401);
    return next();
  }

  var params = req.params;
  var state = req.appState;
  var query = req.query;
  var results = [];
  for (var server in state.servers) {
    results.push(state.servers[server]);
  }
  
  var COUNT = results.length
    
  // Sorting
  if (query.sort !== undefined) {
    // ascending by default
    var order = (query.order === 'descending')
              ? 'descending'
              : 'ascending';
    results = sort(results, query.sort, order);
  }

  // Pagination
  if ('paginate' in query) {
    query.perPage = ~~query.perPage || 10;
    query.page = ~~query.page || 1;
    results = results.slice((query.page - 1) * query.perPage,
                            (query.page) * query.perPage);

    var nextQuery,
        nextLink;
    if (query.page * query.perPage < COUNT) {
      nextQuery = util._extend({}, query);
      nextQuery.page++;
      nextLink = '<' + url.format({protocol: 'http:',
                                       host:req.headers.host, pathname: req.pathname,
                                       query: nextQuery})
                   + '>; rel=next';
    }

    var prevQuery,
        prevLink;
    if (query.page > 1) {
      prevQuery = util._extend({}, query);
      prevQuery.page = Math.max(query.page - 1, 1);
      prevLink = '<' + url.format({protocol: 'http:',
                                       host:req.headers.host, pathname: req.pathname,
                                       query: prevQuery})
                   + '>; rel=prev';
    }

    var links = [prevLink, nextLink].filter(function (x) {return !!x});
    res.setHeader('Link', links.join(','));
  }

  res.send(200, {configurations: results});
  next();
}

function sort (objects, key, order) {
  var orderCoefficient = (order === 'ascending')
        ? -1
        : 1;
  return ( objects.sort(function (a, b) {
             var valA = (typeof a[key] === 'string')
                      ? a[key].toLowerCase()
                      : a[key];
             var valB = (typeof a[key] === 'string')
                      ? b[key].toLowerCase()
                      : b[key];
             if (valA < valB) {
               return orderCoefficient;
             } else {
               return -orderCoefficient;
             }
           }) )
}

function createOne (req, res, next) {
  if (!req.authenticated) {
    res.send(401);
    return next();
  }

  var state = req.appState;
  var params = req.params;
  var id = Math.random().toFixed(3) * 1e3;
  state.servers[id] = params;
  res.setHeader('Location',
                'http://' + req.headers.host
                           + '/server/' + id);
  res.send(201);
  next();
}

function getOne (req, res, next) {
  if (!req.authenticated) {
    res.send(401);
    return next();
  }

  var state = req.appState;
  var params = req.params;
  var server = state.servers[params.id];
  if (server === undefined) {
    res.send(404)
  } else {
    res.send(200, server);
  }
  next();
}

function updateOne (req, res, next) {
  if (!req.authenticated) {
    res.send(401);
    return next();
  }
  var state = req.appState;
  var params = req.params;
  var server = state.servers[params.id];
  if (server === undefined) {
    res.send(404)
  } else {
    server = util._extend(server, params); // Of course, we SHOULD validate.
    res.setHeader('Location',
                  'http://' + req.headers.host
                             + '/server/' + params.id);

    res.send(200);
  }
  next();
}

function deleteOne (req, res, next) {
  if (!req.authenticated) {
    res.send(401);
    return next();
  }

  var state = req.appState;
  var params = req.params;
  delete state.servers[params.id];
  res.send(200);
}

module.exports.getMany = getMany;
module.exports.createOne = createOne;
module.exports.getOne = getOne;
module.exports.deleteOne = deleteOne;
module.exports.updateOne = updateOne;
