var PENQUIRY = {
    vendor: [],
    all_tax:[],
    hsn: '-1',
    gst: 0,
    comstate:'',
    print:'',
    newvendor:[],
    initPEL: function () {
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: "purchase/purchase_enquiry/ajaxget",
                type: 'POST',
                data: function (d) {
                    setTimeout(PENQUIRY.initButton, 1000);
                }
            }
        });


        $(".s-l-cn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("purchase/purchase_enquiry/new", function (data) {
                $('#mainContent').html(data);
            });
        });
        PENQUIRY.initButton();
        COMMON.getUserRole();



    },
    initButton:function(){
        COMMON.getUserRole();
        $(".s-l-e").on("click", function (e) {
            var id=$(this).attr('data-id');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('/purchase/purchase_enquiry/edit/'+id, function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-dv").on("click", function (e) {
            $.get('/purchase/purchase_enquiry/docview/' + $(this).attr('data-id'), function (data) {
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
                $.get('/purchase/purchase_enquiry/delete/'+cid, function (data) {
                    //$('#datatable').DataTable().ajax.reload();
                    $('#datatable').DataTable().ajax.reload();
                    COMMON.shownotification('error', 'Purchase Enquiry deleted successfully!!!');
                });
            });

        });
    },
    initPEN:function(comstate,tax_slab,ship){
        COMMON.getUserRole();
        PENQUIRY.comstate=comstate;
        PENQUIRY.all_tax=tax_slab;
        $(".select2").select2();
        $("#salesunit").select2();
        $('#frmSNew').parsley();
        $('#frmSNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                PENQUIRY.submitSNewFrm();
            }
        });
        $(".s-n-bk").on("click", function (e) {
            location.reload();
        });
        $(".sa-field").on("change paste keyup", function () {
            var rw = event.target.closest(".safildwrap");
            PENQUIRY.claculateSaFieldPrice(rw);
        });
        $(".i-r-o-tax-slab").on("change paste keyup", function () {
            var rw = event.target.closest(".safildwrap");
            PENQUIRY.claculateSaFieldPrice(rw);
        });
        
        jQuery('#enquiry_date').datepicker({
                autoclose: true,
                todayHighlight: true
            });
        jQuery('#submission_date').datepicker({
                autoclose: true,
                todayHighlight: true
            });
        $(".custom-modal-button").on("click", function (e) {
            COMMON.loadCustomModal(this);
        });
        //PENQUIRY.vendor.state==sd[k].state;
       /* $("#shipping").on("change", function() {
            //console.log("this "+$(this).val());
            $.get('/purchase/purchase_enquiry/shippingbyid/' + $(this).val(), function (data) {
                var sd = JSON.parse(data);
                console.log(sd);
                console.log("pstate "+sd[0].state);
                PENQUIRY.vendor.state=sd[0].state;
                PENQUIRY.gstInit();
                PENQUIRY.calculateTotPrice();
            });
        });*/
        $("#vendor").autocomplete({
            source: function (request, response) {
                $.ajax({
                    url: "/purchase/purchase_enquiry/autovendor/" + request.term,
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
                $.get('/purchase/purchase_enquiry/vendorbyid/' + ui.item.id, function (data) {
                    PENQUIRY.vendor = JSON.parse(data);
                    PENQUIRY.getShipping();
                });
                
            }
        });
        
        PENQUIRY.itemRow();
        //PENQUIRY.getShipping();
    },
    initPEE: function(comstate,cus,item,tax_slab,fnlcus){
        
        PENQUIRY.initPEN(comstate,tax_slab);


        for(var k in item){
        PENQUIRY.hsn = item.hsn_code;
        PENQUIRY.gst = item.tax_slabe;
        }
        PENQUIRY.gstInit();
        PENQUIRY.initRowElement();
        PENQUIRY.calculateAddPrice('on');
        //$("#vendor_name").select2('val',fnl);
        $("#vendor_name").val(fnlcus).trigger('change');

    },
    getShipping:function(){
        //console.log("cus "+PENQUIRY.vendor.id);
        $.get('/customer/customer/shipping/' + PENQUIRY.vendor.id, function (data) {
            var sd = JSON.parse(data);
            var $ship=$('#shipping');
            $ship.empty();
            Object.keys(sd).forEach(function(k){
                if(k==0)
                    PENQUIRY.vendor.state==sd[k].state;
                $ship.append($("<option></option>").attr("value", sd[k].id).text(sd[k].label));
            });
        });
    },
    itemRow: function () {
        var htm = '<div class="data-row-wrap" data-id="0">';
        htm += '<div class="col-md-2" style="float: left;">';
        htm += '<input type="text" placeholder="Enter product code" class="form-control i-r-prod"/>';
        htm += '</div>';
        htm += '<div class="col-md-1" style="float: left;">';
        htm += '<input type="text" placeholder="Enter product Description" class="form-control i-r-prod-des"/>';
        htm += '</div>';
        htm += '<div class="col-md-1" style="float: left;">';
        htm += '<input type="number" step=".01" class="form-control i-r-qnt" placeholder="Quantity" >';
        htm += '</div>';
        htm += '<div class="col-md-1" style="float: left;">';
        htm += '<select  class="form-control i-r-unit"></select>';
        htm += '</div>';
        htm += '<div class="col-md-2" style="float: left;">';
        htm += '<input type="number" class="form-control i-r-price" step=".01" placeholder="Price" value="0">';
        htm += '</div>';
        htm += '<div class="col-md-1" style="float: left;">';
        htm += '<select class="form-control i-r-tax-slab">';
        for(var i in PENQUIRY.all_tax)
            htm += '<option value="'+PENQUIRY.all_tax[i]+'">'+PENQUIRY.all_tax[i]+' %</option>';
        htm += '</select>';
        htm += '</div>';
        htm += '<div class="col-md-1" style="float: left;">';
        htm += '<input type="file"  class="form-control i_r_doc" >';
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
        PENQUIRY.initRow();
    },
    initRow: function () {

        $(".i-r-prod").autocomplete({
            source: function (request, response) {
                var data={term: request.term,
                        hsn:-1};
                $.ajax({
                    url: "/purchase/purchase_enquiry/autoitem",
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
                    PENQUIRY.hsn = data.hsn_code;
                    PENQUIRY.gst = data.tax_slabe;
                    PENQUIRY.gstInit();
                    PENQUIRY.claculatePrice(rw);
                    PENQUIRY.initRowElement();
                    if($( ".data-row-wrap[data-id='0']" ).length==0)
                    PENQUIRY.itemRow();
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
            PENQUIRY.claculatePrice(rw);
        });
        $(".i-r-price").on("change paste keyup", function(){
            var rw = event.target.closest(".data-row-wrap");
            PENQUIRY.claculatePrice(rw);
        });
        $(".i-r-tax-slab").on("change paste keyup", function () {
            var rw = event.target.closest(".data-row-wrap");
            PENQUIRY.claculatePrice(rw);
        });
        $(".i-r-del").on("click", function (e) {
            if($(this).closest(".data-row-wrap").attr("data-id")!='0'){
                $( this ).closest( ".data-row-wrap" ).remove();
                var ni = $('.data-row-wrap').length;
                if(ni==1){
                    PENQUIRY.hsn = '-1';
                    PENQUIRY.gst = 0;
                }
                PENQUIRY.calculateAddPrice('off');
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

            $(el).find(".i-r-tax-tot").html(tax1.toFixed(2));
            $(el).find(".i-r-tot").html((t1+tax1).toFixed(2));

          
            PENQUIRY.calculateAddPrice('off');
        }
    },
    
    calculateAddPrice:function(preload){
        var arr={q:0,p:0,d:0,pr:0,tx:0,t:0},st = 0,stt=0,qntty=-1, count = $(".data-row-wrap").length;
        $(".data-row-wrap").each(function (i) {
            if($(this).attr("data-id")!='0'){
            var q1 = $(this).find('.i-r-qnt').val().trim(), p1 = $(this).find('.i-r-price').val().trim(),tax1=$(this).find('.i-r-tax-slab').val().trim();
            var q = (q1 == "") ? 0 : parseFloat(q1), p = (p1 == "") ? 0 : parseFloat(p1),tax = (tax1 == "") ? 0 : parseFloat(tax1);
            var tot = q * p;
            arr.q += q;
            arr.p += tot;
     
            st += parseFloat($(this).find('.i-r-tot').html().trim());
            stt += parseFloat($(this).find('.i-r-tax-tot').html().trim());
            $(".s-a-tot").html(Math.round(st).toFixed(2));
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
                    PENQUIRY.claculateSaFieldPrice(rw);
                    if (!--ct) {
                       // PENQUIRY.calculateTotPrice();
                    }
                });
            }
        });

    },
    calculateTotPrice:function(){
        var arr={q:0,p:0,d:0,pr:0,tx:0,t:0},qnty = 0;
        var qntty = parseFloat($(".s-a-s-tot-qnty").html()),rate = parseFloat($(".s-a-s-tot-r").html()),dis = parseFloat($(".s-a-s-tot-dis").html()),profit = parseFloat($(".s-a-s-tot-profit").html()),st = parseFloat($(".s-a-s-tot").html()),stt = parseFloat($(".s-a-s-tot-tax").html()), ct = $(".safildwrap").length;
        $(".safildwrap").each(function (i) {
            st += parseFloat($(this).find('.i-r-o-tot').html());
           
                $(".s-a-tot").html(Math.round(st).toFixed(2));
            
        });
    },

    submitSNewFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var itm=[],saf=[],i_r_doc=[];
        $( ".data-row-wrap" ).each(function( i ) {
            var id = parseInt($(this).attr('data-id'));
            if(id>0){
                var q1 = $(this).find('.i-r-qnt').val().trim(), p1 = $(this).find('.i-r-price').val().trim(), u = $(this).find('.i-r-unit').val().trim(),desc = $(this).find('.i-r-prod-des').val().trim();
                var q = (q1 == "") ? 0 : parseFloat(q1), p = (p1 == "") ? 0 : parseFloat(p1);
                var t = $(this).find(".i-r-tot").html(),tx=parseFloat($(this).find('.i-r-tax-tot').html().trim()),ts=parseFloat($(this).find('.i-r-tax-slab').val().trim());
                var doc = $(this).find(".i_r_doc").get(0).files[0];
                console.log("doc "+doc);
                itm.push({id: id, q: q, u: u, p: p, t: t, tx:tx,ts:ts,desc:desc,doc:doc});
                }
            });
        console.log(itm);
        var formData = new FormData();
        formData.append('vendor',$("#vendor_name").val());
        formData.append('enquiry_date',$("#enquiry_date").val());
        formData.append('submission_date',$("#submission_date").val());
        formData.append('enquiry_no',$("#enquiry_no").val());
        formData.append('total_amount',parseFloat($(".s-a-tot").html()));
        formData.append('enquiry_note',$("#enquiry_note").val());
        formData.append('enquiry_terms_note',$("#enquiry_terms_note").val());
        formData.append('shipping',$("#shipping").val());
        formData.append('cgst',parseFloat($(".s-a-cgst-a").html()));
        formData.append('sgst',parseFloat($(".s-a-sgst-a").html()));
        formData.append('igst',parseFloat($(".s-a-igst-a").html()));
        formData.append('total_sub',parseFloat($(".s-a-s-tot").html()));
        formData.append('item',itm);
        formData.append('round',parseFloat($(".s-a-round").html()));
        formData.append('sid',$("#sid").val());
        //console.log(itm.doc);
        
        console.log(formData.item);
        
        $.ajax({
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            url: '/purchase/purchase_enquiry/save',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code > 0) {
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("/purchase/purchase_enquiry", function (data) {
                        
                        $('#mainContent').html(data);
                        var msg = '';
                        if ($("#sid").val() !== 'undefined')
                            msg = 'Purchase Enquiry updated successfully!!!';
                        else
                            msg = 'Purchase Enquiry created successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                } else {
                    COMMON.shownotification('error', 'Unable to save Purchase Enquiry!!!');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },


};