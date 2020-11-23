var COMPONENT = {
    initL: function () {
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "product/componentcategory/ajaxget",
                type: 'POST',
                data: function (d) {
                    setTimeout(COMPONENT.initButton, 1000);
                }
            }
        });
        $(".c-l-cn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("product/componentcategory/new", function (data) {
                $('#mainContent').html(data);
            });
        });
        COMPONENT.initButton();
        COMMON.getUserRole();
    },
    initButton:function(){
        COMMON.getUserRole();
        $(".s-l-e").on("click", function (e) {
            var id=$(this).attr('data-id');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('/product/componentcategory/edit/'+id, function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-sc").on("click", function (e) {
        $('#mainContent').html("<div class='loading'></div>");
        $.get('/product/componentcategory/csubname/' + $(this).attr('data-id'), function (data) {
            $('#mainContent').html(data);
        });
        });
        $(".s-l-dv").on("click", function (e) {
            $.get('/product/componentcategory/docview/' + $(this).attr('data-id'), function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-m").on("click", function (e) {
        $('#mainContent').html("<div class='loading'></div>");
        $.get('product/componentcategory/material/' + $(this).attr('data-id'), function (data) {
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
                $.get('/product/componentcategory/delete/'+cid, function (data) {
                    $('#datatable').DataTable().ajax.reload(null, false);
                    COMMON.shownotification('error', 'Component category deleted successfully!!!');
                });
            });

        });
    },
    initCCN: function () {
        $('#frmCNew').parsley();
        $('#frmCNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                COMPONENT.submitCCNewFrm();
            }
        });
        $(".c-n-b").on("click", function (e) {
            location.reload();
        });
    },

    initSL: function () {
        var csid = $('#csid').val();
    	$('#datatable').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "product/componentcategory/ajaxsubnameget/"+csid,
                type: 'POST',
                data: function (d) {
                    setTimeout(COMPONENT.initSubButton, 1000);
                }
            }
        });
        $(".c-l-back").on("click", function (e) {
            location.reload();
        });
        $(".c-l-cn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("product/componentcategory/subnew/" + csid, function (data) {
                $('#mainContent').html(data);
            });
        });
        COMPONENT.initSubButton();
        COMMON.getUserRole();

    },
    initSubButton:function(){
        COMMON.getUserRole();
        $(".s-l-sce").on("click", function (e) {
            var id=$(this).attr('data-id');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('product/componentcategory/subedit/'+id, function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-scd").on("click", function (e) {
            var id=$(this).attr('data-id');
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
                $.get('product/componentcategory/subdelete/'+id, function (data) {
                    $('#datatable').DataTable().ajax.reload(null, false);
                    COMMON.shownotification('error', 'Component sub category deleted successfully!!!');
                });
            });

        });
    },
    initCSN: function () {
        $('#frmCNew').parsley();
        $('#frmCNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                COMPONENT.submitSubNewFrm();
            }
        });
        $(".c-n-b").on("click", function (e) {
            var cid = $("#cid").val();
            $('#mainContent').html("<div class='loading'></div>");
            $.get("product/componentcategory/csubname/" + cid, function (data) {
                $('#mainContent').html(data);
            });
        });
    },
    initML:function () {
        var psid = $('#psid').val();
        $('#datatable1').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "product/componentcategory/ajaxmaterialget/"+ psid,
                type: 'POST',
                data: function (d) {
                    setTimeout(COMPONENT.initmaterialButton, 1000);
                }
            }
        });
        $(".c-n-b").on("click", function (e) {
            location.reload();
        });
        $(".s-l-mn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("product/componentcategory/materialnew/"+psid, function (data) {
                $('#mainContent').html(data);
            });
        });
        COMPONENT.initmaterialButton();
        COMMON.getUserRole();
        

        
    },
    initmaterialButton:function(){
        COMMON.getUserRole();
        $(".s-l-me").on("click", function (e) {
            var id=$(this).attr('data-id');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('product/componentcategory/materialedit/'+id, function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-md").on("click", function (e) {
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
                $.get('product/componentcategory/materialdelete/'+cid, function (data) {
                    //$('#datatable').DataTable().ajax.reload();
                    $('#datatable1').DataTable().ajax.reload(null, false);
                    COMMON.shownotification('error', 'Material deleted successfully!!!');
                });
            });

        });
    },
    initMN: function () {
        $('#frmCNew').parsley();
        $('#frmCNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                COMPONENT.submitMNNnewFrm();
            }
        });
        $(".c-n-b").on("click", function (e) {
            var psid = $('#psid').val();
             $('#mainContent').html("<div class='loading'></div>");
            $.get("product/componentcategory/material/"+psid, function (data) {
                $('#mainContent').html(data);
            });
        });
    },
    submitSubNewFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var cid = $("#cid").val();
        var data = {
        	component_subname: $("#component_subname").val(),
            cid: cid,
            sid: $("#sid").val()};
        //console.log(data);
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'product/componentcategory/subsave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                  
                        $('#mainContent').html("<div class='loading'></div>");
                        $.get("product/componentcategory/csubname/" + cid, function (data) {
                            $('#mainContent').html(data);

                        });
           
                    var msg = '';
                    if ($("#cid").val() !== 'undefined')
                        msg = 'Component Sub Name updated successfully!!!';
                    else
                        msg = 'Component Sub Name created successfully!!!';
                    COMMON.shownotification('success', msg);
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
    
            },
        });
    },

    submitCCNewFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var cmpntdoc = $('#component_doc').val();
        var data = {
        	component_name: $("#component_name").val(),
            component_category: $("#component_category").val(),
            drawing_no:$("#drawing_no").val(),
        	cid: $("#cid").val(),
        	sid: $("#sid").val()
        }
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'product/componentcategory/save',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code > 0) {
                      if(cmpntdoc != ''){
                          console.log("cmpntdoc "+cmpntdoc);
                      COMPONENT.submitCCdocNewFrm(res.code);
                      }
                        $('#mainContent').html("<div class='loading'></div>");
                        $.get("product/componentcategory", function (data) {
                            $('#mainContent').html(data);

                        });
           
                    var msg = '';
                    if ($("#cid").val() !== 'undefined')
                        msg = 'Component Name updated successfully!!!';
                    else
                        msg = 'Component Name created successfully!!!';
                    COMMON.shownotification('success', msg);
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
    initCCDV :function(){
        COMMON.getUserRole();
      $('#frmSNew').parsley();
      var sid = $("#sid").val();
        $('#frmSNew').unbind("submit").submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                COMPONENT.submitCCdocNewFrm(sid);
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
                $.get('/product/componentcategory/docdelete/' + cid, function (data) {
                    $.get("/product/componentcategory", function (data) {
                        $('#mainContent').html(data);
                        COMMON.shownotification('error', 'Document deleted successfully!!!');
                    });
                    
                });
            });

        });
    },
   submitCCdocNewFrm: function (id) {
        $("body").css('cursor', 'wait');
        var files = $('#component_doc').get(0).files[0];
        var formData = new FormData();
        formData.append('componentid',id);
        formData.append('ocomponent_doc',$("#ocomponent_doc").val());
        formData.append('imgid',$("#imgid").val());
        if(typeof (files)==='undefined')
            formData.append('component_doc','');
        else
            formData.append('component_doc',files,files.name); 
        
        //console.log(formData);

        $.ajax({
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            url: '/product/componentcategory/savedocument',
            complete: function (xhr) {
                 var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    $.get("/product/componentcategory", function (data) {
                        $('#mainContent').html(data);
                        var msg='';
                        if(id!=='undefined')msg='Document updated successfully!!!';
                        else msg='Document created successfully!!!';
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
    submitMNNnewFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var psid = $("#psid").val()
        var data = {
            material_name: $("#material_name").val(),
            material_code: $("#material_code").val(),
            material_short_code: $("#material_short_code").val(),
            material_showing_status: $("#material_showing_status").val(),
            psid:psid,
            pisid: $("#pisid").val(),
        }
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'product/componentcategory/materialsave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                  
                        $('#mainContent').html("<div class='loading'></div>");
                        $.get("product/componentcategory/material/"+psid, function (data) {
                            $('#mainContent').html(data);

                        });
           
                    var msg = '';
                    if ($("#pisid").val() !== 'undefined')
                        msg = 'Material updated successfully!!!';
                    else
                        msg = 'Material created successfully!!!';
                    COMMON.shownotification('success', msg);
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
};