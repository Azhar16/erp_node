var mysql=require('mysql');
// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database:"soccerskill"
// });
var con = mysql.createConnection({
  host: "localhost",
  user: "sibyl",
  password: "sibyl@123",
  database:"sibyl_erp_test"
});
con.connect(function(err) {
  if (err) throw err;
  else
  {
  	console.log("connect");
  }
  })
con.set_query=function(sql,error,results)
{
 con.query(sql,function(err,result)
                {
                  if(err)
                  {
                    error(err);
                  }
                  else
                  {
                    results(result);
                  }
                }

  );
}
 con.set_query_twosql=function(sql1,sql2,error,results)
{
 con.query(sql1,sql2,function(err,result)
                {
                  if(err)
                  {
                    error(err);
                  }
                  else
                  {
                    results(result);
                  }
                }

  );
}

  module.exports=con;