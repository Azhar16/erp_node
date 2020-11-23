var RENQUIRY = {
    printOS:'',
 
    initenqyRprt: function () {
        $(".select2").select2();
         COMMON.getUserRole();
         $("#frm_date").datepicker({changeMonth: true, changeYear: true});
        $('#to_date').datepicker({changeMonth: true, changeYear: true});
        var fyear = COMMON.getCurrentFiscalYear();
        $('#frm_date').datepicker('setDate', new Date('04/01/' + fyear[0]));
        $('#to_date').datepicker('setDate', new Date('03/31/' + fyear[1]));
        RENQUIRY.getenqyRprt();
        $(".btn-p-OS").on("click",function(e){
            COMMON.printContent(RENQUIRY.printOS);
        });
        $(".btn-pdf").on("click", function (e) {
            COMMON.printPdf($("#itemWrap"),"enquiry-Detail");
        });
        $(".btn-xl-OS").on("click",function(e){
            COMMON.xlsContent(document.getElementById('datatable'),'enquiry-Detail');
            //COMMON.xlsContent(document.getElementById('datatable1'),'planning-summary-Detail');  
        });
        $(".btn-p-OS-g").on("click",function(e){
           RENQUIRY.getenqyRprt();
        });


    },
    getenqyRprt:function(){
         COMMON.getUserRole();
        var data = {
            frm_date: $("#frm_date").val(),
            to_date: $("#to_date").val(),
            cus_name: $("#cus_name").val(),
            status:$("#status").val()
        };
        
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/report/enquiry/getenquirydetail',
            complete: function (xhr) {
                $('#itemWrap').html(xhr.responseText);
                RENQUIRY.printOS=xhr.responseText;
            },
        });
    },
    initenqyRprtL:function(){
        
    },
    initenqyallRprtL:function(){
        
    },

   
    
};
