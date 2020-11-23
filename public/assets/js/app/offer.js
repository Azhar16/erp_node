var statusid;
var OFFER = {
    customer: [],
    all_tax:[],
    hsn: '-1',
    gst: 0,
    comstate:'',
    print:'',
    newcustomer:[],
    pr:[],
    trim:[],
    stem:[],
    unit:[],
    spclsrvc:[],
    inspec:[],
    initS: function () {
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "sales/offer/ajaxget",
                type: 'POST',
                data: function (d) {
                    setTimeout(OFFER.initButton, 1000);
                }
            }
        });
        /*$(".s-l-cn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("/offer/new", function (data) {
                $('#mainContent').html(data);
            });
        });*/

        $(".s-l-cn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("sales/offer/enquerylist", function (data) {
                $('#mainContent').html(data);
            });
        });
       // COMMON.getUserRole();
        OFFER.initButton();
        COMMON.getUserRole();
        $("#approvedOffer").on("click",function(e){
             $("body").css('cursor', 'wait');

             var data = {statusid:statusid,
                         remarks:$("#remarks").val()
                         };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'sales/offer/approvedOffer',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    $('#datatable').DataTable().ajax.reload(null, false);
                    var msg = '';
                        msg='Offer Accepted successfully!!!';
                        COMMON.shownotification('success', msg);
                } else {
                    $(".loginmessage").css('color','#f90000');
                    $(".loginmessage").html(res.msg);
                }
                $("body").css('cursor', 'default');
            },
        });
        });
        $("#rejectOffer").on("click",function(e){
             $("body").css('cursor', 'wait');
             var data = {statusid:statusid,
                         remarks:$("#remarks").val(),
                         };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'sales/offer/rejectOffer',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    $('#datatable').DataTable().ajax.reload(null, false);
                    var msg = '';
                        msg='Offer Rejected successfully!!!';
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
            $.get('sales/offer/edit/'+id, function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-sc").on("click", function (e) {
          statusid = $(this).attr('data-id');
            $('#myModal').modal('show');
        });
        $(".s-l-v").on("click", function (e) {
        $('#mainContent').html("<div class='loading'></div>");
        $.get('sales/offer/bill/' + $(this).attr('data-id'), function (data) {
            $('#mainContent').html(data);
        });
        });
        
        $(".s-l-dv").on("click", function (e) {
            $.get('/sales/offer/docview/' + $(this).attr('data-id'), function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-es").on("click", function (e) {
            $.get('/sales/offer/editsummary/' + $(this).attr('data-id'), function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-ad").on("click", function (e) {
        $('#mainContent').html("<div class='loading'></div>");
        $.get('sales/offer/new/' + $(this).attr('data-eid'), function (data) {
            $('#mainContent').html(data);
        });
        });
        $(".s-l-m").on("click", function (e) {
        $('#mainContent').html("<div class='loading'></div>");
        $.get('sales/offer/mapping/' + $(this).attr('data-id'), function (data) {
            $('#mainContent').html(data);
        });
        });
        /*$(".s-l-wo").on("click", function (e) {
        $('#mainContent').html("<div class='loading'></div>");
        $.get('/offer/workorder/' + $(this).attr('data-id'), function (data) {
            $('#mainContent').html(data);
        });
        });*/
        $(".s-l-d").on("click", function (e) {
            var cid = $(this).attr('data-id');
            var eosid = $(this).attr('data-eosid');
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
                $.get('/sales/offer/delete/'+cid, function (data) {
                    //$('#datatable').DataTable().ajax.reload();
                    $('#datatable').DataTable().ajax.reload(null, false);
                    COMMON.shownotification('error', 'offer deleted successfully!!!');
                });
            });

        });
    },
    initEL:function(){
        $(".s-n-bk").on("click", function (e) {
            location.reload();
        });
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "sales/offer/ajaxgetenqlist",
                type: 'POST',
                data: function (d) {
                    setTimeout(OFFER.initListButton, 1000);
                }
            }
        });

        OFFER.initListButton();

    },
    initListButton:function(){
        COMMON.getUserRole();
       /* $(".s-l-e").on("click", function (e) {
            var id=$(this).attr('data-id');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('/offer/edit/'+id, function (data) {
                $('#mainContent').html(data);
            });
        });*/
        $(".s-l-od").on("click", function (e) {
        $('#mainContent').html("<div class='loading'></div>");
        $.get('sales/offer/new/' + $(this).attr('data-id'), function (data) {
            $('#mainContent').html(data);
        });
        });
        $(".s-l-os").on("click", function (e) {
        $('#mainContent').html("<div class='loading'></div>");
        $.get('sales/offer/summary/' + $(this).attr('data-id'), function (data) {
            $('#mainContent').html(data);
        });
        });
        /*$(".s-l-d").on("click", function (e) {
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
                $.get('/offer/delete/'+cid, function (data) {
                    //$('#datatable').DataTable().ajax.reload();
                    $('#datatable').DataTable().ajax.reload();
                    COMMON.shownotification('error', 'offer deleted successfully!!!');
                });
            });

        });*/
    },
    initSN: function (comstate,tax_slab,cus,pr,trim,stem,unit,spclsrvc,item,inspec) {
        COMMON.getUserRole();
        OFFER.comstate=comstate;
        OFFER.all_tax=tax_slab;
        OFFER.customer = cus;
        OFFER.pr = pr;
        OFFER.trim = trim;
        OFFER.stem = stem;
        OFFER.unit = unit;
        OFFER.spclsrvc = spclsrvc;
        OFFER.inspec = inspec;
        $("#salesunit").select2();
        $('#frmSNew').parsley();
        $('#frmSNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                OFFER.submitSNFrm();
            }
        });
        $(".s-n-bk").on("click", function (e) {
            location.reload();
        });
        $('#offer_validity').on("change paste keyup", function(){
            OFFER.fetchvalidity($(this).val());
        });
         $(".i-r-tax-slab-new").on("change paste keyup", function () {
            OFFER.calculateTotPrice();
            OFFER.fetchGST($(this).val());
        });
        $(".sa-field").on("change paste keyup", function () {
            var rw = event.target.closest(".safildwrap");
            OFFER.claculateSaFieldPrice(rw);
        });
        $(".i-r-o-tax-slab").on("change paste keyup", function () {
            var rw = event.target.closest(".safildwrap");
            OFFER.claculateSaFieldPrice(rw);
             OFFER.fetchSaData(rw);
        });
        jQuery('#offer_date').datepicker({
                autoclose: true,
                todayHighlight: true
            });
        jQuery('#query_date').datepicker({
                autoclose: true,
                todayHighlight: true
            });
        jQuery('#amendment_date').datepicker({
                autoclose: true,
                todayHighlight: true
            });
        $("#currency").on("change paste keyup", function () {
            var cuncy = $(this).find(':selected').attr('data-val')
            console.log("cuncy "+cuncy);
            if(cuncy != 'undefined' || cuncy != '' || cuncy != 0){
                $("#currency_value").val(cuncy);
                $(".currency_val_cls").show();
            }
            else{
                $(".currency_val_cls").hide();
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
                    OFFER.customer = JSON.parse(data);
                });
                
            }
        });

        OFFER.gstInit();
        OFFER.initRowElement();
        OFFER.calculateAddPrice('on');
        for(var k in item){
        OFFER.itemmodaloperation(item[k].id);
        OFFER.hsn = item[k].hsn_code;
        OFFER.gst = item[k].tax_slabe;
        OFFER.loadspclservice(item[k].id,item[k].ofrid,item[k].ofritemid);
        }
        OFFER.itemRow();
    },
    loadspclservice:function(did,ofr,ofritm){
        console.log("testing");
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
    OfferEditInit:function(comstate,cus,item,tax_slab,pr,trim,stem,unit,spclsrvc){
        COMMON.getUserRole();
     /* $(".a-u-d").on("click", function (e) {
            var id=$("#sid").val();
            $('#mainContent').html("<div class='loading'></div>");
 
        });*/
            OFFER.pr = pr;
            OFFER.trim = trim;
            OFFER.stem = stem;
            OFFER.unit = unit;
            OFFER.spclsrvc = spclsrvc;

           $('#frmSNew').parsley();
           $('#frmSNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                OFFER.submitEditFrm();
            }
        });
       // OFFER.initSN(comstate,tax_slab);
 
        OFFER.comstate=comstate;
        OFFER.all_tax=tax_slab;
        
        $(".s-n-bk").on("click", function (e) {
            location.reload();
        });
        $(".custom-modal-button").on("click", function (e) {
            COMMON.loadCustomModal(this);
        });
        
        $(".sa-field").on("change paste keyup", function () {
            var rw = event.target.closest(".safildwrap");
            OFFER.claculateSaFieldPrice(rw);
        });
        $(".i-r-o-tax-slab").on("change paste keyup", function () {
            var rw = event.target.closest(".safildwrap");
            OFFER.claculateSaFieldPrice(rw);
        });
        jQuery('#offer_date').datepicker({
                autoclose: true,
                todayHighlight: true
            });
        jQuery('#query_date').datepicker({
                autoclose: true,
                todayHighlight: true
            });
        jQuery('#amendment_date').datepicker({
                autoclose: true,
                todayHighlight: true
            });
        $("#currency").on("change paste keyup", function () {
            var cuncy = $(this).find(':selected').attr('data-val')
            console.log("cuncy "+cuncy);
            if(cuncy != 'undefined' || cuncy != '' || cuncy != 0){
                $("#currency_value").val(cuncy);
                $(".currency_val_cls").show();
            }
            else{
                $(".currency_val_cls").hide();
            }
        });
        
        $('.i-r-subprod').on("click",function() {
           OFFER.autofetch();
        });
        OFFER.customer = cus;
        OFFER.gstInit();
        OFFER.initRowElement();
        OFFER.calculateAddPrice('on');
        for(var k in item){
        OFFER.itemmodaloperation(item[k].id);
        OFFER.hsn = item[k].hsn_code;
        OFFER.gst = item[k].tax_slabe;
        OFFER.loadspclservice(item[k].id,item[k].ofrid,item[k].ofritemid);
        }
        OFFER.itemRow();
    },
    autofetch: function () {
        var rw = event.target.closest(".data-row-wrap");
          var itm = $(rw).find('.i-r-subprod').attr('data-id');
          var ui = $(rw).find('.i-r-subprod').attr('data-sid');
            $.ajax({
                url: "sales/offer/getcodecombination/" + itm,
                dataType: "jsonp",
                type: "GET",
                complete: function (data) {
                    var jdata = JSON.parse(data.responseText);
                    var subc = $(rw).find('.i-r-subprod');
                    subc.empty();
                    subc.append($("<option></option>").attr("value", "").text("Select Sub combination"));
                    Object.keys(jdata).forEach(function (key){
                        subc.append($("<option></option>").attr("value", jdata[key].id).text(jdata[key].name));
                        subc.val(ui);
                   });
                }
            }); 
    },
    initOS:function(comstate,tax_slab,cus){
        COMMON.getUserRole();
        OFFER.comstate=comstate;
        OFFER.all_tax=tax_slab;
        OFFER.customer = cus;
        $("#salesunit").select2();
        $('#frmSNew').parsley();
        $('#frmSNew').submit(function (e) {
        e.preventDefault();
        if ($(this).parsley().isValid()) {
            OFFER.submitOSUMNewFrm();
        }
        });
        $('#offer_validity').on("change paste keyup", function(){
            OFFER.fetchvalidity($(this).val());
        });
        $('#total_amount').on("change paste keyup",function() {
            OFFER.claculateOSPrice();
            //OFFER.calculateOfferSummary();
        });
        $(".i-r-tax-slab").on("change paste keyup", function () {
           OFFER.claculateOSPrice();
           OFFER.fetchGST($(this).val());
        });
        $(".sa-field").on("change paste keyup", function () {
            var rw = event.target.closest(".safildwrap");
            OFFER.claculateOSSaFieldPrice(rw);
            
        });
        $(".i-r-o-tax-slab").on("change paste keyup", function () {
            var rw = event.target.closest(".safildwrap");
            OFFER.claculateOSSaFieldPrice(rw);
            OFFER.fetchSaData(rw);
        });
        $(".s-n-bk").on("click", function (e) {
            location.reload();
        });
        $("#currency").on("change paste keyup", function () {
            var cuncy = $(this).find(':selected').attr('data-val')
            console.log("cuncy "+cuncy);
            if(cuncy != 'undefined' || cuncy != '' || cuncy != 0){
                $("#currency_value").val(cuncy);
                $(".currency_val_cls").show();
            }
            else{
                $(".currency_val_cls").hide();
            }
        });
        jQuery('#offer_date').datepicker({
                autoclose: true,
                todayHighlight: true
            });
        jQuery('#query_date').datepicker({
                autoclose: true,
                todayHighlight: true
            });
    },
    initEOS:function(comstate,tax_slab,cus){
        COMMON.getUserRole();
           
        OFFER.initOS(comstate,tax_slab,cus);

        OFFER.customer = cus;
        OFFER.comstate=comstate;
        OFFER.all_tax=tax_slab;
        
        OFFER.gstInit();
        OFFER.claculateOSPrice();
        OFFER.calculateOfferSummary('on');
    },
    fetchvalidity: function(vall){
        $(".saTermField").each(function (i) {
            var _this = this;
            var termdata = $(_this).attr('data-name');
          if(termdata == 'Validity'){ 
             $(_this).find('.sa-term-msg').val(vall+' Days.'); 
          }
        });
    },
    fetchGST: function(vall){
      $(".saTermField").each(function (i) {
            var _this = this;
            var termdata = $(_this).attr('data-name');
            if(termdata == 'GST'){
                $(_this).find('.sa-term-msg').val('Extra at Actual at the time of Despatch. Currently it is @ '+vall+'%');
            }
        });  
    },
    fetchSaData: function(rw){
      $(".saTermField").each(function (i) {
          var _this = this;
          var sadata = $(rw).attr('data-sname');
          var satax = $(rw).find('.i-r-o-tax-slab').val();
          var sataxval = $(rw).find('.i-r-o-tax-tot').html();
          var termdata = $(_this).attr('data-name');
          if(sadata == termdata){
              console.log("yes");
              $(_this).find('.sa-term-msg').val('Extra @'+satax+'%'+' '+'= '+sataxval+' (INR)');
          }
      });
    },
    claculateOSPrice: function(){
        var p1 = $("#total_amount").val(),t1 = $('.i-r-tax-slab').val();
        var p = (p1 == "") ? 0 : parseFloat(p1), t = (t1 == "") ? 0 : parseFloat(t1);
        var ttax = p*t/100;
        var totl = p+ttax;

        $(".s-tax-tot").html(ttax.toFixed(2));
        $(".s-tot").html(totl.toFixed(2));
        OFFER.calculateOfferSummary('off');
    },

    calculateOfferSummary: function(preload){
       var st = $(".s-tot").html();
        //console.log("newst "+st);
         var ct = $(".sa-field").length;
                $(".sa-field").each(function (i) {
                    if(preload=='off' &&parseFloat($(this).attr('data-pct'))>0){
                        var af = ((st * parseFloat($(this).attr('data-pct'))) / 100);
                        $(this).val(af.toFixed(2));
                    }
                    var rw = $(this).closest(".safildwrap");
                    OFFER.claculateOSSaFieldPrice(rw);
                });
    },
    calculateOSTotPrice:function(){
        var st = parseFloat($(".s-tot").html()),stt = parseFloat($(".s-tax-tot").html()), ct = $(".safildwrap").length;
        $(".safildwrap").each(function (i) {
            st += parseFloat($(this).find('.i-r-o-tot').html());
            stt += parseFloat($(this).find('.i-r-o-tax-tot').html());
  
            if (!--ct) {
                $(".s-a-s-tot-2").html(st.toFixed(2));
                $(".s-a-s-tot-2-tax").html(stt.toFixed(2));
                
                $(".s-a-cgst-a").html("0.00");
                $(".s-a-sgst-a").html("0.00");
                $(".s-a-igst-a").html("0.00");
                //console.log("true "+OFFER.customer.state+' '+OFFER.customer.gst_applicable+' '+OFFER.comstate);
                if (typeof OFFER.customer.state !== 'undefined' && stt > 0 && OFFER.customer.gst_applicable == 'yes') {
                    //var gst = (st * PURCHASE.gst / 100);
                    if (OFFER.comstate == OFFER.customer.state) {
                        
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
    claculateOSSaFieldPrice: function (el) {
        var a1 = $(el).find('.sa-field').val().trim(), tax1 = $(el).find('.i-r-o-tax-slab').val().trim();
        var a = (a1 == "") ? 0 : parseFloat(a1), tax = (tax1 == "") ? 0 : parseFloat(tax1);
        var ttax = (a*tax / 100);
        $(el).find(".i-r-o-tax-tot").html(ttax.toFixed(2));
        $(el).find(".i-r-o-tot").html((a+ttax).toFixed(2));
        OFFER.calculateOSTotPrice();
    },
    initDoc:function(){
        $('#frmCUser').parsley();
        $('#frmCUser').submit(function(e) {
            e.preventDefault();
            if ( $(this).parsley().isValid() ) {
                OFFER.submitAmenddocFrm();
            }
        });
    }, 
    itemRow: function () {
        var htm = '<div class="data-row-wrap" data-id="0" data-moc="0" data-trim="0" data-stem="0">';
      /*  htm += '<div class="col-md-1 " style="float: left;    padding-top: 10px;font-size: 20px;">';
        htm += '<span class="i-r-slno"></span>';
        htm += '</div>';
        htm += '<div class="col-md-1" style="float: left;">';
        htm += '<input type="text" placeholder="Enter Enquiry Serial NO" class="form-control i-r-enq-slno"/>';
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
        for(var k in OFFER.unit)
        htm += '<option value="'+OFFER.unit[k].id+'">'+OFFER.unit[k].name+'</option>'
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
        for(var i in OFFER.all_tax)
        htm += '<option value="'+OFFER.all_tax[i]+'">'+OFFER.all_tax[i]+' %</option>';
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
        htm += '<input  type="hidden" class="form-control i-spcl-cls"  >'
        htm += '<input  type="hidden" class="form-control i-standard-cls"  >'
        htm += '<input  type="hidden" class="form-control i-enq-serial-cls"  >'
        htm += '<div class="col-md-12" style="float: left;">';
        htm += '<span class="i-r-span" style="font-size:10px;"></span>';
        htm += '</div>';
        htm += '</div>';
        htm += '<div style="clear: both;"></div>'
        $(".item-wrapper").append(htm);
        OFFER.initRow();
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
                    var $span = $(rw).find('.i-r-span');
                    var $slno = $(rw).find('.i-r-slno');
                    $slno.html($( ".data-row-wrap" ).length+". ")
                  //  $unt.empty();
                   // $unt.append($("<option></option>").attr("value", data.unit).text(data.unit));
                  //  if (data.unit_two != '')
                   //     $unt.append($("<option></option>").attr("value", data.unit_two).text(data.unit_two));
                 //   if (data.unit_three != '')
                   //     $unt.append($("<option></option>").attr("value", data.unit_three).text(data.unit_three));
                    $price.val(data.sales_rate);
                    $span.html(data.name+" "+data.specification);
                    $(rw).find('.i-r-tax-slab option[value="'+data.tax_slabe+'"]').prop('selected', true);
                    OFFER.hsn = data.hsn_code;
                    OFFER.gst = data.tax_slabe;
                    OFFER.gstInit();
                    OFFER.claculatePrice(rw);
                    OFFER.initRowElement();
                    OFFER.itemcustommodal(rw,ui.item.id,data);
                    OFFER.initcombine(ui.item.id,rw);
                    if($( ".data-row-wrap[data-id='0']" ).length==0)
                    OFFER.itemRow();
                });
            }
        });
        $(".select2").select2();
        
    },
    initcombine: function(itm,rw){
         var _this = this;
                $.ajax({
                    url: "sales/offer/getcodecombination/" + itm,
                    dataType: "jsonp",
                    type: "GET",
                    complete: function (data) {
                        var jdata = JSON.parse(data.responseText);
                        var subc = $(rw).find('.i-r-subprod');
                        //subc.empty();
                        subc.append($("<option></option>").attr("value", "").text("Select Sub combination"));
                        Object.keys(jdata).forEach(function (key){
                            //$('.data-row-wrap').attr('data-sid', jdata[key].id);
                            subc.append($("<option></option>").attr("value", jdata[key].id).text(jdata[key].name));
                             // CODIFICATION.pimninitsubftr();
                          });
                        }
                    });
    },
    gstInit:function(){
        $(".s-a-cgst-a").html("0.00");
        $(".s-a-sgst-a").html("0.00");
        $(".s-a-igst-a").html("0.00");
    },
    initRowElement: function () {
        $(".i-r-qnt").on("change paste keyup", function(){
            var rw = event.target.closest(".data-row-wrap");
            OFFER.claculatePrice(rw);
        });
        $(".i-r-price").on("change paste keyup", function(){
            var rw = event.target.closest(".data-row-wrap");
            OFFER.claculatePrice(rw);
        });
        $(".i-r-dis").on("change paste keyup", function(){
            var rw = event.target.closest(".data-row-wrap");
            OFFER.claculatePrice(rw);
        });
        $(".i-r-dis-numeric").on("change paste keyup", function(){
            var rw = event.target.closest(".data-row-wrap");
            OFFER.claculatePrice(rw);
        });
        $(".i-r-tax-slab").on("change paste keyup", function () {
            var rw = event.target.closest(".data-row-wrap");
            OFFER.claculatePrice(rw);
        });
        
        $(".i-r-del").on("click", function (e) {
            if($(this).closest(".data-row-wrap").attr("data-id")!='0'){
                $( this ).closest( ".data-row-wrap" ).remove();
                var ni = $('.data-row-wrap').length;
                if(ni==1){
                    OFFER.hsn = '-1';
                    OFFER.gst = 0;
                }
                OFFER.calculateAddPrice('off');
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
                OFFER.submitSNewFrm($(this).closest(".data-row-wrap").attr("data-id"));
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
        for(var i in OFFER.pr)
        htm += '<option value="'+OFFER.pr[i].id+'" data-forg="'+OFFER.pr[i].short_code+'">'+OFFER.pr[i].name+'</option>'   
        htm += '</select>';
        htm += '</div>';
        htm += '<div class="form-group col-md-6">';
        htm += '<label class="col-form-label" > Stem </label>';
        htm += '<select  class="form-control select2 select2-hidden-accessible  stem_cls">';
        htm += '<option value="0">select</option>';
        for(var i in OFFER.stem)
        htm += '<option value="'+OFFER.stem[i].id+'">'+OFFER.stem[i].name+'</option>'
        htm += '</select>';
        htm += '</div>';
        htm += '<div class="form-group col-md-6">';
        htm += '<label class="col-form-label" > Trim </label>';
        htm += '<select  class="form-control select2 select2-hidden-accessible  trim_cls">';
        htm += '<option value="0">select</option>';
        for(var i in OFFER.trim)
        htm += '<option value="'+OFFER.trim[i].id+'" >'+OFFER.trim[i].name+'</option>'
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
        htm += '<select  class="form-control select2 select2-hidden-accessible  inspection_cls">';
        htm += '<option value="0">select</option>';
        for(var i in OFFER.inspec)
        htm += '<option value="'+OFFER.inspec[i].id+'" >'+OFFER.inspec[i].label+'</option>'
        htm += '</select>';
        htm += '</div>';
        htm += '</div>';
        htm += '</div>';
        htm += '<div class="card-box">';
        htm += '<h4 class="m-t-0 header-title">Special Services</h4>'
        htm += '<div class="form-row">';
        for(var i in OFFER.spclsrvc){
        htm += '<div class="form-group col-md-6 special_service_cls" data-id="'+OFFER.spclsrvc[i].id+'">';
        htm += '<label class="col-form-label" >'+OFFER.spclsrvc[i].service_name+'</label>';
        htm += '<select  class="form-control select2 select2-hidden-accessible special_service_sub_cls" id="spclsrvc'+OFFER.spclsrvc[i].id+'">';
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
        OFFER.itemmodaloperation(did);

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
            var q1 = $(el).find('.i-r-qnt').val().trim(), p1 = $(el).find('.i-r-price').val().trim(), d1 = $(el).find('.i-r-dis').val().trim(),dn1 =$(el).find('.i-r-dis-numeric').val().trim(),tott1 =$(el).find(".i-r-tot").html().trim(),tax1=$(el).find('.i-r-tax-slab').val().trim();
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
            OFFER.calculateAddPrice('off');
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
                    OFFER.claculateSaFieldPrice(rw);
                    if (!--ct) {
                        OFFER.calculateTotPrice();
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
        OFFER.calculateTotPrice();
    },
    calculateTotPrice:function(){
        var arr={q:0,p:0,d:0,pr:0,tx:0,t:0},qnty = 0,tottax=0;
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
                if (typeof OFFER.customer.state !== 'undefined' && stt > 0 && OFFER.customer.gst_applicable == 'yes') {
                    //var gst = (st * PURCHASE.gst / 100);
                    if (OFFER.comstate == OFFER.customer.state) {
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
    submitSNewFrm: function (id) {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var itm=[],saf=[],otc=[],totdis=0,totpft=0,qnty=0;

       // $( ".data-row-wrap" ).each(function( i ) {
            //var id = parseInt($(this).attr('data-id'));
            console.log("ooid "+id);
            if(id > 0){
              //  console.log("qnty2 "+$(this).find('.i-r-qnt').val().trim())
                var q1 = $("div").find("[data-id="+id+"]").find('.i-r-qnt').val().trim(), p1 = $("div").find("[data-id="+id+"]").find('.i-r-price').val().trim(), d1 = $("div").find("[data-id="+id+"]").find('.i-r-dis').val().trim(), u = $("div").find("[data-id="+id+"]").find('.i-r-unit').val().trim(),dis_num = $("div").find("[data-id="+id+"]").find('.i-r-dis-numeric').val().trim();
                var q = (q1 == "") ? 0 : parseFloat(q1), p = (p1 == "") ? 0 : parseFloat(p1), d = (d1 == "") ? 0 : parseFloat(d1),discount_numeric = (dis_num == "") ? 0 : parseFloat(dis_num);
                var t = $("div").find("[data-id="+id+"]").find(".i-r-tot").html(),tx=parseFloat($("div").find("[data-id="+id+"]").find('.i-r-tax-tot').html().trim()),ts=parseFloat($("div").find("[data-id="+id+"]").find('.i-r-tax-slab').val().trim());
                var pr = parseInt($("div").find("[data-id="+id+"]").attr('data-moc')),stem = parseInt($("div").find("[data-id="+id+"]").attr('data-stem')),trim = parseInt($("div").find("[data-id="+id+"]").attr('data-trim'));
                var itmcode = $("div").find("[data-id="+id+"]").find('.i-item-code').val().trim(),spcldescription = $("div").find("[data-id="+id+"]").find('.i-special-description').val().trim(),gnrldescription = $("div").find("[data-id="+id+"]").find('.i-general-description').val().trim(),inspection = $("div").find("[data-id="+id+"]").find('.i-inspection-cls').val().trim(),hydbody = $("div").find("[data-id="+id+"]").find('.i-hydraulic-body').val().trim(),
                hydseat = $("div").find("[data-id="+id+"]").find('.i-hydraulic-seat').val().trim(),pneumseat = $("div").find("[data-id="+id+"]").find('.i-pneumatic-seat').val().trim(),hydbackseat = $("div").find("[data-id="+id+"]").find('.i-hydroback-seat').val().trim(),spclsrvc = $("div").find("[data-id="+id+"]").find('.i-spcl-cls').val().trim(),standard = $("div").find("[data-id="+id+"]").find('.i-standard-cls').val().trim(),
                enq_serial_no = $("div").find("[data-id="+id+"]").find('.i-enq-serial-cls').val().trim();
            }
       // });
        $(".safildwrap").each(function (i) {
            var id = parseInt($(this).attr('data-said'));
            if (id > 0) {
                saf.push({id: id, acc: $(this).attr('data-saacc'), v: parseFloat($(this).find('.sa-field').val().trim()),ts: parseFloat($(this).find('.i-r-o-tax-slab').val().trim()),tx: parseFloat($(this).find('.i-r-o-tax-tot').html().trim())});
            }
        });
        $('.saTermField').each(function (i) {
            var id = parseInt($(this).attr('data-said'));
            if (id > 0) {
                otc.push({id: id, msg: $(this).find('.sa-term-msg').val()});
            }
        });
        var data = {customer: OFFER.customer.id,
            query_date: $("#query_date").val(),
            offer_date: $("#offer_date").val(),
            offerpreby: $("#offerpreby").val(),
            offer_no: $("#offer_no").val(),
            offer_status: $("#offer_status").val(),
            enquery_validity: $("#enquery_validity").val(),
            offer_validity: $("#offer_validity").val(),
            offer_note: $("#offer_note").val(),
            ld_clause: $("#ld_clause").val(),
            p_terms_note: $("#p_terms_note").val(),
            ref_no: $("#ref_no").val(),
            bank_guarnty: $("#bank_guarnty").val(),
            offer_bank_guarnty: $("#bank_guarnty1").val(),
            total_amount: parseFloat($(".s-a-tot").html()),
            amount: parseFloat($(".s-a-s-tot").html()),
            cgst: parseFloat($(".s-a-cgst-a").html()),
            sgst: parseFloat($(".s-a-sgst-a").html()),
            igst: parseFloat($(".s-a-igst-a").html()),
            total_sub: parseFloat($(".s-a-s-tot").html()),
            enquiry_id:$("#enquiry_id").val(),
            ofrid:$("#ofrid").val(),
            sales_agent:$("#sagent").val(),
            tax:$(".i-r-tax-slab-new").val(),
            currency:$("#currency").val(),
            currency_value:$("#currency_value").val(),
         // slab: SALES.gst,
            //item: itm,
            saf:saf,
            otc:otc,
            round:parseFloat($(".s-a-round").html()),
            sid: $("#sid").val(),
            total_dis:totdis,
            total_pft:totpft,
            qnty:qnty,
            did: $("#did").val(),
            amendmentno: $("#amendmentno").val(),
            id: id, q: q, u: u, p: p, t: t,ts:ts,tx:tx, d: d,pr:pr,stem:stem,trim:trim,itmcode:itmcode,spcldescription:spcldescription,gnrldescription:gnrldescription,inspection:inspection,hydbody:hydbody,hydseat:hydseat,pneumseat:pneumseat,hydbackseat:hydbackseat,spclsrvc:spclsrvc,standard:standard,enq_serial_no:enq_serial_no,
            discount_numeric:discount_numeric
        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/sales/offer/save',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code > 0) {
                        var msg = '';
                            msg = 'Offer created successfully!!!';
                        COMMON.shownotification('success', msg);
                      } else {
                    COMMON.shownotification('error', 'Unable to save Offer!!!');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
     submitSNFrm: function () {
         $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var itm=[],saf=[],otc=[],totdis=0,totpft=0,qnty=0;
        $( ".data-row-wrap" ).each(function( i ) {
            var id = parseInt($(this).attr('data-id'));
            if(id>0){
                var q1 = $(this).find('.i-r-qnt').val().trim(), p1 = $(this).find('.i-r-price').val().trim(), d1 = $(this).find('.i-r-dis').val().trim(), u = $(this).find('.i-r-unit').val().trim(),dis_num = $(this).find('.i-r-dis-numeric').val().trim();
                var q = (q1 == "") ? 0 : parseFloat(q1), p = (p1 == "") ? 0 : parseFloat(p1), d = (d1 == "") ? 0 : parseFloat(d1),discount_numeric = (dis_num == "") ? 0 : parseFloat(dis_num);
                var t = $(this).find(".i-r-tot").html(),tx=parseFloat($(this).find('.i-r-tax-tot').html().trim()),ts=parseFloat($(this).find('.i-r-tax-slab').val().trim());
                
                var pr = parseInt($(this).attr('data-moc')),stem = parseInt($(this).attr('data-stem')),trim = parseInt($(this).attr('data-trim'));
                var itmcode = $(this).find('.i-item-code').val().trim(),spcldescription = $(this).find('.i-special-description').val().trim(),gnrldescription = $(this).find('.i-general-description').val().trim(),inspection = $(this).find('.i-inspection-cls').val().trim(),hydbody = $(this).find('.i-hydraulic-body').val().trim(),
                hydseat = $(this).find('.i-hydraulic-seat').val().trim(),pneumseat = $(this).find('.i-pneumatic-seat').val().trim(),hydbackseat = $(this).find('.i-hydroback-seat').val().trim(),spclsrvc = $(this).find('.i-spcl-cls').val().trim(),standard = $(this).find('.i-standard-cls').val().trim(),
                enq_serial_no = $(this).find('.i-enq-serial-cls').val().trim();

                itm.push({id: id, q: q, u: u, p: p, t: t,ts:ts,tx:tx, d: d,pr:pr,stem:stem,trim:trim,itmcode:itmcode,spcldescription:spcldescription,gnrldescription:gnrldescription,inspection:inspection,hydbody:hydbody,hydseat:hydseat,pneumseat:pneumseat,hydbackseat:hydbackseat,spclsrvc:spclsrvc,standard:standard,enq_serial_no:enq_serial_no,discount_numeric:discount_numeric});
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
        $('.saTermField').each(function (i) {
            var id = parseInt($(this).attr('data-said'));
            if (id > 0) {
                otc.push({id: id, msg: $(this).find('.sa-term-msg').val()});
            }
        });
        var offerdoc = $('#offer_doc').val();
        var data = {customer: OFFER.customer.id,
            query_date: $("#query_date").val(),
            offer_date: $("#offer_date").val(),
            offerpreby: $("#offerpreby").val(),
            offer_no: $("#offer_no").val(),
            offer_status: $("#offer_status").val(),
            enquery_validity: $("#enquery_validity").val(),
            offer_validity: $("#offer_validity").val(),
            offer_note: $("#offer_note").val(),
            ld_clause: $("#ld_clause").val(),
            p_terms_note: $("#p_terms_note").val(),
            ref_no: $("#ref_no").val(),
            bank_guarnty: $("#bank_guarnty").val(),
            offer_bank_guarnty: $("#bank_guarnty1").val(),
            total_amount: parseFloat($(".s-a-tot").html()),
            amount: parseFloat($(".s-a-s-tot").html()),
            cgst: parseFloat($(".s-a-cgst-a").html()),
            sgst: parseFloat($(".s-a-sgst-a").html()),
            igst: parseFloat($(".s-a-igst-a").html()),
            total_sub: parseFloat($(".s-a-s-tot").html()),
            enquiry_id:$("#enquiry_id").val(),
            ofrid:$("#ofrid").val(),
            sales_agent:$("#sagent").val(),
            tax:$(".i-r-tax-slab-new").val(),
            currency:$("#currency").val(),
            currency_value:$("#currency_value").val(),

         // slab: SALES.gst,
            item: itm,
            saf:saf,
            otc:otc,
            round:parseFloat($(".s-a-round").html()),
            sid: $("#sid").val(),
            total_dis:totdis,
            total_pft:totpft,
            qnty:qnty,
            did: $("#did").val(),
            amendmentno: $("#amendmentno").val()
        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/sales/offer/finalsave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code > 0) {
                  /*   if(offerdoc != ''){
                        console.log("offerdoc "+offerdoc);
                      OFFER.submitOdocNewFrm(res.code);
                      }*/
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("/sales/offer", function (data) {
                        $('#mainContent').html(data);
                        var msg = '';
                        if ($("#ofrid").val() !== 'undefined')
                            msg = 'Offer updated successfully!!!';
                        else
                            msg = 'Offer created successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                } else {
                    COMMON.shownotification('error', 'Unable to save Offer!!!');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
    submitEditFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var itm=[],saf=[],otc=[],totdis=0,totpft=0,qnty=0;
        $( ".data-row-wrap" ).each(function( i ) {
            var id = parseInt($(this).attr('data-id'));
            if(id>0){
                var q1 = $(this).find('.i-r-qnt').val().trim(), p1 = $(this).find('.i-r-price').val().trim(), d1 = $(this).find('.i-r-dis').val().trim(), u = $(this).find('.i-r-unit').val().trim(),dis_num = $(this).find('.i-r-dis-numeric').val().trim();
                var q = (q1 == "") ? 0 : parseFloat(q1), p = (p1 == "") ? 0 : parseFloat(p1), d = (d1 == "") ? 0 : parseFloat(d1),discount_numeric = (dis_num == "") ? 0 : parseFloat(dis_num);
                var t = $(this).find(".i-r-tot").html(),tx=parseFloat($(this).find('.i-r-tax-tot').html().trim()),ts=parseFloat($(this).find('.i-r-tax-slab').val().trim());
                
                var pr = parseInt($(this).attr('data-moc')),stem = parseInt($(this).attr('data-stem')),trim = parseInt($(this).attr('data-trim'));
                var itmcode = $(this).find('.i-item-code').val().trim(),spcldescription = $(this).find('.i-special-description').val().trim(),gnrldescription = $(this).find('.i-general-description').val().trim(),inspection = $(this).find('.i-inspection-cls').val().trim(),hydbody = $(this).find('.i-hydraulic-body').val().trim(),
                hydseat = $(this).find('.i-hydraulic-seat').val().trim(),pneumseat = $(this).find('.i-pneumatic-seat').val().trim(),hydbackseat = $(this).find('.i-hydroback-seat').val().trim(),spclsrvc = $(this).find('.i-spcl-cls').val().trim(),standard = $(this).find('.i-standard-cls').val().trim(),
                enq_serial_no = $(this).find('.i-enq-serial-cls').val().trim();

                itm.push({id: id, q: q, u: u, p: p, t: t,ts:ts,tx:tx, d: d,pr:pr,stem:stem,trim:trim,itmcode:itmcode,spcldescription:spcldescription,gnrldescription:gnrldescription,inspection:inspection,hydbody:hydbody,hydseat:hydseat,pneumseat:pneumseat,hydbackseat:hydbackseat,spclsrvc:spclsrvc,standard:standard,enq_serial_no:enq_serial_no,discount_numeric:discount_numeric});
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
        $('.saTermField').each(function (i) {
            var id = parseInt($(this).attr('data-said'));
            if (id > 0) {
                otc.push({id: id, msg: $(this).find('.sa-term-msg').val()});
            }
        });
        var data = {customer: OFFER.customer.id,
            offer_date: $("#offer_date").val(),
            offer_no: $("#offer_no").val(),
            amendment_no: $("#amendment_no").val(),
            offer_validity: $("#offer_validity").val(),
            offer_note: $("#offer_note").val(),
            ld_clause: $("#ld_clause").val(),
            p_terms_note: $("#p_terms_note").val(),
            total_amount: parseFloat($(".s-a-tot").html()),
            cgst: parseFloat($(".s-a-cgst-a").html()),
            sgst: parseFloat($(".s-a-sgst-a").html()),
            igst: parseFloat($(".s-a-igst-a").html()),
            total_sub: parseFloat($(".s-a-s-tot").html()),
            tax:$(".i-r-tax-slab-new").val(),
            currency:$("#currency").val(),
            currency_value:$("#currency_value").val(),
//            slab: SALES.gst,
            item: itm,
            saf:saf,
            otc:otc,
            round:parseFloat($(".s-a-round").html()),
            sid: $("#sid").val(),
            total_dis:totdis,
            qnty:qnty,
            
            did: $("#did").val(),
            amendmentno: $("#amendmentno").val()
        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'sales/offer/amendmentdoc',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);

                 var rb = res.rb;
                if (res.code == 1) {
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("sales/offer/amendment", function (data) {
                        $('#mainContent').html(data);
                        //COMMON.shownotification('success', msg);
                    });
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
    submitAmenddocFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');

       /* var doc = $('#amendment_doc').files;
        console.log("doc "+doc);
         var data = {
            did: $("#did").val(),
            amendmentno: $("#amendmentno").val()
        };*/
        var doc = $('#amendment_doc').get(0).files[0];
        var formData = new FormData();
        formData.append('amendmentno',$("#amendmentno").val());
        formData.append('did',$("#did").val());


        if(typeof (doc)==='undefined'){
            formData.append('amendment_doc','');
        }
        else{
               formData.append('amendment_doc',doc,doc.name);         
        }
        $.ajax({
            type: 'POST',
            data: formData,
            contentType: 'application/json',
            processData: false,
            contentType: false,
            url: 'sales/offer/amendmentsave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);

                if (res.code > 0) {
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("sales/offer", function (data) {
                        
                        $('#mainContent').html(data);
                        var msg = '';
                            msg = 'Offer updated successfully!!!';
                            
                        COMMON.shownotification('success', msg);
                    });
                } else {
                    COMMON.shownotification('error', 'Unable to save Offer!!!');
                }
             
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
    initTaxInvoice: function () {
        COMMON.getUserRole();
        OFFER.getInvoiceBody($("#sid").val());
        $(".select2").select2();
        $(".btn-cncl").on("click", function (e) {
            location.reload();
        });
        $(".btn-p-OS").on("click", function (e) {
            COMMON.printContent(OFFER.print);
        });
        $(".btn-pdf").on("click", function (e) {
            COMMON.printPdf($("#itemWrap"),"Tax-Invoice");
        });
    },
    getInvoiceBody:function(id){
      $.get('/sales/offer/billbody/' + id, function (data) {
        OFFER.print=data;
        $('#itemWrap').html(data);
     });
    },
    initODV :function(){
        COMMON.getUserRole();
      $('#frmSNew').parsley();
      var sid = $("#sid").val();
        $('#frmSNew').unbind("submit").submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                OFFER.submitOdocNewFrm(sid);
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
                $.get('/sales/offer/docdelete/' + cid, function (data) {
                    $.get("/sales/offer", function (data) {
                        $('#mainContent').html(data);
                        COMMON.shownotification('error', 'Document deleted successfully!!!');
                    });
                    
                });
            });

        });
    },
   submitOdocNewFrm: function (id) {
        $("body").css('cursor', 'wait');
        var files = $('#offer_doc').get(0).files[0];
        var formData = new FormData();
        formData.append('offerid',id);
        formData.append('ooffer_doc',$("#ooffer_doc").val());
        formData.append('imgid',$("#imgid").val());
        if(typeof (files)==='undefined')
            formData.append('offer_doc','');
        else
            formData.append('offer_doc',files,files.name); 
        
        $.ajax({
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            url: '/sales/offer/savedocument',
            complete: function (xhr) {
                 var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    $.get("/sales/offer", function (data) {
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
    submitOSUMNewFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var otc=[],saf=[];
        $('.saTermField').each(function (i) {
            var id = parseInt($(this).attr('data-said'));
            if (id > 0) {
                otc.push({id: id, msg: $(this).find('.sa-term-msg').val()});
            }
        });
        $(".safildwrap").each(function (i) {
            var id = parseInt($(this).attr('data-said'));
            if (id > 0) {
                saf.push({id: id, acc: $(this).attr('data-saacc'), v: parseFloat($(this).find('.sa-field').val().trim()),ts: parseFloat($(this).find('.i-r-o-tax-slab').val().trim()),tx: parseFloat($(this).find('.i-r-o-tax-tot').html().trim())});
            }
        });
        var files = $('#offer_summary_doc').get(0).files[0];
        var formData = new FormData();
        formData.append('customer',OFFER.customer.id);
        formData.append('offer_date',$("#offer_date").val());
        formData.append('offer_no',$("#offer_no").val());
        formData.append('offer_validity',$("#offer_validity").val());
        formData.append('total_amount',parseFloat($(".s-a-totr").html()));
        formData.append('amount',parseFloat($("#total_amount").val()));
        formData.append('total_quantity',$("#total_quantity").val());
        formData.append('offer_note',$("#offer_note").val());
        formData.append('enquiry_id',$("#enquiry_id").val());
        formData.append('ooffer_summary_doc',$("#ooffer_summary_doc").val());
        formData.append('imgid',$("#imgid").val());
        formData.append('ofrsmryid',$("#sid").val());
        formData.append('sales_agent',$("#sagent").val());
        formData.append('tax',$(".i-r-tax-slab").val());
        formData.append('otc',JSON.stringify(otc));
        formData.append('saf',JSON.stringify(saf));
        if(typeof (files)==='undefined'){
            formData.append('offer_summary_doc','');
        }
        else{
               formData.append('offer_summary_doc',files,files.name); 
            
        }
        $.ajax({
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            url: '/sales/offer/summarysave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("/sales/offer", function (data) {
                        $('#mainContent').html(data);
                        var msg='';
                        if($("#ofrsmryid").val()!=='undefined')
                            msg='Offer updated successfully!!!';
                        else 
                            msg='Offer created successfully!!!';
                        COMMON.shownotification('success',msg);
             $("body").css('cursor', 'wait');
                    });
                }
                 else {
                    $(".loginmessage").css('color','#f90000');
                    $(".loginmessage").html(res.msg);
                }
                $("body").css('cursor', 'default');
            },
        });
    },
    initMPL:function(){
        $(".s-n-bk").on("click", function (e) {
           location.reload();
        });
        var oid=$("#oid").val();
        //console.log("oid "+oid);
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "sales/offer/ajaxgetmappinglist/"+oid,
                type: 'POST',
                data: function (d) {
                    setTimeout(OFFER.initMapListButton, 1000);
                }
            }
        });
        OFFER.initMapListButton();
    },
    initMapListButton:function(){
        COMMON.getUserRole();
        $(".s-l-im").on("click", function (e) {
           var itmid = $(this).attr('data-id');
           var oid = $(this).attr('data-oid');
           var subitm = $(this).attr('data-subitm');
           var oiid = $(this).attr('data-oiid');
        $('#mainContent').html("<div class='loading'></div>");
        $.get('/sales/offer/itemmapping/?itmid="'+itmid+'"&oid="'+oid+'"&oiid="'+oiid+'"', function (data) {
                $('#mainContent').html(data);
            });
          });
    },
initMPN:function(){
    COMMON.getUserRole();
    $('.select2').select2();
    $(".i-n-b").on("click", function (e) {
        var ofrid = $("#ofrid").val();
        $('#mainContent').html("<div class='loading'></div>");
        $.get('sales/offer/mapping/' +ofrid, function (data) {
        $('#mainContent').html(data);
      });
    });
    $('#frmINew').parsley();
    $('#frmINew').submit(function (e) {
        e.preventDefault();
        if ($(this).parsley().isValid()) {
            OFFER.submitPFNform();
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
        url: "sales/offer/getprodspecificitem/" + term,
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
                var prod = $(this).find('.i-r-material').val().trim();
                var imapid = $(this).find('.imapid').val();
                var cm = parseInt($(this).attr('data-cid'));
                item.push({id: id, prod: prod,imapid:imapid,cm:cm});
            }
        });
        var oiid = $("#ofrid").val();
        var data = {
            ofr:$("#ofrid").val(),
            ofritm:$("#ofritm").val(),
            item:item,
        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'sales/offer/mappingsave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("/sales/offer/mapping/"+oiid, function (data) {
                        $('#mainContent').html(data);
                        var msg = '';
                            msg = 'Mapping created successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                }
                else if(res.code == 2){
                     $('#mainContent').html("<div class='loading'></div>");
                    $.get("/sales/offer/mapping/"+oiid, function (data) {
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
    initPL: function () {
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "sales/offer/ajaxgetproduct",
                type: 'POST',
                data: function (d) {
                    setTimeout(OFFER.initPlButton, 1000);
                }
            }
        });
        OFFER.initPlButton();
        COMMON.getUserRole();
   
    },
    initPlButton:function(){
        COMMON.getUserRole();
        
        $(".s-l-subcode").on("click", function (e) {
            var itemid = $(this).attr('data-itemid');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('sales/offer/sub_product/' +itemid , function (data) {
                $('#mainContent').html(data);
            });
        });
    },

    initSPL: function () {
        var scid = $('#scid').val();
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "sales/offer/ajaxsubcodificationget/"+scid,
                type: 'POST',
                data: function (d) {
                    setTimeout(OFFER.initSubButton, 1000);
                }
            }
        });
        $(".c-n-b").on("click", function (e) {
            location.reload();
        });
        $(".s-l-cn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("sales/offer/sub_product_new/"+scid, function (data) {
                $('#mainContent').html(data);
            });
        });
        OFFER.initSubButton();
        COMMON.getUserRole();
    },
    initSubButton:function(){
        COMMON.getUserRole();
        $(".s-l-sce").on("click", function (e) {
            var subitm = $(this).attr('data-subitm');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('sales/offer/sub_product_edit/'+subitm , function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-scd").on("click", function (e) {
            var itm = $(this).attr('data-itm');
            var subitm = $(this).attr('data-subitm');
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
                $.get('sales/offer/sub_product_delete/?id="'+itm+'"&p_i_id="'+subitm+'"', function (data) {
                    $('#datatable').DataTable().ajax.reload(null, false);
                    COMMON.shownotification('error', ' sub Product  deleted successfully!!!');
                });
            });
        });
    },
     initSPN: function () {
        $(".select2").select2();
        $('#frmCNew').parsley();
        $('#frmCNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                OFFER.submitPSCNnewFrm();
            }
        });
        $('.specification_item_cls').on("change",function() {
             OFFER.dynamiccode();
             OFFER.dynamicname();
             OFFER.dynamicpart();
        });
        $('.specific_category_cls').each(function() {
                 var term = $(this).closest('.specific_category_cls').attr('data-id');
                 var _this = this;
                $.ajax({
                    url: "product/prod_codification/getprodspecificitem/" + term,
                    dataType: "jsonp",
                    type: "GET",
                    complete: function (data) {
                        var jdata=JSON.parse(data.responseText);
                        Object.keys(jdata).forEach(function (key){
                             var $specification_item = $('#speification_item'+jdata[key].specification_id);
                                $specification_item.append($("<option></option>").val(jdata[key].code).text(jdata[key].name).attr("data-id", jdata[key].id));
                          });
                        }
                    });
            });
        $(".c-n-b").on("click", function (e) {
            var cid = $("#itmid").val();
            $('#mainContent').html("<div class='loading'></div>");
            $.get("sales/offer/sub_product/" + cid, function (data) {
                $('#mainContent').html(data);
            });
        });
    },
    dynamiccode: function (rw) {
        console.log(rw);
        console.log("kk "+$(".i-product-code").val());
          $(".i-product-code").val(" "); 
          $('.specification_item_cls').each(function() { 
             var _this = this;
             var txt = $(_this).val();
             console.log('txt '+txt);
             if(txt != null){
             $(".i-product-code").val($(".i-product-code").val() + txt);
             }
             else{
                 OFFER.loadOldData();
             }

         });
    },
    initSPE: function (iid) {
        OFFER.subcode = iid;
        $(".select2").select2();
        $('#frmCNew').parsley();
        $('#frmCNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                OFFER.submitPSCNnewFrm();
            }
        });
        $('.specification_item_cls').on("change",function() {
             
             OFFER.dynamiccode();
             OFFER.dynamicname();
             OFFER.dynamicpart();
        });
        $('.specific_category_cls').each(function() {
                 var term = $(this).closest('.specific_category_cls').attr('data-id');
                 var _this = this;

                $.ajax({
                    url: "product/prod_codification/getprodspecificitem/" + term,
                    dataType: "jsonp",
                    type: "GET",
                    complete: function (data) {
                        var jdata=JSON.parse(data.responseText);
                        Object.keys(jdata).forEach(function (key){
                             var $specification_item = $('#speification_item'+jdata[key].specification_id);
                                $specification_item.append($("<option></option>").val(jdata[key].code).text(jdata[key].name).attr("data-id", jdata[key].id));

                          });
                    }
                   
                });
          });
        OFFER.loadsubOldData();
        $(".c-n-b").on("click", function (e) {
            var cid = $("#itmid").val();
            $('#mainContent').html("<div class='loading'></div>");
            $.get("sales/offer/sub_product/" + cid, function (data) {
                $('#mainContent').html(data);
            });
        });
        
    },
    dynamicname: function () {
        $("#product_name").val(" ");
         $('.specification_item_cls').each(function() { 
             if($(this).val() != ''){
             var txt = $(this).find('option:selected').text();
             var sf = txt.replace(/select/g, "");
             $("#product_name").val($("#product_name").val()+'/'+sf);
             }
             });
    },
    dynamicpart: function () {
        $("#product_part").val(" ");
         $('.specification_item_cls').each(function() { 
             if($(this).val() != ''){
             var sname = $(this).attr("data-name");
             //console.log("sname"+sname);
             var sf = $(this).val();
             $("#product_part").val($("#product_part").val()+' '+sname+' - '+sf);
             }
             });
    },
    loadOldData:function(){
        $.ajax({
                url: 'sales/offer/getoldcode/?pid="'+OFFER.prodcode.product_item_id+'"' ,
                dataType: "jsonp",
                type: "GET",
                complete: function (data) {
                    var jdata=JSON.parse(data.responseText);
                    Object.keys(jdata).forEach(function (k){
                        
                        var $specification_item = $('#speification_item'+jdata[k].prod_specification_category);

                        //console.log($specification_item.val(jdata[k].code).trigger('change'));
                        $specification_item.val(jdata[k].code).trigger('change');

                      }); 
                }
            });
    },
    loadsubOldData:function(){
        $.ajax({
                url: 'sales/offer/getsuboldcode/?pid="'+OFFER.subcode.sub_item+'"' ,
                dataType: "jsonp",
                type: "GET",
                complete: function (data) {
                    var jdata=JSON.parse(data.responseText);
                    Object.keys(jdata).forEach(function (k){
                        console.log('speification_item '+jdata[k].prod_specification_category);
                        var $specification_item = $('#speification_item'+jdata[k].prod_specification_category);
                        $specification_item.val(jdata[k].code).trigger('change');

                      }); 
                }
            });
    },
    submitPSCNnewFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var category = [];
        $(".specific_category_cls").each(function(i){
            var specificid=$(this).attr("data-id");
            $(this).find(".specification_item_cls").each(function(j){
                if($(this).val() != ''){
                    category.push({specificid:$(this).closest(".specific_category_cls").attr("data-id"),
                     item_name:$("#speification_item"+specificid+" option:selected").attr('data-id'),
                });  
                }  
            });
        });
        var idd = $('#itmid').val();
        var data = {
            category:category,
            code:$('#product_code').val(),
            product_specification:$('#product_name').val(),
            product_name:$('#product_part').val(),
            itmid:$('#itmid').val(),
            subitmid:$("#subitmid").val(),
        }
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'sales/offer/sub_product_save',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                        $('#mainContent').html("<div class='loading'></div>");
                        $.get("sales/offer/sub_product/"+idd, function (data) {
                            $('#mainContent').html(data);

                        });
                    var msg = '';
                    if ($("#subitmid").val() !== 'undefined')
                        msg = 'Sub Product  updated successfully!!!';
                    else
                        msg = 'Sub Product created successfully!!!';
                    COMMON.shownotification('success', msg);
                }
                else {
                        COMMON.shownotification('error', 'Unable to create Sub Product!!!');
                    }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },

};