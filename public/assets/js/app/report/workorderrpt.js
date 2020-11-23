var RWORKORDER = {
    printOS:'',
 
    initwoRprt: function () {
        $(".select2").select2();
         COMMON.getUserRole();
         $("#frm_date").datepicker({changeMonth: true, changeYear: true});
        $('#to_date').datepicker({changeMonth: true, changeYear: true});
        var fyear = COMMON.getCurrentFiscalYear();
        $('#frm_date').datepicker('setDate', new Date('04/01/' + fyear[0]));
        $('#to_date').datepicker('setDate', new Date('03/31/' + fyear[1]));
        RWORKORDER.getwoRprt();
        $(".btn-p-OS").on("click",function(e){
            COMMON.printContent(RWORKORDER.printOS);
        });
        $(".btn-pdf").on("click", function (e) {
            COMMON.printPdf($("#itemWrap"),"workorder-Detail");
        });
        $(".btn-xl-OS").on("click",function(e){
            COMMON.xlsContent(document.getElementById('datatable'),'workorder-Detail');
            //COMMON.xlsContent(document.getElementById('datatable1'),'planning-summary-Detail');  
        });
        $(".btn-p-OS-g").on("click",function(e){
           RWORKORDER.getwoRprt();
        });


    },
    getwoRprt:function(){
         COMMON.getUserRole();
        var data = {
            frm_date: $("#frm_date").val(),
            to_date: $("#to_date").val(),
            wo_status: $("#wo_status").val(),
        };
        
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/report/workorder/getwodetail',
            complete: function (xhr) {
                $('#itemWrap').html(xhr.responseText);
                RWORKORDER.printOS=xhr.responseText;
            },
        });
    },
    initwoRprtL:function(){
        
    },
    
   
    
};
