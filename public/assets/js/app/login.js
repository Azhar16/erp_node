var LOGIN={

	initLogin:function(){
        $('#loginForm').parsley();
        $('#loginForm').submit(function(e) {
            e.preventDefault();
            if ( $(this).parsley().isValid() ) {
                LOGIN.submitLoginFrm();
            }
        });
     $("#sendMsg").on("click",function(e){
            

             $("body").css('cursor', 'wait');
                var data = {};
             data.to = $("#to").val();

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/login/sendMessage',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    var msg="";
                    //window.location.href='http://localhost:3000';
                    msg='Mail sent successfully!!!...';
                        COMMON.shownotification('success',msg);
                } else {
                    $(".loginmessage").css('color','#f90000');
                    $(".loginmessage").html(res.msg);
                }
                $("body").css('cursor', 'default');
            },
        });
        });
    },
    submitLoginFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Authenticating user. Please Wait...');
        var data = {};
        data.uid = $("#username").val();
        data.pwd = $("#password").val();
         $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/login/logincheck',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                   // COMMON.getUserRole();
                    window.location.href = '/dashboard';
                } else {
                    $(".loginmessage").css('color','#f90000');
                    $(".loginmessage").html(res.msg);
                    $("body").css('cursor', 'default');
                }
            },
        });

    },

};