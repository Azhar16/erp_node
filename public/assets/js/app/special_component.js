var SPECIAL = {
    initSL: function () {
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "product/special_component/ajaxget",
                type: 'POST',
                data: function (d) {
                    setTimeout(SPECIAL.initButton, 1000);
                }
            }
        });

        $(".s-l-cn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("/product/special_component/new", function (data) {
                $('#mainContent').html(data);
            });
        });
        SPECIAL.initButton();
        COMMON.getUserRole();  
    },
    initButton:function(){
        COMMON.getUserRole();
        $(".s-l-e").on("click", function (e) {
            var id=$(this).attr('data-id');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('/product/special_component/edit/'+id, function (data) {
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
                $.get('/product/special_component/delete/'+cid, function (data) {
                    //$('#datatable').DataTable().ajax.reload();
                    $('#datatable').DataTable().ajax.reload(null, false);
                    COMMON.shownotification('error', 'product feature deleted successfully!!!');
                });
            });

        });
    },
    initSN: function () {
        $('#frmCNew').parsley();
        $('#frmCNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                SPECIAL.submitSNnewFrm();
            }
        });
        $(".c-n-b").on("click", function (e) {
            location.reload();
        });
    },
    submitSNnewFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var data = {
            name: $("#name").val(),
            stype: $("#stype").val(),
            saf_no: $("#saf_no").val(),
            size: $("#size").val(),
            desp: $("#desp").val(),
            sid: $("#sid").val(),
        }
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/product/special_component/save',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                  
                        $('#mainContent').html("<div class='loading'></div>");
                        $.get("/product/special_component", function (data) {
                            $('#mainContent').html(data);

                        });
           
                    var msg = '';
                    if ($("#pfid").val() !== 'undefined')
                        msg = 'Special Component updated successfully!!!';
                    else
                        msg = 'Special Component created successfully!!!';
                    COMMON.shownotification('success', msg);
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
    
    
};