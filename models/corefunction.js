var  config = require('config')
,express = require('express')
  , app = express()
  ,fs = require('fs')
  , jsonfile = require('jsonfile');


global.generateLogFile = function (data) {
    try
    {
        var d = new Date();
        fs.appendFile('log/'+d.getFullYear()+'-'+d.getMonth()+'.log', JSON.stringify(data) + "\n", function (err) {
            //console.log(JSON.stringify(data));
        });
    } catch (e) {
        console.log(e);
    }
}
global.generateUserType = function (data) {
    try
    {
        fs.appendFile('settings/'+JSON.parse(data.userid)+'.json', JSON.stringify(data.obj,null,2) + "\n", function (err) {
        });
    } catch (e) {
    }
}
/*global.role = function (data) {

        jsonfile.readFile('settings/'+req.session.user.id+'.json', function (err, usavedrole) {

        });

    


}*/
global.amountToWord=function(num){
        var a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
        var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

        var myarr = parseFloat(num).toFixed(2).toString().split(".");
        console.log(myarr);
        if ((num = myarr[0].toString()).length > 9) return 'overflow';
        n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        //console.log(n);
        if (!n) return; var str = '';
        str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
        str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
        str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
        str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
        if(typeof myarr[1]!=='undefined' && Number(myarr[1])>0){
            str += (n[5] != 0) ?  (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]])  : '';
            str += ((str != '') ? 'and ' : '') + (a[Number(myarr[1])] || b[myarr[1][0]] + '' + a[myarr[1][1]]) + ' paisa only ' ;
        }
        else
            str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + '' + a[n[5][1]]) + 'only ' : '';
        str = "rupees "+str;
        //console.log(str);
        return str;
    }
function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}

Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};

global.getFYear=function(today){
    var curMonth = today.getMonth();
    var fiscalYr = '';
        if (curMonth > 2) {
            fiscalYr = today.getFullYear().toString().substr(-2)+(today.getFullYear() + 1).toString().substr(-2);
        } else {
            fiscalYr = (today.getFullYear() - 1).toString().substr(-2)+today.getFullYear().toString().substr(-2);
        }
        return fiscalYr;
}

global.getDateByDay=function(date1,days){
    
    var date2 = new Date();
    var date = new Date();
    date.setDate(date.getDate() + 15);
    console.log("cmonth "+date2.getMonth());
    var futDate=date.getDate().toString() + "/" + date.getMonth().toString() + "/" + date.getFullYear().toString();

    return futDate;
}

if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength,padString) {
        targetLength = targetLength>>0; //truncate if number or convert non-number to 0;
        padString = String((typeof padString !== 'undefined' ? padString : ' '));
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength-this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0,targetLength) + String(this);
        }
    };
}