var PCOMPETITIVE = {
    vendor: [],
    all_tax:[],
    hsn: '-1',
    gst: 0,
    comstate:'',
    print:'',
    state:'',
    vname:'',
    enqyn:'',
    newvendor:[],
    initPCL: function () {
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "purchase/price_competitive/ajaxget",
                type: 'POST',
                data: function (d) {
                    setTimeout(PCOMPETITIVE.initButton, 1000);
                }
            }
        });
        $(".s-l-cn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("purchase/price_competitive/new", function (data) {
                $('#mainContent').html(data);
            });
        });
        PCOMPETITIVE.initButton();
        COMMON.getUserRole();
    },
    initButton:function(){
        COMMON.getUserRole();
        $(".s-l-e").on("click", function (e) {
            var id=$(this).attr('data-id');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('/purchase/price_competitive/edit/'+id, function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-dv").on("click", function (e) {
            $.get('/purchase/price_competitive/docview/' + $(this).attr('data-id'), function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-pon").on("click", function (e) {
            $.get('/purchase/price_competitive/purchaseOrder/' + $(this).attr('data-id'), function (data) {
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
                $.get('/purchase/price_competitive/delete/'+cid, function (data) {
                    //$('#datatable').DataTable().ajax.reload();
                    $('#datatable').DataTable().ajax.reload(null, false);
                    COMMON.shownotification('error', 'Price Competative Statement deleted successfully!!!');
                });
            });

        });
    },
    initPCN:function(comstate,tax_slab){
        COMMON.getUserRole();
        PCOMPETITIVE.comstate=comstate;
        PCOMPETITIVE.all_tax=tax_slab;
        $(".select2").select2();
        $("#salesunit").select2();
        $('#frmSNew').parsley();
        $('#frmSNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                PCOMPETITIVE.submitSNewFrm();
            }
        });
        $(".s-n-bk").on("click", function (e) {
            location.reload();
        });
        $(".sa-field").on("change paste keyup", function () {
            var rw = event.target.closest(".safildwrap");
            PCOMPETITIVE.claculateSaFieldPrice(rw);
        });
        $(".i-r-o-tax-slab").on("change paste keyup", function () {
            var rw = event.target.closest(".safildwrap");
            PCOMPETITIVE.claculateSaFieldPrice(rw);
        });
        
        jQuery('#enquiry_date').datepicker({
                autoclose: true,
                todayHighlight: true
            });
        $(".custom-modal-button").on("click", function (e) {
            COMMON.loadCustomModal(this);
        });
        $("#vendor_name").on("change", function() {
            var vendorid = $(this).val();
            $.get('/purchase/price_competitive/vendorbyid/' + vendorid, function (data) {
                    PCOMPETITIVE.vendor = JSON.parse(data);
                    PCOMPETITIVE.getShipping(PCOMPETITIVE.vendor.default_shipping);
                });
            
        });
        PCOMPETITIVE.itemRow();
    },
    initPCE: function(comstate,cus,sp,item,tax_slab){
        $(".select2").select2();
        PCOMPETITIVE.initPCN(comstate,tax_slab);

        for(var k in item){
        PCOMPETITIVE.hsn = item.hsn_code;
        PCOMPETITIVE.gst = item.tax_slabe;
        }
        PCOMPETITIVE.vendor.gst_applicable = cus.gst_applicable;
        PCOMPETITIVE.state = sp.state;
        PCOMPETITIVE.gstInit();
        PCOMPETITIVE.initRowElement();
        PCOMPETITIVE.calculateAddPrice('on');

    },
    getShipping:function(vendorid){
        $.get('/purchase/price_competitive/shippingbyid/' + vendorid, function (data) {
            var sd = JSON.parse(data);
                    PCOMPETITIVE.state = sd.state;
            });
    },
    itemRow: function () {
        var htm = '<div class="data-row-wrap" data-id="0">';
        htm += '<div class="col-md-3" style="float: left;">';
        htm += '<input type="text" placeholder="Enter product code" class="form-control i-r-prod"/>';
        htm += '</div>';
        htm += '<div class="col-md-1" style="float: left;">';
        htm += '<input type="text" placeholder="Enter product Description" class="form-control i-r-prod-des"/>';
        htm += '</div>';
        htm += '<div class="col-md-1" style="float: left;">';
        htm += '<input type="number" step="1" class="form-control i-r-qnt" placeholder="Quantity" >';
        htm += '</div>';
        htm += '<div class="col-md-1" style="float: left;">';
        htm += '<select  class="form-control i-r-unit"></select>';
        htm += '</div>';
        htm += '<div class="col-md-2" style="float: left;">';
        htm += '<input type="number" class="form-control i-r-price" step=".01" placeholder="Price" value="0">';
        htm += '</div>';
        htm += '<div class="col-md-1" style="float: left;">';
        htm += '<select class="form-control i-r-tax-slab">';
        for(var i in PCOMPETITIVE.all_tax)
            htm += '<option value="'+PCOMPETITIVE.all_tax[i]+'">'+PCOMPETITIVE.all_tax[i]+' %</option>';
        htm += '</select>';
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
        htm += '<div class="col-md-12" style="float: left;">';
        htm += '<span class="i-r-span" style="font-size:10px;"></span>';
        htm += '</div>';
        htm += '</div>';
        $(".item-wrapper").append(htm);
        PCOMPETITIVE.initRow();
    },
    initRow: function () {

        $(".i-r-prod").autocomplete({
            source: function (request, response) {
                var data={term: request.term,
                        hsn:-1};
                $.ajax({
                    url: "/purchase/price_competitive/autoitem",
                    type: "POST",
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    complete: function (data) {
                        response($.map(JSON.parse(data.responseText), function (item) {
                            return {
                                label: item.code+' ('+item.specification+')',
                                value: item.code+' HSN:'+item.hsn_code,
                                id: item.id,
                            };
                        }));
                    }
                });
            },
            minLength: 3,
            select: function (event, ui) {
                $.get('/item/itembyid/' + ui.item.id, function (data) {
                    data = JSON.parse(data);
                    var rw = event.target.closest(".data-row-wrap");
                    $(rw).attr('data-id', data.id);
                    var $unt = $(rw).find('.i-r-unit');
                    var $qnty = $(rw).find('.i-r-qnt');
                    var $span = $(rw).find('.i-r-span');
                    $unt.empty();
                    $unt.append($("<option></option>").attr("value", data.unit).text(data.unit));
                    if (data.unit_two != '')
                        $unt.append($("<option></option>").attr("value", data.unit_two).text(data.unit_two));
                    if (data.unit_three != '')
                        $unt.append($("<option></option>").attr("value", data.unit_three).text(data.unit_three));
                    $qnty.val(data.tot_qnty);
                    $span.html(data.name+", "+data.specification);
                    $(rw).find('.i-r-tax-slab option[value="'+data.tax_slabe+'"]').prop('selected', true);
                    PCOMPETITIVE.hsn = data.hsn_code;
                    PCOMPETITIVE.gst = data.tax_slabe;
                    PCOMPETITIVE.gstInit();
                    PCOMPETITIVE.claculatePrice(rw);
                    PCOMPETITIVE.initRowElement();
                    if($( ".data-row-wrap[data-id='0']" ).length==0)
                    PCOMPETITIVE.itemRow();
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
            PCOMPETITIVE.claculatePrice(rw);
        });
        $(".i-r-price").on("change paste keyup", function(){
            var rw = event.target.closest(".data-row-wrap");
            PCOMPETITIVE.claculatePrice(rw);
        });
        $(".i-r-tax-slab").on("change paste keyup", function () {
            var rw = event.target.closest(".data-row-wrap");
            PCOMPETITIVE.claculatePrice(rw);
        });
        $(".i-r-del").on("click", function (e) {
            if($(this).closest(".data-row-wrap").attr("data-id")!='0'){
                $( this ).closest( ".data-row-wrap" ).remove();
                var ni = $('.data-row-wrap').length;
                if(ni==1){
                    PCOMPETITIVE.hsn = '-1';
                    PCOMPETITIVE.gst = 0;
                }
                PCOMPETITIVE.calculateAddPrice('off');
            }
        });
        
    },

    claculatePrice: function (el) {
        var id = parseInt($(el).attr('data-id'));
        if (id > 0) {
            var q1 = $(el).find('.i-r-qnt').val().trim(), p1 = $(el).find('.i-r-price').val().trim(),tax1=$(el).find('.i-r-tax-slab').val().trim();
            var q = (q1 == "") ? 0 : parseFloat(q1), p = (p1 == "") ? 0 : parseFloat(p1),tax = (tax1 == "") ? 0 : parseFloat(tax1);
            var t1 = q * p;
            var tax1 = t1*tax / 100;
            var a = t1+tax1;
   
             $(el).find(".i-r-tax-tot").html(tax1.toFixed(2));
             $(el).find(".i-r-tot").html(a.toFixed(2));
            
            PCOMPETITIVE.calculateAddPrice('off');
        }
    },
    
    calculateAddPrice:function(preload){
        var arr={q:0,p:0,d:0,pr:0,tx:0,t:0},st = 0,stt=0,qntty=-1,dis=0,pft=0, count = $(".data-row-wrap").length;
        $(".data-row-wrap").each(function (i) {
            if($(this).attr("data-id")!='0'){
            var q1 = $(this).find('.i-r-qnt').val().trim(), p1 = $(this).find('.i-r-price').val().trim(),tax1=$(this).find('.i-r-tax-slab').val().trim();
            var q = (q1 == "") ? 0 : parseFloat(q1), p = (p1 == "") ? 0 : parseFloat(p1),tax = (tax1 == "") ? 0 : parseFloat(tax1);
            var tot = q * p
            arr.q += q;
            arr.p += tot;

            st += parseFloat($(this).find('.i-r-tot').html().trim());
            stt += parseFloat($(this).find('.i-r-tax-tot').html().trim());
        }
            if (!--count) {
                $(".s-a-s-tot-qnty").html(arr.q.toFixed(2));
                $(".s-a-s-tot-r").html(arr.p.toFixed(2));
                $(".s-a-s-tot-tax").html(stt.toFixed(2));
                $(".s-a-s-tot").html(st.toFixed(2));
                var ct = $(".sa-field").length;
                $(".sa-field").each(function (i) {
                    if(preload=='off' && parseFloat($(this).attr('data-pct'))>0){
                        var af = ((st * parseFloat($(this).attr('data-pct'))) / 100);
                        $(this).val(af.toFixed(2));
                    }
                    var rw = $(this).closest(".safildwrap");
                    PCOMPETITIVE.claculateSaFieldPrice(rw);
                    if (!--ct) {
                        PCOMPETITIVE.calculateTotPrice();
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
        PCOMPETITIVE.calculateTotPrice();
    },
    calculateTotPrice:function(){
        var arr={q:0,p:0,d:0,pr:0,tx:0,t:0},qnty = 0;
        var qntty = parseFloat($(".s-a-s-tot-qnty").html()),rate = parseFloat($(".s-a-s-tot-r").html()),st = parseFloat($(".s-a-s-tot").html()),stt = parseFloat($(".s-a-s-tot-tax").html()), ct = $(".safildwrap").length;
        $(".safildwrap").each(function (i) {
            st += parseFloat($(this).find('.i-r-o-tot').html());
            stt += parseFloat($(this).find('.i-r-o-tax-tot').html());
            if (!--ct) {
                $(".s-a-s-qnty-2").html(qntty.toFixed(2));
                $(".s-a-s-r-2").html(rate.toFixed(2));
                $(".s-a-s-tot-2").html(st.toFixed(2));
                $(".s-a-s-tot-2-tax").html(stt.toFixed(2));
                
                $(".s-a-cgst-a").html("0.00");
                $(".s-a-sgst-a").html("0.00");
                $(".s-a-igst-a").html("0.00");
                if (typeof PCOMPETITIVE.state !== 'undefined' && stt > 0 && PCOMPETITIVE.vendor.gst_applicable == 'yes') {
                    //var gst = (st * PURCHASE.gst / 100);
                    if (PCOMPETITIVE.comstate == PCOMPETITIVE.state) {
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
    initPON: function(comstate,cus,enqy,sp,item,tax_slab){
        COMMON.getUserRole();
        $(".select2").select2();
        PCOMPETITIVE.comstate=comstate;
        PCOMPETITIVE.all_tax=tax_slab;
        $('#frmSNew').parsley();
        $('#frmSNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                PCOMPETITIVE.submitPONNewFrm();
            }
        });
        PCOMPETITIVE.vendor.vname = cus.id;
        PCOMPETITIVE.vendor.enqyn = enqy.enquiry;
        $(".s-n-bk").on("click", function (e) {
            location.reload();
        });
        $(".sa-field").on("change paste keyup", function () {
            var rw = event.target.closest(".safildwrap");
            PCOMPETITIVE.claculateSaFieldPrice(rw);
        });
        $(".i-r-o-tax-slab").on("change paste keyup", function () {
            var rw = event.target.closest(".safildwrap");
            PCOMPETITIVE.claculateSaFieldPrice(rw);
        });
        
        jQuery('#purchase_order_date').datepicker({
                autoclose: true,
                todayHighlight: true
            });
        $(".custom-modal-button").on("click", function (e) {
            COMMON.loadCustomModal(this);
        });
        $("#vendor_name").on("change", function() {
            var vendorid = PCOMPETITIVE.vendor.vname;
            $.get('/purchase/price_competitive/vendorbyid/' + vendorid, function (data) {
                    PCOMPETITIVE.vendor = JSON.parse(data);
                    PCOMPETITIVE.getShipping(PCOMPETITIVE.vendor.default_shipping);
                });
            
        });
        
        

        //PCOMPETITIVE.itemRow();
        for(var k in item){
        PCOMPETITIVE.hsn = item.hsn_code;
        PCOMPETITIVE.gst = item.tax_slabe;
        }
        PCOMPETITIVE.vendor.gst_applicable = cus.gst_applicable;
        PCOMPETITIVE.state = sp.state;
        PCOMPETITIVE.gstPOInit();
        PCOMPETITIVE.initPORowElement();
        PCOMPETITIVE.calculatePOAddPrice('on');

    },
    gstPOInit:function(){
        $(".s-a-cgst-a").html("0.00");
        $(".s-a-sgst-a").html("0.00");
        $(".s-a-igst-a").html("0.00");
    },
    initPORowElement: function () {
        $(".i-r-qnt").on("change paste keyup", function(){
            var rw = event.target.closest(".data-row-wrap");
            PCOMPETITIVE.claculatePOPrice(rw);
        });
        $(".i-r-price").on("change paste keyup", function(){
            var rw = event.target.closest(".data-row-wrap");
            PCOMPETITIVE.claculatePOPrice(rw);
        });
        $(".i-r-tax-slab").on("change paste keyup", function () {
            var rw = event.target.closest(".data-row-wrap");
            PCOMPETITIVE.claculatePOPrice(rw);
        });
        $(".i-r-del").on("click", function (e) {
            if($(this).closest(".data-row-wrap").attr("data-id")!='0'){
                $( this ).closest( ".data-row-wrap" ).remove();
                var ni = $('.data-row-wrap').length;
                if(ni==1){
                    PCOMPETITIVE.hsn = '-1';
                    PCOMPETITIVE.gst = 0;
                }
                PCOMPETITIVE.calculatePOAddPrice('off');
            }
        });
        
    },

    claculatePOPrice: function (el) {
        var id = parseInt($(el).attr('data-id'));
        if (id > 0) {
            var q1 = $(el).find('.i-r-qnt').val().trim(), p1 = $(el).find('.i-r-price').html().trim(),tax1=$(el).find('.i-r-tax-slab').html().trim();
            var q = (q1 == "") ? 0 : parseFloat(q1), p = (p1 == "") ? 0 : parseFloat(p1),tax = (tax1 == "") ? 0 : parseFloat(tax1);
            var t1 = q * p;
            var tax1 = t1*tax / 100;
            var a = t1+tax1;
   
             $(el).find(".i-r-tax-tot").html(tax1.toFixed(2));
             $(el).find(".i-r-tot").html(a.toFixed(2));
            
            PCOMPETITIVE.calculatePOAddPrice('off');
        }
    },
    
    calculatePOAddPrice:function(){
        var arr={q:0,p:0,d:0,pr:0,tx:0,t:0},st = 0,stt=0,qntty=-1,dis=0,pft=0, count = $(".data-row-wrap").length;
        $(".data-row-wrap").each(function (i) {
            if($(this).attr("data-id")!='0'){
            var q1 = $(this).find('.i-r-qnt').val().trim(), p1 = $(this).find('.i-r-price').html().trim(),tax1=$(this).find('.i-r-tax-slab').html().trim();
            var q = (q1 == "") ? 0 : parseFloat(q1), p = (p1 == "") ? 0 : parseFloat(p1),tax = (tax1 == "") ? 0 : parseFloat(tax1);
            var tot = q * p
            arr.q += q;
            arr.p += tot;

            st += parseFloat($(this).find('.i-r-tot').html().trim());
            stt += parseFloat($(this).find('.i-r-tax-tot').html().trim());
        }
            if (!--count) {
                $(".s-a-s-tot-qnty").html(arr.q.toFixed(2));
                $(".s-a-s-tot-r").html(arr.p.toFixed(2));
                $(".s-a-s-tot-tax").html(stt.toFixed(2));
                $(".s-a-s-tot").html(st.toFixed(2));
                var ct = $(".sa-field").length;
                $(".sa-field").each(function (i) {
                    if(parseFloat($(this).attr('data-pct'))>0){
                        var af = ((st * parseFloat($(this).attr('data-pct'))) / 100);
                        $(this).val(af.toFixed(2));
                    }
                    var rw = $(this).closest(".safildwrap");
                    PCOMPETITIVE.claculatePOSaFieldPrice(rw);
                    if (!--ct) {
                        PCOMPETITIVE.calculatePOTotPrice();
                    }
                });
            }
        });

    },
    claculatePOSaFieldPrice: function (el) {
        var a1 = $(el).find('.sa-field').val().trim(), tax1 = $(el).find('.i-r-o-tax-slab').val().trim();
        var a = (a1 == "") ? 0 : parseFloat(a1), tax = (tax1 == "") ? 0 : parseFloat(tax1);
        var ttax = (a*tax / 100);
        $(el).find(".i-r-o-tax-tot").html(ttax.toFixed(2));
        $(el).find(".i-r-o-tot").html((a+ttax).toFixed(2));
        PCOMPETITIVE.calculatePOTotPrice();
    },
    calculatePOTotPrice:function(){
        var arr={q:0,p:0,d:0,pr:0,tx:0,t:0},qnty = 0;
        var qntty = parseFloat($(".s-a-s-tot-qnty").html()),rate = parseFloat($(".s-a-s-tot-r").html()),st = parseFloat($(".s-a-s-tot").html()),stt = parseFloat($(".s-a-s-tot-tax").html()), ct = $(".safildwrap").length;
        $(".safildwrap").each(function (i) {
            st += parseFloat($(this).find('.i-r-o-tot').html());
            stt += parseFloat($(this).find('.i-r-o-tax-tot').html());
            if (!--ct) {
                $(".s-a-s-qnty-2").html(qntty.toFixed(2));
                $(".s-a-s-r-2").html(rate.toFixed(2));
                $(".s-a-s-tot-2").html(st.toFixed(2));
                $(".s-a-s-tot-2-tax").html(stt.toFixed(2));
                
                $(".s-a-cgst-a").html("0.00");
                $(".s-a-sgst-a").html("0.00");
                $(".s-a-igst-a").html("0.00");
                if (typeof PCOMPETITIVE.state !== 'undefined' && stt > 0 && PCOMPETITIVE.vendor.gst_applicable == 'yes') {
                    //var gst = (st * PURCHASE.gst / 100);
                    if (PCOMPETITIVE.comstate == PCOMPETITIVE.state) {
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
    submitSNewFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var itm=[],saf=[];
        $( ".data-row-wrap" ).each(function( i ) {
            var id = parseInt($(this).attr('data-id'));
            if(id>0){
                var q1 = $(this).find('.i-r-qnt').val().trim(), p1 = $(this).find('.i-r-price').val().trim(), u = $(this).find('.i-r-unit').val().trim(),desc = $(this).find('.i-r-prod-des').val().trim();
                var q = (q1 == "") ? 0 : parseFloat(q1), p = (p1 == "") ? 0 : parseFloat(p1);
                var t = $(this).find(".i-r-tot").html(),tx=parseFloat($(this).find('.i-r-tax-tot').html().trim()),ts=parseFloat($(this).find('.i-r-tax-slab').val().trim());
                itm.push({id: id, q: q, u: u, p: p, t: t, tx:tx,ts:ts,desc:desc});
         
            }
        });
        $(".safildwrap").each(function (i) {
            var id = parseInt($(this).attr('data-said'));
            if (id > 0) {
                saf.push({id: id, acc: $(this).attr('data-saacc'), v: parseFloat($(this).find('.sa-field').val().trim()),ts: parseFloat($(this).find('.i-r-o-tax-slab').val().trim()),tx: parseFloat($(this).find('.i-r-o-tax-tot').html().trim())});
            }
        });
        var data = {vendor: $("#vendor_name").val(),
            enquiry_date: $("#enquiry_date").val(),
            enquiry_no: $("#enquiry_no").val(),
            note: $("#note").val(),
            total_amount: parseFloat($(".s-a-tot").html()),
            cgst: parseFloat($(".s-a-cgst-a").html()),
            sgst: parseFloat($(".s-a-sgst-a").html()),
            igst: parseFloat($(".s-a-igst-a").html()),
            total_sub: parseFloat($(".s-a-s-tot").html()),
            item: itm,
            saf:saf,
            round:parseFloat($(".s-a-round").html()),
            sid: $("#sid").val(),
        };
        
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/purchase/price_competitive/save',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code > 0) {
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("/purchase/price_competitive", function (data) {
                        
                        $('#mainContent').html(data);
                        var msg = '';
                        if ($("#sid").val() !== 'undefined')
                            msg = 'Price Compititive updated successfully!!!';
                        else
                            msg = 'Price Compititive created successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                } else {
                    COMMON.shownotification('error', 'Unable to save Price Compititive!!!');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
    submitPONNewFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var itm=[],saf=[];
        $( ".data-row-wrap" ).each(function( i ) {
            var id = parseInt($(this).attr('data-id'));
            if(id>0){
                var q1 = $(this).find('.i-r-qnt').val().trim(), p1 = $(this).find('.i-r-price').html().trim(), u = $(this).find('.i-r-unit').html().trim();
                var q = (q1 == "") ? 0 : parseFloat(q1), p = (p1 == "") ? 0 : parseFloat(p1);
                var t = $(this).find(".i-r-tot").html(),tx=parseFloat($(this).find('.i-r-tax-tot').html().trim()),ts=parseFloat($(this).find('.i-r-tax-slab').html().trim());
                itm.push({id: id, q: q, u: u, p: p, t: t, tx:tx,ts:ts});
            }
        });
        $(".safildwrap").each(function (i) {
            var id = parseInt($(this).attr('data-said'));
            if (id > 0) {
                saf.push({id: id, acc: $(this).attr('data-saacc'), v: parseFloat($(this).find('.sa-field').val().trim()),ts: parseFloat($(this).find('.i-r-o-tax-slab').val().trim()),tx: parseFloat($(this).find('.i-r-o-tax-tot').html().trim())});
            }
        });
        var data = {
            vendor: PCOMPETITIVE.vendor.vname,
            purchase_order_date: $("#purchase_order_date").val(),
            enquiry_no: PCOMPETITIVE.vendor.enqyn,
            purchase_order_no: $("#purchase_order_no").val(),
            note: $("#note").val(),
            total_amount: parseFloat($(".s-a-tot").html()),
            cgst: parseFloat($(".s-a-cgst-a").html()),
            sgst: parseFloat($(".s-a-sgst-a").html()),
            igst: parseFloat($(".s-a-igst-a").html()),
            total_sub: parseFloat($(".s-a-s-tot").html()),
            item: itm,
            saf:saf,
            round:parseFloat($(".s-a-round").html()),
            pcid: $("#pcid").val(),
            sid: $("#sid").val(),
        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/purchase/price_competitive/purchaseOrdersave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code > 0) {
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("/purchase/price_competitive", function (data) {
                        
                        $('#mainContent').html(data);
                        var msg = '';
                        if ($("#sid").val() !== 'undefined')
                            msg = 'Purchase Order updated successfully!!!';
                        else
                            msg = 'Purchase Order created successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                } else {
                    COMMON.shownotification('error', 'Unable to save Purchase Order!!!');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
};