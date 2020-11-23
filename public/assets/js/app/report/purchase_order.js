var RPORDER = {
    printOS:'',
    initpoRprt: function () {
        $(".select2").select2();
         COMMON.getUserRole();
         $("#frm_date").datepicker({changeMonth: true, changeYear: true});
        $('#to_date').datepicker({changeMonth: true, changeYear: true});
        var fyear = COMMON.getCurrentFiscalYear();
        $('#frm_date').datepicker('setDate', new Date('04/01/' + fyear[0]));
        $('#to_date').datepicker('setDate', new Date('03/31/' + fyear[1]));
        RPORDER.getpoRprt();
        $(".btn-p-OS").on("click",function(e){
            COMMON.printContent(RPORDER.printOS);
        });
        $(".btn-pdf").on("click", function (e) {
            COMMON.printPdf($("#itemWrap"),"Purchase_order-Detail");
        });
        $(".btn-xl-OS").on("click",function(e){
            COMMON.xlsContent(document.getElementById('datatable'),'Purchase_Order-Detail');
            //COMMON.xlsContent(document.getElementById('datatable1'),'planning-summary-Detail');  
        });
        $(".btn-p-OS-g").on("click",function(e){
           RPORDER.getpoRprt();
        });
    },
    getpoRprt:function(){
         COMMON.getUserRole();
        var data = {
            frm_date: $("#frm_date").val(),
            to_date: $("#to_date").val(),
            cus_name: $("#cus_name").val(),
            status:$("#status").val(),
            type:$("#type").val(),
        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/report/purchase_order/getpodetail',
            complete: function (xhr) {
                $('#itemWrap').html(xhr.responseText);
                RPORDER.printOS=xhr.responseText;
            },
        });
    },
    initpoallRprtL:function(){
    },
    initpoRprtLByItem:function(){
    }, 

    initpobyddateRprt: function () {
        $(".select2").select2();
         COMMON.getUserRole();
        
        var fyear = COMMON.getCurrentFiscalYear();
        
        RPORDER.getpobyddateRprt();
        $(".btn-p-OS").on("click",function(e){
            COMMON.printContent(RPORDER.printOS);
        });
        $(".btn-pdf").on("click", function (e) {
            COMMON.printPdf($("#itemWrap"),"purchaseorder-detail");
        });
        $(".btn-xl-OS").on("click",function(e){
            COMMON.xlsContent(document.getElementById('datatable'),'purchaseorder-detail');
            //COMMON.xlsContent(document.getElementById('datatable1'),'planning-summary-Detail');  
        });
        $(".btn-p-OS-g").on("click",function(e){
           RPORDER.getpobyddateRprt();
        });
    },
    getpobyddateRprt:function(){
         COMMON.getUserRole();
        var data = {
            frm_date: $("#ddate").val(),
            status:$("#status").val()
        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/report/purchase_order/getpodetailwithindate',
            complete: function (xhr) {
                $('#itemWrap').html(xhr.responseText);
                RPORDER.printOS=xhr.responseText;
            },
        });
    },
};
