var Transport = {
    
    initNew:function(){
        COMMON.getUserRole();
        $('#frmCNew').parsley();
        $('#frmCNew').submit(function(e) {
            e.preventDefault();
            if ( $(this).parsley().isValid() ) {
                Transport.submitNewFrm();
            }
        });
    },
    
    submitNewFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var data = {title:$("#title").val(),
            manner:$("#manner").val(),
            transporter_name:$("#transporter_name").val(),
            vechicle_no:$("#vechicle_no").val(),
            cn_no:$("#cn_no").val()};
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/transport/save',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    //$('#mainContent').html("<div class='loading'></div>");
                    //$.get("/customer", function (data) {
                    //    $('#mainContent').html(data);
                        var msg='';
                        if($("#cid").val()!=='undefined')msg='Transport updated successfully!!!';
                        else msg='Transport created successfully!!!';
                        COMMON.shownotification('success',msg);
                    //});
                } else {
                    COMMON.shownotification('error','Unable to save transport!!!');
                    
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
};