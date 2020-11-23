var APARTNER={
    initAPL: function () {
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "asset/assetpartner/ajaxget",
                type: 'POST',
                data: function (d) {
                    setTimeout(APARTNER.initButton, 1000);
                }
            }
        });
        $(".s-l-cn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("asset/assetpartner/new", function (data) {
                $('#mainContent').html(data);
            });
        });
        APARTNER.initButton();
        COMMON.getUserRole();

    },
    initButton:function(){
        COMMON.getUserRole();
        $(".s-l-e").on("click", function (e) {
            var id=$(this).attr('data-id');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('/asset/assetpartner/edit/'+id, function (data) {
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
                $.get('/asset/assetpartner/delete/'+cid, function (data) {
                    //$('#datatable').DataTable().ajax.reload();
                    $('#datatable').DataTable().ajax.reload(null, false);
                    COMMON.shownotification('error', 'Asset Partner deleted successfully!!!');
                });
            });

        });
    },
   initAPN:function(){
        $('#frmCUser').parsley();
        $('#frmCUser').submit(function(e) {
            e.preventDefault();
            if ( $(this).parsley().isValid() ) {
                APARTNER.submitAPartnerNFrm();
            }
        });
        $(".b-u-b").on("click",function(e){
            $('#mainContent').html("<div class='loading'></div>");
            $.get("/asset/assetpartner", function (data) {
                $('#mainContent').html(data);
            });
        });
    },
    initALL: function () {
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "asset/assetpartner/ajaxLocget",
                type: 'POST',
                data: function (d) {
                    setTimeout(APARTNER.initLocButton, 1000);
                }
            }
        });


        $(".s-l-cn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("asset/assetpartner/locnew", function (data) {
                $('#mainContent').html(data);
            });
        });
        APARTNER.initButton();
        COMMON.getUserRole();

    },
    initLocButton:function(){
        COMMON.getUserRole();
        $(".s-l-e").on("click", function (e) {
            var id=$(this).attr('data-id');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('/asset/assetpartner/locedit/'+id, function (data) {
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
                $.get('/asset/assetpartner/locdelete/'+cid, function (data) {
                    $('#datatable').DataTable().ajax.reload(null, false);
                    COMMON.shownotification('error', 'Asset Location deleted successfully!!!');
                });
            });

        });
    },
   initALN:function(){
   	$(".select2").select2();
        $('#frmCUser').parsley();
        $('#frmCUser').submit(function(e) {
            e.preventDefault();
            if ( $(this).parsley().isValid() ) {
                APARTNER.submitALocNFrm();
            }
        });
        $(".b-u-b").on("click",function(e){
            $('#mainContent').html("<div class='loading'></div>");
            $.get("/asset/assetpartner/aLocation", function (data) {
                $('#mainContent').html(data);
            });
        });
    },
    submitAParnerNFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var files = $('#logo').get(0).files[0];
        var formData = new FormData();
        formData.append('name',$("#name").val());
        formData.append('ph',$("#ph").val());
        formData.append('uid',$("#uid").val());
        formData.append('address',$("#address").val());
        formData.append('email',$("#email").val());
        formData.append('ologo',$("#ologo").val());
        formData.append('id',$("#id").val());
        if(typeof (files)==='undefined')
            formData.append('logo','');
        else
            formData.append('logo',files,files.name);
        $.ajax({
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            url: '/asset/assetpartner/save',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code > 0) {
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("/asset/assetpartner", function (data) {
                        $('#mainContent').html(data);
                        var msg='';
                        if($("#id").val()!=='undefined')msg='Asset Partner updated successfully!!!';
                        else msg='Asset Partner created successfully!!!';
                        COMMON.shownotification('success',msg);
                    });
                } else {
                    $(".loginmessage").css('color','#f90000');
                    $(".loginmessage").html(res.msg);
                }
                $("body").css('cursor', 'default');
            },
        });
    },
    submitALocNFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var data = {label: $("#label").val(),
            address: $("#address").val(),
            city: $("#city").val(),
            state: $("#state").val(),
            country: $("#country").val(),
            zip: $("#zip").val(),
            sid: $("#sid").val()};
        //console.log(data);
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/asset/assetpartner/locsave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                 if (res.code > 0) {
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("/asset/assetpartner/alocation", function (data) {
                        
                        $('#mainContent').html(data);
                        var msg = '';
                        if ($("#sid").val() !== 'undefined')
                            msg = 'Asset Location updated successfully!!!';
                        else
                            msg = 'Asset Location created successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                } else {
                    COMMON.shownotification('error', 'Unable to save Asset Location!!!');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
}