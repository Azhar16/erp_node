var WORKORDER = {
    customer: [],
    all_tax:[],
    hsn: '-1',
    gst: 0,
    comstate:'',
    print:'',
     pr:[],
    trim:[],
    stem:[],
    unit:[],
    state:[],
    cntry:[],
    spclsrvc:[],
    initWOL: function () {
        //$('#datatable').DataTable();
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "sales/workorder/ajaxget",
                type: 'POST',
                data: function (d) {
                    setTimeout(WORKORDER.initButton, 1000);
                }
            }
        });
        $(".s-l-cn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("sales/workorder/new", function (data) {
                $('#mainContent').html(data);
            });
        });
        WORKORDER.initButton();
        $("#approvedwo").on("click",function(e){
             $("body").css('cursor', 'wait');           
             var data = {
                     statusid:statusid,
                     remarks:$("#remarks").val()
                     };
           

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'sales/workorder/approvedwo',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    $('#datatable').DataTable().ajax.reload(null, false);
                    var msg = '';
                        msg='Workorder Accepted successfully!!!';
                        COMMON.shownotification('success', msg);
                }
                else if (res.code == 2) {
                    $('#datatable').DataTable().ajax.reload(null, false);
                    var msg = '';
                        msg='Product list empty please fill up to continue!!!';
                        COMMON.shownotification('error', msg);
                } else {
                    $(".loginmessage").css('color','#f90000');
                    $(".loginmessage").html(res.msg);
                }
                $("body").css('cursor', 'default');
            },
        });
        });

        $("#rejectwo").on("click",function(e){
             $("body").css('cursor', 'wait');

             var data = {
                     statusid:statusid,
                     remarks:$("#remarks").val(),
                     };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'sales/workorder/rejectwo',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    $('#datatable').DataTable().ajax.reload(null, false);
                    var msg = '';
                        msg='Workorder Rejected successfully!!!';
                        COMMON.shownotification('error', msg);
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
            $.get('sales/workorder/edit/'+id, function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-v").on("click", function (e) {
        $('#mainContent').html("<div class='loading'></div>");
        $.get('sales/workorder/techno_commercial/' + $(this).attr('data-id'), function (data) {
            $('#mainContent').html(data);
        });
        });
        $(".s-l-di").on("click", function (e) {
        $('#mainContent').html("<div class='loading'></div>");
        $.get('sales/workorder/despatch_insurance/' + $(this).attr('data-id'), function (data) {
            $('#mainContent').html(data);
        });
        });
        $(".s-l-sc").on("click", function (e) {
        $('#mainContent').html("<div class='loading'></div>");
        $.get('sales/workorder/commercial/' + $(this).attr('data-id'), function (data) {
            $('#mainContent').html(data);
        });
        });
        $(".s-l-wsc").on("click", function (e) {
          statusid = $(this).attr('data-id');
            $('#myModal').modal('show');
        });
        $(".s-l-pl").on("click", function (e) {
        $('#mainContent').html("<div class='loading'></div>");
        $.get('sales/workorder/product_list/' + $(this).attr('data-id'), function (data) {
            $('#mainContent').html(data);
        });
        });
        $(".s-l-dv").on("click", function (e) {
            $.get('/sales/workorder/docview/' + $(this).attr('data-id'), function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-m").on("click", function (e) {
        $('#mainContent').html("<div class='loading'></div>");
        $.get('sales/workorder/mapping/' + $(this).attr('data-id'), function (data) {
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
                $.get('sales/workorder/delete/'+cid, function (data) {
                    $('#datatable').DataTable().ajax.reload(null, false);
                    COMMON.shownotification('error', 'work order deleted successfully!!!');
                });
            });

        });
    },

    initWON: function () {
       COMMON.getUserRole();
        //$("#salesagent").select2();
        $('#frmSNew').parsley();
        $('#frmSNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                WORKORDER.submitWONewFrm();
            }
        });
        $(".s-n-bk").on("click", function (e) {
            location.reload();
        });
        $(".custom-modal-button").on("click", function (e) {
            COMMON.loadCustomModal(this);
        });
        jQuery('#wo_date').datepicker({
                autoclose: true,
                todayHighlight: true
            });
        jQuery('#order_recive_date').datepicker({
                autoclose: true,
                todayHighlight: true
            });
        jQuery('#order_date').datepicker({
                autoclose: true,
                todayHighlight: true
            });
        jQuery('#ach_date').datepicker({
                autoclose: true,
                todayHighlight: true
            });
        jQuery('#circulated_date').datepicker({
                autoclose: true,
                todayHighlight: true
            });
        jQuery('#recived_date').datepicker({
                autoclose: true,
                todayHighlight: true
            });
        jQuery('#over_all_cdd').datepicker({
                autoclose: true,
                todayHighlight: true
            });
        $("#pr_status").on("change", function () {
            $(".recived-date-cls").hide();
            if ($(this).val() == 'recived') {
                $(".recived-date-cls").show();
            }
        });
        $("#offer_no").autocomplete({
            source: function (request, response) {
                var data={term: request.term};
                $.ajax({
                    url: "sales/workorder/autoofferno/"+request.term,
                    dataType: "jsonp",
                    type: "GET",
                    data:JSON.stringify(data),
                    complete: function (data) {
                        response($.map(JSON.parse(data.responseText), function (item) {
                            return {
                                label: item.offer_no,
                                value: item.offer_no,
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
                $.get('sales/workorder/offernobyid/' + ui.item.id, function (data) {
                    WORKORDER.offerno = JSON.parse(data);
                    $.get('sales/workorder/getcustomer/' + WORKORDER.offerno.id, function (jdata) {
                     jdata = JSON.parse(jdata);
                     WORKORDER.customer = jdata;
                     console.log("statee "+WORKORDER.customer.state);
                     WORKORDER.getShipping(jdata.csid);
                   //  $("#shipping").val(jdata.csid).trigger('change');
                     $("#customer").val(jdata.name);
                     $("#customer").attr('data-id',jdata.id);
                    
                     if(jdata.said != 'null'){
                     console.log("poo "+jdata.salesagent);
                     $(".clsfld").attr('data-id',jdata.said);
                     $("#sagent").val(jdata.salesagent);
                     }
                });
                   
          //if(data.offer_no.length == 15){
          
                });
                
            }
        });
        $(".new-shipping").on("click", function (e) {
            if (typeof WORKORDER.customer.id !== 'undefined' ){
                $(this).attr('data-href','/customer/customer/shippingnew/'+WORKORDER.customer.id);
                COMMON.loadCustomModal(this,WORKORDER.getShipping);
            }else{
                COMMON.shownotification('error', 'Select a customer first!!!');
            }
        });
        $("#shipping").on("change", function() {
            console.log("from shipping 2 "+$(this).val());
            $.get('/customer/customer/shippingbyid/' + $(this).val(), function (data) {
                var sd = JSON.parse(data);
                //console.log(sd[0]);
                if(sd[0] != undefined){
                WORKORDER.customer.state=sd[0].state;
               }
            });
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
                    WORKORDER.customer = JSON.parse(data);
                   // $('#payment_due_date option[value="' + WORKORDER.customer.payment_terms + '"]').prop('selected', true);
                    WORKORDER.getShipping();
                });
                
            }
        });
       WORKORDER.orderAddField();


    },
    initWOE: function(ofr,cus) {
        COMMON.getUserRole();
        WORKORDER.initWON();
        WORKORDER.offerno = ofr;
        WORKORDER.customer = cus;
    },
    initWOCOM: function(cus,row){
        COMMON.getUserRole();
        $('#frmSNew').parsley();
        $('#frmSNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                WORKORDER.submitWOCOMnewFrm();
            }
        });
        $(".s-n-bk").on("click", function (e) {
            location.reload();
        });
        $(".custom-modal-button").on("click", function (e) {
            COMMON.loadCustomModal(this);
        });
        $(".new-shipping").on("click", function (e) {
            if (typeof WORKORDER.customer.id !== 'undefined' ){
                $(this).attr('data-href','/customer/customer/shippingnew/'+WORKORDER.customer.id);
                COMMON.loadCustomModal(this,WORKORDER.getShipping);
            }else{
                COMMON.shownotification('error', 'Select a customer firest!!!');
            }
        });
        $("#shipping").on("change", function() {
            $.get('/customer/customer/shippingbyid/' + $(this).val(), function (data) {
                var sd = JSON.parse(data);
                WORKORDER.customer.state=sd[0].state;
            });
        });
        jQuery('#order_date').datepicker({
                autoclose: true,
                todayHighlight: true
            });
        jQuery('#over_all_cdd').datepicker({
                autoclose: true,
                todayHighlight: true
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
                    WORKORDER.customer = JSON.parse(data);
                   // $('#payment_due_date option[value="' + ENQUIRY.customer.payment_terms + '"]').prop('selected', true);
                    WORKORDER.getShipping();
                });
                
            }
        });
        WORKORDER.customer = cus;
        WORKORDER.orderAddField();

        $(".b-ss-r").on("click", function (e) {
             if($(this).closest(".clsfld").attr("data-id")!='0'){
                $( this ).closest( ".clsfld" ).remove();
            }
        });
        


    },
    initWOTC: function (cus,wotc,cntry,state) {
        WORKORDER.cntry = cntry;
        WORKORDER.state = state;
        WORKORDER.customer = cus;
        COMMON.getUserRole();
        $('.select2').select2();
        $(".s-n-bk").on("click", function (e) {
            location.reload();
        });

        $('#frmSNew').parsley();
        $('#frmSNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                WORKORDER.submitWOTCnewFrm();
            }
        });
       /* $("#sender_name").autocomplete({
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
                    WORKORDER.customer = JSON.parse(data);
                    
                   // $('#payment_due_date option[value="' + ENQUIRY.customer.payment_terms + '"]').prop('selected', true);
                    WORKORDER.getShipping();
                });
                
            }
        });*/
        $(".new-shipping").on("click", function (e) {
            if (typeof WORKORDER.customer.id !== 'undefined' ){
                $(this).attr('data-href','/customer/customer/shippingnew/'+WORKORDER.customer.id);
                COMMON.loadCustomModal(this,WORKORDER.getShipping);
            }else{
                COMMON.shownotification('error', 'Select a customer first!!!');
            }
        });
        $("#shipping").on("change", function() {
            console.log("from shipping 2 "+$(this).val());
            $.get('/customer/customer/shippingbyid/' + $(this).val(), function (data) {
                var sd = JSON.parse(data);
                //console.log(sd[0]);
                if(sd[0] != undefined){
                WORKORDER.customer.state=sd[0].state;
               }
            });
        });
        $(".i-r-shippig-details").on("click", function (e) {
            var ship = $("#shipping").val();
            $.get('/customer/customer/shippingbyid/' + ship, function (data) {
                var sd = JSON.parse(data);
                $("#myShippingModal").find("#label_modal").html(" "+sd[0].label);
                $("#myShippingModal").find("#city_modal").html(" "+sd[0].city);
                $("#myShippingModal").find("#state_modal").html(" "+sd[0].state);
                $("#myShippingModal").find("#country_modal").html(" "+sd[0].country);
                $("#myShippingModal").find("#zip_modal").html(" "+sd[0].zip);
                $("#myShippingModal").find("#gst_modal").html(" "+sd[0].gst);
                $("#myShippingModal").find("#address_modal").html(" "+sd[0].address);

            });
            $("#myShippingModal").modal('show');
        });
        if(wotc.sa != undefined){
            console.log("calling from wotc");
         WORKORDER.getShipping(wotc.sa.shipping);
        }
        else{
            console.log("calling from wooo");
         WORKORDER.getShipping(WORKORDER.customer.shipping);   
        }
        WORKORDER.initackRowElement();
        WORKORDER.acknowledgementRow();

    },
    acknowledgementRow: function(){
    var htm = '<div class="data-row-acknowledgement" data-id="0" >';
        htm += '<div class="col-md-6" style="float: left;">';
        htm += '<input type="text" placeholder="Enter company name" class="form-control i-r-company"/>';
        htm += '</div>';
        htm += '<div class="col-md-2" style="float: left;">';
        htm += '<a class="btn btn-icon waves-effect waves-light btn-primary m-b-5 i-r-modal-details"> <i class="fa fa-eye"></i> </a>';
        htm += '</div>';
        htm += '<div class="col-md-2" style="float: left;">';
        htm += '<a class="btn btn-icon waves-effect waves-light btn-primary m-b-5 i-r-add"> <i class="fa fa-eye"></i> </a>';
        htm += '</div>';
        htm += '<div class="col-md-2" style="float: left;">';
        htm += '<a class="btn btn-icon waves-effect waves-light btn-danger m-b-5 i-r-del"> <i class="fa fa-remove"></i> </a>';
        htm += '</div>';
        htm += '<input  type="hidden" class="form-control i-address"  >';
        htm += '<input  type="hidden" class="form-control i-city"  >';
        htm += '<input  type="hidden" class="form-control i-country"  >';
        htm += '<input  type="hidden" class="form-control i-state"  >'
        htm += '<input  type="hidden" class="form-control i-zip"  >';
        htm += '<input  type="hidden" class="form-control i-gstin"  >';
        htm += '</div>';
        $(".item-wrapper").append(htm);
        WORKORDER.initackRowElement();
        
    },
    initackRowElement: function () {
        $('.i-r-company').on("blur",function() {
            var rw = event.target.closest(".data-row-acknowledgement");
            $(rw).attr('data-id', $( ".data-row-acknowledgement" ).length);
            WORKORDER.initmodalacknowledgement($(rw).attr('data-id'));
        });
        $(".i-r-modal-details").on("click", function (e) {
          var rw = event.target.closest(".data-row-acknowledgement");
           $('#myModal'+$(rw).attr('data-id')).modal('show');
        });
        $(".i-r-add").on("click", function (e) {
            WORKORDER.acknowledgementRow();
        });
        $(".i-r-del").on("click", function (e) {
            if($(this).closest(".data-row-acknowledgement").attr("data-id") > '1'){
                $( this ).closest( ".data-row-acknowledgement" ).remove();
            }
        }); 
         
    },
    initmodalacknowledgement: function(did){       
        var htm = '<div id="myModal'+did+'" class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" >';
        htm += '<div class="modal-dialog modal-lg" style="padding-top: 140px;">';
        htm += '<div class="modal-content">';
        htm += '<div class="modal-header">'
        htm += '<h5 class="modal-title" id="myModalLabel">Item Details</h5>';
        htm += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>'
        htm += '</div>'
        htm += '<div class="modal-body" >';
        htm += '<div class="card-box">';
        htm += '<h4 class="m-t-0 header-title">Address Information</h4>'
        htm += '<div class="form-row">';
        htm += '<div class="form-group col-md-6">';
        htm += '<label class="col-form-label" >City</label>';
        htm += '<input type="text" name="city" value="" class="form-control modal_city">';
        htm += '</div>';
        htm += '<div class="form-group col-md-6">';
        htm += '<label class="col-form-label" >State<span style="font-size: 10px;">(If country is not India leave it blank)</span></label>';
        htm += '<select class="form-control select2 select2-hidden-accessible modal_state" aria-hidden="true" id="state">';
        htm += '<option value="">select </option>'
        for(var k in WORKORDER.state)
        htm += '<option value="'+WORKORDER.state[k]+'">'+WORKORDER.state[k]+'</option>'
        htm += '</select>'
        htm += '</div>';
        htm += '<div class="form-group col-md-6">';
        htm += '<label class="col-form-label" >Country</label>';
        htm += '<select class="form-control select2 select2-hidden-accessible modal_country" tabindex="-1" aria-hidden="true" id="country" >';
        for(var k in WORKORDER.cntry){
        if(WORKORDER.cntry != undefined && WORKORDER.cntry[k] == 'India'){
        htm += '<option selected value="'+WORKORDER.cntry[k]+'">'+WORKORDER.cntry[k]+'</option>'
        }
        else{
        htm += '<option value="'+WORKORDER.cntry[k]+'">'+WORKORDER.cntry[k]+'</option>'
        }
        }
        htm += '</select>'
        htm += '</div>';
        htm += '<div class="form-group col-md-6">';
        htm += '<label class="col-form-label" >Zip Code</label>';
        htm += '<input type="text" name="zip" value="" class="form-control modal_zip">';
        htm += '</div>';
        htm += '<div class="form-group col-md-6">';
        htm += '<label class="col-form-label" >GSTIN</label>';
        htm += '<input type="text" name="gstin" value="" class="form-control modal_gstin">';
        htm += '</div>';
        htm += '<div class="form-group col-md-6">';
        htm += '<label class="col-form-label" >Address</label>';
        htm += '<textarea name="address" rows="5" class="form-control modal_address"></textarea>';
        htm += '</div>';
        htm += '</div>';
        htm += '</div>'
        htm += '<div class="modal-footer">';
        htm += ' <button class="btn  btn-success btn-outline btn-rounded acpt-btn"  data-dismiss="modal">Save</button>';
        htm += '</div>';
        htm += '</div>';
        htm += '</div>';
        htm += '</div>';
        $(".item-modal").append(htm);
        WORKORDER.itemmodalackoperation(did);
    },
    itemmodalackoperation: function (did) {
        $('.select2').select2();
        $("#myModal"+did).find(".acpt-btn").on("click", function (e) {

        $("div").find("[data-id="+did+"]").find('.i-city').val($("#myModal"+did).find('.modal_city').val());
        $("div").find("[data-id="+did+"]").find('.i-state').val($("#myModal"+did).find('.modal_state').val());
        $("div").find("[data-id="+did+"]").find('.i-country').val($("#myModal"+did).find('.modal_country').val());
        $("div").find("[data-id="+did+"]").find('.i-zip').val($("#myModal"+did).find('.modal_zip').val());
        $("div").find("[data-id="+did+"]").find('.i-gstin').val($("#myModal"+did).find('.modal_gstin').val());
        $("div").find("[data-id="+did+"]").find('.i-address').val($("#myModal"+did).find('.modal_address').val());

     });
    },
    initWODI: function (cus) {
        COMMON.getUserRole();
        $(".select2").select2();
        $(".s-n-bk").on("click", function (e) {
            location.reload();
        });

        $('#frmSNew').parsley();
        $('#frmSNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                WORKORDER.submitWODInewFrm();
            }
        });
        $(".custom-modal-button-t").on("click", function (e) {
            COMMON.loadCustomModal(this,WORKORDER.getTransport);
        });
        $(".custom-modal-button").on("click", function (e) {
            COMMON.loadCustomModal(this);
        });

        $("#vendor_code").autocomplete({
            source: function (request, response) {
                $.ajax({
                    url: "sales/workorder/autocustomer/" + request.term,
                    dataType: "jsonp",
                    type: "GET",
                    data: {
                        term: request.term
                    },
                    complete: function (data) {
                        response($.map(JSON.parse(data.responseText), function (item) {
                            return {
                                label: item.code,
                                value: item.code,
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
                    WORKORDER.customer = JSON.parse(data);
                });
                
            }
        });
        WORKORDER.customer = cus;



    },
    getTransport:function(){
        $.get('/transport/bycompany' , function (data) {
            var sd = JSON.parse(data);
            var $ship=$('#transport');
            $ship.empty();
            $ship.append($("<option></option>").attr("value", "").text(""));
            Object.keys(sd).forEach(function(k){
                $ship.append($("<option></option>").attr("value", sd[k].id).text(sd[k].title));
            });
        });
    },
    orderAddField: function () {
            var htm = '<div class="col-md-12 clsfld" data-id="0">';
            htm += '<div class="form-group col-md-6" style="float:left;">';
            htm += ' <input type="text" autocomplete="off" class="form-control clsfldname" placeholder="Name" >';
            htm += ' </div>';
            htm += ' <div class="form-group col-md-5" style="float:left;">';
            htm += ' <input type="text" class="form-control clsfldamt" placeholder="0.00" value="0.00">';
            htm += '</div>';
            htm += '<div class="form-group col-md-1" style="float:left;">';
            htm += ' <button class="btn btn-icon waves-effect waves-light btn-danger m-b-5 b-ss-r"> <i class="fa fa-remove"></i> </button>';
            htm += ' </div>';
            htm += '</div>';
            $(".item-wrapper").append(htm);
           // WORKORDER.orderInitDynamic();
            WORKORDER.initSARow();
            WORKORDER.orderInitDynamic();

            
    },
    initSARow: function () {
        COMMON.getUserRole();
    $(".clsfldname").autocomplete({
            source: function (request, response) {
                $.ajax({
                    url: "sales/workorder/autosalesperson/" + request.term,
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
                $.get('sales/workorder/salespersonbyid/' + ui.item.id, function (data) {
                    data = JSON.parse(data);
                    var rw = event.target.closest(".clsfld");
                    $(rw).attr('data-id', data.id);
                    WORKORDER.orderInitDynamic();
                    if($( ".clsfld[data-id='0']" ).length==0)
                    WORKORDER.orderAddField();
                });
            }
        });
    },
    orderInitDynamic:function(){
        $(".b-ss-r").on("click", function (e) {
            if($(this).closest(".clsfld").attr("data-id")!='0'){
                $( this ).closest( ".clsfld" ).remove();
            }
        });
    },
    getShipping:function(ship){
        console.log("hhhhhhhhh "+WORKORDER.customer.id);
        $.get('/customer/customer/shipping/' + WORKORDER.customer.id, function (data) {
            var sd = JSON.parse(data);
            var $ship=$('#shipping');
            $ship.empty();
            Object.keys(sd).forEach(function(k){
                if(k==0)
                WORKORDER.customer.state==sd[k].state;
            console.log("uuu "+sd[k].label);
                $ship.append($("<option></option>").attr("value", sd[k].id).text(sd[k].label));
                if(ship != 'undefined' && ship != '')
                $ship.val(ship).trigger('change');
            });
        });
    },
    initWOPE: function (comstate,cus,item,newitem,tax_slab,pr,trim,stem,unit,spclsrvc) {
        COMMON.getUserRole();
        WORKORDER.comstate=comstate;
        WORKORDER.all_tax=tax_slab;

        WORKORDER.pr = pr;
        WORKORDER.trim = trim;
        WORKORDER.stem = stem;
        WORKORDER.unit = unit;
        WORKORDER.spclsrvc = spclsrvc;

         $('#frmSNew').parsley();
           $('#frmSNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                WORKORDER.submitWOPENewFrm();
            }
        });
        $(".s-n-bk").on("click", function (e) {
            location.reload();
        });
        $(".custom-modal-button").on("click", function (e) {
            COMMON.loadCustomModal(this);
        });
        $("#shipping").on("change", function() {
            $.get('/customer/customer/shippingbyid/' + $(this).val(), function (data) {
                var sd = JSON.parse(data);
                WORKORDER.customer.state=sd[0].state;
            });
        });
       
        $(".sa-field").on("change paste keyup", function () {
            var rw = event.target.closest(".safildwrap");
            WORKORDER.claculateSaFieldPrice(rw);
        });
        $(".i-r-o-tax-slab").on("change paste keyup", function () {
            var rw = event.target.closest(".safildwrap");
            WORKORDER.claculateSaFieldPrice(rw);
        });

        jQuery('#offer_date').datepicker({
                autoclose: true,
                todayHighlight: true
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
                    WORKORDER.customer = JSON.parse(data);
                    $('#payment_due_date option[value="' + WORKORDER.customer.payment_terms + '"]').prop('selected', true);
                    WORKORDER.gstInit();
                    WORKORDER.getShipping();
                });
                
            }
        });

       WORKORDER.customer = cus;

        WORKORDER.gstInit();
        WORKORDER.initRowElement();
        WORKORDER.calculateAddPrice('on');
        var fitem = [];
        if(newitem.length >0){
        for(var k in newitem){
        WORKORDER.itemmodaloperation(newitem[k].id);
        WORKORDER.hsn = newitem[k].hsn_code;
        WORKORDER.gst = newitem[k].tax_slabe;
        WORKORDER.loadspclservicewo(newitem[k].id,newitem[k].ofrid,newitem[k].ofritemid);
        }
        }else{
        for(var k in item){
        WORKORDER.itemmodaloperation(item[k].id);
        WORKORDER.hsn = item[k].hsn_code;
        WORKORDER.gst = item[k].tax_slabe;
        WORKORDER.loadspclserviceofr(item[k].id,item[k].ofrid,item[k].ofritemid);
        }
        }
        
        WORKORDER.itemRow();
    },
    loadspclserviceofr:function(did,ofr,ofritm){
        console.log("testing123");
        $.ajax({
                url: 'sales/offer/getsubservicecode/?pid="'+ofritm+'"' ,
                dataType: "jsonp",
                type: "GET",
                complete: function (data) {
                    var jdata=JSON.parse(data.responseText);
                    Object.keys(jdata).forEach(function (k){
                        console.log("uuuuu")
                        var $specification_item = $("#myModal"+did).find("#spclsrvc"+jdata[k].special_service);;
                        $specification_item.val(jdata[k].sub_special_service).trigger('change');

                      }); 
                }
            });
    },
    loadspclservicewo:function(did,ofr,ofritm){
        console.log("testing123");
        $.ajax({
                url: 'sales/workorder/getsubservicecode/?pid="'+ofritm+'"' ,
                dataType: "jsonp",
                type: "GET",
                complete: function (data) {
                    var jdata=JSON.parse(data.responseText);
                    Object.keys(jdata).forEach(function (k){
                        console.log("uuuuu")
                        var $specification_item = $("#myModal"+did).find("#spclsrvc"+jdata[k].special_service);;
                        $specification_item.val(jdata[k].sub_special_service).trigger('change');

                      }); 
                }
            });
    },

    itemRow: function () {
        var htm = '<div class="data-row-wrap" data-id="0" data-moc="0" data-trim="0" data-stem="0">';
        /*htm += '<div class="col-md-1 " style="float: left;    padding-top: 10px;font-size: 20px;">';
        htm += '<span class="i-r-slno"></span>';
        htm += '</div>';*/
        htm += '<div class="col-md-1" style="float: left;">';
        htm += '<input type="text" placeholder="Enter product code" class="form-control i-r-prod"/>';
        htm += '</div>';
        htm += '<div class="col-md-1" style="float: left;">';
        htm += '<a class="btn btn-icon waves-effect waves-light btn-primary m-b-5 i-r-modal-details"> <i class="fa fa-eye"></i> </a>';
        htm += '</div>';
        htm += '<div class="col-md-1" style="float: left;">';
        htm += '<input type="number" step="1" class="form-control i-r-qnt" placeholder="Quantity" value="1">';
        htm += '</div>';
        htm += '<div class="col-md-1" style="float: left;">';
        htm += '<select  class="form-control i-r-unit">';
        for(var k in WORKORDER.unit)
        htm += '<option value="'+WORKORDER.unit[k].id+'">'+WORKORDER.unit[k].name+'</option>'
        htm += '</select>';
        htm += '</div>';
        htm += '<div class="col-md-1" style="float: left;">';
        htm += '<input type="number" class="form-control i-r-price" step=".01" placeholder="Price" value="0">';
        htm += '</div>';
        htm += '<div class="col-md-1" style="float: left;">';
        htm += '<input type="number" class="form-control i-r-dis" step="1" placeholder="Discount(%)" value="0">';
        htm += '</div>';
        htm += '<div class="col-md-1" style="float: left;">';
        htm += '<input type="number" class="form-control i-r-dis-numeric" step="1" placeholder="Discount(numeric)" value="0">';
        htm += '</div>';
         htm += '<div class="col-md-1" style="float: left;">';
        htm += '<select class="form-control i-r-tax-slab">';
        for(var i in WORKORDER.all_tax)
        htm += '<option value="'+WORKORDER.all_tax[i]+'">'+WORKORDER.all_tax[i]+' %</option>';
        htm += '</select>';
        htm += '</div>';
        htm += '<div class="col-md-1" style="float: left;text-align: right;">';
        htm += '<span class="i-r-dis-tot">0.00</span>';
        htm += '</div>';
        htm += '<div class="col-md-1" style="float: left;text-align: right;">';
        htm += '<span class="i-r-tax-tot">0.00</span>';
        htm += '</div>';
        htm += '<div class="col-md-1" style="float: left;text-align: right;padding-right: 20px;">';
        htm += '<span class="i-r-tot">0.00</span>';
        htm += '</div>';
        htm += '<div class="col-md-1" style="float: left;">';
        htm += '<a class="btn btn-icon waves-effect waves-light btn-danger m-b-5 i-r-del"> <i class="fa fa-remove"></i> </a>';
        htm += '</div>';
        htm += '<div class="col-md-1" style="float: left;">';
        htm += '<a class="btn btn-icon waves-effect waves-light btn-warning m-b-5 i-r-save"> <i class="fa fa-wrench"></i> </a>';
        htm += '</div>';
         htm += '<input  type="hidden" class="form-control i-item-code"  >';
        htm += '<input  type="hidden" class="form-control i-special-description"  >';
        htm += '<input  type="hidden" class="form-control i-general-description"  >';
        htm += '<input  type="hidden" class="form-control i-inspection-cls"  >'
        htm += '<input  type="hidden" class="form-control i-hydraulic-body"  >';
        htm += '<input  type="hidden" class="form-control i-hydraulic-seat"  >';
        htm += '<input  type="hidden" class="form-control i-pneumatic-seat"  >';
        htm += '<input  type="hidden" class="form-control i-hydroback-seat"  >';
        htm += '<input  type="hidden" class="form-control i-spcl-cls"  >';
        htm += '<input  type="hidden" class="form-control i-standard-cls"  >';
        htm += '<input  type="hidden" class="form-control i-enq-serial-cls"  >';
        htm += '<input  type="hidden" class="form-control i-loa-serial-cls"  >';
        htm += '<input  type="hidden" class="form-control i-po-serial-cls"  >';
        htm += '<div class="col-md-12" style="float: left;">';
        htm += '<span class="i-r-span" style="font-size:10px;"></span>';
        htm += '</div>';
        htm += '</div>';
        htm += '<div style="clear: both;"></div>'
        $(".item-wrapper").append(htm);
        WORKORDER.initRow();
    },
    initRow: function () {
        $(".i-r-prod").autocomplete({
            source: function (request, response) {
                var data={term: request.term,
                        hsn:-1};
                $.ajax({
                    url: "/sales/offer/autoitem",
                    type: "POST",
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    complete: function (data) {
                        response($.map(JSON.parse(data.responseText), function (item) {
                            return {
                                label: item.size_id,
                                value: item.size_id,
                                id: item.id,
                  };
               }));
               }
             });
            },
            minLength: 3,
            select: function (event, ui) {
                $.get('/sales/offer/itembyid/' + ui.item.id, function (data) {
                    data = JSON.parse(data);
                    var rw = event.target.closest(".data-row-wrap");
                    $(rw).attr('data-id', data.id);
                    var $unt = $(rw).find('.i-r-unit');
                    var $price = $(rw).find('.i-r-price');
                    var $slno = $(rw).find('.i-r-slno');
                    $slno.html($( ".data-row-wrap" ).length+". ")
                    var $span = $(rw).find('.i-r-span');
                    
                    $price.val(data.sales_rate);
                    $span.html(data.name+", "+data.specification);
                    $(rw).find('.i-r-tax-slab option[value="'+data.tax_slabe+'"]').prop('selected', true);
                    WORKORDER.hsn = data.hsn_code;
                    WORKORDER.gst = data.tax_slabe;
                    WORKORDER.gstInit();
                    WORKORDER.claculatePrice(rw);
                    WORKORDER.initRowElement();
                    WORKORDER.itemcustommodal(rw,ui.item.id,data);
                    if($( ".data-row-wrap[data-id='0']" ).length==0)
                    WORKORDER.itemRow();
                });
            }
        });
        $(".select2").select2();
    },
    gstInit:function(){
        $(".s-a-cgst-a").html("0.00");
        $(".s-a-sgst-a").html("0.00");
        $(".s-a-igst-a").html("0.00");
    },
    initRowElement: function () {
        $(".i-r-qnt").on("change paste keyup", function(){
            var rw = event.target.closest(".data-row-wrap");
            WORKORDER.claculatePrice(rw);
        });
        $(".i-r-price").on("change paste keyup", function(){
            var rw = event.target.closest(".data-row-wrap");
            WORKORDER.claculatePrice(rw);
        });
        $(".i-r-dis").on("change paste keyup", function(){
            var rw = event.target.closest(".data-row-wrap");
            WORKORDER.claculatePrice(rw);
        });
        $(".i-r-dis-numeric").on("change paste keyup", function(){
            var rw = event.target.closest(".data-row-wrap");
            WORKORDER.claculatePrice(rw);
        });
        $(".i-r-tax-slab").on("change paste keyup", function () {
            var rw = event.target.closest(".data-row-wrap");
            WORKORDER.claculatePrice(rw);
        });
        $(".i-r-del").on("click", function (e) {
            if($(this).closest(".data-row-wrap").attr("data-id")!='0'){
                $( this ).closest( ".data-row-wrap" ).remove();
                var ni = $('.data-row-wrap').length;
                if(ni==1){
                    WORKORDER.hsn = '-1';
                    WORKORDER.gst = 0;
                }
                WORKORDER.calculateAddPrice('off');
            }
        });
        $(".i-r-modal-details").on("click", function (e) {
          var rw = event.target.closest(".data-row-wrap");
          $('.i-r-size_id').val($(rw).find('.i-r-prod').val());
           $('#myModal'+$(rw).attr('data-id')).modal('show');
        });
         $(".i-r-save").on("click", function (e) {
            if($(this).closest(".data-row-wrap").attr("data-id")!='0'){
                 var rw = event.target.closest(".data-row-wrap");
                 console.log('rww '+$(this).closest(".data-row-wrap").attr("data-id"));
                 if($(this).closest(".data-row-wrap").attr("data-moc") > 0 && $(this).closest(".data-row-wrap").attr("data-trim") > 0){
                WORKORDER.submitWOPEFrm($(this).closest(".data-row-wrap").attr("data-id"));
            }else{
                var msg  = 'Fill Up item Details part!!!';
                        COMMON.shownotification('error', msg);
            }
            }
        });
        
    },
    itemcustommodal: function(rw,did,idata){       
        var htm = '<div id="myModal'+did+'" class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" >';
        htm += '<div class="modal-dialog modal-lg" style="padding-top: 140px;">';
        htm += '<div class="modal-content">';
        htm += '<div class="modal-header">'
        htm += '<h5 class="modal-title" id="myModalLabel">Item Details</h5>';
        htm += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>'
        htm += '</div>'
        htm += '<div class="modal-body" >';
        htm += '<div class="card-box">';
        htm += '<h4 class="m-t-0 header-title">Serial No</h4>'
        htm += '<div class="form-row">';
        htm += '<div class="form-group col-md-6">';
        htm += '<label class="col-form-label" >Enquiry Serial No</label>';
        htm += '<input type="text" name="enq_serial_no" value="" class="form-control enq_serial_no_cls">';
        htm += '</div>';
        htm += '<div class="form-group col-md-6">';
        htm += '<label class="col-form-label" >LOA Serial No</label>';
        htm += '<input type="text" name="loa_serial_no" value="" class="form-control loa_serial_no_cls">';
        htm += '</div>';
        htm += '<div class="form-group col-md-6">';
        htm += '<label class="col-form-label" >PO Serial No</label>';
        htm += '<input type="text" name="po_serial_no" value="" class="form-control po_serial_no_cls">';
        htm += '</div>';
        htm += '</div>';
        htm += '</div>'
        htm += '<div class="card-box">';
        htm += '<h4 class="m-t-0 header-title">Product Summary</h4>'
        htm += '<div class="form-row">';
        htm += '<div class="form-group col-md-6">';
        htm += '<label class="col-form-label" >Size Id</label>';
        htm += '<input type="text" name="size_id"  class="form-control i-r-size_id">';
        htm += '</div>';
        htm += '<div class="form-group col-md-6">';
        htm += '<label class="col-form-label" >Moc</label>';
        htm += '<select  class="form-control select2 select2-hidden-accessible  pr_cls">';
        htm += '<option value="0">select</option>';
        for(var i in WORKORDER.pr)
        htm += '<option value="'+WORKORDER.pr[i].id+'" data-forg="'+WORKORDER.pr[i].short_code+'">'+WORKORDER.pr[i].name+'</option>'   
        htm += '</select>';
        htm += '</div>';
        htm += '<div class="form-group col-md-6">';
        htm += '<label class="col-form-label" > Stem </label>';
        htm += '<select  class="form-control select2 select2-hidden-accessible  stem_cls">';
        htm += '<option value="0">select</option>';
        for(var i in WORKORDER.stem)
        htm += '<option value="'+WORKORDER.stem[i].id+'">'+WORKORDER.stem[i].name+'</option>'
        htm += '</select>';
        htm += '</div>';
        htm += '<div class="form-group col-md-6">';
        htm += '<label class="col-form-label" > Trim </label>';
        htm += '<select  class="form-control select2 select2-hidden-accessible  trim_cls">';
        htm += '<option value="0">select</option>';
        for(var i in WORKORDER.trim)
        htm += '<option value="'+WORKORDER.trim[i].id+'" >'+WORKORDER.trim[i].name+'</option>'
        htm += '</select>';
        htm += '</div>';
        htm += '<div class="form-group col-md-6">';
        htm += '<label class="col-form-label" > Forging </label>';
        htm += '<input type="text" name="forging" value="" class="form-control forg_cls">';
        htm += '</div>';
        htm += '</div>';
        htm += '</div>'
        htm += '<div class="card-box">';
        htm += '<h4 class="m-t-0 header-title">Description</h4>'
        htm += '<div class="form-row">';
        htm += '<div class="form-group col-md-6">';
        htm += '<label class="col-form-label" >Description(special Entry)</label>';
        htm += '<textarea  class="form-control i-r-prod-spcl-des" colspan="3"></textarea>';
        htm += '</div>';
        htm += '<div class="form-group col-md-6">';
        htm += '<label class="col-form-label" >General Description</label>';
        htm += '<textarea  placeholder="Enter product Description" class="form-control i-r-prod-des" colspan="3"></textarea>';
        htm += '</div>';
        htm += '</div>';
        htm += '</div>';
        htm += '<div class="card-box">';
        htm += '<h4 class="m-t-0 header-title">Other Details</h4>'
        htm += '<div class="form-row">';
        htm += '<div class="form-group col-md-6">';
        htm += '<label class="col-form-label" >Item code / Tag No</label>';
        htm += '<input type="text" name="item_code" value="" class="form-control item_code_cls">';
        htm += '</div>';
        htm += '<div class="form-group col-md-6">';
        htm += '<label class="col-form-label" >Inspection By</label>';
        htm += '<input type="text" name="inspection_by" value="" class="form-control inspection_cls">';
        htm += '</div>';
        htm += '</div>';
        htm += '</div>';
        htm += '<div class="card-box">';
        htm += '<h4 class="m-t-0 header-title">Special Services</h4>'
        htm += '<div class="form-row">';
        for(var i in WORKORDER.spclsrvc){
        htm += '<div class="form-group col-md-6 special_service_cls" data-id="'+WORKORDER.spclsrvc[i].id+'">';
        htm += '<label class="col-form-label" >'+WORKORDER.spclsrvc[i].service_name+'</label>';
        htm += '<select  class="form-control select2 select2-hidden-accessible special_service_sub_cls" id="spclsrvc'+WORKORDER.spclsrvc[i].id+'">';
        htm += '</select>';
        htm += '</div>';
        }
        htm += '</div>';
        htm += '</div>';
        htm += '<div class="card-box">';
        htm += '<h4 class="m-t-0 header-title">Details</h4>'
        htm += '<div class="form-group col-md-6">';
        htm += '<label class="col-form-label" >Standard</label>';
        htm += '<input type="text" name="standard"  class="form-control standard_cls">';
        htm += '</div>';
        htm += '<div class="form-row">';
        htm += '<div class="form-group col-md-6">';
        htm += '<label class="col-form-label" >Hydraulic body</label>';
        htm += '<input type="text" name="hydraulic_body" value="'+idata.hydraulic_body+'" class="form-control hydraulic_body_cls">';
        htm += '</div>';
        htm += '<div class="form-group col-md-6">';
        htm += '<label class="col-form-label" >Hydraulic seat</label>';
        htm += '<input type="text" name="hydraulic_seat" value="'+idata.hydraulic_seat+'" class="form-control hydraulic_seat_cls">';
        htm += '</div>';
        htm += '<div class="form-group col-md-6">';
        htm += '<label class="col-form-label" >Pneumatic seat</label>';
        htm += '<input type="text" name="pneumatic_seat" value="'+idata.pneumatic_seat+'" class="form-control pneumatic_seat_cls">';
        htm += '</div>';
        htm += '<div class="form-group col-md-6">';
        htm += '<label class="col-form-label" >Hydroback seat</label>';
        htm += '<input type="text" name="hydroback_seat" value="'+idata.hydroback_seat+'" class="form-control hydroback_seat_cls">';
        htm += '</div>';
        htm += '</div>';
        htm += '</div>';
        htm += '</div>';
        htm += '<div class="modal-footer">';
        htm += ' <button class="btn  btn-success btn-outline btn-rounded acpt-btn"  data-dismiss="modal">Save</button>';
        htm += '</div>';
        htm += '</div>';
        htm += '</div>';
        htm += '</div>';
        $(".item-modal").append(htm);
        WORKORDER.itemmodaloperation(did);

    },
    itemmodaloperation: function (did) {
       $("#myModal"+did).find(".pr_cls").on("change", function (e) {
            $("#myModal"+did).find('.forg_cls').val($("#myModal"+did).find(".pr_cls option:selected").attr("data-forg"));
        });
        $("#myModal"+did).find('.special_service_cls').each(function() {
                 var term = $(this).closest('.special_service_cls').attr('data-id');
                 var _this = this;
                $.ajax({
                    url: "sales/offer/getsubspclsrvc/" + term,
                    dataType: "jsonp",
                    type: "GET",
                    complete: function (data) {
                        var jdata=JSON.parse(data.responseText);
                        Object.keys(jdata).forEach(function (key){
                             var $specification_item = $("#myModal"+did).find('#spclsrvc'+jdata[key].special_service);
                                $specification_item.append($("<option></option>").val(jdata[key].id).text(jdata[key].name));
                          });
                        }
                    });
            });
        $("#myModal"+did).find(".acpt-btn").on("click", function (e) {
        
        
       if($("#myModal"+did).find('.trim_cls').val() != 0){
          $("div").find("[data-id="+did+"]").attr('data-trim', $("#myModal"+did).find('.trim_cls').val());
        }
        else{
           var msg  = 'Please select a trim parts!!!';
            COMMON.shownotification('error', msg);
        }
        if($("#myModal"+did).find('.pr_cls').val() != 0){
          $("div").find("[data-id="+did+"]").attr('data-moc', $("#myModal"+did).find('.pr_cls').val());
        }
        else{
           var msg  = 'Please select a moc!!!';
            COMMON.shownotification('error', msg);
        }
        if($("#myModal"+did).find('.hydraulic_body_cls').val() != 0){
          $("div").find("[data-id="+did+"]").find('.i-hydraulic-body').val($("#myModal"+did).find('.hydraulic_body_cls').val());
        }
        else{
           var msg  = 'Please enter Hydraulic body !!!';
            COMMON.shownotification('error', msg);
        }
        if($("#myModal"+did).find('.hydraulic_seat_cls').val() != 0){
          $("div").find("[data-id="+did+"]").find('.i-hydraulic-seat').val($("#myModal"+did).find('.hydraulic_seat_cls').val());
        }
        else{
           var msg  = 'Please enter Hydraulic seat !!!';
            COMMON.shownotification('error', msg);
        }
        if($("#myModal"+did).find('.pneumatic_seat_cls').val() != 0){
          $("div").find("[data-id="+did+"]").find('.i-pneumatic-seat').val($("#myModal"+did).find('.pneumatic_seat_cls').val());
        }
        else{
           var msg  = 'Please enter pneumatic seat !!!';
            COMMON.shownotification('error', msg);
        }
        if($("#myModal"+did).find('.hydroback_seat_cls').val() != 0){
          $("div").find("[data-id="+did+"]").find('.i-hydroback-seat').val($("#myModal"+did).find('.hydroback_seat_cls').val());
        }
        else{
           var msg  = 'Please enter hydroback body !!!';
            COMMON.shownotification('error', msg);
        }



        //  $("div").find("[data-id="+did+"]").attr('data-trim', $("#myModal"+did).find('.trim_cls').val());
       // $("div").find("[data-id="+did+"]").attr('data-moc', $("#myModal"+did).find('.pr_cls').val());
        $("div").find("[data-id="+did+"]").attr('data-stem', $("#myModal"+did).find('.stem_cls').val());

        $("div").find("[data-id="+did+"]").find('.i-item-code').val($("#myModal"+did).find('.item_code_cls').val());
        $("div").find("[data-id="+did+"]").find('.i-special-description').val($("#myModal"+did).find('.i-r-prod-spcl-des').val());
        $("div").find("[data-id="+did+"]").find('.i-general-description').val($("#myModal"+did).find('.i-r-prod-des').val());
        $("div").find("[data-id="+did+"]").find('.i-inspection-cls').val($("#myModal"+did).find('.inspection_cls').val());
        $("div").find("[data-id="+did+"]").find('.i-standard-cls').val($("#myModal"+did).find('.standard_cls').val());
        $("div").find("[data-id="+did+"]").find('.i-enq-serial-cls').val($("#myModal"+did).find('.enq_serial_no_cls').val());
        $("div").find("[data-id="+did+"]").find('.i-loa-serial-cls').val($("#myModal"+did).find('.loa_serial_no_cls').val());
        $("div").find("[data-id="+did+"]").find('.i-po-serial-cls').val($("#myModal"+did).find('.po_serial_no_cls').val());

     /* $("div").find("[data-id="+did+"]").find('.i-hydraulic-body').val($("#myModal"+did).find('.hydraulic_body_cls').val());
        $("div").find("[data-id="+did+"]").find('.i-hydraulic-seat').val($("#myModal"+did).find('.hydraulic_seat_cls').val());
        $("div").find("[data-id="+did+"]").find('.i-pneumatic-seat').val($("#myModal"+did).find('.pneumatic_seat_cls').val());
        $("div").find("[data-id="+did+"]").find('.i-hydroback-seat').val($("#myModal"+did).find('.hydroback_seat_cls').val());*/
        var srvcrslt='',materialrslt='';
        var srvc =[],materiall=[];
         $("#myModal"+did).find(".special_service_cls").each(function(i){
            //var spclsrvcid=$(this).attr("data-id");
            $(this).find(".special_service_sub_cls").each(function(j){
                if($(this).val() != ''){
                   var spclsrvcid = $(this).closest(".special_service_cls").attr("data-id");
                   var item_name = $("#spclsrvc"+spclsrvcid+" option:selected").attr('data-id');
                  srvc.push($(this).closest(".special_service_cls").attr("data-id")+":"+$(this).val());
                  srvcrslt = srvc.join();
                }  
            });
            
        });
         $("div").find("[data-id="+did+"]").find('.i-spcl-cls').val(srvcrslt);

        });


    },

    claculatePrice: function (el) {
        var id = parseInt($(el).attr('data-id'));
        if (id > 0) {
            var q1 = $(el).find('.i-r-qnt').val().trim(), p1 = $(el).find('.i-r-price').val().trim(), d1 = $(el).find('.i-r-dis').val().trim(),dn1 =$(el).find('.i-r-dis-numeric').val().trim(),tott1 =$(el).find(".i-r-tot").html().trim,tax1=$(el).find('.i-r-tax-slab').val().trim();
            var q = (q1 == "") ? 0 : parseFloat(q1), p = (p1 == "") ? 0 : parseFloat(p1), d = (d1 == "") ? 0 : parseFloat(d1),dn = (dn1 == "") ? 0 : parseFloat(dn1),tott = (tott1 == "") ? 0 : parseFloat(tott1),tax = (tax1 == "") ? 0 : parseFloat(tax1);
            var t1 = q * p;
            var tax1 = t1*tax / 100;
            var t = t1 - ((t1 * d) / 100);
            var ttax = t*tax / 100;
            var t2 = t1 - dn;
            var ttax2 =t2*tax/100; 
   
           

            if(d == 0 && dn == 0){
            $(el).find(".i-r-tax-tot").html(ttax.toFixed(2));
            $(el).find(".i-r-tot").html((t+ttax).toFixed(2));
            }
            else if(d == 0 && dn !=0){
             $(el).find(".i-r-tax-tot").html(ttax2.toFixed(2));
             $(el).find(".i-r-tot").html((t2+ttax2).toFixed(2));
            }
             else if(dn == 0 && d !=0){
             $(el).find(".i-r-tax-tot").html(ttax.toFixed(2));
             $(el).find(".i-r-tot").html((t+ttax).toFixed(2));
            }
             else if(dn != 0 && d != 0) {
               var totaldiscount = t-dn;
               var totaltax = totaldiscount*tax/ 100;
             $(el).find(".i-r-tax-tot").html(totaltax.toFixed(2));
             $(el).find(".i-r-tot").html((totaldiscount+totaltax).toFixed(2));
            }
            WORKORDER.calculateAddPrice('off');
        }
    },
    
    calculateAddPrice:function(preload){
        var arr={q:0,p:0,d:0,td:0,pr:0,tx:0,t:0},st = 0,stt=0,qntty=-1,dis=0,dis=0,pft=0, count = $(".data-row-wrap").length;
        $(".data-row-wrap").each(function (i) {
            if($(this).attr("data-id")!='0'){
             var q1 = $(this).find('.i-r-qnt').val().trim(), p1 = $(this).find('.i-r-price').val().trim(), d1 = $(this).find('.i-r-dis').val().trim(),dn1 = $(this).find('.i-r-dis-numeric').val().trim(),tax1=$(this).find('.i-r-tax-slab').val().trim();
            var q = (q1 == "") ? 0 : parseFloat(q1), p = (p1 == "") ? 0 : parseFloat(p1), d = (d1 == "") ? 0 : parseFloat(d1),dn = (dn1 == "") ? 0 : parseFloat(dn1),tax = (tax1 == "") ? 0 : parseFloat(tax1);
            var tot = q * p,dis= (tot*d)/100,disnum = (dis+dn);
            //console.log("dis "+dis+' '+tot)
           // var taxsum= (tot-dis)*tax/100;
           var taxsum= (tot-dis-disnum)*tax/100;
            arr.q += q;
            arr.p += tot;
            arr.d += disnum;
            //arr.td += disnum;
            $(this).find(".i-r-dis-tot").html(disnum.toFixed(2));
            arr.tx += taxsum;
          //  arr.t= (tot+taxsum-dis);

            st += parseFloat($(this).find('.i-r-tot').html().trim());
            stt += parseFloat($(this).find('.i-r-tax-tot').html().trim());
        }
            if (!--count) {
                $(".s-a-s-tot-qnty").html(arr.q.toFixed(2));
                $(".s-a-s-tot-r").html(arr.p.toFixed(2));
                $(".s-a-s-tot-dis").html(arr.d.toFixed(2));
                $(".s-a-s-tot-tax").html(stt.toFixed(2));
                $(".s-a-s-tot").html(st.toFixed(2));
                var ct = $(".sa-field").length;
                $(".sa-field").each(function (i) {
                    if(preload=='off' && parseFloat($(this).attr('data-pct'))>0){
                        var af = ((st * parseFloat($(this).attr('data-pct'))) / 100);
                        $(this).val(af.toFixed(2));
                    }
                    var rw = $(this).closest(".safildwrap");
                    WORKORDER.claculateSaFieldPrice(rw);
                    if (!--ct) {
                        WORKORDER.calculateTotPrice();
                    }
                });
            }
        });

    },
    claculateSaFieldPrice: function (el) {
        var a1 = $(el).find('.sa-field').val().trim(), tax1 = $(el).find('.i-r-o-tax-slab').val().trim();
        var a = (a1 == "") ? 0 : parseFloat(a1), tax = (tax1 == "") ? 0 : parseFloat(tax1);
        var ttax = (a*tax / 100);
        $(el).find(".i-r-o-tax-tot").html(ttax.toFixed(2));
        $(el).find(".i-r-o-tot").html((a+ttax).toFixed(2));
        WORKORDER.calculateTotPrice();
    },
    calculateTotPrice:function(){
        var arr={q:0,p:0,d:0,pr:0,tx:0,t:0},qnty = 0;
        var qntty = parseFloat($(".s-a-s-tot-qnty").html()),rate = parseFloat($(".s-a-s-tot-r").html()),dis = parseFloat($(".s-a-s-tot-dis").html()),profit = parseFloat($(".s-a-s-tot-profit").html()),st = parseFloat($(".s-a-s-tot").html()),stt = parseFloat($(".s-a-s-tot-tax").html()), ct = $(".safildwrap").length;
        $(".safildwrap").each(function (i) {
            st += parseFloat($(this).find('.i-r-o-tot').html());
            stt += parseFloat($(this).find('.i-r-o-tax-tot').html());
           


            if (!--ct) {
                $(".s-a-s-qnty-2").html(qntty.toFixed(2));
                $(".s-a-s-r-2").html(rate.toFixed(2));
                $(".s-a-s-dis-2").html(dis.toFixed(2));
                $(".s-a-s-pft-2").html(profit.toFixed(2));
                $(".s-a-s-tot-2").html(st.toFixed(2));
                $(".s-a-s-tot-2-tax").html(stt.toFixed(2));
                
                $(".s-a-cgst-a").html("0.00");
                $(".s-a-sgst-a").html("0.00");
                $(".s-a-igst-a").html("0.00");
                if (typeof WORKORDER.customer.state !== 'undefined' && stt > 0 && WORKORDER.customer.gst_applicable == 'yes') {
                    //var gst = (st * PURCHASE.gst / 100);
                    if (WORKORDER.comstate == WORKORDER.customer.state) {
                        $(".s-a-cgst-a").html((stt / 2).toFixed(2));
                        $(".s-a-sgst-a").html((stt / 2).toFixed(2));
                    } else {
                        $(".s-a-igst-a").html(stt.toFixed(2));
                    }
                    //st += gst;
                }
                $(".s-a-totr").html(st.toFixed(2));
                var round = -(st - Math.round(st));
                $(".s-a-round").html(round.toFixed(2));
                $(".s-a-tot").html(Math.round(st).toFixed(2));
            }
        });
    },

    submitWONewFrm:function(){
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var addfield=[];
        var doc = $(".clsfld");
        doc.each(function(  ) {
            if($( this ).find(".clsfldname").val()!='' && $( this ).find(".clsfldamt").val()!=''){
                var id = parseInt($(this).attr('data-id'));
           // if(id>0){
           addfield.push({id:id,name:$( this ).find(".clsfldname").val(),amount:$( this ).find(".clsfldamt").val()}) 
          //}
      }
        });
        var wodoc = $('#wo_doc').val();
        var data = {
            customer: WORKORDER.customer.id,
            shipping:$("#shipping").val(),
            workorder_no: $("#workorder_no").val(),
            offer_no: WORKORDER.offerno.id,
            wo_date: $("#wo_date").val(),
            order_recive_date: $("#order_recive_date").val(),
            order_type: $("#order_type").val(),
            mtc_issue_for: $("#mtc_issue_for").val(),
            order_no: $("#order_no").val(),
            order_date: $("#order_date").val(),
            over_all_cdd : $("#over_all_cdd").val(),
            order_quantity: $("#order_quantity").val(),
            order_material_value: $("#order_material_value").val(),
            //shipping: $("#shipping").attr('data-sid'),
            formal_order: $("#formal_order").val(),
            ach_date: $("#ach_date").val(),
            circulated_date: $("#circulated_date").val(),
            pr_status: $("#pr_status").val(),
            recived_date: $("#recived_date").val(),
            woid: $("#woid").val(),

            addfield:addfield,
        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/sales/workorder/save',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code > 0) {
                 //   console.log(res.code);
                  //  if(wodoc != ''){

                    //  WORKORDER.submitWOdocNewFrm(res.code);
                    //  }
                   $('#mainContent').html("<div class='loading'></div>");
                    $.get("/sales/workorder", function (data) {
                        
                        $('#mainContent').html(data);
                        var msg = '';
                        if ($("#woid").val() !== 'undefined')
                            msg = 'workorder updated successfully!!!';
                        else
                            msg = 'workorder created successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                }  else {
                    COMMON.shownotification('error', 'Unable to save workorder!!!');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });

    },
    initWODV :function(){
        COMMON.getUserRole();
      $('#frmSNew').parsley();
      var sid = $("#sid").val();
        $('#frmSNew').unbind("submit").submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                WORKORDER.submitWOdocNewFrm(sid);
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
                $.get('/sales/workorder/docdelete/' + cid, function (data) {
                    $.get("/sales/workorder", function (data) {
                        $('#mainContent').html(data);
                        COMMON.shownotification('error', 'Document deleted successfully!!!');
                    });
                    
                });
            });

        });
    },
   submitWOdocNewFrm: function (id) {
        $("body").css('cursor', 'wait');
        var files = $('#wo_doc').get(0).files[0];
        var formData = new FormData();
        formData.append('woid',id);
        formData.append('owo_doc',$("#owo_doc").val());
        formData.append('imgid',$("#imgid").val());
        if(typeof (files)==='undefined')
            formData.append('wo_doc','');
        else
            formData.append('wo_doc',files,files.name); 
        

        $.ajax({
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            url: '/sales/workorder/savedocument',
            complete: function (xhr) {
                 var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    $.get("/sales/workorder", function (data) {
                        $('#mainContent').html(data);
                        var msg='';
                        if($("#imgid").val() !=='undefined')msg='Document updated successfully!!!';
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
    submitWOCOMnewFrm:function(){
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var addfield=[];
        var doc = $(".clsfld");
        doc.each(function(  ) {
            if($( this ).find(".clsfldname").val()!='' && $( this ).find(".clsfldamt").val()!=''){
                var id = parseInt($(this).attr('data-id'));
           // if(id>0){
           addfield.push({id:id,name:$( this ).find(".clsfldname").val(),amount:$( this ).find(".clsfldamt").val()}) 
          //}
      }
        });

        var data = {customer: WORKORDER.customer.id,
            workorder_no: $("#workorder_no").val(),
            mtc_issue_for: $("#mtc_issue_for").val(),
            order_no: $("#order_no").val(),
            order_date: $("#order_date").val(),
            over_all_cdd : $("#over_all_cdd").val(),
            order_quantity: $("#order_quantity").val(),
            order_material_value: $("#order_material_value").val(),
            shipping: $("#shipping").val(),
            wocomid: $("#wocomid").val(),

            order_acknowledgement: $("#order_acknowledgement").val(),
            qap_approval: $("#qap_approval").val(),
            proforma_invoice: $("#proforma_invoice").val(),
            despatch_clearance: $("#despatch_clearance").val(),
            arrange_way_bill: $("#arrange_way_bill").val(),
            packing_list: $("#packing_list").val(),
            excise_invoice: $("#excise_invoice").val(),
            Commercial_invoice: $("#Commercial_invoice").val(),
            Specify_other: $("#Specify_other").val(),
            ld_clause : $("#ld_clause").val(),


            addfield:addfield,
        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'sales/workorder/commercialsave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code > 0) {
                   $('#mainContent').html("<div class='loading'></div>");
                    $.get("sales/workorder", function (data) {
                        
                        $('#mainContent').html(data);
                        var msg = '';
                            msg = 'workorder Comnmercial part Updated successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                }  else {
                    COMMON.shownotification('error', 'Unable to save workorder Comnmercial!!!');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });

    },
    submitWOTCnewFrm:function(){

        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var mod = [];
        $('.data-row-acknowledgement').each(function (i) {
            var id = parseInt($(this).attr('data-id'));
            if (id > 0) {
                var label = $(this).find('.i-r-company').val().trim(),city = $(this).find('.i-city').val().trim(),state = $(this).find('.i-state').val().trim(),country = $(this).find('.i-country').val().trim(),
                address = $(this).find('.i-address').val().trim(),zip = $(this).find('.i-zip').val().trim(),gstin = $(this).find('.i-gstin').val().trim();
                mod.push({id: id,label:label,city:city,state:state,country:country,address:address,zip:zip,gstin:gstin});
            }
        });
        
        var data = {
            drawing_approval: $("#drawing_approval").val(),
            quality_assurance_plan: $("#quality_assurance_plan").val(),
            inspection_by: $("#inspection_by").val(),
            guarantee_period: $("#guarantee_period").val(),
            guarantee_days : $("#guarantee_days").val(),
            other_test: $("#other_test").val(),
            tpi_charges: $("#tpi_charges").val(),
            freight_option: $("#freight_option").val(),
            freight_charges: $("#freight_charges").val(),

            price_based_on: $("#price_based_on").val(),
            packing_forwarding: $("#packing_forwarding").val(),
            excise_duty: $("#excise_duty").val(),
            sale_tax: $("#sale_tax").val(),
            surcharge: $("#surcharge").val(),
            cgst: $("#cgst").val(),
            sgst: $("#sgst").val(),
            igst: $("#igst").val(),
            payment_terms: $("#payment_terms").val(),
            bank_guarantee: $("#bank_guarantee").val(),
            shipping:$("#shipping").val(),
            mod:mod,

            wotcid : $("#wotcid").val(),
            wtcid : $("#wtcid").val()

        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'sales/workorder/technocommercialsave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code > 0) {
                   $('#mainContent').html("<div class='loading'></div>");
                    $.get("sales/workorder", function (data) {
                        
                        $('#mainContent').html(data);
                        var msg = '';
                            msg = 'workorder Techno Comnmercial part Updated successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                }  else {
                    COMMON.shownotification('error', 'Unable to save workorder Techno Comnmercial!!!');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });

    },
    submitWODInewFrm:function(){

        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        

        var data = {
            insurance_brone_by: $("#insurance_brone_by").val(),
            insurance_details: $("#insurance_details").val(),
            transport_mode: $("#transport_mode").val(),
            delivery_basis: $("#delivery_basis").val(),
            road_permit : $("#road_permit").val(),
            transport: $("#transport").val(),
            wodi : $("#wodi").val(),
        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'sales/workorder/despatchinsurancesave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code > 0) {
                   $('#mainContent').html("<div class='loading'></div>");
                    $.get("sales/workorder", function (data) {
                        
                        $('#mainContent').html(data);
                        var msg = '';
                            msg = 'workorder despatch insurance part Updated successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                }  else {
                    COMMON.shownotification('error', 'Unable to save workorder despatch insurance!!!');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });

    },
    submitWOPEFrm: function (id) {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var itm=[],saf=[],totdis=0,totpft=0;
        if(id > 0){
              //  console.log("qnty2 "+$(this).find('.i-r-qnt').val().trim())
                var q1 = $("div").find("[data-id="+id+"]").find('.i-r-qnt').val().trim(), p1 = $("div").find("[data-id="+id+"]").find('.i-r-price').val().trim(), d1 = $("div").find("[data-id="+id+"]").find('.i-r-dis').val().trim(), u = $("div").find("[data-id="+id+"]").find('.i-r-unit').val().trim(),dis_num = $("div").find("[data-id="+id+"]").find('.i-r-dis-numeric').val().trim();
                var q = (q1 == "") ? 0 : parseFloat(q1), p = (p1 == "") ? 0 : parseFloat(p1), d = (d1 == "") ? 0 : parseFloat(d1),discount_numeric = (dis_num == "") ? 0 : parseFloat(dis_num);
                var t = $("div").find("[data-id="+id+"]").find(".i-r-tot").html(),tx=parseFloat($("div").find("[data-id="+id+"]").find('.i-r-tax-tot').html().trim()),ts=parseFloat($("div").find("[data-id="+id+"]").find('.i-r-tax-slab').val().trim());
                var pr = parseInt($("div").find("[data-id="+id+"]").attr('data-moc')),stem = parseInt($("div").find("[data-id="+id+"]").attr('data-stem')),trim = parseInt($("div").find("[data-id="+id+"]").attr('data-trim'));
                var itmcode = $("div").find("[data-id="+id+"]").find('.i-item-code').val().trim(),spcldescription = $("div").find("[data-id="+id+"]").find('.i-special-description').val().trim(),gnrldescription = $("div").find("[data-id="+id+"]").find('.i-general-description').val().trim(),inspection = $("div").find("[data-id="+id+"]").find('.i-inspection-cls').val().trim(),hydbody = $("div").find("[data-id="+id+"]").find('.i-hydraulic-body').val().trim(),
                hydseat = $("div").find("[data-id="+id+"]").find('.i-hydraulic-seat').val().trim(),pneumseat = $("div").find("[data-id="+id+"]").find('.i-pneumatic-seat').val().trim(),hydbackseat = $("div").find("[data-id="+id+"]").find('.i-hydroback-seat').val().trim(),spclsrvc = $("div").find("[data-id="+id+"]").find('.i-spcl-cls').val().trim(),standard = $("div").find("[data-id="+id+"]").find('.i-standard-cls').val().trim(),
                enq_serial_no = $("div").find("[data-id="+id+"]").find('.i-enq-serial-cls').val().trim(),loa_serial_no = $("div").find("[data-id="+id+"]").find('.i-loa-serial-cls').val().trim(),po_serial_no = $("div").find("[data-id="+id+"]").find('.i-po-serial-cls').val().trim();
            }
        $(".safildwrap").each(function (i) {
            var id = parseInt($(this).attr('data-said'));
            if (id > 0) {
                saf.push({id: id, acc: $(this).attr('data-saacc'), v: parseFloat($(this).find('.sa-field').val().trim()),ts: parseFloat($(this).find('.i-r-o-tax-slab').val().trim()),tx: parseFloat($(this).find('.i-r-o-tax-tot').html().trim())});
            }
        });
        
         var data = {
            offer_no: $("#offer_no").val(),
            total_amount: parseFloat($(".s-a-tot").html()),
            cgst: parseFloat($(".s-a-cgst-a").html()),
            sgst: parseFloat($(".s-a-sgst-a").html()),
            igst: parseFloat($(".s-a-igst-a").html()),
            total_sub: parseFloat($(".s-a-s-tot").html()),
             tax:$(".i-r-tax-slab-new").val(),
//            slab: SALES.gst,
            item: itm,
            saf:saf,
            round:parseFloat($(".s-a-round").html()),
            sid: $("#sid").val(),
            woid:$('#woid').val(),
            total_dis:totdis,
            id: id, q: q, u: u, p: p, t: t,ts:ts,tx:tx, d: d,pr:pr,stem:stem,trim:trim,itmcode:itmcode,spcldescription:spcldescription,gnrldescription:gnrldescription,inspection:inspection,hydbody:hydbody,hydseat:hydseat,pneumseat:pneumseat,hydbackseat:hydbackseat,spclsrvc:spclsrvc,standard:standard,
            enq_serial_no:enq_serial_no,loa_serial_no:loa_serial_no,po_serial_no:po_serial_no,discount_numeric:discount_numeric            
        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/sales/workorder/productsave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
             if (res.code > 0) {
                   var  msg = 'workorder product Updated successfully!!!';
                        COMMON.shownotification('success', msg);
                } 
             
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
    submitWOPENewFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var itm=[],saf=[],totdis=0,totpft=0,qnty=0;
        $( ".data-row-wrap" ).each(function( i ) {
            var id = parseInt($(this).attr('data-id'));
           if(id>0){
                var q1 = $(this).find('.i-r-qnt').val().trim(), p1 = $(this).find('.i-r-price').val().trim(), d1 = $(this).find('.i-r-dis').val().trim(), u = $(this).find('.i-r-unit').val().trim(),dis_num = $(this).find('.i-r-dis-numeric').val().trim();
                var q = (q1 == "") ? 0 : parseFloat(q1), p = (p1 == "") ? 0 : parseFloat(p1), d = (d1 == "") ? 0 : parseFloat(d1),discount_numeric = (dis_num == "") ? 0 : parseFloat(dis_num);
               var t = $(this).find(".i-r-tot").html(),tx=parseFloat($(this).find('.i-r-tax-tot').html().trim()),ts=parseFloat($(this).find('.i-r-tax-slab').val().trim());
                
                var pr = parseInt($(this).attr('data-moc')),stem = parseInt($(this).attr('data-stem')),trim = parseInt($(this).attr('data-trim'));
                var itmcode = $(this).find('.i-item-code').val().trim(),spcldescription = $(this).find('.i-special-description').val().trim(),gnrldescription = $(this).find('.i-general-description').val().trim(),inspection = $(this).find('.i-inspection-cls').val().trim(),hydbody = $(this).find('.i-hydraulic-body').val().trim(),
                hydseat = $(this).find('.i-hydraulic-seat').val().trim(),pneumseat = $(this).find('.i-pneumatic-seat').val().trim(),hydbackseat = $(this).find('.i-hydroback-seat').val().trim(),spclsrvc = $(this).find('.i-spcl-cls').val().trim(),standard = $(this).find('.i-standard-cls').val().trim(),
                enq_serial_no = $(this).find('.i-enq-serial-cls').val().trim(),loa_serial_no = $(this).find('.i-loa-serial-cls').val().trim(),po_serial_no = $(this).find('.i-po-serial-cls').val().trim();

                itm.push({id: id, q: q, u: u, p: p, t:t,ts:ts,tx:tx, d: d,pr:pr,stem:stem,trim:trim,itmcode:itmcode,spcldescription:spcldescription,gnrldescription:gnrldescription,inspection:inspection,hydbody:hydbody,hydseat:hydseat,pneumseat:pneumseat,hydbackseat:hydbackseat,spclsrvc:spclsrvc,
                standard:standard,enq_serial_no:enq_serial_no,loa_serial_no:loa_serial_no,po_serial_no:po_serial_no,discount_numeric:discount_numeric});
                totdis += d;
                qnty += q;
            }
        });
        $(".safildwrap").each(function (i) {
            var id = parseInt($(this).attr('data-said'));
            if (id > 0) {
                saf.push({id: id, acc: $(this).attr('data-saacc'), v: parseFloat($(this).find('.sa-field').val().trim()),ts: parseFloat($(this).find('.i-r-o-tax-slab').val().trim()),tx: parseFloat($(this).find('.i-r-o-tax-tot').html().trim())});
            }
        });
        
         var data = {
            offer_no: $("#offer_no").val(),
            total_amount: parseFloat($(".s-a-tot").html()),
            cgst: parseFloat($(".s-a-cgst-a").html()),
            sgst: parseFloat($(".s-a-sgst-a").html()),
            igst: parseFloat($(".s-a-igst-a").html()),
            total_sub: parseFloat($(".s-a-s-tot").html()),
//            slab: SALES.gst,
            item: itm,
            saf:saf,
            round:parseFloat($(".s-a-round").html()),
            sid: $("#sid").val(),
            woid:$('#woid').val(),
            total_dis:totdis,
            
        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/sales/workorder/finalproductsave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
             if (res.code > 0) {
                   $('#mainContent').html("<div class='loading'></div>");
                    $.get("/sales/workorder", function (data) {
                        
                        $('#mainContent').html(data);
                        var msg = '';
                            msg = 'workorder product Updated successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                } 
             
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
    initWOML:function(){
        $(".s-n-bk").on("click", function (e) {
           location.reload();
        });
        var oid=$("#oid").val();
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "sales/workorder/ajaxgetmappinglist/"+oid,
                type: 'POST',
                data: function (d) {
                    setTimeout(WORKORDER.initMapListButton, 1000);
                }
            }
        });
        WORKORDER.initMapListButton();
    },
    initMapListButton:function(){
        COMMON.getUserRole();
        $(".s-l-im").on("click", function (e) {
           var itmid = $(this).attr('data-id');
           var oid = $(this).attr('data-oid');
           var wid = $(this).attr('data-wid');
           var wiid = $(this).attr('data-wiid');
        $('#mainContent').html("<div class='loading'></div>");
        $.get('/sales/workorder/itemmapping/?itmid="'+itmid+'"&oid="'+oid+'"&wid="'+wid+'"&wiid="'+wiid+'"', function (data) {
                $('#mainContent').html(data);
            });
          });
    },
    initMPN:function(){
        COMMON.getUserRole();
        $('.select2').select2();
        $(".i-n-b").on("click", function (e) {
            var woid = $("#woid").val();
            $('#mainContent').html("<div class='loading'></div>");
            $.get('/sales/workorder/mapping/'+woid, function (data) {
            $('#mainContent').html(data);
          });
        });
        $('#frmINew').parsley();
        $('#frmINew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                WORKORDER.submitPFNform();
            }
        });
        $('.data-row-wrap').each(function() {
             var term = $(this).attr('data-pfid');
             var trim = $(this).attr('data-trim');
             var moc = $(this).attr('data-moc');
             var stem = $(this).attr('data-stem');
             var pid = $(this).attr('data-pid');
             var _this = this;
             $.ajax({
                url: "sales/workorder/getprodspecificitem/" + term,
                dataType: "jsonp",
                type: "GET",
                complete: function (data) {
                    var jdata=JSON.parse(data.responseText);
                    var $specification_item = $(_this).find('.i-r-material');
                    Object.keys(jdata).forEach(function (key){
                        console.log(jdata[key]);
                            $specification_item.append($("<option></option>").val(jdata[key].id).text(jdata[key].name+" code:"+jdata[key].code));
                        if(pid != 0){
                             $specification_item.val(pid).trigger('change');
                        }
                        else{
                            if(jdata[key].component_name == 'PR PARTS'){
                                 $specification_item.val(moc).trigger('change');
                            }
                            else if(jdata[key].component_name == 'TRIM PARTS'){
                                 $specification_item.val(trim).trigger('change');
                            }
                            else{
                            if(jdata[key].showing == 'yes'){
                                $specification_item.val(jdata[key].id).trigger('change');
                            }
                           }
                        }
                      });
                    
                    }
                });
            });
    },
    submitPFNform:function(){
       $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var item=[];
        $( ".data-row-wrap" ).each(function( i ) {
            var id = parseInt($(this).attr('data-id'));
            if(id>0){
                var prod=0;
                if($(this).find('.i-r-prod').val() != ''){
                prod = $(this).find('.i-r-material').val().trim();
                }
                var imapid = $(this).find('.imapid').val();
                var cm = parseInt($(this).attr('data-cid'));
                item.push({id: id, prod: prod,imapid:imapid,cm:cm});
            }
        });
        var oiid = $("#woid").val();
        var data = {
            wo:$("#woid").val(),
            wiid:$("#wiid").val(),
            item:item,
        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'sales/workorder/mappingsave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("/sales/workorder/mapping/"+oiid, function (data) {
                        $('#mainContent').html(data);
                        var msg = '';
                            msg = 'Mapping created successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                }
                else if(res.code == 2){
                     $('#mainContent').html("<div class='loading'></div>");
                    $.get("/sales/workorder/mapping/"+oiid, function (data) {
                        $('#mainContent').html(data);
                        var msg = '';
                            msg = 'Mapping updated successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                } else {
                    COMMON.shownotification('error', 'Unable to save item!!!');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        }); 
    },
     

};        