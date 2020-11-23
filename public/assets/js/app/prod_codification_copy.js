var CODIFICATION = {
    cmpnt:[],
    olddata:[],
    initPCL: function () {
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: "product/prod_codification/ajaxget",
                type: 'POST',
                data: function (d) {
                    setTimeout(CODIFICATION.initButton, 1000);
                }
            }
        });

        $(".s-l-cn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("product/prod_codification/new", function (data) {
                $('#mainContent').html(data);
            });
        });
        CODIFICATION.initButton();
        COMMON.getUserRole();
        
         
        
    },
    initButton:function(){
        COMMON.getUserRole();
        $(".s-l-e").on("click", function (e) {
            var id=$(this).attr('data-id');
            var prod = $(this).attr('data-prodcode');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('product/prod_codification/edit/'+prod , function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-itm").on("click", function (e) {
            var id=$(this).attr('data-id');
            var itemid = $(this).attr('data-itemid');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('product/prod_codification/item/'+itemid, function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-pf").on("click", function (e) {
            var id=$(this).attr('data-id');
            var itemid = $(this).attr('data-itemid');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('product/prod_codification/prod_feature/'+itemid, function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-im").on("click", function (e) {
            var itemid = $(this).attr('data-itemid');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('product/prod_codification/itemmapping/' +itemid , function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-m").on("click", function (e) {
            var itemid = $(this).attr('data-itemid');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('product/prod_codification/mapping/' +itemid , function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-dm").on("click", function (e) {
            var itemid = $(this).attr('data-itemid');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('product/prod_codification/drawingmapping/' +itemid , function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-dv").on("click", function (e) {
            var itemid = $(this).attr('data-itemid');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('product/prod_codification/drawingview/' +itemid , function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-rawitm").on("click", function (e) {
            var id=$(this).attr('data-id');
            var itemid = $(this).attr('data-itemid');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('product/prod_codification/rawitem/'+itemid, function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-d").on("click", function (e) {
            var cid = $(this).attr('data-id');
            var piid = $(this).attr('data-prodcode');
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
                $.get('product/prod_codification/delete/?id="'+cid+'"&p_i_id="'+piid+'"', function (data) {
                    $('#datatable').DataTable().ajax.reload();
                    COMMON.shownotification('error', 'product  deleted successfully!!!');
                });
            });

        });
    },
    initPCN: function () {
        $(".select2").select2();
        $('#frmCNew').parsley();
        $('#frmCNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                CODIFICATION.submitPCNnewFrm();
            }
        });
        $('.specification_item_cls').on("change",function() {
             
             CODIFICATION.dynamiccode();
             
             CODIFICATION.dynamicname();
             
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
        /*$('.specific_category_cls').each(function() {
            var id = $(this).attr("data-id");
            var txt;
            //$("#speification_item"+id).on("change",function() {
                 txt = $("#speification_item"+id+" option:selected").val(); 
                $("#product_code").val($("#product_code").val() + txt);
            //});
          });*/
        $(".c-n-b").on("click", function (e) {
            location.reload();
        });
    },
    initPCE: function (iid) {
        CODIFICATION.prodcode = iid;
        $(".select2").select2();
        $('#frmCNew').parsley();
        $('#frmCNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                CODIFICATION.submitPCNnewFrm();
            }
        });
        $('.specification_item_cls').on("change",function() {
             
             CODIFICATION.dynamiccode();
             CODIFICATION.dynamicname();
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
        CODIFICATION.loadOldData();
        $(".c-n-b").on("click", function (e) {
            location.reload();
        });
    },
    initIN: function () {
        $('#frmINew').parsley();
        $('#frmINew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                CODIFICATION.submitINewFrm();
            }
        });
        $(".i-n-b").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("product/prod_codification", function (data) {
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

    },
    initIRN: function () {
        $('#frmINew').parsley();
        $('#frmINew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                CODIFICATION.submitIRNewFrm();
            }
        });
        $(".i-n-b").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("product/prod_codification", function (data) {
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

    },
    initPFN: function (iid) {
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
        

        $('.prod_feature_cls').each(function() {
                 var term = $(this).closest('.prod_feature_cls').attr('data-id');
                 var _this = this;

                $.ajax({
                    url: "product/prod_codification/getprodsubfeature/" + term,
                    dataType: "jsonp",
                    type: "GET",
                    complete: function (data) {
                        var jdata=JSON.parse(data.responseText);
                        Object.keys(jdata).forEach(function (key){
                             var subfeature = $('#prod_item'+jdata[key].prod_feature);
                                subfeature.append($("<option></option>").val(jdata[key].id).text(jdata[key].name).attr("data-id", jdata[key].id));

                          });
                    }
                   
                });
          });
        //console.log($(".prod_feature_cls"+specificid+" option:selected").val());
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
    dynamicname: function () {
          $("#product_name").val(" ");
         $('.specification_item_cls').each(function() { 
             if($(this).val() != ''){
             var txt = $(this).find('option:selected').text();
             var sf = txt.replace(/select/g, "");
             $("#product_name").val($("#product_name").val()+'***'+sf);
             }
             });
            
    },
    loadOldData:function(){
        $.ajax({
                    url: 'product/prod_codification/getoldcode/?pid="'+CODIFICATION.prodcode.product_item_id+'"' ,
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
                    url: 'product/prod_codification/getoldfeaturecode/'+CODIFICATION.prodcode ,
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
    },

    initPIMN: function (cmpnt,olddata) {
        CODIFICATION.cmpnt=cmpnt;
        $(".i-n-b").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("product/prod_codification", function (data) {
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
                CODIFICATION.submitComponentFrm();
            }
        });
        CODIFICATION.pimnitemRow();
         

        
    },
    initPMN:function(){
        $(".i-n-b").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("product/prod_codification", function (data) {
                $('#mainContent').html(data);
            });
        });
        $('#frmINew').parsley();
        $('#frmINew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                CODIFICATION.submitPFNform();
            }
        });
        $(".i-r-prod").autocomplete({
            source: function (request, response) {
                var data={term: request.term,
                        hsn:-1};
                $.ajax({
                    url: "product/prod_codification/autoitem",
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
                    $(rw).attr('data-pid', data.id);
                    
                });
            }
        });
    },
    initPDN:function(){
        $(".i-n-b").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("product/prod_codification", function (data) {
                $('#mainContent').html(data);
            });
        });
        $('#frmINew').parsley();
        $('#frmINew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                CODIFICATION.submitPDNform();
            }
        });
        
    },
    initPDV:function(){
        $(".s-n-bk").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("product/prod_codification", function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".doc-dlt").on("click", function (e) {
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
                $.get('/product/prod_codification/docdelete/' + cid, function (data) {
                    $.get("/product/prod_codification", function (data) {
                        $('#mainContent').html(data);
                        COMMON.shownotification('error', 'Drawing File deleted successfully!!!');
                    });
                    
                });
            });

        });
        $('#frmSNew').parsley();
        $('#frmSNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                CODIFICATION.submitPDVform();
            }
        });
       
    },
    pimnitemRow: function () {
        var htm = '<div class="data-row-wrap" data-id="0" data-pid="0">';
        htm += '<div class="col-md-3" style="float: left;">';
        htm += '<select class="form-control i-r-compnt">';
        htm += '<option value=""> select component </option>';
        for(var i in CODIFICATION.cmpnt){
        //console.log("kk "+CODIFICATION.cmpnt[i].id);
        if(CODIFICATION.cmpnt[i].id == CODIFICATION.itemcmpnt){
            htm += '<option selected value="'+CODIFICATION.cmpnt[i].id+'">'+CODIFICATION.cmpnt[i].component_name+'</option>';
        }
        else{
           htm += '<option value="'+CODIFICATION.cmpnt[i].id+'">'+CODIFICATION.cmpnt[i].component_name+'</option>'; 
        }
        }
        htm += '</select>';
        htm += '</div>';
        htm += '<div class="col-md-3" style="float: left;text-align: center;">';
        htm += '<select class="form-control i-r-ftre" >';
        htm += '</select>';
        htm += '</div>';
        htm += '<div class="col-md-3" style="float: left;text-align: center;">';
        htm += '<select class="form-control i-r-sub-ftre">';
        htm += '</select>';
        htm += '</div>';
        htm += '<div class="col-md-2" style="float: left;">';
        htm += '<input type="number" step=".01" class="form-control i-r-qnty" placeholder="Quantity" value="1">';
        htm += '</div>';;
        htm += '<div class="col-md-1" style="float: left;">';
        htm += '<a class="btn btn-icon waves-effect waves-light btn-danger m-b-5 i-r-del"> <i class="fa fa-remove"></i> </a>';
        htm += '</div>';
        htm += '</div>';
        $(".item-wrapper").append(htm);
        CODIFICATION.pimninitRow();


    },
    pimninitRow:function(){
        $(".i-r-compnt").on("change paste keyup", function () {
            CODIFICATION.pimninitsub($(this).val());
        });
        $(".i-r-ftre").on("change paste keyup", function () {
            CODIFICATION.pimninitsubftre($(this).val());
        });
       /* if(CODIFICATION.itemcmpnt != 0){
          CODIFICATION.pimninitsub(CODIFICATION.itemcmpnt);  
        } */
        $(".i-r-del").on("click", function (e) {
           var cid = $(this).attr('data-id');
           if($(this).closest(".data-row-wrap").attr("data-pid")!='0'){
               var pid = $(this).closest(".data-row-wrap").attr("data-pid");
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
                $.get('/product/prod_codification/itemdelete/' + pid, function (data) {
                    $.get("/product/prod_codification", function (data) {
                        $('#mainContent').html(data);
                        COMMON.shownotification('error', 'item deleted successfully!!!');
                    });
                    
                });
            });
        }
            /*if($(this).closest(".data-row-wrap").attr("data-id")!='0'){
                $( this ).closest( ".data-row-wrap" ).remove();
            }*/
        });
        
    },
    pimninitsub:function(term){
        console.log("term "+term);
      //  $('.data-row-wrap').each(function() {
                 CODIFICATION.itemcmpnt = term;
                 //console.log("dd "+term);
                 var _this = this;
                $.ajax({
                    url: "product/prod_codification/getfeature/" + term,
                    dataType: "jsonp",
                    type: "GET",
                    complete: function (data) {
                        var jdata = JSON.parse(data.responseText);
                        var subc = $('.i-r-ftre');
                        //subc.empty();
                        subc.append($("<option></option>").attr("value", "").text("Select Feature"));
                        Object.keys(jdata).forEach(function (key){
                            $('.data-row-wrap').attr('data-id', jdata[key].id);
                            subc.append($("<option></option>").attr("value", jdata[key].id).text(jdata[key].name));
                             // CODIFICATION.pimninitsubftr();
                          });
                        if($( ".data-row-wrap[data-id='0']" ).length==0)
                           CODIFICATION.pimnitemRow();
                          // $(_this).find(".i-r-compnt").val(term);

                            
                         }
                      });
                 // });
        //  CODIFICATION.loadOlditemmappinData();

    },
    pimninitsubftre:function(term){
      //  $('.data-row-wrap').each(function() {
                 var _this = this;
                $.ajax({
                    url: "product/prod_codification/getsubfeature/" + term,
                    dataType: "jsonp",
                    type: "GET",
                    complete: function (data) {
                        var jdata=JSON.parse(data.responseText);
                        var subc = $('.i-r-sub-ftre');
                            subc.empty();
                        Object.keys(jdata).forEach(function (key){
                            //$(_this).attr('data-id', jdata[key].id);
                            subc.append($("<option></option>").attr("value", jdata[key].id).text(jdata[key].name));
                          
                          });
                        
                        
                    }

                });
                
                
        //  });
       // CODIFICATION.loadOlditemmappinData();


    },
    loadOlditemmappinData:function(){
        $.ajax({
                    url: "product/prod_codification/getfinishedolditem/" + CODIFICATION.itemIId,
                    dataType: "jsonp",
                    type: "GET",
                    complete: function (data) {
                        var jdata=JSON.parse(data.responseText);
                        Object.keys(jdata).forEach(function (k){
                           
                           

                          });

                        
                    }
                   
                });
    },
    
    initilizeArea:function (){
        //ITEM.loadOldData();
                $(".item-emty-div").droppable({
                    drop: function(e, ui) { 
                       // ui.preventDefault();

                        //var r   = $(this).attr('data-id');
                        var id = ui.draggable.attr('data-id');
                        var name = ui.draggable.html();
                        
                        
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
    
    submitPCNnewFrm: function () {
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
        var data = {
            category:category,
            product_code:$('#product_code').val(),
            product_name:$('#product_name').val(),
            prodid:$('#prodid').val(),
            itmid:$('#itmid').val(),
        }
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'product/prod_codification/save',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                  
                        $('#mainContent').html("<div class='loading'></div>");
                        $.get("product/prod_codification", function (data) {
                            $('#mainContent').html(data);

                        });
           
                    var msg = '';
                    if ($("#pfid").val() !== 'undefined')
                        msg = 'Product Codification updated successfully!!!';
                    else
                        msg = 'Product Codification created successfully!!!';
                    COMMON.shownotification('success', msg);
                }
                else if(res.code == 2){
                    var msg='';
                     msg = 'Product Id Already Exit!!!';
                    COMMON.shownotification('error', msg);
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
    submitINewFrm: function () {
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
            url: 'product/prod_codification/itemsave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("product/prod_codification", function (data) {
                        $('#mainContent').html(data);
                        var msg = '';
                        if ($("#iid").val() !== 'undefined')
                            msg = 'Item updated successfully!!!';
                        else
                            msg = 'Item created successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                }  else {
                    COMMON.shownotification('error', 'Unable to save item!!!');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    }, 

    submitPFNewFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
          var category = [];
        $(".prod_feature_cls").each(function(i){
            var specificid=$(this).attr("data-id");
             $(this).find(".prod_item_cls").each(function(j){
                if($(this).val() != ''){
                    //console.log("abc "+$(this).closest(".prod_feature_cls").attr("data-name"));
                    category.push({pfitmid:$(this).closest(".prod_feature_cls").attr("data-id"),
                            pfval:$("#prod_item"+specificid+" option:selected").val(),
 
            });
                }
            });
        });
        var data = {
            category:category,
            iid: $("#iid").val(),
            };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'product/prod_codification/pfsave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("product/prod_codification", function (data) {
                        $('#mainContent').html(data);
                        var msg = '';
                        if ($("#iid").val() !== 'undefined')
                            msg = 'Product Feature updated successfully!!!';
                        else
                            msg = 'Product Feature created successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                }  else {
                    COMMON.shownotification('error', 'Unable to save Product Feature!!!');
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
        /*$(".i-sub-row").each(function(i){
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
        });*/

        $( ".data-row-wrap" ).each(function( i ) {
            var id = parseInt($(this).attr('data-id'));
            var pid = parseInt($(this).attr('data-pid'));
            if(id>0){
                var comp1 = $(this).find('.i-r-compnt').val().trim(), ftre1 = $(this).find('.i-r-ftre').val().trim(), sub_ftre1 = $(this).find('.i-r-sub-ftre').val(), qnty = $(this).find('.i-r-qnty').val().trim();
                var comp = (comp1 == "") ? 0 : parseFloat(comp1),ftre = (ftre1 == "") ? 0 : parseFloat(ftre1),sub_ftre = (sub_ftre1 == null) ? 0 : parseFloat(sub_ftre1);
                item.push({id: id,pid:pid, comp: comp, ftre: ftre, sub_ftre: sub_ftre, qnty: qnty});
            }
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
  
            item:item,

        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'product/prod_codification/itemmappingsave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("product/prod_codification", function (data) {
                        $('#mainContent').html(data);
                        var msg = '';
                            msg = 'Item Mapping created successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                }
                else if(res.code == 2){
                     $('#mainContent').html("<div class='loading'></div>");
                    $.get("product/prod_codification", function (data) {
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
    submitIRNewFrm: function () {
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
            url: 'product/prod_codification/rawitemsave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("product/prod_codification", function (data) {
                        $('#mainContent').html(data);
                        var msg = '';
                        if ($("#iid").val() !== 'undefined')
                            msg = 'Raw Item updated successfully!!!';
                        else
                            msg = 'Raw Item created successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                }  else {
                    COMMON.shownotification('error', 'Unable to save Raw item!!!');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
    submitPFNform:function(){
       $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var item=[];
        $( ".data-row-wrap" ).each(function( i ) {
            var id = parseInt($(this).attr('data-id'));

            if(id>0){
                var prod = parseInt($(this).attr('data-pid'));
                item.push({id: id, prod: prod});
            }
        });
        var data = {
           
            item:item

        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'product/prod_codification/mappingsave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code > 0) {
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("product/prod_codification", function (data) {
                        $('#mainContent').html(data);
                        var msg = '';
                            msg = 'Mapping created successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                }
                else if(res.code == 2){
                     $('#mainContent').html("<div class='loading'></div>");
                    $.get("product/prod_codification", function (data) {
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
    submitPDNform:function(){
        $("body").css('cursor', 'wait');
         $(".loginmessage").html('Data submiting. Please Wait...');
         var itm=[];
         $( ".data-row-wrap" ).each(function( i ) {
            var id = parseInt($(this).attr('data-id'));
            console.log($( ".data-row-wrap" ).length);
            if(id>0){
              var drawing_no = $(this).find('.i-r-drawing').val().trim();
              var docc='';
              var docs='';
              var doc = $(this).find(".i_r_drawing_file").get(0).files[0];
                if(typeof (doc)==='undefined'){
                docs='';
                docc = '';
                }
                else{
                 docs = doc;
                 docc = doc.name;    
                }

              itm.push({id:id,drawing_no,docc:docc,docs:docs});
              var lastEl = itm[itm.length-1];
              console.log(lastEl.id); 
            }
            });
         console.log(itm);
         console.log("ga "+$('.data-row-wrap').find('.i-r-drawing').val().trim());
         var formData = new FormData();
         formData.append('item',JSON.stringify(itm));
         console.log(...formData);
        $.ajax({
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            url: '/product/prod_codification/drawingmappingsave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code > 0) {
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("/product/prod_codification", function (data) {
                        $('#mainContent').html(data);
                    });
                } else {
                    COMMON.shownotification('error', 'Unable to save Drawing mapping!!!');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
      //  }
     
    },
    submitPDVform:function(){
        $("body").css('cursor', 'wait');
            $(".loginmessage").html('Data submiting. Please Wait...');
            var id = $("#docid").val();
            var formData = new FormData();
            formData.append('id',id);
            var doc = $("#doc_upld").get(0).files[0];       
            if(typeof (doc)==='undefined'){
            formData.append('doc_upld','');
            }
            else{
             formData.append('doc_upld',doc,doc.name);    
            }
            $.ajax({
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                url: '/product/prod_codification/docsave',
                complete: function (xhr) {
                    var res = JSON.parse(xhr.responseText);
                    if (res.code > 0) {
                        $('#mainContent').html("<div class='loading'></div>");
                        $.get("/product/prod_codification", function (data) {
                            $('#mainContent').html(data);
                            var msg = '';
                            msg = 'Drawing document updated successfully!!!';
                            COMMON.shownotification('success', msg);
                        });
                    } else {
                        COMMON.shownotification('error', 'Unable to save Drawing document!!!');
                    }
                    $(".loginmessage").html('');
                    $("body").css('cursor', 'default');
                },
            });
    },
    submitPDNform:function(){
         var itm=[],doc='',docname = '';
       //  $( ".data-row-wrap" ).each(function( i ) {
         $("body").css('cursor', 'wait');
         $(".loginmessage").html('Data submiting. Please Wait...');
         $( ".data-row-wrap" ).each(function( i ) {
            var id = parseInt($(this).attr('data-id'));
            var drawing_no = $(this).find('.i-r-drawing').val().trim();
            var old_drawing_no = $(this).find('.oi-r-drawing').val();
            var old_doc = $(this).find(".oi_r_drawing_file").val();
            console.log("o "+old_drawing_no);
            var docdata = $(this).find(".i_r_drawing_file").get(0).files[0];
            if(typeof (docdata) !='undefined'){
                doc = docdata;
                docname = doc.name;
                console.log("docname "+doc.name);
            }
            itm.push({id:id,drawing_no:drawing_no,old_drawing_no:old_drawing_no,old_doc:old_doc,doc,doc,docname:docname});
            });

        
        var formData = new FormData();
        formData.append('itm',JSON.stringify(itm));

       
        $.ajax({
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            url: '/product/prod_codification/drawingmappingsave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code > 0) {
                    $('#mainContent').html("<div class='loading'></div>");
                    //console.log("lastEl "+lastEl);
                    if(id == lastEl){
                        console.log("1 "+lastEl);
                         $.get("/product/prod_codification", function (data) {
                        $('#mainContent').html(data);
                    });
                    l
                }
                else{
                    console.log("2 "+lastEl);
                    location.reload(true);
                   
                }
                } else {
                    COMMON.shownotification('error', 'Unable to save Drawing mapping!!!');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
      //  }
    //  }
   // });
    },
};
