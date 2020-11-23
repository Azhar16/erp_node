var ASSET = {
    customer: [],
    initAL: function () {
        //$('#datatable').DataTable();
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "asset/asset/ajaxget",
                type: 'POST',
                data: function (d) {
                    setTimeout(ASSET.initButton, 1000);
                }
            }
        });
        $(".s-l-cn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("asset/asset/new", function (data) {
                $('#mainContent').html(data);
            });
        });
        ASSET.initButton();
        COMMON.getUserRole();

    },
    initButton:function(){
        COMMON.getUserRole();
        $(".s-l-e").on("click", function (e) {
            var id=$(this).attr('data-id');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('/asset/asset/edit/'+id, function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-dv").on("click", function (e) {
            $.get('/asset/asset/docview/' + $(this).attr('data-id'), function (data) {
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
                $.get('/asset/asset/delete/'+cid, function (data) {
                    //$('#datatable').DataTable().ajax.reload();
                    $('#datatable').DataTable().ajax.reload(null, false);
                    COMMON.shownotification('error', 'Asset deleted successfully!!!');
                });
            });

        });
    },
    initAN: function () {
       COMMON.getUserRole();
        $(".select2").select2();
        $('#frmSNew').parsley();
        $('#frmSNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                ASSET.submitANewFrm();
            }
        });
        $(".s-n-bk").on("click", function (e) {
            location.reload();
        });
        
    },
    submitANewFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        
        var assetdoc = $('#asset_doc').val();        
        var data = {
            asset_no: $("#asset_no").val(),
            asset_type: $("#asset_type").val(),
            asset_name: $("#asset_name").val(),
            buying_price: $("#buying_price").val(),
            assetid: $("#assetid").val(),
        };
        
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/asset/asset/save',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code > 0) {
                if(assetdoc != ''){
                      ASSET.submitAdocNewFrm(res.code);
                      }
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("/asset/asset", function (data) {
                        
                        $('#mainContent').html(data);
                        var msg = '';
                        if ($("#assetid").val() !== 'undefined')
                            msg = 'Asset updated successfully!!!';
                        else
                            msg = 'Asset created successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                } else {
                    COMMON.shownotification('error', 'Unable to save Asset!!!');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
    initADV :function(){
        COMMON.getUserRole();
      $('#frmSNew').parsley();
      var sid = $("#sid").val();
        $('#frmSNew').unbind("submit").submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                ASSET.submitAdocNewFrm(sid);
            }
        });
        $(".s-n-bk").on("click", function (e) {
            location.reload();
        });  
        $(".doc-dlt").on("click", function (e) {
            var cid = $("#docid").val();
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
                $.get('/asset/asset/docdelete/' + cid, function (data) {
                    $.get("/asset/asset", function (data) {
                        $('#mainContent').html(data);
                        COMMON.shownotification('error', 'Document deleted successfully!!!');
                    });
                    
                });
            });

        });
    },
   submitAdocNewFrm: function (id) {
        $("body").css('cursor', 'wait');
        var files = $('#asset_doc').get(0).files[0];
        var formData = new FormData();
        formData.append('assetid',id);
        formData.append('oasset_doc',$("#oasset_doc").val());
        formData.append('imgid',$("#imgid").val());
        if(typeof (files)==='undefined')
            formData.append('asset_doc','');
        else
            formData.append('asset_doc',files,files.name); 
        
        //console.log(formData);

        $.ajax({
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            url: '/asset/asset/savedocument',
            complete: function (xhr) {
                 var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    $.get("/asset/asset", function (data) {
                        $('#mainContent').html(data);
                    });
                } else {
                    $(".loginmessage").css('color','#f90000');
                    $(".loginmessage").html(res.msg);
                }
                $("body").css('cursor', 'default');
            },
        });
    },

};