var FEATURE = {
    initPFL: function () {
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "product/prod_feature/ajaxget",
                type: 'POST',
                data: function (d) {
                    setTimeout(FEATURE.initButton, 1000);
                }
            }
        });

        $(".s-l-cn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("product/prod_feature/new", function (data) {
                $('#mainContent').html(data);
            });
        });
        FEATURE.initButton();
        COMMON.getUserRole();
        

        
    },
    initButton:function(){
        COMMON.getUserRole();
        $(".s-l-e").on("click", function (e) {
            var id=$(this).attr('data-id');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('product/prod_feature/edit/'+id, function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-si").on("click", function (e) {
        $('#mainContent').html("<div class='loading'></div>");
        $.get('product/prod_feature/subfeature/' + $(this).attr('data-id'), function (data) {
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
                $.get('product/prod_feature/delete/'+cid, function (data) {
                    //$('#datatable').DataTable().ajax.reload();
                    $('#datatable').DataTable().ajax.reload(null, false);
                    COMMON.shownotification('error', 'product feature deleted successfully!!!');
                });
            });

        });
    },
    initPFN: function () {
        $('#frmCNew').parsley();
        $('#frmCNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                FEATURE.submitPFNnewFrm();
            }
        });
        $(".c-n-b").on("click", function (e) {
            location.reload();
        });
    },
    initSPFL:function () {
        var psid = $('#psid').val();
        $('#datatable1').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "product/prod_feature/ajaxsubfeatureget/"+ psid,
                type: 'POST',
                data: function (d) {
                    setTimeout(FEATURE.inititemButton, 1000);
                }
            }
        });
        $(".c-n-b").on("click", function (e) {
            location.reload();
        });
        $(".s-l-psfn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("product/prod_feature/subfeaturenew/"+psid, function (data) {
                $('#mainContent').html(data);
            });
        });
        FEATURE.inititemButton();
        COMMON.getUserRole();
        

        
    },
    inititemButton:function(){
        COMMON.getUserRole();
        $(".s-l-ie").on("click", function (e) {
            var id=$(this).attr('data-id');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('product/prod_feature/subfeatureedit/'+id, function (data) {
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
                $.get('product/prod_feature/subfeaturedelete/'+cid, function (data) {
                    //$('#datatable').DataTable().ajax.reload();
                    $('#datatable1').DataTable().ajax.reload(null, false);
                    COMMON.shownotification('error', 'product Sub Feature deleted successfully!!!');
                });
            });

        });
    },
    initPSFN: function () {
        $('#frmCNew').parsley();
        $('#frmCNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                FEATURE.submitPSFNnewFrm();
            }
        });
        $(".c-n-b").on("click", function (e) {
            var psid = $('#psid').val();
             $('#mainContent').html("<div class='loading'></div>");
            $.get("product/prod_feature/subfeature/"+psid, function (data) {
                $('#mainContent').html(data);
            });
        });
        $("#type").on("change", function () {
            $(".bar-cls").hide();
            $(".forge-cls").hide();
            if ($(this).val() == 'bar') {
                $(".bar-cls").show();
                $(".forge-cls").hide();
            }
            else if($(this).val() == 'forging'){
                $(".bar-cls").hide();
                $(".forge-cls").show();
            }
        });
    },
    submitPFNnewFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var data = {
            prod_feature_name: $("#prod_feature_name").val(),
            component_category: $("#component_category").val(),
            pfid: $("#pfid").val(),

        }
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'product/prod_feature/save',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                  
                        $('#mainContent').html("<div class='loading'></div>");
                        $.get("product/prod_feature", function (data) {
                            $('#mainContent').html(data);

                        });
           
                    var msg = '';
                    if ($("#pfid").val() !== 'undefined')
                        msg = 'Product Feature updated successfully!!!';
                    else
                        msg = 'Product Feature created successfully!!!';
                    COMMON.shownotification('success', msg);
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
    submitPSFNnewFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var psid = $("#psid").val()
        var data = {
            prod_sub_feature_name: $("#prod_sub_feature_name").val(),
            type: $("#type").val(),
            length: $("#length").val(),
            diameter: $("#diameter").val(),
            unit: $("#unit").val(),
            forging: $("#forging").val(),
            psid:psid,
            pisid: $("#pisid").val(),
        }
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'product/prod_feature/subfeaturesave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                  
                        $('#mainContent').html("<div class='loading'></div>");
                        $.get("product/prod_feature/subfeature/"+psid, function (data) {
                            $('#mainContent').html(data);

                        });
           
                    var msg = '';
                    if ($("#pisid").val() !== 'undefined')
                        msg = 'Product Sub Feature updated successfully!!!';
                    else
                        msg = 'Product Sub Feature created successfully!!!';
                    COMMON.shownotification('success', msg);
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
};