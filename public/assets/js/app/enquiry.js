var acceptenqueryid;
var ENQUIRY = {
    customer: [],
    initE: function () {
        //$('#datatable').DataTable();
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "sales/enquiry/ajaxget",
                type: 'POST',
                data: function (d) {
                    setTimeout(ENQUIRY.initButton, 1000);
                }
            }
        });
        $(".s-l-cn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("sales/enquiry/new", function (data) {
                $('#mainContent').html(data);
            });
        });
        ENQUIRY.initButton();
        COMMON.getUserRole();

        $("#approvedEnquiry").on("click",function(e){
             $("body").css('cursor', 'wait');

             var data = {acceptenqueryid:acceptenqueryid,
                         remarks:$("#remarks").val()
                         };
           
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'sales/enquiry/approvedEnquiry',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    $('#datatable').DataTable().ajax.reload(null, false);
                    var msg = '';
                        msg='Enquiry Accepted successfully!!!';
                        COMMON.shownotification('success', msg);
                } else {
                    $(".loginmessage").css('color','#f90000');
                    $(".loginmessage").html(res.msg);
                }
                $("body").css('cursor', 'default');
            },
        });
        });

        $("#rejectEnquiry").on("click",function(e){
             $("body").css('cursor', 'wait');

             var data = {acceptenqueryid:acceptenqueryid,
                         remarks:$("#remarks").val()
                         };

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'sales/enquiry/rejectEnquiry',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    $('#datatable').DataTable().ajax.reload(null, false);
                    var msg = '';
                        msg='Enquiry Rejected successfully!!!';
                        COMMON.shownotification('error', msg);
                } else {
                    $(".loginmessage").css('color','#f90000');
                    $(".loginmessage").html(res.msg);
                }
                $("body").css('cursor', 'default');
            },
        });
        });

        $("#enquiry_permission").on("click",function(e){
             $("body").css('cursor', 'wait');
              console.log('jjigd '+$(".s-l-cp").attr('data-id'));
                var doc = $('#change_doc').get(0).files[0];
                var formData = new FormData();
                formData.append('remarks',$("#change_remarks").val());
                formData.append('ep_id',$(".s-l-cp").attr('data-id'));

                if(typeof (doc)==='undefined'){
                    formData.append('change_doc','');
                }

                else{
                
                       formData.append('change_doc',doc,doc.name);         
                    
                }            

        $.ajax({
            type: 'POST',
            data: formData,
            contentType: 'application/json',
            processData: false,
            contentType: false,
            url: 'sales/enquiry/enquirypermission',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    $('#datatable').DataTable().ajax.reload(null, false);
                    var msg = '';
                        msg='Change permission For Enquiry Send successfully!!!';
                        COMMON.shownotification('success', msg);
                } else {
                    $(".loginmessage").css('color','#f90000');
                    $(".loginmessage").html(res.msg);
                }
                $("body").css('cursor', 'default');
            },
        });
        });
    },
    initButton:function(){
        COMMON.getUserRole();
        $(".s-l-e").on("click", function (e) {
            var id=$(this).attr('data-id');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('/sales/enquiry/edit/'+id, function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-sc").on("click", function (e) {
          acceptenqueryid = $(this).attr('data-id');
            $('#myModal').modal('show');
        });
        $(".s-l-cp").on("click", function (e) {
          var id = $(this).attr('data-id');
            $('#myChangeModal').modal('show');
        });
        /*$(".s-l-v").on("click", function (e) {
        $('#mainContent').html("<div class='loading'></div>");
        $.get('/enquiry/newoffer/' + $(this).attr('data-id'), function (data) {
            $('#mainContent').html(data);
        });
        });*/
        $(".s-l-dv").on("click", function (e) {
            $.get('/sales/enquiry/docview/' + $(this).attr('data-id'), function (data) {
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
                $.get('/sales/enquiry/delete/'+cid, function (data) {
                    //$('#datatable').DataTable().ajax.reload();
                    $('#datatable').DataTable().ajax.reload(null, false);
                    COMMON.shownotification('error', 'Enquiry deleted successfully!!!');
                });
            });

        });
    },
    initEN: function () {
       COMMON.getUserRole();
        $("#salesagent").select2();
        $('#frmSNew').parsley();
        $('#frmSNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                ENQUIRY.submitENewFrm();
            }
        });
        $(".s-n-bk").on("click", function (e) {
            location.reload();
        });
        $(".custom-modal-button").on("click", function (e) {
            COMMON.loadCustomModal(this);
        });
        $(".new-shipping").on("click", function (e) {
            if (typeof ENQUIRY.customer.id !== 'undefined' ){
                $(this).attr('data-href','/customer/customer/shippingnew/'+ENQUIRY.customer.id);
                COMMON.loadCustomModal(this,ENQUIRY.getShipping);
            }else{
                COMMON.shownotification('error', 'Select a customer firest!!!');
            }
        });
        $("#shipping").on("change", function() {
            $.get('/customer/customer/shippingbyid/' + $(this).val(), function (data) {
                var sd = JSON.parse(data);
                ENQUIRY.customer.state=sd[0].state;
            });
        });
        jQuery('#query_date').datepicker({
                autoclose: true,
                todayHighlight: true
            });
        jQuery('#bid_opening_date').datepicker({
                autoclose: true,
                todayHighlight: true
            });
        $("#earn_money").on("change", function () {
            $(".earn-amount").hide();
            if ($(this).val() == 'yes') {
                $(".earn-amount").show();
            }
        });
        $("#customer").autocomplete({
            source: function (request, response) {
                $.ajax({
                    url: "/customer/customer/autocustomer/" + request.term,
                    dataType: "jsonp",
                    type: "GET",
                    data: {
                        term: request.term
                    },
                    complete: function (data) {
                        response($.map(JSON.parse(data.responseText), function (item) {
                            return {
                                label: item.name,
                                value: item.name,
                                id: item.id,
                            };
                        }));
                    },
                    search: function (e, u) {
                        $(this).addClass('loader');
                    },
                    response: function (e, u) {
                        $(this).removeClass('loader');
                    },
                    error: function (xhr) {

                    }
                });
            },
            minLength: 3,
            select: function (event, ui) {
                $.get('/customer/customer/vendorbyid/' + ui.item.id, function (data) {
                    ENQUIRY.customer = JSON.parse(data);
                   // $('#payment_due_date option[value="' + ENQUIRY.customer.payment_terms + '"]').prop('selected', true);
                    ENQUIRY.getShipping();
                });
                
            }
        });
    },
    initEE: function (cus) {
        COMMON.getUserRole();
        $("#salesagent").select2();
        $('#frmSNew').parsley();
        $('#frmSNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                ENQUIRY.submitENewFrm();
            }
        });
        $(".s-n-bk").on("click", function (e) {
            location.reload();
        });
        $(".custom-modal-button").on("click", function (e) {
            COMMON.loadCustomModal(this);
        });
        $(".new-shipping").on("click", function (e) {
            if (typeof ENQUIRY.customer.id !== 'undefined' ){
                $(this).attr('data-href','/customer/customer/shippingnew/'+ENQUIRY.customer.id);
                COMMON.loadCustomModal(this,ENQUIRY.getShipping);
            }else{
                COMMON.shownotification('error', 'Select a customer first!!!');
            }
        });
        $("#shipping").on("change", function() {
            $.get('/customer/customer/shippingbyid/' + $(this).val(), function (data) {
                var sd = JSON.parse(data);
                ENQUIRY.customer.state=sd[0].state;
            });
        });
        jQuery('#query_date').datepicker({
                autoclose: true,
                todayHighlight: true
            });
        jQuery('#bid_opening_date').datepicker({
                autoclose: true,
                todayHighlight: true
            });
        $("#earn_money").on("change", function () {
            $(".earn-amount").hide();
            if ($(this).val() == 'yes') {
                $(".earn-amount").show();
            }
        });
        $("#customer").autocomplete({
            source: function (request, response) {
                $.ajax({
                    url: "/customer/customer/autocustomer/" + request.term,
                    dataType: "jsonp",
                    type: "GET",
                    data: {
                        term: request.term
                    },
                    complete: function (data) {
                        response($.map(JSON.parse(data.responseText), function (item) {
                            return {
                                label: item.name,
                                value: item.name,
                                id: item.id,
                            };
                        }));
                    },
                    search: function (e, u) {
                        $(this).addClass('loader');
                    },
                    response: function (e, u) {
                        $(this).removeClass('loader');
                    },
                    error: function (xhr) {

                    }
                });
            },
            minLength: 3,
            select: function (event, ui) {
                $.get('/customer/customer/vendorbyid/' + ui.item.id, function (data) {
                    ENQUIRY.customer = JSON.parse(data);
                   // $('#payment_due_date option[value="' + ENQUIRY.customer.payment_terms + '"]').prop('selected', true);
                    ENQUIRY.getShipping();
                });
                
            }
        });
        ENQUIRY.customer = cus;
    },

    getShipping:function(){
        $.get('/customer/customer/shipping/' + ENQUIRY.customer.id, function (data) {
            var sd = JSON.parse(data);
            var $ship=$('#shipping');
            $ship.empty();
            Object.keys(sd).forEach(function(k){
                if(k==0)
                    ENQUIRY.customer.state==sd[k].state;
                $ship.append($("<option></option>").attr("value", sd[k].id).text(sd[k].label));
            });
        });
    },
    submitENewFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        
        var enquirydoc = $('#enquiry_doc').val();
        var data = {
            customer: ENQUIRY.customer.id,
            shipping: $("#shipping").val(),
            query_date: $("#query_date").val(),
            ref_no: $("#ref_no").val(),
            bank_guarnty: $("#bank_guarnty").val(),
            bank_guarnty_percentage: $("#bank_guarnty_percentage").val(),
            salesagent: $("#salesagent").val(),
            project_name: $("#project_name").val(),
            project_no: $("#project_no").val(),
            category: $("#category").val(),
            bid_opening_date: $("#bid_opening_date").val(),
            enquery_validity: $("#enquery_validity").val(),
            currency: $("#currency").val(),
            earn_money: $("#earn_money").val(),
            amount: $("#amount").val(),
            eid: $("#eid").val(),
            enquiry_no: $("#enquiry_no").val(),
        };
        
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/sales/enquiry/save',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code > 0) {
                    console.log("abc");
                    if(enquirydoc != ''){
                        console.log("enquirydoc "+enquirydoc);
                      ENQUIRY.submitEdocNewFrm(res.code);
                      }
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("/sales/enquiry", function (data) {
                        
                        $('#mainContent').html(data);
                        var msg = '';
                        if ($("#eid").val() !== 'undefined')
                            msg = 'Enquiry updated successfully!!!';
                        else
                            msg = 'Enquiry created successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                }
                else if(res.code == 'dup'){
                    COMMON.shownotification('error', 'Customer Enquiry No Already Exit!!!');
                } else {
                    COMMON.shownotification('error', 'Unable to save Enquiry!!!');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
    initEDV :function(){
        COMMON.getUserRole();
      $('#frmSNew').parsley();
      var sid = $("#sid").val();
        $('#frmSNew').unbind("submit").submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                ENQUIRY.submitEdocNewFrm(sid);
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
                $.get('/sales/enquiry/docdelete/' + cid, function (data) {
                    $.get("/sales/enquiry", function (data) {
                        $('#mainContent').html(data);
                        COMMON.shownotification('error', 'Document deleted successfully!!!');
                    });
                    
                });
            });

        });
    },
   submitEdocNewFrm: function (id) {
        $("body").css('cursor', 'wait');
        var files = $('#enquiry_doc').get(0).files[0];
        var formData = new FormData();
        formData.append('enquiryid',id);
        formData.append('oenquiry_doc',$("#oenquiry_doc").val());
        formData.append('imgid',$("#imgid").val());
        if(typeof (files)==='undefined')
            formData.append('enquiry_doc','');
        else
            formData.append('enquiry_doc',files,files.name); 
        //console.log(formData);
        $.ajax({
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            url: '/sales/enquiry/savedocument',
            complete: function (xhr) {
                 var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    $.get("/sales/enquiry", function (data) {
                        $('#mainContent').html(data);
                        var msg='';
                        if(id!=='undefined')msg='Document updated successfully!!!';
                        else msg='Document created successfully!!!';
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

};