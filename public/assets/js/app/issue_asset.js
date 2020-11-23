var IASSET = {
    partner: [],
    initIAL: function () {
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "asset/issue_asset/ajaxget",
                type: 'POST',
                data: function (d) {
                    setTimeout(IASSET.initButton, 1000);
                }
            }
        });

        $(".s-l-cn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("asset/issue_asset/new", function (data) {
                $('#mainContent').html(data);
            });
        });
       // COMMON.getUserRole();
        IASSET.initButton();
        COMMON.getUserRole(); 
    },
    initButton:function(){
        COMMON.getUserRole();
        $(".s-l-e").on("click", function (e) {
            var id=$(this).attr('data-id');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('asset/issue_asset/edit/'+id, function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-dv").on("click", function (e) {
            $.get('/asset/issue_asset/docview/' + $(this).attr('data-id'), function (data) {
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
                $.get('/asset/issue_asset/delete/'+cid, function (data) {
                    $('#datatable').DataTable().ajax.reload(null, false);
                    COMMON.shownotification('error', 'Issue Asset deleted successfully!!!');
                });
            });

        });
    },
    initIAN: function () {
        COMMON.getUserRole();
        $('#frmSNew').parsley();
        $('#frmSNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                IASSET.submitAANewFrm();
            }
        });
        $(".s-n-bk").on("click", function (e) {
            location.reload();
        });
        jQuery('#issue_date').datepicker({
                autoclose: true,
                todayHighlight: true
            });
        $(".custom-modal-button").on("click", function (e) {
            COMMON.loadCustomModal(this);
        });
        $("#customer").autocomplete({
            source: function (request, response) {
                $.ajax({
                    url: "/asset/issue_asset/autopartner/" + request.term,
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
                $.get('/asset/issue_asset/partnerbyid/' + ui.item.id, function (data) {
                    IASSET.partner = JSON.parse(data);
                });
                
            }
        });
        
        IASSET.itemRow();
    },
    initIAE:function(cus){
        COMMON.getUserRole();
        IASSET.initIAN();
        $(".s-n-bk").on("click", function (e) {
            location.reload();
        });
        IASSET.partner = cus;
        IASSET.initRowElement();
    },
    itemRow: function () {
        var htm = '<div class="data-row-wrap" data-id="0">';
        htm += '<div class="col-md-6" style="float: left;">';
        htm += '<input type="text" placeholder="Enter Asset" class="form-control i-r-ast"/>';
        htm += '</div>';
        htm += '<div class="col-md-5" style="float: left;">';
        htm += '<input type="number" step=".01" class="form-control i-r-qnt" placeholder="Quantity" value="1">';
        htm += '</div>';
        htm += '<div class="col-md-1" style="float: left;">';
        htm += '<a class="btn btn-icon waves-effect waves-light btn-danger m-b-5 i-r-del"> <i class="fa fa-remove"></i> </a>';
        htm += '</div>';
        htm += '<div class="col-md-12" style="float: left;">';
        htm += '<span class="i-r-span" style="font-size:10px;"></span>';
        htm += '</div>';
        htm += '</div>';
        $(".item-wrapper").append(htm);
        IASSET.initRow();
    },
    initRow: function () {
        $(".i-r-ast").autocomplete({
            source: function (request, response) {
                var data={term: request.term,
                          };
                $.ajax({
                    url: "/asset/issue_asset/autoasset",
                    type: "POST",
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    complete: function (data) {
                        response($.map(JSON.parse(data.responseText), function (asset) {
                            return {
                                label: asset.asset_name+' ('+asset.asset_no+')',
                                value: asset.asset_name+' ASSET_NO:'+asset.asset_no,
                                id: asset.id,
                            };
                        }));
                    }
                });
            },
            minLength: 3,
            select: function (event, ui) {
                $.get('/asset/issue_asset/assetbyid/' + ui.item.id, function (data) {
                    data = JSON.parse(data);
                    console.log("gg "+data.id);
                    var rw = event.target.closest(".data-row-wrap");
                    $(rw).attr('data-id', data.id);
                    var $price = $(rw).find('.i-r-price');
                    var $span = $(rw).find('.i-r-span');
                    $price.val(data.default_price);
                    $span.html(data.asset_name+", "+data.asset_name);
                    IASSET.initRowElement();
                    if($( ".data-row-wrap[data-id='0']" ).length==0)
                    IASSET.itemRow();
                });
            }
        });
    },
    initRowElement: function () {
        $(".i-r-qnt").on("change paste keyup", function(){
            var rw = event.target.closest(".data-row-wrap");
        });
        $(".i-r-price").on("change paste keyup", function(){
            var rw = event.target.closest(".data-row-wrap");
        });
        $(".i-r-del").on("click", function (e) {
            if($(this).closest(".data-row-wrap").attr("data-id")!='0'){
                $( this ).closest( ".data-row-wrap" ).remove();
                var ni = $('.data-row-wrap').length;
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
                var q1 = $(this).find('.i-r-qnt').val().trim();
                var q = (q1 == "") ? 0 : parseFloat(q1);
                var t = $(this).find(".i-r-tot").html();
                itm.push({id: id, q: q});
            }
        });
        var data = {
            partner: IASSET.partner.id,
            issue_date: $("#issue_date").val(),
            issue_remarks: $("#issue_remarks").val(),
            item: itm,
            
            did: $("#did").val(),
           
        };
        //console.log(data.eid);
        
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/asset/issue_asset/save',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code > 0) {
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("/asset/issue_asset", function (data) {
                        
                        $('#mainContent').html(data);
                        var msg = '';
                        if ($("#did").val() !== 'undefined')
                            msg = 'Issue Asset updated successfully!!!';
                        else
                            msg = ' Asset ISsued  successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                } else {
                    COMMON.shownotification('error', 'Unable to Issue Asset!!!');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
};