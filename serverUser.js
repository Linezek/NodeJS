module.exports = {
  configureSingleAllRoutes: function (singleRoute) {
    //HERE WE NEED TO CONFIGURE ALL ROUTES
    //QUERY: UPDATE POST GET DELETE
  },
  configureSingleGetRoute: function (singleRoute) {
    //HERE WE HAVE THE GET ROUTE TO ANTOINE_USER DATABASE
    //QUERY: SELECT
    singleRoute.get(function(req,res,next){
      console.log("GET");
        req.getConnection(function(err,conn){
            console.log("IN GET HTTP RESQUEST");
            if (err) return next("Cannot Connect to MySQL");
            var query = conn.query('SELECT * FROM antoine_user',function(err,rows){
                if(err){ return next("Mysql error, check your query")}
                console.log("Yea start render");
                res.setHeader("Content-Type","application/json")
                console.log(JSON.stringify(rows))
                res.send(JSON.stringify(rows))
             });
        });
    });
  },
  configureSinglePutRoute: function (singleRoute) {
    //HERE WE HAVE THE PUT ROUTE TO ANTOINE_DATABASE
    //QUERY: UPDATE
    singleRoute.put(function(req,res,next){
      console.log("PUT");
      console.log("req.parameters > " + req.parameters);
      var user_id = req.params['id'];
      var data = {
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
      };
      req.getConnection(function (err, conn){
        console.log("IN PUT HTTP RESQUEST");
        if (err) return next("Cannot Connect");
            var query = conn.query("UPDATE antoine_user SET name = ?, email = ?, password = ? WHERE user_id = ? ",[data.name,data.email,data.password,user_id], function(err, rows){
              var query = conn.query("SELECT * FROM antoine_user WHERE email = ?",[data.email], function(err, rows){
              res.setHeader("Content-Type","application/json")
              res.status = 200;
              res.send(JSON.stringify(rows[0]))
            });
        });
      });
    });
  },
  configureSingleDeleteRoute: function (singleRoute) {
    //HERE WE HAVE THE DELETE ROUTE TO ANTOINE_USER DATABASE
    //QUERY: DELETE
    singleRoute.delete(function(req,res,next){
      var user_id = req.params['id'];
      req.getConnection(function (err, conn) {
        console.log("IN DELETE HTTP REQUEST");
        if (err) return next("Cannot connect to MySQL")
        var query = conn.query("DELETE FROM antoine_user WHERE id = ?  ",[user_id], function(err, rows){
          if(err){
              res.status(402).json(errors);
              res.send()
              return;
          } else {
            res.setHeader("Content-Type","application/json")
            res.status = 200;
            res.send()
            return;
          }
        });
      });
    });
  },
  configureSinglePostRoute: function (singleRoute) {
    //HERE WE HAVE THE POST ROUTE TO ANTOINE_USER DATABASE
    //QUERY: POST
    singleRoute.post(function(req,res,next){
      console.log("IN POST HTTP REQUEST");
        var data = {
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
         };
      req.getConnection(function (err, conn){
          if (err) return next("Cannot Connect to MySQL");
          var query = conn.query("INSERT INTO antoine_user set ? ",data, function(err, rows){
            if (err) return next("Mysql error, check your query");
            var query = conn.query("SELECT * FROM antoine_user WHERE email = ?",[data.email], function(err, rows){
              res.setHeader("Content-Type","application/json")
              res.status = 200;
              console.log(JSON.stringify(rows[0]))
              res.send(JSON.stringify(rows[0]))
          });
        });
      });
    });
  }
};
