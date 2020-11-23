var SPECIFICATION = {
    initPSL: function () {
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "product/prod_specification/ajaxget",
                type: 'POST',
                data: function (d) {
                    setTimeout(SPECIFICATION.initButton, 1000);
                }
            }
        });
        $(".s-l-cn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("product/prod_specification/new", function (data) {
                $('#mainContent').html(data);
            });
        });
        SPECIFICATION.initButton();
        COMMON.getUserRole();
    },
    initButton:function(){
        COMMON.getUserRole();
        $(".s-l-e").on("click", function (e) {
            var id=$(this).attr('data-id');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('product/prod_specification/edit/'+id, function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-si").on("click", function (e) {
        $('#mainContent').html("<div class='loading'></div>");
        $.get('product/prod_specification/specification_item/' + $(this).attr('data-id'), function (data) {
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
                $.get('product/prod_specification/delete/'+cid, function (data) {
                    //$('#datatable').DataTable().ajax.reload();
                    $('#datatable').DataTable().ajax.reload(null, false);
                    COMMON.shownotification('error', 'product specifiction deleted successfully!!!');
                });
            });
        });
    },
    initPSN: function () {
        $('#frmCNew').parsley();
        $('#frmCNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                SPECIFICATION.submitPSNnewFrm();
            }
        });
        $(".c-n-b").on("click", function (e) {
            location.reload();
        });
    },
    initPSIL:function () {
        var psid = $('#psid').val();
        $('#datatable1').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "product/prod_specification/ajaxspeficitemget/"+ psid,
                type: 'POST',
                data: function (d) {
                    setTimeout(SPECIFICATION.inititemButton, 1000);
                }
            }
        });
        $(".c-n-b").on("click", function (e) {
            location.reload();
        });
        $(".s-l-psicn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("product/prod_specification/specificitemnew/"+psid, function (data) {
                $('#mainContent').html(data);
            });
        });
        SPECIFICATION.inititemButton();
        //COMMON.getUserRole();
        

        
    },
    inititemButton:function(){
        //COMMON.getUserRole();
        $(".s-l-ie").on("click", function (e) {
            var id=$(this).attr('data-id');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('product/prod_specification/specificitemedit/'+id, function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-id").on("click", function (e) {
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
                $.get('product/prod_specification/specificitemdelete/'+cid, function (data) {
                    //$('#datatable').DataTable().ajax.reload();
                    $('#datatable1').DataTable().ajax.reload(null, false);
                    COMMON.shownotification('error', 'product specifiction item deleted successfully!!!');
                });
            });

        });
    },
    initPSIN: function () {
        $('#frmCNew').parsley();
        $('#frmCNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                SPECIFICATION.submitPSINnewFrm();
            }
        });
        $(".c-n-b").on("click", function (e) {
            var psid = $('#psid').val();
             $('#mainContent').html("<div class='loading'></div>");
            $.get("product/prod_specification/specification_item/"+psid, function (data) {
                $('#mainContent').html(data);
            });
        });
    },
    submitPSNnewFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var data = {
            specification_name: $("#specification_name").val(),
            specification_no: $("#specification_no").val(),
            psid: $("#psid").val(),



        }
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'product/prod_specification/save',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                  
                        $('#mainContent').html("<div class='loading'></div>");
                        $.get("product/prod_specification", function (data) {
                            $('#mainContent').html(data);

                        });
           
                    var msg = '';
                    if ($("#psid").val() !== 'undefined')
                        msg = 'Product Specification updated successfully!!!';
                    else
                        msg = 'Product Specification created successfully!!!';
                    COMMON.shownotification('success', msg);
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
    submitPSINnewFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var psid = $("#psid").val()
        var data = {
            specification_item_name: $("#specification_item_name").val(),
            specification_item_code: $("#specification_item_code").val(),
            specification_item_short_code: $("#specification_item_shortcode").val(),
            psid:psid,
            pisid: $("#pisid").val(),
        }
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'product/prod_specification/specificitemsave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                  
                        $('#mainContent').html("<div class='loading'></div>");
                        $.get("product/prod_specification/specification_item/"+psid, function (data) {
                            $('#mainContent').html(data);

                        });
           
                    var msg = '';
                    if ($("#pisid").val() !== 'undefined')
                        msg = 'Product Specification Item updated successfully!!!';
                    else
                        msg = 'Product Specification Item created successfully!!!';
                    COMMON.shownotification('success', msg);
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },

    
};