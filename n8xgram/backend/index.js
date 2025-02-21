const req = require('./server');

req.listen(3001, () => {
    console.log("server is running on \nhttp://localhost:3001");
})