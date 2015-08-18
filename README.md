# Hello
Here is a from-scratch http server.

## ~~Install and~~ run
```shell
$ node index.js
```

Server listens on port `9999`

There's a single known user: `lukealbao:tenable`
```shell
$ curl -c cookies -v -X POST -H 'content-type: application/json' \
-d '{"username":"lukealbao","password":"tenable"}' http://localhost:9999/login
```

## Automated tests
```javascript
node test/spec.js
```

## Server API
You may receive a `404` when the route is not found; a `405` when the
method is not defined on a known route; a `401` when the request is
not authenticated.

* `/login`
  - Method: `POST`
  - URL Params: none
  - Body Params:
    - `username` try 'lukealbao'
    - `password` try 'tenable'
  - Success
    - HTTP Status: `200`
    - Set-Cookie: `sessionId`
  - Failure
    - HTTP Status: `401`

* `/logout`
  - Method: `GET`
  - URL Params: none
  - Body Params: none
  - Cookie: `sessionId`
  - Success
    - HTTP Status: `200`
  - Failure
    - HTTP Status: `200`

* `/servers`
  - Method: `POST`
    - URL Params: none
    - Body Params:
      - `name` String, required
      - `hostname` String, required
      - `port` Number, required
      - `username` String, required
    - Cookie: `sessionId`
    - Success
      - HTTP Status: `201`
      - Header: `Location`. Absolute URI of resource.
    - Failure
      - HTTP Status: `401`
  - Method: `GET`
    - URL Params: none
    - Query String Params (All optional):
      - `paginate`, Null. If present, paginate results.
      - `page`, Number. Pagination offset. Defaults to 1
      - `perPage`, Number. Records per page. Defaults to 10.
      - `sort`, String. Key for sorting. See `POST`:BodyParams.
      - `order`, String. Valid values: `ascending` (default) or `descending`
    - Body Params: none
    - Cookie: `sessionId`
    - Success
      - HTTP Status: `200`
      - Body: `application/json` only
    - Failure
      - HTTP Status: `401`

* `/server/:id`
  - Method: `GET`
    - URL Params: 
      `:id`: id of server. See `Location` header when creating one. 
    - Body Params: none
    - Cookie: `sessionId`
    - Success
      - HTTP Status: `200`
      - Body: `application/json` only
    - Failure
      - HTTP Statuses: `401`,`404`
  - Method: `DELETE`
    - URL Params: 
      `:id`: id of server. See `Location` header when creating one. 
    - Body Params: none
    - Cookie: `sessionId`
    - Success
      - HTTP Status: `200`
    - Failure
      - HTTP Status: `401`
  - Method: `PUT`
    - URL Params: 
      `:id`: id of server. See `Location` header when creating one. 
    - Body Params: See `POST:/servers`. All optional
    - Cookie: `sessionId`
    - Success
      - HTTP Status: `200`
    - Failure
      - HTTP Statuses: `401`, `404`


## Framework API

Want to extend the server?

```javascript
var server = new App();

// Create middleware that all routes will use
server.use(function (req, res, next) {
  // ... do stuff to the req, res objects
  req.cool = true;

  // Call the next handler, always!
  next();
});

// Add a route. Only CRUD operations are defined.
server.post('/fun', function (req, res, next) {
  // You recognize this stuff.
  next();
});
```

The following middleware can be added by name:
* `extendObjects`: Add helper methods and attributes to `req` and `res` objects
* `parseBody`: Add any URL and Body params to a `req.params` object
