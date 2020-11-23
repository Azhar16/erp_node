var ITEM = {
    itemId:0,
    initI: function () {
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "/item/ajaxget",
                type: 'POST',
                data: function (d) {
                    setTimeout(ITEM.initButton, 1000);
                }
            }
        });
        $(".i-l-cn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("/item/new", function (data) {
                $('#mainContent').html(data);
            });
        });
        ITEM.initButton();
        COMMON.getUserRole();
        

    },
    initButton: function () {
        $(".i-l-e").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get('/item/edit/' + $(this).attr('data-id'), function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".i-l-f").on("click", function (e) {
            ITEM.itemId=$(this).attr('data-id');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('/item/componentmaping/' +ITEM.itemId , function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".i-l-d").on("click", function (e) {
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
                $.get('/item/delete/' + cid, function (data) {
                    $('#datatable').DataTable().ajax.reload(null, false);
                    COMMON.shownotification('error', 'Customer deleted successfully!!!');
                });
            });

        });
    },
    initIN: function () {
        $('#frmINew').parsley();
        $('#frmINew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                ITEM.submitINewFrm();
            }
        });
        $(".i-n-b").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("/item", function (data) {
                $('#mainContent').html(data);
            });
        });
        $("#unit").keyup(function () {
            if ($(this).val() == "")
                $(".i-d-u").html("Default unit");
            else
                $(".i-d-u").html($(this).val());
        });
        $('#multi_unit').click(function () {
            if ($(this).prop("checked") == true) {
                $(".m-u-w").css("display", "block");
            } else {
                $(".m-u-w").css("display", "none");
            }
        });
        $("#frmINew input[name='type']").click(function () {
            ITEM.checkService();
        });
        ITEM.checkService();
    },
    initCN: function (iid) {
        ITEM.itemId=iid;
        $(".i-n-b").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("/item", function (data) {
                $('#mainContent').html(data);
            });
        });
        jQuery('#product_cdd').datepicker({
                autoclose: true,
                todayHighlight: true
            });

        $('#frmINew').parsley();
        $('#frmINew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                ITEM.submitComponentFrm();
            }
        });
        var i=0;

        $('#item-srch').keyup(function(){
           var txt =  $('#item-srch').val();
            if(txt.length>2){

                $.ajax({
                    url: "/item/getprod/"+txt,
                    dataType: "jsonp",
                    type: "GET",
                    data:{
                        txt:txt
                    },
                                      
                    complete: function (data) {
                        var jdata=JSON.parse(data.responseText);
                        Object.keys(jdata).forEach(function (key){
                            $(".prod-holder").append(`
                                    <div class="item-dragable" data-id="${jdata[key].id}">
                                    ${jdata[key].code}
                        </div>
                            `);
                             
                          });
                        $(".item-dragable").draggable({
                        revert: 'invalid',
                        helper: 'clone',
                        cursor: 'move'
                        
                    });
                       
                    }

                   
                });
             }
             else {
                $(".prod-holder").empty();
             }
          });

        $('.i-sub-row').each(function() {
                 var term = $(this).closest('.i-sub-row').attr('data-id');
                 var _this = this;
                $.ajax({
                    url: "/item/getsubname/" + term,
                    dataType: "jsonp",
                    type: "GET",
                    complete: function (data) {
                        var jdata=JSON.parse(data.responseText);
                        Object.keys(jdata).forEach(function (key){
                           var htm = '<div class="data-row-wrap sub-data-item" data-id="'+jdata[key].id+'">';
                                htm += '<div class="col-md-12 item-div" style="width:250px;min-height:21px;border:thick solid rgb(35, 138, 119); text-align:center;">'+jdata[key].component_subname+'</div>';
                                htm += '<div class="col-md-12 item-emty-div" style="min-height:100px;border:thick solid rgb(35, 138, 64); text-align:left;" >';
                                htm += '</div>';
                                htm += '</div>';
                                $(_this).find('.item-wrapper').append(htm);

                          });
                        ITEM.initilizeArea();
                    }
                   
                });
          });

        ITEM.loadOldData();
 
    },
    loadOldData:function(){
        $.ajax({
                    url: "/item/getolditem/" + ITEM.itemId,
                    dataType: "jsonp",
                    type: "GET",
                    complete: function (data) {
                        var jdata=JSON.parse(data.responseText);
                        Object.keys(jdata).forEach(function (k){
                           var htm=`<div class="item item-full-prod"  data-id="${jdata[k].id}"><div class="p-name">${jdata[k].code}</div><div class="p-num">
                                 <input type="number"  class="form-control i-r-qnt" placeholder="Quantity" value='${jdata[k].prod_quantity}'>
                                 </div>
                                 <div class="p-del" >
                                 <a class="btn btn-icon waves-effect waves-light btn-danger m-b-5 i-r-del"> <i class="fa fa-remove"></i> </a>
                                 </div>
                                 <div style="clear:both;"></div>
                                 <div>
                                
                            `;
                            $(".i-r-del").on("click", function (e) {
                            
                                $( this ).closest( ".item-full-prod" ).remove();
                                
                                });
                          
                           $(".main-cls").find("[data-id="+jdata[k].component+"]").find("[data-id="+jdata[k].sub_component+"]").find(".item-emty-div").append(htm);
                         
                           
                           

                          });

                        
                    }
                   
                });
    },
    initilizeArea:function (){
     //console.log(iid);
        //ITEM.loadOldData();
                $(".item-emty-div").droppable({
                    drop: function(e, ui) { 
                       // ui.preventDefault();

                        //var r   = $(this).attr('data-id');
                        var id = ui.draggable.attr('data-id');
                        var name = ui.draggable.html();
                        
                        
                        //console.log('did '+did);
                        //var repetitions = ui.sender.attr('repetitions');
                        //jdata[r].push({'id':id,});
                                                //alert(dropedId);
                       // drawMappArea(); 
                       var otar=$(this).find('.item'+id);
                       if(otar.length>0){
                            var tot=otar.find('.i-r-qnt').val();
                            tot=(tot=='' || tot=='NaN')?0:tot;
                            otar.find('.i-r-qnt').val(parseInt(tot)+1);
                       }else{
                        var htm=`<div class="item${id} item-full-prod" data-id="${id}" ><div class="p-name">${name}</div><div class="p-num">
                                 <input type="number"  class="form-control i-r-qnt" placeholder="Quantity" value='1'>
                                 </div>
                                 <div class="p-del" >
                                 <a class="btn btn-icon waves-effect waves-light btn-danger m-b-5 i-r-del"> <i class="fa fa-remove"></i> </a>
                                 </div>
                                 <div style="clear:both;"></div>
                                 <div>
                                
                            `;
                            $(this).append(htm);

                            $(".i-r-del").on("click", function (e) {
                            
                                $( this ).closest( ".item-full-prod" ).remove();
                                
                                });
                       }
                       
                        
                    }
                });
           
                
            },

            drawAfterDrag:function(){
                var htm='';

            
            },
    
    checkService: function () {
        if ($('input:radio[name=type]:checked').val() == "service") {
            $(".forProd").css("display", 'none');
            $("#unit").val('-');
        } else {
            $(".forProd").css("display", 'block');
            $("#unit").val('');
        }
    },

    submitINewFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var data = {name: $("#name").val(),
            type: $("input[name='type']:checked").val(),
            code: $("#code").val(),
            group: $("#group").val(),
            specification: $("#specification").val(),
            unit: $("#unit").val(),
            hsn_code: $("#hsn_code").val(),
            category: $("#category").val(),
            tax_slabe: $("#tax_slabe").val(),
            multi_unit: ($("#multi_unit").prop("checked") == true) ? 'yes' : 'no',
            unit_one_no: $("#unit_one_no").val(),
            unit_two_no: $("#unit_two_no").val(),
            unit_two: $("#unit_two").val(),
            unit_three_no: $("#unit_three_no").val(),
            unit_three: $("#unit_three").val(),
            sales_rate: $("#sales_rate").val(),
            sales_discount: $("#sales_discount").val(),
            purchase_rate: $("#purchase_rate").val(),
            ostock: $("#ostock").val(),
            orate: $("#orate").val(),
            description: $("#description").val(),
            iid: $("#iid").val()};
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/item/save',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("/item", function (data) {
                        $('#mainContent').html(data);
                        var msg = '';
                        if ($("#iid").val() !== 'undefined')
                            msg = 'Item updated successfully!!!';
                        else
                            msg = 'Item created successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                } else if (res.code == 2) {
                    COMMON.shownotification('error', res.msg);
                } else {
                    COMMON.shownotification('error', 'Unable to save item!!!');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
    submitComponentFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var item=[];
        $(".i-sub-row").each(function(i){
            var compid=$(this).attr("data-id");
            $(this).find(".sub-data-item").each(function(j){
                $(this).find(".item-full-prod").each(function(k){
                    item.push({comp:$(this).closest(".i-sub-row").attr("data-id"),
                            sub_com:$(this).closest(".sub-data-item").attr("data-id"),
                            prod:$(this).attr("data-id"),
                            qnt:$(this).find(".i-r-qnt").val()
                        });
                });    
            });
        });
        
        
        var data = {
            product_size:$('#product_size').val(),
            product_type:$('#product_type').val(),
            product_class:$('#product_class').val(),
            product_figure:$('#product_figure').val(),
            product_ends:$('#product_ends').val(),
            product_moc:$('#product_moc').val(),
            product_cdd:$('#product_cdd').val(),
            product_trim:$('#product_trim').val(),
            product_qty:$('#product_qty').val(),
            product_inspection:$('#product_inspection').val(),
            product_hydraulic_body:$('#product_hydraulic_body').val(),
            product_hydraulic_seat:$('#product_hydraulic_seat').val(),
            product_pneumatic_seat:$('#product_pneumatic_seat').val(),
            product_hydroback_seat:$('#product_hydroback_seat').val(),
            product_unit_rate:$('#product_unit_rate').val(),
            product_category:$('#product_category').val(),
            size_id:$('#size_id').val(),
            compmapid:$('#compmapid').val(),

            body:$('#body').val(),
            forged:$('#forged').val(),
            bonet:$('#bonet').val(),
            bolted:$('#bolted').val(),
            spindle:$('#spindle').val(),
            rising:$('#rising').val(),
            seat:$('#seat').val(),
            renewable:$('#renewable').val(),
            wedge:$('#wedge').val(),
            loose_needle:$('#loose_needle').val(),
            gland_boss:$('#gland_boss').val(),
            single:$('#single').val(),
            back_seat:$('#back_seat').val(),
            integral:$('#integral').val(),
            hand_wheel:$('#hand_wheel').val(),
            gasket:$('#gasket').val(),
            spiral_wound:$('#spiral_wound').val(),


            
            item:item,

        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/item/componentsave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("/item", function (data) {
                        $('#mainContent').html(data);
                        var msg = '';
                            msg = 'Item Mapping created successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                }
                else if(res.code == 2){
                     $('#mainContent').html("<div class='loading'></div>");
                    $.get("/item", function (data) {
                        $('#mainContent').html(data);
                        var msg = '';
                            msg = 'Item Mapping updated successfully!!!';
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