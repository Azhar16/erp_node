var SPECIAL = {
    initSSL: function () {
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "sales/special_services/ajaxget",
                type: 'POST',
                data: function (d) {
                    setTimeout(SPECIAL.initButton, 1000);
                }
            }
        });
        $(".s-l-cn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("sales/special_services/new", function (data) {
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
            $.get('sales/special_services/edit/'+id, function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-si").on("click", function (e) {
        $('#mainContent').html("<div class='loading'></div>");
        $.get('sales/special_services/subservice/' + $(this).attr('data-id'), function (data) {
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
                $.get('sales/special_services/delete/'+cid, function (data) {
                    //$('#datatable').DataTable().ajax.reload();
                    $('#datatable').DataTable().ajax.reload(null, false);
                    COMMON.shownotification('error', 'Special Service deleted successfully!!!');
                });
            });
        });
    },
    initSSN: function () {
        $('#frmCNew').parsley();
        $('#frmCNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                SPECIAL.submitSSNnewFrm();
            }
        });
        $(".c-n-b").on("click", function (e) {
            location.reload();
        });
    },
    initSSSL:function () {
        var ssid = $('#ssid').val();
        $('#datatable1').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "sales/special_services/ajaxsubget/"+ ssid,
                type: 'POST',
                data: function (d) {
                    setTimeout(SPECIAL.inititemButton, 1000);
                }
            }
        });
        $(".c-n-b").on("click", function (e) {
            location.reload();
        });
        $(".s-l-cn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("sales/special_services/subnew/"+ssid, function (data) {
                $('#mainContent').html(data);
            });
        });
        SPECIAL.inititemButton();
        //COMMON.getUserRole();
        

        
    },
    inititemButton:function(){
        //COMMON.getUserRole();
        $(".s-l-ie").on("click", function (e) {
            var id=$(this).attr('data-id');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('sales/special_services/subedit/'+id, function (data) {
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
                $.get('sales/special_services/subdelete/'+cid, function (data) {
                    //$('#datatable').DataTable().ajax.reload();
                    $('#datatable1').DataTable().ajax.reload(null, false);
                    COMMON.shownotification('error', 'Sub service deleted successfully!!!');
                });
            });

        });
    },
    initSSSN: function () {
        $('#frmCNew').parsley();
        $('#frmCNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                SPECIAL.submitSSSNnewFrm();
            }
        });
        $(".c-n-b").on("click", function (e) {
            var ssid = $('#ssid').val();
             $('#mainContent').html("<div class='loading'></div>");
            $.get("sales/special_services/subservice/"+ssid, function (data) {
                $('#mainContent').html(data);
            });
        });
    },
    submitSSNnewFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var data = {
            special_service: $("#special_service").val(),
            special_service_no: $("#special_service_no").val(),
            ssid: $("#ssid").val(),



        }
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'sales/special_services/save',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                  
                        $('#mainContent').html("<div class='loading'></div>");
                        $.get("sales/special_services", function (data) {
                            $('#mainContent').html(data);

                        });
           
                    var msg = '';
                    if ($("#ssid").val() !== 'undefined')
                        msg = 'Special Service updated successfully!!!';
                    else
                        msg = 'Special Service created successfully!!!';
                    COMMON.shownotification('success', msg);
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
    submitSSSNnewFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var ssid = $("#ssid").val()
        var data = {
            sub_special_service: $("#sub_special_service").val(),
            sub_special_service_no: $("#sub_special_service_no").val(),
            ssid:ssid,
            sssid: $("#sssid").val(),
        }
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'sales/special_services/subsave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                  
                        $('#mainContent').html("<div class='loading'></div>");
                        $.get("sales/special_services/subservice/"+ssid, function (data) {
                            $('#mainContent').html(data);

                        });
           
                    var msg = '';
                    if ($("#sssid").val() !== 'undefined')
                        msg = 'Sub Service updated successfully!!!';
                    else
                        msg = 'Sub Service created successfully!!!';
                    COMMON.shownotification('success', msg);
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },

    
};