var PORDER = {
vendor: [],
all_tax:[],
hsn: '-1',
gst: 0,
comstate:'',
print:'',
newvendor:[],
initPOL: function () {
    $('#datatable').DataTable({
        processing: true,
        serverSide: true,
        stateSave: true,
        ajax: {
            url: "purchase/purchase_order/ajaxget",
            type: 'POST',
            data: function (d) {
                setTimeout(PORDER.initButton, 1000);
            }
        }
    });


    $(".s-l-cn").on("click", function (e) {
        $('#mainContent').html("<div class='loading'></div>");
        $.get("purchase/purchase_order/new", function (data) {
            $('#mainContent').html(data);
        });
    });
    PORDER.initButton();
    COMMON.getUserRole();



},
initButton:function(){
    COMMON.getUserRole();
    $(".s-l-e").on("click", function (e) {
        var id=$(this).attr('data-id');
        $('#mainContent').html("<div class='loading'></div>");
        $.get('/purchase/purchase_order/edit/'+id, function (data) {
            $('#mainContent').html(data);
        });
    });
    $(".s-l-dv").on("click", function (e) {
        $.get('/purchase/purchase_order/docview/' + $(this).attr('data-id'), function (data) {
            $('#mainContent').html(data);
        });
    });
    $(".s-l-v").on("click", function (e) {
        $('#mainContent').html("<div class='loading'></div>");
        $.get('/purchase/purchase_order/view/' + $(this).attr('data-id'), function (data) {
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
            $.get('/purchase/purchase_order/delete/'+cid, function (data) {
                //$('#datatable').DataTable().ajax.reload();
                $('#datatable').DataTable().ajax.reload(null, false);
                COMMON.shownotification('error', 'Purchase Enquiry deleted successfully!!!');
            });
        });

    });
},
initPON:function(comstate,tax_slab){
    COMMON.getUserRole();
    PORDER.comstate=comstate;
    PORDER.all_tax=tax_slab;
    $(".select2").select2();
    $("#salesunit").select2();
    $('#frmSNew').parsley();
    $('#frmSNew').submit(function (e) {
    e.preventDefault();
     if ($(this).parsley().isValid()) {
        PORDER.submitSNewFrm();
     }
    });
    $(".s-n-bk").on("click", function (e) {
        location.reload();
    });
    $(".sa-field").on("change paste keyup", function () {
        var rw = event.target.closest(".safildwrap");
        PORDER.claculateSaFieldPrice(rw);
    });
    $(".i-r-o-tax-slab").on("change paste keyup", function () {
        var rw = event.target.closest(".safildwrap");
        PORDER.claculateSaFieldPrice(rw);
        PORDER.fetchSaData(rw);
        console.log("pp");
    });
    $("#office_type").on("change", function() {
            $.get('/purchase/purchase_order/autonum/' + $(this).val(), function (data) {
                var sd = JSON.parse(data);
                $("#purchase_order_no").val(sd);

            });
        });
    
    jQuery('#po_date').datepicker({
            autoclose: true,
            todayHighlight: true
        });
    jQuery('#delivery_date').datepicker({
            autoclose: true,
            todayHighlight: true
        });
   
    $(".custom-modal-button").on("click", function (e) {
        COMMON.loadCustomModal(this);
    });
    $("#vendor").on("change",function(e){
       var data = {
        enquiry_no: $("#enquiry_no").val(),
        vendor: $("#vendor").val(),
        };
        if($("#enquiry_no").val() != ''){
        $.ajax({
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                url: "purchase/purchase_order/getalldetail",              
                complete: function (data) {
                    var jdata=JSON.parse(data.responseText);
                    $("#pcid").val(jdata.sa.id);
                         $('.item-wrapper').empty();
                         $('.item-saf-wrapper').empty();

                        PORDER.state = jdata.sp[0].state;
                        PORDER.vendor.gst_applicable = jdata.cus[0].gst_applicable;
                        
                        PORDER.itemRow(jdata.item);
                        PORDER.itemsafRow(jdata.saf);
                        
                        PORDER.gstInit();
                        PORDER.initRowElement();
                        PORDER.calculateAddPrice('on');
                    }
               
                });
   }
   else{
       $.ajax({
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                url: "purchase/purchase_order/getvendordetail",              
                complete: function (data) {
                    var jdata=JSON.parse(data.responseText);

                         $('.item-wrapper').empty();
                         $('.item-saf-wrapper').empty();

                        PORDER.state = jdata.sp[0].state;
                        PORDER.vendor.gst_applicable = jdata.sa.gst_applicable;
                        
                        PORDER.itemNewRow();
                        PORDER.itemsafRow(jdata.saf);

                }

               
            });
       
   }
    });
    
    
    //PORDER.getShipping();
},
fetchSaData: function(rw){
      $(".saTermField").each(function (i) {
          console.log("oo");
          var _this = this;
          var sadata = $(rw).attr('data-sname');
          var satax = $(rw).find('.i-r-o-tax-slab').val();
          var sataxval = $(rw).find('.i-r-o-tax-tot').html();
          var termdata = $(_this).attr('data-name');
          console.log("sadata "+sadata);
          console.log("satax "+satax);
          console.log("termdata "+termdata);
          if(sadata == termdata){
              console.log("yes");
              $(_this).find('.sa-term-msg').val('Extra @'+satax+'%'+' '+'= '+sataxval+' (INR)');
          }
      });  
    },
initPOE: function(comstate,cus,saf,sp,item,tax_slab){
    
    PORDER.initPON(comstate,tax_slab);

    PORDER.state = sp.state;
    PORDER.vendor.gst_applicable = cus.gst_applicable;

    //PORDER.itemRow(jdata.item);
    //PORDER.itemsafRow(saf);

    $(".sa-field").on("change paste keyup", function () {
        var rw = event.target.closest(".safildwrap");
        PORDER.claculateSaFieldPrice(rw);
    });
    $(".i-r-o-tax-slab").on("change paste keyup", function () {
        var rw = event.target.closest(".safildwrap");
        PORDER.claculateSaFieldPrice(rw);
        PORDER.fetchSaData(rw);
    });

    PORDER.gstInit();
    PORDER.initRowElement();
   // PORDER.initRow();
    PORDER.calculateAddPrice('on');
    

},
itemRow: function (itm) {
    for(var i in itm){
    var htm = '<div class="data-row-wrap" data-id="'+itm[i].id+'">';
    htm += '<div class="col-md-3" style="float: left;">';
    htm += '<input type="text" placeholder="Enter product code" class="form-control i-r-prod" value="'+itm[i].code +' HSN:'+itm[i].hsn_code+'" readonly=""/>';
    htm += '</div>';
    htm += '<div class="col-md-2" style="float: left;">';
    htm += '<input type="number" step="1" class="form-control i-r-qnt" placeholder="Quantity" value="'+itm[i].quantity+'" readonly=""/>';
    htm += '</div>';
    htm += '<div class="col-md-1" style="float: left;">';
    htm += '<select  class="form-control i-r-unit">'
    htm += '<option value="'+itm[i].punit+'">'+itm[i].punit+'</option>';
    htm += '</select>';
    htm += '</div>';
    htm += '<div class="col-md-2" style="float: left;">';
    htm += '<input type="number" class="form-control i-r-price" step=".01" placeholder="Price" value="'+itm[i].rate+'" readonly="">';
    htm += '</div>';
    htm += '<div class="col-md-1" style="float: left;">';
    htm += '<select class="form-control i-r-tax-slab">';
    htm += '<option value="'+itm[i].tax+'">'+itm[i].tax+' %</option>';
    htm += '</select>';
    htm += '</div>';
    htm += '<div class="col-md-1" style="float: left;text-align: right;">';
    htm += '<span class="i-r-tax-tot">'+itm[i].tax_amount+'</span>';
    htm += '</div>';
    htm += '<div class="col-md-1" style="float: left;text-align: right;padding-right: 20px;">';
    htm += '<span class="i-r-tot">'+itm[i].final_amount+'</span>';
    htm += '</div>';
    htm += '<div class="col-md-1" style="float: left;">';
    htm += '<a class="btn btn-icon waves-effect waves-light btn-danger m-b-5 i-r-del"> <i class="fa fa-remove"></i> </a>';
    htm += '</div>';
    htm += '<div class="col-md-12" style="float: left;">';
    htm += '<span class="i-r-span" style="font-size:10px;"></span>';
    htm += '</div>';
    htm += '</div>';
     
    $(".item-wrapper").append(htm);

    }
},
itemNewRow: function () {
    var htm = '<div class="data-row-wrap" data-id="0">';
    htm += '<div class="col-md-3" style="float: left;">';
    htm += '<input type="text" placeholder="Enter product code" class="form-control i-r-prod"/>';
    htm += '</div>';
    htm += '<div class="col-md-2" style="float: left;">';
    htm += '<input type="number" step="1" class="form-control i-r-qnt" placeholder="Quantity" >';
    htm += '</div>';
    htm += '<div class="col-md-1" style="float: left;">';
    htm += '<select  class="form-control i-r-unit"></select>';
    htm += '</div>';
    htm += '<div class="col-md-2" style="float: left;">';
    htm += '<input type="number" class="form-control i-r-price" step="1" placeholder="Price" value="0">';
    htm += '</div>';
    htm += '<div class="col-md-1" style="float: left;">';
    htm += '<select class="form-control i-r-tax-slab">';
    for(var i in PORDER.all_tax)
    htm += '<option value="'+PORDER.all_tax[i]+'">'+PORDER.all_tax[i]+' %</option>';
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
    PORDER.initNewRow();
},
initNewRow: function () {
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
                PORDER.hsn = data.hsn_code;
                PORDER.gst = data.tax_slabe;
                PORDER.gstInit();
                PORDER.claculatePrice(rw);
                PORDER.initRowElement();
                if($( ".data-row-wrap[data-id='0']" ).length==0)
                PORDER.itemNewRow();
            });
        }
    });
},
itemsafRow: function (saf) {
    for(var i in saf){
    var htm = '<div class="safildwrap" data-saacc="'+saf[i].account+'" data-said="'+saf[i].id+'" data-sname="'+saf[i].name+'">';
    htm += ' <div class="form-group col-md-6" style="float: left;text-align: right;">';
    htm += '<span >'+saf[i].name+'</span>';
    htm += '</div>';
    htm += '<div class="form-group col-md-2" style="float: left;text-align: right;" >';
    htm += '<input step=".01" type="number" class="form-control sa-field"  data-pct="'+saf[i].amount+'" placeholder="0.00" value="0.00" style="text-align: right;">';
    htm += '</div>';
    htm += '<div class="col-md-1" style="float: left;text-align: right;">';
    htm += '<select class="form-control i-r-o-tax-slab">'
    for(var k in PORDER.all_tax){
    htm += '<option value="'+PORDER.all_tax[k]+'">'+PORDER.all_tax[k]+' %</option>';
    }
    htm += '</select>' 
    htm += '</div>';
    htm += '<div class="col-md-1" style="float: left;text-align: right;">';
    htm += '<span class="i-r-o-tax-tot">0.00</span>';
    htm += '</div>';
    htm += '<div class="col-md-1" style="float: left;text-align: right;padding-right: 15px;">';
    htm += '<span class="i-r-o-tot">0.00</span>'
    htm += '</div>';
    htm += '</div>';
    $(".item-saf-wrapper").append(htm);
    PORDER.initRow();
    }
},
initRow: function () {
    $(".sa-field").on("change paste keyup", function () {
        var rw = event.target.closest(".safildwrap");
        PORDER.claculateSaFieldPrice(rw);
    });
    $(".i-r-o-tax-slab").on("change paste keyup", function () {
        var rw = event.target.closest(".safildwrap");
        PORDER.claculateSaFieldPrice(rw);
        PORDER.fetchSaData(rw);
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
        PORDER.claculatePrice(rw);
    });
    $(".i-r-price").on("change paste keyup", function(){
        var rw = event.target.closest(".data-row-wrap");
        PORDER.claculatePrice(rw);
    });
    $(".i-r-tax-slab").on("change paste keyup", function () {
        var rw = event.target.closest(".data-row-wrap");
        PORDER.claculatePrice(rw);
    });
    $(".i-r-del").on("click", function (e) {
        if($(this).closest(".data-row-wrap").attr("data-id")!='0'){
            $( this ).closest( ".data-row-wrap" ).remove();
            var ni = $('.data-row-wrap').length;
            if(ni==1){
                PORDER.hsn = '-1';
                PORDER.gst = 0;
            }
            PORDER.calculateAddPrice('off');
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
        PORDER.calculateAddPrice('off');
    }
},
calculateAddPrice:function(){
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
            PORDER.calculateTotPrice();
            var ct = $(".sa-field").length;
            $(".sa-field").each(function (i) {
                if(parseFloat($(this).attr('data-pct'))>0){
                    var af = ((st * parseFloat($(this).attr('data-pct'))) / 100);
                    $(this).val(af.toFixed(2));
                }
                var rw = $(this).closest(".safildwrap");
                PORDER.claculateSaFieldPrice(rw);
                if (!--ct) {
                    PORDER.calculateTotPrice();
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
    PORDER.calculateTotPrice();
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
            if (typeof PORDER.state !== 'undefined' && stt > 0 && PORDER.vendor.gst_applicable == 'yes') {
                //var gst = (st * PURCHASE.gst / 100);
                if (PORDER.comstate == PORDER.state) {
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
    var itm=[],saf=[],otc=[];
    $( ".data-row-wrap" ).each(function( i ) {
        var id = parseInt($(this).attr('data-id'));
        if(id>0){
            var q1 = $(this).find('.i-r-qnt').val().trim(), p1 = $(this).find('.i-r-price').val().trim(), u = $(this).find('.i-r-unit').val().trim();
            var q = (q1 == "") ? 0 : parseFloat(q1), p = (p1 == "") ? 0 : parseFloat(p1);
            var t = $(this).find(".i-r-tot").html(),tx=parseFloat($(this).find('.i-r-tax-tot').html().trim()),ts=parseFloat($(this).find('.i-r-tax-slab').val().trim());
            
            itm.push({id: id, q: q, u: u, p: p, t: t, tx:tx,ts:ts});
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
     var data = {
        vendor: $("#vendor").val(),
        po_date: $("#po_date").val(),
        enquiry_no: $("#enquiry_no").val(),
        purchase_order_no: $("#purchase_order_no").val(),
        note: $("#note").val(),
        delivery_date: $("#delivery_date").val(),
        quotation_no: $("#quotation_no").val(),
        total_amount: parseFloat($(".s-a-tot").html()),
        cgst: parseFloat($(".s-a-cgst-a").html()),
        sgst: parseFloat($(".s-a-sgst-a").html()),
        igst: parseFloat($(".s-a-igst-a").html()),
        total_sub: parseFloat($(".s-a-s-tot").html()),
        item: itm,
        saf:saf,
        otc:otc,
        round:parseFloat($(".s-a-round").html()),
        pcid: $("#pcid").val(),
        sid: $("#sid").val(),
        old_enquiry: $("#old_enquiry").val(),
    };
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/purchase/purchase_order/save',
        complete: function (xhr) {
            var res = JSON.parse(xhr.responseText);
            if (res.code > 0) {
                $('#mainContent').html("<div class='loading'></div>");
                $.get("/purchase/purchase_order", function (data) {
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
initPEDV :function(){
    COMMON.getUserRole();
  $('#frmSNew').parsley();
    $(".s-n-bk").on("click", function (e) {
        location.reload();
    });  
    $(".doc-dlt").on("click", function (e) {
        var cid = $("#sid").val();
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
            $.get('/purchase/purchase_order/docdelete/' + cid, function (data) {
                $.get("/purchase/purchase_order", function (data) {
                    $('#mainContent').html(data);
                    COMMON.shownotification('error', 'Document deleted successfully!!!');
                });
                
            });
        });

    });
},
initPOV: function () {
        COMMON.getUserRole();
        PORDER.getInvoiceBody($("#sid").val());
        $(".select2").select2();
        $(".btn-cncl").on("click", function (e) {
            location.reload();
        });
        $(".btn-p-OS").on("click", function (e) {
            COMMON.printContent(PORDER.print);
        });
        $(".btn-pdf").on("click", function (e) {
            COMMON.printPdf($("#itemWrap"),"Tax-Invoice");
        });
        
    },
getInvoiceBody:function(id){
$.get('/purchase/purchase_order/purchaseview/' + id, function (data) {
    PORDER.print=data;
    $('#itemWrap').html(data);
});
    },
submitdocNewFrm: function (id) {
    $("body").css('cursor', 'wait');
    $( ".data-row-wrap" ).each(function( i ) {
     var did = parseInt($(this).attr('data-id'));
     if(did>0){
        var formData = new FormData();
        formData.append('sid',id);
        formData.append('did',did);
        var doc = $(this).find(".i_r_doc").get(0).files[0];
        console.log("doc "+doc);
        console.log("doclength "+Object.keys(doc).length);
        // console.log("o "+Object.keys(doc).length);
        // if(doc != '' || typeof (doc) != 'undefined'){        
        if(typeof (doc)==='undefined'){
        formData.append('i_r_doc','');
        }
        else{
         formData.append('i_r_doc',doc,doc.name); 
        }
        $.ajax({
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            url: '/purchase/purchase_order/docsave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code > 0) {
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("/purchase/purchase_order", function (data) {
                        
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
      //  }
      }
    });
},
};