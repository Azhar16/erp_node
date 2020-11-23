var SERVICEITEM = {
    itemID:0,
    initSIL: function () {
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "product/serviceitem/ajaxget",
                type: 'POST',
                data: function (d) {
                    setTimeout(SERVICEITEM.initButton, 1000);
                }
            }
        });

        $(".s-l-cn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("product/serviceitem/new", function (data) {
                $('#mainContent').html(data);
            });
        });
        SERVICEITEM.initButton();
        COMMON.getUserRole();
        
         
        
    },
    initButton:function(){
        COMMON.getUserRole();
        $(".s-l-e").on("click", function (e) {
            var id=$(this).attr('data-id');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('product/serviceitem/edit/'+id , function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-rim").on("click", function (e) {
            var id=$(this).attr('data-id');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('product/serviceitem/rawitemmapiing/'+id , function (data) {
                $('#mainContent').html(data);
            });
        });

        $(".s-l-d").on("click", function (e) {
            var cid = $(this).attr('data-id');
            swal({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
                confirmButtonClass: 'btn btn-success',
                cancelButtonClass: 'btn btn-danger m-l-10',
                buttonsStyling: false
            }).then(function () {
                $.get('product/serviceitem/delete/'+cid, function (data) {
                    $('#datatable').DataTable().ajax.reload(null, false);
                    COMMON.shownotification('error', 'Service item deleted successfully!!!');
                });
            });

        });
    },
    initSIN: function () {
        $('#frmINew').parsley();
        $('#frmINew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                SERVICEITEM.submitRINewFrm();
            }
        });
        $(".i-n-b").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("product/serviceitem", function (data) {
                $('#mainContent').html(data);
            });
        });
 

    },
 

    submitRINewFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var data = {name: $("#name").val(),
            code: $("#code").val(),
            group: $("#group").val(),
            specification: $("#specification").val(),
            hsn_code: $("#hsn_code").val(),
            tax_slabe: $("#tax_slabe").val(),
            sales_rate: $("#sales_rate").val(),
            sales_discount: $("#sales_discount").val(),
            purchase_rate: $("#purchase_rate").val(),
            description: $("#description").val(),
            iid: $("#iid").val()};
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'product/serviceitem/save',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("product/serviceitem", function (data) {
                        $('#mainContent').html(data);
                        var msg = '';
                        if ($("#iid").val() !== 'undefined')
                            msg = 'Service Item updated successfully!!!';
                        else
                            msg = 'Service Item created successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                }else if(res.code == 2){
                  COMMON.shownotification('error', 'Product Code already Exit!!!');
                }  else {
                    COMMON.shownotification('error', 'Unable to save Service Item!!!');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
};