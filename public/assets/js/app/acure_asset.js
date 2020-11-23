var ACUREASSET = {
    vendor: [],
    initAAL: function () {
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "asset/acure_asset/ajaxget",
                type: 'POST',
                data: function (d) {
                    setTimeout(ACUREASSET.initButton, 1000);
                }
            }
        });
        $(".s-l-cn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("asset/acure_asset/new", function (data) {
                $('#mainContent').html(data);
            });
        });
       // COMMON.getUserRole();
        ACUREASSET.initButton();
        COMMON.getUserRole(); 
    },
    initButton:function(){
        COMMON.getUserRole();
        $(".s-l-e").on("click", function (e) {
            var id=$(this).attr('data-id');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('asset/acure_asset/edit/'+id, function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-dv").on("click", function (e) {
            $.get('/asset/acure_asset/docview/' + $(this).attr('data-id'), function (data) {
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
                $.get('/asset/acure_asset/delete/'+cid, function (data) {
                    //$('#datatable').DataTable().ajax.reload();
                    $('#datatable').DataTable().ajax.reload(null, false);
                    COMMON.shownotification('error', 'Acure Asset deleted successfully!!!');
                });
            });

        });
    },
    initAAN: function () {
        COMMON.getUserRole();
        $('#frmSNew').parsley();
        $('#frmSNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                ACUREASSET.submitAANewFrm();
            }
        });
        $(".s-n-bk").on("click", function (e) {
            location.reload();
        });
        jQuery('#aacure_date').datepicker({
                autoclose: true,
                todayHighlight: true
            });
        $(".custom-modal-button").on("click", function (e) {
            COMMON.loadCustomModal(this);
        });
        $("#customer").autocomplete({
            source: function (request, response) {
                $.ajax({
                    url: "/customer/customer/autovendor/" + request.term,
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
                    ACUREASSET.vendor = JSON.parse(data);
                });
                
            }
        });
        
        ACUREASSET.itemRow();
    },
   initAAE:function(cus,item){
        COMMON.getUserRole();
        ACUREASSET.initAAN();
        
        $(".s-n-bk").on("click", function (e) {
            location.reload();
        });
       
        
       // ACUREASSET.itemRow();

        ACUREASSET.vendor = cus;
  
        ACUREASSET.initRowElement();
        ACUREASSET.calculateAddPrice('on');
    },
    itemRow: function () {
        var htm = '<div class="data-row-wrap" data-id="0" data-sid="0">';
        htm += '<div class="col-md-3" style="float: left;">';
        htm += '<input type="text" placeholder="Enter Asset" class="form-control i-r-ast"/>';
        htm += '</div>';
        htm += '<div class="col-md-2" style="float: left;">';
        htm += '<select class="form-control i-r-shift" required>';
        htm += '<option value="1">Single shift</option>';
        htm += '<option value="2">Double shift</option>';
        htm += '<option value="3">Triple shift</option>';
        htm += '</select>';
        htm += '</div>';
        htm += '<div class="col-md-2" style="float: left;">';
        htm += '<input type="number" class="form-control i-r-ulife" step="1" placeholder="Useful Life" readonly="">';
        htm += '</div>';
        htm += '<div class="col-md-1" style="float: left;">';
        htm += '<input type="number" step="1" class="form-control i-r-qnt" placeholder="Quantity" value="1">';
        htm += '</div>';
        htm += '<div class="col-md-2" style="float: left;">';
        htm += '<input type="number" class="form-control i-r-price" step=".01" placeholder="Price" value="0">';
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
        ACUREASSET.initRow();
    },
    initRow: function () {

        $(".i-r-ast").autocomplete({
            source: function (request, response) {
                console.log("kkk "+request.term);
                var data={term: request.term,
                          };
                $.ajax({
                    url: "/asset/acure_asset/autoasset",
                    type: "POST",
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    complete: function (data) {
                        response($.map(JSON.parse(data.responseText), function (asset) {
                            return {
                                label: asset.asset_name,
                                value: asset.asset_name,
                                id: asset.id,
                            };
                        }));
                    }
                });
            },
            minLength: 3,
            select: function (event, ui) {
                $.get('/asset/acure_asset/assetbyid/' + ui.item.id, function (data) {
                    data = JSON.parse(data);
                    console.log("gg "+data.id);
                    var rw = event.target.closest(".data-row-wrap");
                    $(rw).attr('data-id', data.id);
                    var $price = $(rw).find('.i-r-price');
                    var $span = $(rw).find('.i-r-span');
                    var $ulife = $(rw).find('.i-r-ulife');
                    $price.val(data.buying_price);
                    $ulife.val(data.useful_life);
                    //$span.html(data.asset_name+", "+data.asset_name);
                    ACUREASSET.claculatePrice(rw);
                    ACUREASSET.initRowElement();
                    if($( ".data-row-wrap[data-id='0']" ).length==0)
                    ACUREASSET.itemRow();
                });
            }
        });
    },
    initRowElement: function () {
        $(".i-r-qnt").on("change paste keyup", function(){
            var rw = event.target.closest(".data-row-wrap");
            ACUREASSET.claculatePrice(rw);
        });
        $(".i-r-price").on("change paste keyup", function(){
            var rw = event.target.closest(".data-row-wrap");
            ACUREASSET.claculatePrice(rw);
        });
        $(".i-r-del").on("click", function (e) {
            if($(this).closest(".data-row-wrap").attr("data-id")!='0'){
                if($(this).closest(".data-row-wrap").attr("data-sid") != '0'){
                  console.log("1");
                  $.get('/asset/acure_asset/itemdelete/'+$(this).closest(".data-row-wrap").attr("data-sid"), function (data) {
                   $( this ).closest( ".data-row-wrap" ).remove();
                  });
                }
                else{
                    console.log("2");
                    $( this ).closest( ".data-row-wrap" ).remove();
                }
               // $( this ).closest( ".data-row-wrap" ).remove();
            //   $.get('/asset/acure_asset/itemdelete/'+$(this).attr("data-id"), function (data) {
              // });
                var ni = $('.data-row-wrap').length;
                ACUREASSET.calculateAddPrice('off');
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
    
            ACUREASSET.calculateAddPrice('off');
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
                var itmid = parseInt($(this).attr('data-sid'));
                var q1 = $(this).find('.i-r-qnt').val().trim(), p1 = $(this).find('.i-r-price').val().trim();
                var q = (q1 == "") ? 0 : parseFloat(q1), p = (p1 == "") ? 0 : parseFloat(p1);
                var t = $(this).find(".i-r-tot").html();
                var s = $(this).find('.i-r-shift').val().trim();
                itm.push({id: id,itmid:itmid, q: q, p: p, t: t,s:s});
            }
        });
        var files = $('#asset_doc').get(0).files[0];
        var formData = new FormData();
        formData.append('vendor',ACUREASSET.vendor.id);
        formData.append('aacure_date',$("#aacure_date").val());
        formData.append('acure_validity',$("#acure_validity").val());
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
        
        $.ajax({
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            url: '/asset/acure_asset/save',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code > 0) {
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("/asset/acure_asset", function (data) {
                        
                        $('#mainContent').html(data);
                        var msg = '';
                        if ($("#did").val() !== 'undefined')
                            msg = 'Acure Asset updated successfully!!!';
                        else
                            msg = 'Acure Asset created successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                } else {
                    COMMON.shownotification('error', 'Unable to save Acure Asset!!!');
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
                ACUREASSET.submitAdocNewFrm(sid);
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
                $.get('/asset/acure_asset/docdelete/' + cid, function (data) {
                    $.get("/asset/acure_asset", function (data) {
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
            url: '/asset/acure_asset/savedocument',
            complete: function (xhr) {
                 var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    $.get("/asset/acure_asset", function (data) {
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