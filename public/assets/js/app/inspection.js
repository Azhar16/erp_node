var INSPECTION = {
    initIL:function(){
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "/sales/inspection/ajaxget",
                type: 'POST',
                data: function (d) {
                    setTimeout(INSPECTION.initButton, 1000);
                }
            }
        });
        $(".su-l-cn").on("click",function(e){
            $('#mainContent').html("<div class='loading'></div>");
            $.get("/sales/inspection/new", function (data) {
                $('#mainContent').html(data);
            });
        });
        INSPECTION.initButton();
        COMMON.getUserRole();
    },
    initButton:function(){
        COMMON.getUserRole();
        $(".s-l-e").on("click", function (e) {
            var id=$(this).attr('data-id');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('/sales/inspection/edit/'+id , function (data) {
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
                $.get('/sales/inspection/delete/'+cid, function (data) {
                    $('#datatable').DataTable().ajax.reload(null, false);
                    COMMON.shownotification('error', 'Inspection deleted successfully!!!');
                });
            });

        });
    },
    initIN:function(){
        COMMON.getUserRole();
        $('#frmSUNew').parsley();
        $('#frmSUNew').submit(function(e) {
            e.preventDefault();
            if ( $(this).parsley().isValid() ) {
                INSPECTION.submitINewFrm();
            }
        });
        $(".su-n-b").on("click",function(e){
            $('#mainContent').html("<div class='loading'></div>");
            $.get("/sales/inspection", function (data) {
                $('#mainContent').html(data);
            });
        });
    },
    submitINewFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var data = {label:$("#display_name").val(),
                    iid:$("#iid").val()
                };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/sales/inspection/save',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("/sales/inspection", function (data) {
                        $('#mainContent').html(data);
                        var msg='';
                        if($("#iid").val()!=='undefined')msg='Inspection updated successfully!!!';
                        else msg='Inspection created successfully!!!';
                        COMMON.shownotification('success',msg);
                    });
                } else {
                    COMMON.shownotification('error','Unable to save Inspection!!!');
                    $(".loginmessage").html('');
                }
                $("body").css('cursor', 'default');
            },
        });
    },
};