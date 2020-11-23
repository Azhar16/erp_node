var CUSTOMER = {
    initC: function () {
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "/customer/customer/ajaxget",
                type: 'POST',
                data: function (d) {
                    setTimeout(CUSTOMER.initButton, 1000);
                }
            }
        });
        $(".c-l-cn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("/customer/customer/new", function (data) {
                $('#mainContent').html(data);
            });
        });
        COMMON.getUserRole();
        CUSTOMER.initButton();
    },
    initButton: function () {
        COMMON.getUserRole();
        $('#datatable').on("click", ".c-l-s", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("/customer/customer/shippinglist/" + $(this).attr('data-id'), function (data) {
                $('#mainContent').html(data);
            });
        });
        $('#datatable').on("click", ".c-l-e", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get('/customer/customer/edit/' + $(this).attr('data-id'), function (data) {
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
                $.get('/customer/customer/delete/' + cid, function (data) {
                    $('#datatable').DataTable().ajax.reload(null, false);
                    COMMON.shownotification('error', 'Customer deleted successfully!!!');
                });
            });

        });
    },
    initCSh: function () {
        COMMON.getUserRole();
        $('#datatable').DataTable();
        $(".c-l-back").on("click", function (e) {
            location.reload();
        });
        $(".c-l-cn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("/customer/customer/shippingnew/" + $(this).attr('data-cid'), function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".c-l-e").on("click", function (e) {
            var cid = $('#cid').val();
            $('#mainContent').html("<div class='loading'></div>");
            $.get('/customer/customer/shippingedit/' + $(this).closest("td").attr('data-id') + '/' + cid, function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".c-l-d").on("click", function (e) {
            var sid = $(this).closest("td").attr('data-id');
            var cid = $('#cid').val();
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
                $('#mainContent').html("<div class='loading'></div>");
                $.get('/customer/customer/shippingdelete/' + sid + '/' + cid, function (data) {
                    $('#mainContent').html(data);
                    COMMON.shownotification('error', 'Customer shipping address deleted successfully!!!');
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
                CUSTOMER.submitCNewFrm();
            }
        });
        $(".c-n-b").on("click", function (e) {
            location.reload();
        });
        $('#ckSameShip').click(function () {
            if ($(this).prop("checked") == true) {
                $(".shipp-wrap").css("display", "none");
            } else {
                $(".shipp-wrap").css("display", "block");
            }
        });
    },
    initShippingN: function () {
        COMMON.getUserRole();
        $(".select2").select2();
        $('#frmCNew').parsley();
        $('#frmCNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                CUSTOMER.submitShippingNewFrm();
            }
        });
        $(".c-n-b").on("click", function (e) {
            var cid = $("#cid").val();
            $('#mainContent').html("<div class='loading'></div>");
            $.get("/customer/customer/shippinglist/" + cid, function (data) {
                $('#mainContent').html(data);
            });
        });
    },
    submitShippingNewFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var cid = $("#cid").val();
        var data = {label: $("#label").val(),
            saddress: $("#saddress").val(),
            scity: $("#scity").val(),
            sstate: $("#sstate").val(),
            scountry: $("#scountry").val(),
            szip: $("#szip").val(),
            gst: $("#gst").val(),
            cid: cid,
            sid: $("#sid").val()};
        //console.log(data);
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/customer/customer/shippingsave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    if ($("#modal_tag").val() == 'on') {
                        Custombox.modal.closeAll();
                    } else {
                        $('#mainContent').html("<div class='loading'></div>");
                        $.get("/customer/customer/shippinglist/" + cid, function (data) {
                            $('#mainContent').html(data);

                        });
                    }
                } else {
                    COMMON.shownotification('error', 'Unable to save customer shipping!!!');

                }
                var msg = '';
                if ($("#cid").val() !== 'undefined')
                    msg = 'Customer shipping updated successfully!!!';
                else
                    msg = 'Customer shipping created successfully!!!';
                COMMON.shownotification('success', msg);
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
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
            code: $("#code").val(),
            gst: $("#gst").val(),
            pan: $("#pan").val(),
            address: $("#address").val(),
            city: $("#city").val(),
            state: $("#state").val(),
            country: $("#country").val(),
            zip: $("#zip").val(),
            label: $("#label").val(),
            saddress: $("#saddress").val(),
            scity: $("#scity").val(),
            sstate: $("#sstate").val(),
            scountry: $("#scountry").val(),
            szip: $("#szip").val(),
            currency: $("#currency").val(),
            opening_balance: $("#opening_balance").val(),
            opening_balance_type: $("#opening_balance_type").val(),
            payment_terms: $("#payment_terms").val(),
            credit_limit: $("#credit_limit").val(),
            salesunit: $("#salesunit").val(),
            gst_applicable: $("#gst_applicable").val(),
            cid: $("#cid").val(),
            sid: $("#sid").val()};
        if ($('#ckSameShip').prop("checked") == true) {
            data.label = $("#company_name").val();
            data.saddress = $("#address").val();
            data.scity = $("#city").val();
            data.sstate = $("#state").val();
            data.scountry = $("#country").val();
            data.szip = $("#zip").val();
        }
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/customer/customer/save',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code > 0) {
                    if ($("#modal_tag").val() == 'on') {
                        Custombox.modal.closeAll();
                    } else {
                        $('#mainContent').html("<div class='loading'></div>");
                        $.get("/customer/customer", function (data) {
                            $('#mainContent').html(data);

                        });
                    }
                    var msg = '';
                    if ($("#cid").val() !== 'undefined')
                        msg = 'Customer updated successfully!!!';
                    else
                        msg = 'Customer created successfully!!!';
                    COMMON.shownotification('success', msg);
                    } else if (res.code == 'dup') {
                        COMMON.shownotification('error', res.msg);
                    } else {
                        COMMON.shownotification('error', 'Unable to save customer!!!');
                    }
                    $(".loginmessage").html('');
                    $("body").css('cursor', 'default');
            },
        });
    },
};