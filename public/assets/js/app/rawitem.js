var RAWITEM = {
    itemID:0,
    commap:[],
    initRIL: function () {
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "product/rawitem/ajaxget",
                type: 'POST',
                data: function (d) {
                    setTimeout(RAWITEM.initButton, 1000);
                }
            }
        });

        $(".s-l-cn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("product/rawitem/new", function (data) {
                $('#mainContent').html(data);
            });
        });
        RAWITEM.initButton();
        COMMON.getUserRole();       
    },
    initButton:function(){
        COMMON.getUserRole();
        $(".s-l-e").on("click", function (e) {
            var id=$(this).attr('data-id');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('product/rawitem/edit/'+id , function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-rim").on("click", function (e) {
            var id=$(this).attr('data-id');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('product/rawitem/rawitemmapiing/'+id , function (data) {
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
                $.get('product/rawitem/delete/'+cid, function (data) {
                    $('#datatable').DataTable().ajax.reload(null, false);
                    COMMON.shownotification('error', 'Raw item deleted successfully!!!');
                });
            });

        });
    },
    initRIN: function () {
        
        $('#frmINew').parsley();
        $('#frmINew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                RAWITEM.submitRINewFrm();
            }
        });
        $(".i-n-b").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("product/rawitem", function (data) {
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
        $(".cmpnt_cls").on("change paste keyup", function () {
            var term = $(".cmpnt_cls").val();
                 var _this = this;
                 
                $.ajax({
                    url: "product/prod_codification/getfeature/" + term,
                    dataType: "jsonp",
                    type: "GET",
                    complete: function (data) {
                        var jdata = JSON.parse(data.responseText);
                        var subc = $('.feature_cls');
                        subc.empty();
                        subc.append($("<option></option>").attr("value", "").text("Select Feature"));
                        Object.keys(jdata).forEach(function (key){
                            //$(_this).attr('data-id', jdata[key].id);
                            subc.append($("<option></option>").attr("value", jdata[key].id).text(jdata[key].name));
                             // CODIFICATION.pimninitsubftr();
                          
                          });
                         subc.val(RAWITEM.commap.component_feature);
                    }

                   
                });

        });
        $(".feature_cls").on("change paste keyup", function () {
            var term = $(".feature_cls").val();
                 var _this = this;
                 console.log("term "+term);
           $.ajax({
                    url: "product/prod_codification/getsubfeature/" + term,
                    dataType: "jsonp",
                    type: "GET",
                    complete: function (data) {
                        var jdata=JSON.parse(data.responseText);
                        var subc = $('.sub_feature_cls');
                            subc.empty();
                        Object.keys(jdata).forEach(function (key){
                            subc.append($("<option></option>").attr("value", jdata[key].id).text(jdata[key].name));
                          });
                       subc.val(RAWITEM.commap.component_sub_feature);
                    }

                   
                });

        });

    },


 /*   initPFN: function (iid) {
        CODIFICATION.prodcode = iid;
        $(".select2").select2();
        $('#frmCNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                CODIFICATION.submitPFNewFrm();
            }
        });
        $(".c-n-b").on("click", function (e) {
            location.reload();
        });
        CODIFICATION.loadoldFeatureData();
    },
    
    dynamiccode: function () {
          $("#product_code").val(" "); 
         $('.specification_item_cls').each(function() { 
             var _this = this;
             var txt = $(_this).val();
             $("#product_code").val($("#product_code").val() + txt);

         });
    },
    loadOldData:function(){
        $.ajax({
                    url: '/prod_codification/getoldcode/?pid="'+CODIFICATION.prodcode.product_item_id+'"' ,
                    dataType: "jsonp",
                    type: "GET",
                    complete: function (data) {
                        var jdata=JSON.parse(data.responseText);
                        Object.keys(jdata).forEach(function (k){
                            var $specification_item = $('#speification_item'+jdata[k].prod_specification_category);
                            $specification_item.val(jdata[k].code).trigger('change');

                          }); 
                    }
                   
                });
    },
    loadoldFeatureData:function(){
        $.ajax({
                    url: '/prod_codification/getoldfeaturecode/'+CODIFICATION.prodcode ,
                    dataType: "jsonp",
                    type: "GET",
                    complete: function (data) {
                        var jdata=JSON.parse(data.responseText);
                        Object.keys(jdata).forEach(function (k){        
                             var $prod_item = $('#prod_item'+jdata[k].product_feature);
                             $prod_item.val(jdata[k].feature_val).trigger('change');
                               
                          });
                    }
                   
                });
    },*/

     initRIMP: function (iid) {
        RAWITEM.itemId=iid;
        $(".i-n-b").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("product/rawitem", function (data) {
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
                RAWITEM.submitComponentFrm();
            }
        });
        var i=0;

        $('#item-srch').keyup(function(){
           var txt =  $('#item-srch').val();
            if(txt.length>2){

                $.ajax({
                    url: "product/rawitem/getrawprod/"+txt,
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
                    url: "product/rawitem/getrawsubname/" + term,
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
                        RAWITEM.initilizeArea();
                    }
                   
                });
          });

         
        RAWITEM.loadOlditemmappinData();
         

        
    },
    loadOlditemmappinData:function(){
        $.ajax({
                    url: "product/rawitem/getrawolditem/" + RAWITEM.itemId,
                    dataType: "jsonp",
                    type: "GET",
                    complete: function (data) {
                        var jdata=JSON.parse(data.responseText);
                        Object.keys(jdata).forEach(function (k){
                           var htm=`<div class="item item-full-prod"  data-id="${jdata[k].id}" style="padding-botton:5px;padding-top:5px"><div class="p-name">${jdata[k].code}</div><div class="p-num">
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
            compmapid:$('#compmapid').val(),
            item:item,

        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'product/rawitem/rawitemmappingsave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("product/rawitem", function (data) {
                        $('#mainContent').html(data);
                        
                        var msg = '';
                            msg = 'Raw Item Mapping created successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                }
              else {
                    COMMON.shownotification('error', 'Unable to save item!!!');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },     
    submitRINewFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
var data = {name: $("#name").val(),
    code: $("#code").val(),
    group: $("#group").val(),
    specification: $("#specification").val(),
    unit: $("#unit").val(),
    hsn_code: $("#hsn_code").val(),
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
            url: 'product/rawitem/save',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("product/rawitem", function (data) {
                        $('#mainContent').html(data);
                        var msg = '';
                        if ($("#iid").val() !== 'undefined')
                            msg = 'Raw Item updated successfully!!!';
                        else
                            msg = 'Raw Item created successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                }else if(res.code == 2){
                  COMMON.shownotification('error', 'Product Code already Exit!!!');
                }  else {
                    COMMON.shownotification('error', 'Unable to save Raw item!!!');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
};