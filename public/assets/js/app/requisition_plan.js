var RPLAN = {
    initRPL: function () {
        $('#frmSNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                RPLAN.submitRNewFrm();
            }
        });


    },
    submitRNewFrm:function(){
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var itm=[];
        $( ".data-row-wrap" ).each(function( i ) {
            var id = parseInt($(this).attr('data-id'));
            //console.log("isd "+id);
            if(id>0){
            if($(this).find(".requisitionplan-cls").is(":checked")) {
                console.log("avc "+$(this).find('.i-r-qnty').val().trim());
                var planid = parseInt($(this).attr('data-planid')),prod= parseInt($(this).attr('data-itemid')),rawprod = parseInt($(this).attr('data-rawid')),qnty = $(this).find('.i-r-qnty').val().trim();
                itm.push({planid:planid,prod:prod,rawprod:rawprod,qnty:qnty});
            }
        }
        });
        var data={
            itm:itm,
        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/plan/requisition_plan/send',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
               if (res.code > 0) {
                $('#mainContent').html("<div class='loading'></div>");
                    $.get("plan/requisition_plan", function (data) {
                        
                        $('#mainContent').html(data);
                        var msg = '';
                         msg = 'Plan Send successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                }
                  else {
                    COMMON.shownotification('error','Unable to send plan!!!');
                    $(".loginmessage").html('');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
    
    
};