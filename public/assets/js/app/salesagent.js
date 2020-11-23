var SALESAGENT = {
    initSA:function(){
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "/salesagent/ajaxget",
                type: 'POST',
                data: function (d) {
                    setTimeout(SALESAGENT.initButton, 1000);
                }
            }
        });
        $(".su-l-cn").on("click",function(e){
            $('#mainContent').html("<div class='loading'></div>");
            $.get("/salesagent/new", function (data) {
                $('#mainContent').html(data);
            });
        });
        SALESAGENT.initButton();
        COMMON.getUserRole();
    },
    initButton:function(){
        COMMON.getUserRole();
        $(".s-l-e").on("click", function (e) {
            var id=$(this).attr('data-id');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('/salesagent/edit/'+id , function (data) {
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
                $.get('/salesagent/delete/'+cid, function (data) {
                    $('#datatable').DataTable().ajax.reload(null, false);
                    COMMON.shownotification('error', 'Sales Agent deleted successfully!!!');
                });
            });

        });
    },
    initSAN:function(){
        COMMON.getUserRole();
        $('#frmSUNew').parsley();
        $('#frmSUNew').submit(function(e) {
            e.preventDefault();
            if ( $(this).parsley().isValid() ) {
                SALESAGENT.submitSANewFrm();
            }
        });
        $(".su-n-b").on("click",function(e){
            $('#mainContent').html("<div class='loading'></div>");
            $.get("/salesagent", function (data) {
                $('#mainContent').html(data);
            });
        });
    },
    submitSANewFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var data = {name:$("#name").val(),display_name:$("#display_name").val(),ph:$("#ph").val(),email:$("#email").val(),sid:$("#sid").val()};
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/salesagent/save',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("/salesagent", function (data) {
                        $('#mainContent').html(data);
                        var msg='';
                        if($("#sid").val()!=='undefined')msg='Sales Agent updated successfully!!!';
                        else msg='Sales Agent created successfully!!!';
                        COMMON.shownotification('success',msg);
                    });
                } else {
                    COMMON.shownotification('error','Unable to save sales Agent!!!');
                    $(".loginmessage").html('');
                }
                $("body").css('cursor', 'default');
            },
        });
    },
};