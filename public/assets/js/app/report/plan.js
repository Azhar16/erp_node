var RPLAN = {
    printOS:'',
 
    initPlanSumRprt: function () {
         COMMON.getUserRole();
        RPLAN.getPlanSumRprt();
        $(".btn-p-OS").on("click",function(e){
            COMMON.printContent(RPLAN.printOS);
        });
        $(".btn-pdf").on("click", function (e) {
            COMMON.printPdf($("#itemWrap"),"planning-summary-Detail");
        });
        $(".btn-xl-OS").on("click",function(e){
            COMMON.xlsContent(document.getElementById('datatable'),'planning-summary-Detail');
            //COMMON.xlsContent(document.getElementById('datatable1'),'planning-summary-Detail');  
        });
        $(".btn-p-OS-g").on("click",function(e){
           RPLAN.getPlanSumRprt();
        });

       /* $("#plan_month").on("change",function(e){
           var data = {
            plan_year: $("#plan_year").val(),
            plan_month: $("#plan_month").val(),
        };
           $.ajax({
                    type: 'POST',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    url: "/report/plan/getplan",              
                    complete: function (data) {
                        var jdata=JSON.parse(data.responseText);
                        Object.keys(jdata).forEach(function (key){
                            console.log("jdata "+jdata[key].plan_no);
                            $("#plan_no").append(`
                                    <option val="${jdata[key].plan_no}">${jdata[key].plan_no}</option>
                        </div>
                            `);
                             
                          });
 
                       
                    }

                   
                });
        });
*/
    },
    getPlanSumRprt:function(){
         COMMON.getUserRole();
        var data = {
            plan_year: $("#plan_year").val(),
            plan_month: $("#plan_month").val(),
           // plan_no: $("#plan_no").val()
        };
        
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/report/plan/getplanningsumdetail',
            complete: function (xhr) {
                $('#itemWrap').html(xhr.responseText);
                RPLAN.printOS=xhr.responseText;
            },
        });
    },
    initPlanSunDetLis:function(){
        
    },

    initcomRprt: function () {
        COMMON.getUserRole();
        RPLAN.getcomRprt();
        $(".btn-p-OS").on("click",function(e){
            COMMON.printContent(RPLAN.printOS);
        });
        $(".btn-pdf").on("click", function (e) {
            COMMON.printPdf($("#itemWrap"),"Component-Detail");
        });
        $(".btn-xl-OS").on("click",function(e){
            COMMON.xlsContent(document.getElementById('datatable'),'Component-Detail');
            //COMMON.xlsContent(document.getElementById('datatable1'),'planning-summary-Detail');  
        });
        $(".btn-p-OS-g").on("click",function(e){
           RPLAN.getcomRprt();
        });

        
    },
    getcomRprt:function(){
        COMMON.getUserRole();
        var data = {
            plan_year: $("#plan_year").val(),
            plan_month: $("#plan_month").val(),
            comp_name: $("#comp_name").val()
        };
        
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/report/plan/getcomponentdetail',
            complete: function (xhr) {
                $('#itemWrap').html(xhr.responseText);
                RPLAN.printOS=xhr.responseText;
            },
        });
    },
    initCompDetLis:function(){
        
    },
    
};
