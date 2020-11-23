var RASSET = {
    printOS:'',
 
    initassetIRprt: function () {
        $(".select2").select2();
         COMMON.getUserRole();
         $("#frm_date").datepicker({changeMonth: true, changeYear: true});
        var fyear = COMMON.getCurrentFiscalYear();
        RASSET.getdepincomeTaxRprt();
        $(".btn-p-OS").on("click",function(e){
            COMMON.printContent(RASSET.printOS);
        });
        $(".btn-pdf").on("click", function (e) {
            COMMON.printPdf($("#itemWrap"),"Depreciation-IncomeTax-Detail");
        });
        $(".btn-xl-OS").on("click",function(e){
            COMMON.xlsContent(document.getElementById('datatable'),'Depreciation-IncomeTax-Detail');
            //COMMON.xlsContent(document.getElementById('datatable1'),'planning-summary-Detail');  
        });
        $(".btn-p-OS-g").on("click",function(e){
           RASSET.getdepincomeTaxRprt();
        });
    },
    getdepincomeTaxRprt:function(){
         COMMON.getUserRole();
        var data = {
            frm_date: $("#frm_date").val(),
            asset_name: $("#asset_name").val(),
        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/report/asset/getdepincometaxdetail',
            complete: function (xhr) {
                $('#itemWrap').html(xhr.responseText);
                RASSET.printOS=xhr.responseText;
            },
        });
    },
    initassetIRprtL:function(){
        
    },

    initAORprt: function () {
        $(".select2").select2();
         COMMON.getUserRole();
        var fyear = COMMON.getCurrentFiscalYear();
        RASSET.getOpeningsRprt();
        $(".btn-p-OS").on("click",function(e){
            COMMON.printContent(RASSET.printOS);
        });
        $(".btn-pdf").on("click", function (e) {
            COMMON.printPdf($("#itemWrap"),"Openings-Detail");
        });
        $(".btn-xl-OS").on("click",function(e){
            COMMON.xlsContent(document.getElementById('datatable'),'Openings-Detail');
            //COMMON.xlsContent(document.getElementById('datatable1'),'planning-summary-Detail');  
        });
        $(".btn-p-OS-g").on("click",function(e){
           RASSET.getOpeningsRprt();
        });
    },
    getOpeningsRprt:function(){
         COMMON.getUserRole();
        var data = {
           method_id: $("#method_id").val(),
        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/report/asset/getOpeningssdetail',
            complete: function (xhr) {
                $('#itemWrap').html(xhr.responseText);
                RASSET.printOS=xhr.responseText;
            },
        });
    },
    initOpeningsCRprtL:function(){
      
    },
    initAdditionsCRprt: function () {
        $(".select2").select2();
         COMMON.getUserRole();
         $("#frm_date").datepicker({changeMonth: true, changeYear: true});
        var fyear = COMMON.getCurrentFiscalYear();
        console.log("fyear "+fyear);
        RASSET.getAdditionsRprt();
        $(".btn-p-OS").on("click",function(e){
            COMMON.printContent(RASSET.printOS);
        });
        $(".btn-pdf").on("click", function (e) {
            COMMON.printPdf($("#itemWrap"),"Addtions-Detail");
        });
        $(".btn-xl-OS").on("click",function(e){
            COMMON.xlsContent(document.getElementById('datatable'),'Addtions-Detail');
            //COMMON.xlsContent(document.getElementById('datatable1'),'planning-summary-Detail');  
        });
        $(".btn-p-OS-g").on("click",function(e){
           RASSET.getAdditionsRprt();
        });
    },
    getAdditionsRprt:function(){
         COMMON.getUserRole();
        var data = {
            method_id: $("#method_id").val(),
        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/report/asset/getAdditionsdetail',
            complete: function (xhr) {
                $('#itemWrap').html(xhr.responseText);
                RASSET.printOS=xhr.responseText;
            },
        });
    },
    initAdditionsRprtL:function(){
        
    },

   
    
};
