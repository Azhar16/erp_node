var HYDRO = {
    initHTL: function () {
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "product/hydro_test/ajaxget",
                type: 'POST',
                data: function (d) {
                    setTimeout(HYDRO.initButton, 1000);
                }
            }
        });
        $(".c-l-cn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("product/hydro_test/new", function (data) {
                $('#mainContent').html(data);
            });
        });
        HYDRO.initButton();
        COMMON.getUserRole();
    },
    initButton:function(){
        COMMON.getUserRole();
        $(".s-l-e").on("click", function (e) {
            var id=$(this).attr('data-id');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('/product/hydro_test/edit/'+id, function (data) {
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
                $.get('/product/hydro_test/delete/'+cid, function (data) {
                    $('#datatable').DataTable().ajax.reload(null, false);
                    COMMON.shownotification('error', 'Hydro Test deleted successfully!!!');
                });
            });

        });
    },
    initHTN: function () {
        $('#frmCNew').parsley();
        $('#frmCNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                HYDRO.submitHTNewFrm();
            }
        });
        $(".c-n-b").on("click", function (e) {
            location.reload();
        });
    },
    submitHTNewFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var data = {
        	clas: $("#class_id").val(),
            body: $("#body").val(),
            seat: $("#seat").val(),
            back_seat: $("#back_seat").val(),
            seat_air: $("#seat_air").val(),
        	uid: $("#uid").val()
        }
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'product/hydro_test/save',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code > 0) {
                        $('#mainContent').html("<div class='loading'></div>");
                        $.get("/product/hydro_test", function (data) {
                            $('#mainContent').html(data);
                        });
                    var msg = '';
                    if ($("#uid").val() !== 'undefined')
                        msg = 'Hydro Test updated successfully!!!';
                    else
                        msg = 'Hydro Test created successfully!!!';
                    COMMON.shownotification('success', msg);
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
    
};