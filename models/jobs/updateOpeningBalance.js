var express     = require('express'),
        app         =express();
//var fileExists = require('file-exists');
var db = require('../db/base');
//var cfn = require('../../models/corefunction');
exports.updateOpeningBalance  = function(){
    console.log("---------------------");
    //console.log("Running Cron Job");
//    getFYear(new Date())
    var sql    = "SELECT id,account,year,count FROM `opening_balance` WHERE account_from='account' ORDER BY `count` LIMIT 0,10";
    db.query.selectCustomDb(sql, function (row) {
        Object.keys(row).forEach(function (k) {
            //console.log(row[k]);
        });
    });
            
//    var dbCls = db.poolDatabase;
//    var query    = "SELECT *  FROM videos  WHERE m3u8 ='no' AND type='basicmedia' and is_project='no' and status=1 and processing_status=3 limit 0,1";
//    dbCls.selectCustomDb(query, function(data){
//        if(data && data.length > 0){
//            var base_path   = (data[0].editor_file_path=='')?app.get('views')+ '/upload/user_'+data[0].user_id+'/basicmedia/':data[0].editor_file_path+'/';
//            if(fileExists(base_path+data[0].filename)){
//                var mkdirp      = require('mkdirp');
//                mkdirp.sync(base_path+'m3u8'+data[0].id);
//                var fCmdCron    = "ffmpeg -i "+base_path+data[0].filename+" -s 1280x720  -c:v libx264 -preset medium -x264opts keyint=12:min-keyint=12 -c:a aac -strict experimental -ar 44100 -ac 2 -start_number 0 -hls_time 10 -hls_list_size 0 -f hls "+base_path+'m3u8'+data[0].id+"/play.m3u8 ";
//                cfn.excuteFFMPGCommandAsy(fCmdCron);
//                query    = "UPDATE videos set m3u8='yes'  WHERE id ='"+data[0].id +"' ";
//                dbCls.selectCustomDb(query, function(row){
//                    console.log("base to m3u8 updated");
//                });
//            }
//            else{
//                query    = "UPDATE videos set processing_status=1, processing_status_msg='Source Video File Missing',status=1  WHERE id ='"+data[0].id +"' ";
//                dbCls.selectCustomDb(query, function(row){
//                    console.log("base to m3u8 updated");
//                });
//            }
//            
//        }
//    });
};