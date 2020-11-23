var UNIT = {
    initL: function () {
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "product/unit/ajaxget",
                type: 'POST',
                data: function (d) {
                    setTimeout(UNIT.initButton, 1000);
                }
            }
        });
        $(".c-l-cn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("product/unit/new", function (data) {
                $('#mainContent').html(data);
            });
        });
        UNIT.initButton();
        COMMON.getUserRole();
    },
    initButton:function(){
        COMMON.getUserRole();
        $(".s-l-e").on("click", function (e) {
            var id=$(this).attr('data-id');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('/product/unit/edit/'+id, function (data) {
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
                $.get('/product/unit/delete/'+cid, function (data) {
                    $('#datatable').DataTable().ajax.reload(null, false);
                    COMMON.shownotification('error', 'Unit deleted successfully!!!');
                });
            });

        });
    },
    initPU: function () {
        $('#frmCNew').parsley();
        $('#frmCNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                UNIT.submitPUNewFrm();
            }
        });
        $(".c-n-b").on("click", function (e) {
            location.reload();
        });
    },
    submitPUNewFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var data = {
        	name: $("#unit").val(),
        	uid: $("#uid").val()
        }
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'product/unit/save',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code > 0) {
                        $('#mainContent').html("<div class='loading'></div>");
                        $.get("product/unit", function (data) {
                            $('#mainContent').html(data);

                        });
           
                    var msg = '';
                    if ($("#uid").val() !== 'undefined')
                        msg = 'Unit updated successfully!!!';
                    else
                        msg = 'Unit created successfully!!!';
                    COMMON.shownotification('success', msg);
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
    
};