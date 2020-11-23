var VENDOR = {
    initC: function () {
        $('#datatable').DataTable({
            "processing": true,
            "serverSide": true,
            "stateSave": true,
            "ajax": {
                "url": "/customer/vendor/ajaxget",
                type: 'POST',
                "data": function (d) {
                    setTimeout(VENDOR.initButton, 1000);
                }
            }
        });
        $(".c-l-cn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("/customer/vendor/new", function (data) {
                $('#mainContent').html(data);
            });
        });
        COMMON.getUserRole();
        VENDOR.initButton();
    },
    initButton: function () {
        COMMON.getUserRole();
        $('#datatable').on("click", ".c-l-e", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get('/customer/vendor/edit/' + $(this).attr('data-id'), function (data) {
                $('#mainContent').html(data);
            });
        });
        $('#datatable').on("click", ".c-l-d", function (e) {
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
                $.get('/customer/vendor/delete/' + cid, function (data) {
                    $('#datatable').DataTable().ajax.reload(null, false);
                    COMMON.shownotification('error', 'Vendor deleted successfully!!!');
                });
            });

        });
    },
    initCN: function () {
        COMMON.getUserRole();
        $(".select2").select2();
        $('#frmCNew').parsley();
        $('#frmCNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                VENDOR.submitCNewFrm();
            }
        });
        $(".c-n-b").on("click", function (e) {
            location.reload();
        });
    },
    submitCNewFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var data = {name: $("#name").val(),
            company_name: $("#company_name").val(),
            ph: $("#ph").val(),
            email: $("#email").val(),
            web: $("#web").val(),
            gst: $("#gst").val(),
            code: $("#code").val(),
            pan: $("#pan").val(),
            address: $("#address").val(),
            city: $("#city").val(),
            state: $("#state").val(),
            country: $("#country").val(),
            currency: $("#currency").val(),
            zip: $("#zip").val(),
            opening_balance: $("#opening_balance").val(),
            opening_balance_type: $("#opening_balance_type").val(),
            payment_terms: $("#payment_terms").val(),
            credit_limit: $("#credit_limit").val(),
            gst_applicable: $("#gst_applicable").val(),
            cid: $("#cid").val(),
            sid: $("#sid").val()};
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/customer/vendor/save',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("/customer/vendor", function (data) {
                        $('#mainContent').html(data);
                        var msg = '';
                        if ($("#cid").val() !== 'undefined')
                            msg = 'Vendor updated successfully!!!';
                        else
                            msg = 'Vendor created successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                } else if (res.code == 2) {
                    COMMON.shownotification('error', res.msg);
                } else {
                    COMMON.shownotification('error', 'Unable to save vendor!!!');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
};