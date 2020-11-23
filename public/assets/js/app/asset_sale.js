var SALEASSET = {
    customer: [],
    initSAL: function () {
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "asset/asset_sale/ajaxget",
                type: 'POST',
                data: function (d) {
                    setTimeout(SALEASSET.initButton, 1000);
                }
            }
        });
        $(".s-l-cn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("asset/asset_sale/new", function (data) {
                $('#mainContent').html(data);
            });
        });
       // COMMON.getUserRole();
          SALEASSET.initButton();
          COMMON.getUserRole(); 
    },
    initButton:function(){
        COMMON.getUserRole();
        $(".s-l-e").on("click", function (e) {
            var id=$(this).attr('data-id');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('asset/asset_sale/edit/'+id, function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-dv").on("click", function (e) {
            $.get('/asset/asset_sale/docview/' + $(this).attr('data-id'), function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-d").on("click", function (e) {
            var cid = $(this).attr('data-id');
            var pid = $(this).attr('data-pid');

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
                $.get('/asset/asset_sale/delete/?pid="'+pid+'"&cid="'+cid+'"', function (data) {
                    //$('#datatable').DataTable().ajax.reload();
                    $('#datatable').DataTable().ajax.reload(null, false);
                    COMMON.shownotification('error', 'Asset Sold successfully!!!');
                });
            });
        });
    },
    initSAN: function () {
        COMMON.getUserRole();
        $('#frmSNew').parsley();
        $('#frmSNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                SALEASSET.submitAANewFrm();
            }
        });
        $(".s-n-bk").on("click", function (e) {
            location.reload();
        });
        jQuery('#sale_date').datepicker({
                autoclose: true,
                todayHighlight: true
            });
        $(".custom-modal-button").on("click", function (e) {
            COMMON.loadCustomModal(this);
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
                    SALEASSET.customer = JSON.parse(data);
                });
            }
        });
        SALEASSET.itemRow();
    },
   initSAE:function(cus,item){
        COMMON.getUserRole();
        SALEASSET.initSAN();
        
        $(".s-n-bk").on("click", function (e) {
            location.reload();
        });

       // SALEASSET.itemRow();

        SALEASSET.customer = cus;
  
        SALEASSET.initRowElement();
        SALEASSET.calculateAddPrice('on');
    },
    itemRow: function () {
        var htm = '<div class="data-row-wrap" data-id="0" data-sid="0" data-pid="0">';
        htm += '<div class="col-md-4" style="float: left;">';
        htm += '<input type="text" placeholder="Enter Asset" class="form-control i-r-ast"/>';
        htm += '</div>';
        htm += '<div class="col-md-2" style="float: left;">';
        htm += '<input type="number" step="1" class="form-control i-r-qnt" placeholder="Quantity" value="1">';
        htm += '</div>';
        htm += '<div class="col-md-3" style="float: left;">';
        htm += '<input type="number" class="form-control i-r-price" step=".01" placeholder="Price" value="0">';
        htm += '</div>';
        htm += '<div class="col-md-2" style="float: left;text-align: right;padding-right: 20px;">';
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
        SALEASSET.initRow();
    },
    initRow: function () {
        $(".i-r-ast").autocomplete({
            source: function (request, response) {
                var data={term: request.term,
                          };
                $.ajax({
                    url: "/asset/asset_sale/autoasset",
                    type: "POST",
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    complete: function (data) {
                        response($.map(JSON.parse(data.responseText), function (asset) {
                            return {
                                label: asset.asset_name+ ' price: '+asset.rate,
                                value: asset.asset_name+ ' price: '+asset.rate,
                                id: asset.id,
                            };
                        }));
                    }
                });
            },
            minLength: 3,
            select: function (event, ui) {
                $.get('/asset/asset_sale/assetbyid/' + ui.item.id, function (data) {
                    data = JSON.parse(data);
                    var rw = event.target.closest(".data-row-wrap");
                    $(rw).attr('data-id', data.id);
                    $(rw).attr('data-sid', data.aid);
                    var $span = $(rw).find('.i-r-span');
                    //$span.html(data.asset_name+", "+data.asset_name);
                    SALEASSET.claculatePrice(rw);
                    SALEASSET.initRowElement();
                    if($( ".data-row-wrap[data-id='0']" ).length==0)
                    SALEASSET.itemRow();
                });
            }
        });
    },
    initRowElement: function () {
        $(".i-r-qnt").on("change paste keyup", function(){
            var rw = event.target.closest(".data-row-wrap");
            SALEASSET.claculatePrice(rw);
        });
        $(".i-r-price").on("change paste keyup", function(){
            var rw = event.target.closest(".data-row-wrap");
            SALEASSET.claculatePrice(rw);
        });
        $(".i-r-del").on("click", function (e) {
            if($(this).closest(".data-row-wrap").attr("data-id")!='0'){
                if($(this).closest(".data-row-wrap").attr("data-pid") != '0'){
                  console.log("1");
                  $.get('/asset/asset_sale/itemdelete/'+$(this).closest(".data-row-wrap").attr("data-pid"), function (data) {
                   $( this ).closest( ".data-row-wrap" ).remove();
                  });
                }
                else{
                    console.log("2");
                    $( this ).closest( ".data-row-wrap" ).remove();
                }
                var ni = $('.data-row-wrap').length;
                SALEASSET.calculateAddPrice('off');
            }
        });
        
    },
    claculatePrice: function (el) {
        var id = parseInt($(el).attr('data-id'));
        if (id > 0) {
            var q1 = $(el).find('.i-r-qnt').val().trim(), p1 = $(el).find('.i-r-price').val().trim();
            var q = (q1 == "") ? 0 : parseFloat(q1), p = (p1 == "") ? 0 : parseFloat(p1);
            var t1 = q * p;
            $(el).find(".i-r-tot").html((t1).toFixed(2));
            SALEASSET.calculateAddPrice('off');
        }
    },
    calculateAddPrice:function(preload){
        var arr={q:0,p:0},st = 0,st1 = 0, count = $(".data-row-wrap").length;
        $(".data-row-wrap").each(function (i) {
            if($(this).attr("data-id")!='0'){
            var q1 = $(this).find('.i-r-qnt').val().trim(), p1 = $(this).find('.i-r-price').val().trim();
            var q = (q1 == "") ? 0 : parseFloat(q1), p = (p1 == "") ? 0 : parseFloat(p1);
            var tot = q * p;
            arr.q += q;
            arr.p += p;

            st += parseFloat($(this).find('.i-r-tot').html().trim());
        }
            if (!--count) {
                 $(".s-a-s-qnty").html(arr.q.toFixed(2));
                $(".s-a-s-r").html(arr.p.toFixed(2));
                $(".s-a-s-tot").html(st.toFixed(2));
            }
        });
    },
    submitAANewFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var itm=[];
        $( ".data-row-wrap" ).each(function( i ) {
            var id = parseInt($(this).attr('data-id'));
            if(id>0){
                var assetid = parseInt($(this).attr('data-sid'));
                var itmid = parseInt($(this).attr('data-pid'));
                var q1 = $(this).find('.i-r-qnt').val().trim(), p1 = $(this).find('.i-r-price').val().trim();
                var q = (q1 == "") ? 0 : parseFloat(q1), p = (p1 == "") ? 0 : parseFloat(p1);
                var t = $(this).find(".i-r-tot").html();
                itm.push({id: id,assetid: assetid,itmid: itmid,q: q, p: p, t: t});
            }
        });
        var files = $('#asset_doc').get(0).files[0];
        var formData = new FormData();
        formData.append('customer',SALEASSET.customer.id);
        formData.append('sale_date',$("#sale_date").val());
        formData.append('asset_note',$("#asset_note").val());
        formData.append('acure_location',$("#acure_location").val());
        formData.append('tot', parseFloat($(".s-a-s-tot").html()));
        formData.append('did',$("#did").val());
        formData.append('itm',JSON.stringify(itm));
        //console.log(data.eid);
        if(typeof (files)==='undefined')
            formData.append('asset_doc','');
        else
            formData.append('asset_doc',files,files.name); 
        //console.log(data.eid);
        $.ajax({
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            url: '/asset/asset_sale/save',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code > 0) {
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("/asset/asset_sale", function (data) {
                        $('#mainContent').html(data);
                        var msg = '';
                        if ($("#did").val() !== 'undefined')
                            msg = 'Sale Asset Info updated successfully!!!';
                        else
                            msg = 'Sale Asset Info created successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                } else {
                    COMMON.shownotification('error', 'Unable to save Sale Asset Info!!!');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
    initADV :function(){
        COMMON.getUserRole();
      $('#frmSNew').parsley();
      var sid = $("#sid").val();
        $('#frmSNew').unbind("submit").submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                SALEASSET.submitAdocNewFrm(sid);
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
                $.get('/asset/asset_sale/docdelete/' + cid, function (data) {
                    $.get("/asset/asset_sale", function (data) {
                        $('#mainContent').html(data);
                        COMMON.shownotification('error', 'Document deleted successfully!!!');
                    });
                    
                });
            });
        });
    },
   submitAdocNewFrm: function (id) {
        $("body").css('cursor', 'wait');
        var files = $('#asset_doc').get(0).files[0];
        var formData = new FormData();
        formData.append('assetid',id);
        formData.append('oasset_doc',$("#oasset_doc").val());
        if(typeof (files)==='undefined')
            formData.append('asset_doc','');
        else
            formData.append('asset_doc',files,files.name); 
        
        //console.log(formData);

        $.ajax({
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            url: '/asset/asset_sale/savedocument',
            complete: function (xhr) {
                 var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    $.get("/asset/asset_sale", function (data) {
                        $('#mainContent').html(data);
                        var msg='';
                         msg='Document updated successfully!!!';
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