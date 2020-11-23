var table,plan_item_id;
var PLAN = {
    initPL: function () {
       // $('#datatable').DataTable();
        $('#datatablepl').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "plan/plan/ajaxget",
                type: 'POST',
                data: function (d) {
                    setTimeout(PLAN.initButton, 1000);
                }
            }
        });
        $(".s-l-cn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("plan/plan/new", function (data) {
                $('#mainContent').html(data);
            });
        });
        PLAN.initButton();
        COMMON.getUserRole();
        
   },
   initButton:function(){
        $(".s-l-e").on("click", function (e) {
            var id=$(this).attr('data-id');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('plan/plan/edit/'+id, function (data) {
                $('#mainContent').html(data);
            });
        });
         $(".s-l-sc").on("click", function (e) {
        $('#mainContent').html("<div class='loading'></div>");
        $.get('plan/plan/monthlyplansheet/' + $(this).attr('data-id'), function (data) {
            $('#mainContent').html(data);
        });
        });
        /*$(".s-l-v").on("click", function (e) {
        $('#mainContent').html("<div class='loading'></div>");
        $.get('/workorder/techno_commercial/' + $(this).attr('data-id'), function (data) {
            $('#mainContent').html(data);
        });
        });
        $(".s-l-di").on("click", function (e) {
        $('#mainContent').html("<div class='loading'></div>");
        $.get('/workorder/despatch_insurance/' + $(this).attr('data-id'), function (data) {
            $('#mainContent').html(data);
        });
        });
        $(".s-l-sc").on("click", function (e) {
        $('#mainContent').html("<div class='loading'></div>");
        $.get('/workorder/commercial/' + $(this).attr('data-id'), function (data) {
            $('#mainContent').html(data);
        });
        });*/
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
                $.get('plan/plan/delete/'+cid, function (data) {
                    $('#datatablepl').DataTable().ajax.reload(null, false);
                    COMMON.shownotification('error', 'Plan deleted successfully!!!');
                });
            });

        });
    },

    initPN: function () {

        //$("#salesagent").select2();
        $('#frmSNew').parsley();
        $('#frmSNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                PLAN.submitPNewFrm();
            }
        });
        $(".s-n-bk").on("click", function (e) {
            location.reload();
        });
    },
  
    initMPSL: function () {
        //$('#datatable').DataTable();
        $(".select2").select2();
        table=$('#datatable').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "plan/plan/ajaxmonthsheet",
                type: 'POST',
                data: function (d) {
                    //setTimeout(PLAN.initButton, 1000);
                }
            },

           dom: 'lrtip',
        initComplete: function () {
            this.api().columns([1]).every( function () {
            var column = this;
            console.log(column);
            var select = $("#srlFltr"); 
            column.data().unique().sort().each( function ( d, j ) {
                console.log("abc1 "+d);
              select.append( '<option value="'+d+'">'+d+'</option>' )
            });
          });
            this.api().columns([2]).every( function () {
            var column = this;
            console.log(column);
            var select = $("#woFltr"); 
            column.data().unique().sort().each( function ( d, j ) {
                console.log("abc2 "+d);
              select.append( '<option value="'+d+'">'+d+'</option>' )
            });
          });
        }
    });
           /* this.api().columns([3]).every( function () {
            var column = this;
            console.log(column);
            var select = $("#cusFltr"); 
            column.data().unique().sort().each( function ( d, j ) {
              select.append( '<option value="'+d+'">'+d+'</option>' )
            } );
          } );
            this.api().columns([4]).every( function () {
            var column = this;
            console.log(column);
            var select = $("#sizeFltr"); 
            column.data().unique().sort().each( function ( d, j ) {
              select.append( '<option value="'+d+'">'+d+'</option>' )
            } );
          } );
            this.api().columns([5]).every( function () {
            var column = this;
            console.log(column);
            var select = $("#mocFltr"); 
            column.data().unique().sort().each( function ( d, j ) {
              select.append( '<option value="'+d+'">'+d+'</option>' )
            } );
          } );
            this.api().columns([6]).every( function () {
            var column = this;
            console.log(column);
            var select = $("#trimFltr"); 
            column.data().unique().sort().each( function ( d, j ) {
              select.append( '<option value="'+d+'">'+d+'</option>' )
            } );
          } );
          this.api().columns([7]).every( function () {
            var column = this;
            console.log(column);
            var select = $("#endsFltr"); 
            column.data().unique().sort().each( function ( d, j ) {
              select.append( '<option value="'+d+'">'+d+'</option>' )
            } );
          } );
           this.api().columns([8]).every( function () {
            var column = this;
            console.log(column);
            var select = $("#cddFltr"); 
            column.data().unique().sort().each( function ( d, j ) {
              select.append( '<option value="'+d+'">'+d+'</option>' )
            } );
          } );
           this.api().columns([9]).every( function () {
            var column = this;
            console.log(column);
            var select = $("#odrFltr"); 
            column.data().unique().sort().each( function ( d, j ) {
              select.append( '<option value="'+d+'">'+d+'</option>' )
            } );
          } );
           this.api().columns([10]).every( function () {
            var column = this;
            console.log(column);
            var select = $("#plndFltr"); 
            column.data().unique().sort().each( function ( d, j ) {
              select.append( '<option value="'+d+'">'+d+'</option>' )
            } );
          } );
           this.api().columns([11]).every( function () {
            var column = this;
            console.log(column);
            var select = $("#balaFltr"); 
            column.data().unique().sort().each( function ( d, j ) {
              select.append( '<option value="'+d+'">'+d+'</option>' )
            } );
          } );*/
          //$("#nameFltr,#phnoFltr").material_select();
       //}

       // });
     $('#srlFltr').on('change', function(){
        var search = [];
        console.log('avc');
      
      $.each($('#srlFltr option:selected'), function(){
            search.push($(this).val());
            console.log("avc1 "+$(this).val());
      });
      
      search = search.join('|');
      table.column(1).search(search, true, false).draw();
      //console.log(table.column(1));
    });
     $('#woFltr').on('change', function(){
        var search = [];
      
      $.each($('#woFltr option:selected'), function(){
            search.push($(this).val());
      });
      
      search = search.join('|');
      table.column(2).search(search, true, false).draw();

    });
     /*$('#cusFltr').on('change', function(){
        var search = [];
      
      $.each($('#cusFltr option:selected'), function(){
            search.push($(this).val());
      });
      
      search = search.join('|');
      table.column(3).search(search, true, false).draw();
    });
     $('#sizeFltr').on('change', function(){
        var search = [];
      
      $.each($('#sizeFltr option:selected'), function(){
            search.push($(this).val());
      });
      
      search = search.join('|');
      table.column(4).search(search, true, false).draw();
    });
     $('#mocFltr').on('change', function(){
        var search = [];
      
      $.each($('#mocFltr option:selected'), function(){
            search.push($(this).val());
      });
      
      search = search.join('|');
      table.column(5).search(search, true, false).draw();
    });
     $('#trimFltr').on('change', function(){
        var search = [];
      
      $.each($('#trimFltr option:selected'), function(){
            search.push($(this).val());
      });
      
      search = search.join('|');
      table.column(6).search(search, true, false).draw();
    });
     $('#endsFltr').on('change', function(){
        var search = [];
      
      $.each($('#endsFltr option:selected'), function(){
            search.push($(this).val());
      });
      
      search = search.join('|');
      table.column(7).search(search, true, false).draw();
    });
     $('#cddFltr').on('change', function(){
        var search = [];
      
      $.each($('#cddFltr option:selected'), function(){
            search.push($(this).val());
      });
      
      search = search.join('|');
      table.column(8).search(search, true, false).draw();
    });
     $('#odrFltr').on('change', function(){
        var search = [];
      
      $.each($('#odrFltr option:selected'), function(){
            search.push($(this).val());
      });
      
      search = search.join('|');
      table.column(9).search(search, true, false).draw();
    });


     $('#plndFltr').on('change', function(){
        var search = [];
      
      $.each($('#plndFltr option:selected'), function(){
            search.push($(this).val());
      });
      
      search = search.join('|');
      table.column(10).search(search, true, false).draw();  
    });
    
    $('#balaFltr').on('change', function(){
        var search = [];
      
      $.each($('#balaFltr option:selected'), function(){
            search.push($(this).val());
      });
      
      search = search.join('|');
      table.column(11).search(search, true, false).draw();
    });*/

     
    // PLAN.initComplete();

        $('#datatable tbody').on('click', '.monthlyplansheet-cls', function() {
       // $('#checkbox1').change(function() {
        plan_item_id = $(this).attr('data-pid');
        var trowid = $(this).attr('data-trowid');
        if($(this).is(":checked")) {
            console.log("qwerty")
              

              var wo = $(this).attr('data-wo');
              var oqnty = $(this).attr('data-oqnty');
              var woid = $(this).attr('data-id');
              var item = $(this).attr('data-item');
              var bala = $(this).attr('data-bal');
              
              var planid = $('#planid').val();
              var planedqnty = $(this).attr('data-planed');
              console.log('bala '+oqnty);
              var planedqnty2;
            if(planedqnty == 0){
                planedqnty2 = $(this).attr('data-oqnty');
            } else {
                planedqnty2 = $(this).attr('data-bal');
            }
              


                var htm = '<div class="data-row-wrap d-r-c'+trowid+'" data-id="'+trowid+'" data-bal="'+bala+'" data-planed="'+planedqnty+'">';
                htm += '<div class="col-md-3" style="float: left;">';
                htm += '<input type="text" placeholder="Enter Id" class="form-control i-r-pitemid" readonly="" value="'+plan_item_id+'"/>';
                htm += '</div>';
                htm += '<div class="col-md-6" style="float: left;">';
                htm += '<input type="text" class="form-control i-r-wono" placeholder="Enter Pick Id" readonly="" value="'+wo+'">';
                htm += '</div>';
                htm += '<div class="col-md-3" style="float: left;">';
                htm += '<input type="number" step=".01" class="form-control i-r-oqnty" placeholder="Quantity" value="'+planedqnty2+'">';
                htm += '</div>';
                htm += '<div  style="float: left;">';
                htm += '<input type="hidden"  class="form-control i-r-woid"  value="'+woid+'">';
                htm += '</div>';
                htm += '<div  style="float: left;">';
                htm += '<input type="hidden"  class="form-control i-r-item"  value="'+item+'">';
                htm += '</div>';
                htm += '<div  style="float: left;">';
                htm += '<input type="hidden"  class="form-control i-r-planid"  value="'+planid+'">';
                htm += '</div>';
                htm += '</div>';
                $(".item-wrapper").append(htm);

        }

        else{
            $( ".d-r-c"+trowid ).each(function( i ) {
                    $(this).closest(".data-row-wrap").remove();
            });
        }
       /* $(".i-r-del").on("click", function (e) {

            var data = {

            woid : $('.data-row-wrap').find('.i-r-woid').val(),
            pitem : $('.data-row-wrap').find('.i-r-item').val(),
            planid : $('.data-row-wrap').find('.i-r-planid').val()

        };
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
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/plan/monthlyplansheetdelete',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
               if (res.code == 1) {
                table.ajax.reload();
                    COMMON.shownotification('success','Monthly Plan sheet Deleted successfully!!!');
                } else {
                    COMMON.shownotification('error','Unable to delete Monthly Plan sheet!!!');
                    $(".loginmessage").html('');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    });
            
            
            $( this ).closest( ".data-row-wrap" ).remove();
            
        });*/
    });
      $( ".data-row-wrap-history" ).each(function( i ) {
       var historyid =  $(this).attr('data-id');
       var _this=this;
       $(".i-r-del-history"+historyid).on("click", function (e) {
            var data = {
            id : $(_this).attr('data-id'),
            woid : $(_this).find('.i-r-planwoid-history').val(),
            pitem : $(_this).find('.i-r-planitem-history').val(),
            planid : $(_this).find('.i-r-planhisid-history').val(),
            balance: $(_this).attr('data-balance'),
            planed: $(_this).attr('data-planed'),
            newplan_qnty : $(_this).find('.i-r-oqnty-history').val(),

        };

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
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'plan/plan/monthlyplansheetdelete',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
               if (res.code == 1) {
                table.ajax.reload();
                    $( _this ).closest( ".data-row-wrap-history" ).remove();
                    COMMON.shownotification('success','Monthly Plan sheet Deleted successfully!!!');
                } else {
                    COMMON.shownotification('error','Unable to delete Monthly Plan sheet!!!');
                    $(".loginmessage").html('');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
      });
    });
  });

      $( ".data-row-wrap-history" ).each(function( i ) {
       var historyeditid =  $(this).attr('data-id');
       var _this=this;
       //console.log("dpid "+historyid);
       $(".i-r-edit-history"+historyeditid).on("click", function (e) {
           //console.log("ff "+$(_this).attr('data-id'));

            var data = {
            id : $(_this).attr('data-id'),
            qnty: $(_this).attr('data-qnty'),
            oqnty: $(_this).attr('data-plnqnty'),
            balance: $(_this).attr('data-balance'),
            planed: $(_this).attr('data-planed'),
            newplan_qnty : $(_this).find('.i-r-oqnty-history').val(),
            woid : $(_this).find('.i-r-planwoid-history').val(),
            pitem : $(_this).find('.i-r-planitem-history').val(),
            planid : $(_this).find('.i-r-planhisid-history').val(),

        };
        //console.log("dataitem "+data.pitem);
        //console.log("datawo "+data.woid);
        //console.log("dataplan "+data.planid);
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'plan/plan/monthlyplansheetedit',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
               if (res.code == 1) {
                //table.ajax.reload();
                $('#mainContent').html("<div class='loading'></div>");
                    $.get("plan/plan", function (data) {
                        $('#mainContent').html(data);
                        COMMON.shownotification('success','Monthly Chosed Plan sheet updated successfully!!!');
            
                    });
                    
                }
                else if(res.code == 2){
                      var msg = '';
                         msg = 'planed quantity must be less than balanced quantity !!!';
                        COMMON.shownotification('error', msg);
                } else {
                    COMMON.shownotification('error','Unable to update Monthly Plan sheet!!!');
                    $(".loginmessage").html('');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
            
        });
   });


       /*$('.plan-history').each(function() {
        console.log("abbbc");
                 var term = $('#planid').val();
                 var _this = this;

                $.ajax({
                    url: "/plan/getplanhistory/" + term,
                    dataType: "jsonp",
                    type: "GET",
                    complete: function (data) {
                        var jdata=JSON.parse(data.responseText);
                        console.log("ss "+jdata.quantity);
                        Object.keys(jdata).forEach(function (key){
                            console.log("aaa "+jdata[key].quantity);
                           var htm = '<div class="data-row-wrap" >';
                            htm += '<div class="col-md-2" style="float: left;">';
                            htm += '<input type="text" placeholder="Enter Id" class="form-control i-r-pitemid-history" readonly="" value=""/>';
                            htm += '</div>';
                            htm += '<div class="col-md-5" style="float: left;">';
                            htm += '<input type="text" class="form-control i-r-wono-history" placeholder="Enter Pick Id" readonly="" value="">';
                            htm += '</div>';
                            htm += '<div class="col-md-3" style="float: left;">';
                            htm += '<input type="number" step=".01" class="form-control i-r-oqnty-history" placeholder="Quantity" value="">';
                            htm += '</div>';
                            htm += '<div class="col-md-2" style="float: left;">';
                            htm += '<a class="btn btn-icon waves-effect waves-light btn-danger m-b-5 i-r-del-history"> <i class="fa fa-remove"></i> </a>';
                            htm += '</div>';
                                $(_this).find('.item-history-wrapper').append(htm);

                          });
                    }
                   
                });
          });*/
     

        $('#frmSNew').parsley();
        $('#frmSNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                PLAN.submitMPSLNewFrm();
            }
        });
        $(".s-n-bk").on("click", function (e) {
            location.reload();
        });
      

    },

    
    submitPNewFrm: function(){
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        

        var data = {
            plan_no: $("#plan_no").val(),
            period_begin: $("#period_begin").val(),
            period_end: $("#period_end").val(),
            plan_month: $("#plan_month").val(),
            plan_year : $("#plan_year").val(),
            preference: $("#preference").val(),

            planid : $("#planid").val(),


        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'plan/plan/save',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
               if (res.code > 0) {
                   $('#mainContent').html("<div class='loading'></div>");
                    $.get("plan/plan", function (data) {
                        
                        $('#mainContent').html(data);
                        var msg = '';
                        if ($("#planid").val() !== 'undefined')
                            msg = 'Plan updated successfully!!!';
                        else
                            msg = 'Plan created successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                }  else {
                    COMMON.shownotification('error', 'Unable to save Plan!!!');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });


    },
    submitMPSLNewFrm: function(){
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        
        var itm=[];
        $( ".data-row-wrap" ).each(function( i ) {
             var balance = parseInt($(this).attr('data-bal'));
             var planed =  parseInt($(this).attr('data-planed'));
             var qnty =  $(this).find('.i-r-oqnty').val().trim();
             var finalqnty = parseInt(qnty) + parseInt(planed);
             var finalbal = (balance - qnty);
             var plan_item_id = $(this).find('.i-r-pitemid').val().trim(), wo = $(this).find('.i-r-wono').val().trim(),  woid = $(this).find('.i-r-woid').val().trim(),pitem = $(this).find('.i-r-item').val().trim(),planid = $(this).find('.i-r-planid').val().trim();
              
               itm.push({balance:balance,finalbal:finalbal,plan_item_id: plan_item_id, wo: wo, finalqnty:finalqnty,qnty:qnty,woid:woid,pitem:pitem,planid:planid});

            });
        
        

        var data = {
            pid: $("#planid").val(),
            item:itm,

        };
       // console.log("pquantity "+data.itm.finalqnty);

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'plan/plan/monthlyplansheetsave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
               if (res.code == 2) {
                $('#mainContent').html("<div class='loading'></div>");
                    $.get("plan/plan", function (data) {
                        
                        $('#mainContent').html(data);
                        var msg = '';
                         msg = 'Monthly Plan sheet created successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                }
                else if(res.code == 3){
                      var msg = '';
                         msg = 'planed quantity must be less than balanced quantity !!!';
                        COMMON.shownotification('error', msg);
                }
                else if(res.code == 1){                     
                        $('#mainContent').html("<div class='loading'></div>");
                        $.get("plan/plan", function (data) {
                        $('#mainContent').html(data);
                        var msg = '';
                         msg = 'Monthly Plan sheet updated successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                }
                  else {
                    COMMON.shownotification('error','Unable to update Monthly Plan sheet!!!');
                    $(".loginmessage").html('');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });


    },
    



};        