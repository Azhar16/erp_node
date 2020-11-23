var ASSETTYPE = {
    initATL: function () {
        //$('#datatable').DataTable();
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "asset/assettype/ajaxget",
                type: 'POST',
                data: function (d) {
                    setTimeout(ASSETTYPE.initButton, 1000);
                }
            }
        });
        $(".s-l-cn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("asset/assettype/new", function (data) {
                $('#mainContent').html(data);
            });
        });
        ASSETTYPE.initButton();
        COMMON.getUserRole();

    },
    initButton:function(){
        COMMON.getUserRole();
        $(".s-l-e").on("click", function (e) {
            var id=$(this).attr('data-id');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('/asset/assettype/edit/'+id, function (data) {
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
                $.get('/asset/assettype/delete/'+cid, function (data) {
                    //$('#datatable').DataTable().ajax.reload();
                    $('#datatable').DataTable().ajax.reload(null, false);
                    COMMON.shownotification('error', 'Asset Type deleted successfully!!!');
                });
            });

        });
    },
    initATN: function () {
       COMMON.getUserRole();
        $(".select2").select2();
        $('#frmSNew').parsley();
        $('#frmSNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                ASSETTYPE.submitATNewFrm();
            }
        });
        $("#category_type").on("change", function () {
            $(".act-cls").hide();
            if ($(this).val() == 'depreciation') {
                $(".act-cls").show();
            }
        });
        $(".s-n-bk").on("click", function (e) {
            location.reload();
        });
        
    },
    submitATNewFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        
        var data = {
            tname: $("#tname").val(),
            useful_life:$("#useful_life").val(),
            category_type: $("#category_type").val(),
            aincometax: $("#aincometax").val(),
            acompanyact: $("#acompanyact").val(),
            adescription: $("#adescription").val(),
            atid: $("#atid").val(),
        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/asset/assettype/save',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code > 0) {
               $('#mainContent').html("<div class='loading'></div>");
                    $.get("/asset/assettype", function (data) {
                        $('#mainContent').html(data);
                        var msg = '';
                        if ($("#atid").val() !== 'undefined')
                            msg = 'Asset Type updated successfully!!!';
                        else
                            msg = 'Asset Type created successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                } else {
                    COMMON.shownotification('error', 'Unable to save Asset Type!!!');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
   
};