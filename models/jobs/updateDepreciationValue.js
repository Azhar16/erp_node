var express     = require('express'),
        app         =express();
var db = require('../db/base');

exports.updateDepreciationValue  = function(){
          
           updateDepreciation();

};

function updateDepreciation(){
	var cal;
	var sql = "SELECT * FROM asset  WHERE status<>'delete' LIMIT 1";
	      db.query.selectCustomDb(sql, function (row) {
         if(row.length>0){

          var sql2 = "SELECT * FROM assettype WHERE id="+row[0].asset_type;
         db.query.selectCustomDb(sql2, function (atype) {
         	if(atype.length > 0){
         		
         		 cal = (atype[0].incometax/100)*row[0].purchase_price;
         		 finalcal = (cal/365)*row[0].asset_validity
         		 console.log("call "+finalcal);
         		
         	}
             	
             });
         
         }
     });
}