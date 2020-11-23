var ROFFER = {
    printOS:'',
 
    initofferRprt: function () {
        $(".select2").select2();
         COMMON.getUserRole();
         $("#frm_date").datepicker({changeMonth: true, changeYear: true});
        $('#to_date').datepicker({changeMonth: true, changeYear: true});
        var fyear = COMMON.getCurrentFiscalYear();
        $('#frm_date').datepicker('setDate', new Date('04/01/' + fyear[0]));
        $('#to_date').datepicker('setDate', new Date('03/31/' + fyear[1]));
        ROFFER.getofrRprt();
        $(".btn-p-OS").on("click",function(e){
            COMMON.printContent(ROFFER.printOS);
        });
        $(".btn-pdf").on("click", function (e) {
            COMMON.printPdf($("#itemWrap"),"offer-Detail");
        });
        $(".btn-xl-OS").on("click",function(e){
            COMMON.xlsContent(document.getElementById('datatable'),'offer-Detail');
            //COMMON.xlsContent(document.getElementById('datatable1'),'planning-summary-Detail');  
        });
        $(".btn-p-OS-g").on("click",function(e){
           ROFFER.getofrRprt();
        });


    },
    getofrRprt:function(){
         COMMON.getUserRole();
        var data = {
            frm_date: $("#frm_date").val(),
            to_date: $("#to_date").val(),
           // cus_name: $("#cus_name").val(),
        };
        
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/report/offer/getofferdetail',
            complete: function (xhr) {
                $('#itemWrap').html(xhr.responseText);
                ROFFER.printOS=xhr.responseText;
            },
        });
    },
    initofferRprtL:function(){
        
    },


   
    
};
