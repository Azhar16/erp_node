var USER={
    userDefaultRole:{},
    initl:function(){
        $('#datatable').DataTable();
        COMMON.getUserRole();
        /*$(".select2").select2();
        var table = $('#datatable').DataTable({
         dom: 'lrtip',
        initComplete: function () {
          this.api().columns([1]).every( function () {
            var column = this;
            console.log(column);
            var select = $("#nameFltr"); 
            column.data().unique().sort().each( function ( d, j ) {
              select.append( '<option value="'+d+'">'+d+'</option>' )
            } );
          } );
           this.api().columns([2]).every( function () {
            var column = this;
            console.log(column);
            var select = $("#phnoFltr"); 
            column.data().unique().sort().each( function ( d, j ) {
              select.append( '<option value="'+d+'">'+d+'</option>' )
            } );
          } );
          //$("#nameFltr,#phnoFltr").material_select();
       }
    });
    
    $('#nameFltr').on('change', function(){
        var search = [];
      
      $.each($('#nameFltr option:selected'), function(){
            search.push($(this).val());
      });
      
      search = search.join('|');
      table.column(1).search(search, true, false).draw();  
    });
    
    $('#phnoFltr').on('change', function(){
        var search = [];
      
      $.each($('#phnoFltr option:selected'), function(){
            search.push($(this).val());
      });
      
      search = search.join('|');
      table.column(2).search(search, true, false).draw();
    });*/

        $(".b-u-e").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get('/configuration/user/edit/'+$(this).closest( "td" ).attr('data-id'), function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".b-u-d").on("click", function (e) {
            var cid=$(this).closest( "td" ).attr('data-id');
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
                $('#mainContent').html("<div class='loading'></div>");
                $.get('/configuration/user/delete/'+cid, function (data) {
                    $('#mainContent').html(data);
                    COMMON.shownotification('error','User deleted successfully!!!');
                });
            });
            
        });
        $(".b-u-ab").on("click", function (e) {
            var cid=$(this).closest( "td" ).attr('data-id');
            $('#mainContent').html("<div class='loading'></div>");
                $.get('/configuration/user/block/'+cid+"/"+$(this).attr('data-type'), function (data) {
                    $('#mainContent').html(data);
                    COMMON.shownotification('success','User status change successfully!!!');
                });
        });
        $(".b-u-c").on("click",function(e){
            $('#mainContent').html("<div class='loading'></div>");
            $.get("/configuration/user/new", function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".b-u-r").on("click",function(e){
            $('#mainContent').html("<div class='loading'></div>");
            $.get('/configuration/user/role/'+$(this).closest( "td" ).attr('data-id'), function (data) {
                $('#mainContent').html(data);
            });
        });
    },
    initf:function(){
        $('#frmCUser').parsley();
        $('#frmCUser').submit(function(e) {
            e.preventDefault();
            if ( $(this).parsley().isValid() ) {
                USER.submitUserFrm();
            }
        });
        $(".b-u-b").on("click",function(e){
            $('#mainContent').html("<div class='loading'></div>");
            $.get("/configuration/user", function (data) {
                $('#mainContent').html(data);
            });
        });
    },
    initsc:function(){
        $('#frmSCUser').submit(function(e) {
            e.preventDefault();
            USER.submitSwitchFrm();
        });
        $(".b-u-s-c-b").on("click",function(e){
            $('#mainContent').html("<div class='loading'></div>");
            $.get("/configuration/user", function (data) {
                $('#mainContent').html(data);
            });
        });
    },
    initR:function(uJson){
        console.log(uJson);
        USER.userDefaultRole=uJson;
        $('#frmSCUser').submit(function(e) {
            e.preventDefault();
            USER.submitUserroleFrm();
        });
        $(".s-n-bk").on("click", function (e) {
            location.reload();
        });
        $(".clsusrrole").change(function() {
            var ischecked= $(this).is(':checked');
            var lvl=$(this).attr("data-level"),lvl1=$(this).attr("data-lvl1"),lvl2=$(this).attr("data-lvl2"),lvl3=$(this).attr("data-lvl3");
            if(parseInt(lvl)==1){
                USER.userDefaultRole.modules[lvl1].permission=(!ischecked)?-1:1;
                if(USER.userDefaultRole.modules[lvl1].permission=(ischecked)){
                    console.log("ischecked");
                  // USER.userDefaultRole.modules[lvl1].submodule[lvl2].permission="1";
                  // USER.userDefaultRole.modules[lvl1].submodule[lvl2].item[lvl3]=(ischecked)?1:-1;
                }else{
                   console.log("!ischecked"); 
                }
                
            }else if(parseInt(lvl)==2){
                USER.userDefaultRole.modules[lvl1].submodule[lvl2].permission=(!ischecked)?-1:1;
            } else {
                USER.userDefaultRole.modules[lvl1].submodule[lvl2].item[lvl3]=(!ischecked)?-1:1;
            }

        });
        $(".usertype").change(function() {
            var ischecked= $(this).is(':checked');
              var usrtype = $(this).attr("data-usrtype");
                USER.userDefaultRole.user_type.name[usrtype]=(!ischecked)?-1:1;

        }); 
        /*$(".module-each-cls").click(function () {
          $('.module-sub-cls').attr('checked', this.checked);
       });
        $(".module-sub-cls").click(function(){

        if($(".module-sub-cls").length == $(".module-sub-cls:checked").length) {
            $(".module-sub-cls").attr("checked", "checked");
        } else {
            $(".module-each-cls").removeAttr("checked");
        }

    });*/
    },
    submitSwitchFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var data = {'company':$("#company").val()};
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/configuration/user/switchsave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    window.location.href='';
                } else {
                    $(".loginmessage").css('color','#f90000');
                    $(".loginmessage").html(res.msg);
                }
                $("body").css('cursor', 'default');
            },
        });
    },
    submitUserFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var files = $('#logo').get(0).files[0];
        var formData = new FormData();
        formData.append('name',$("#name").val());
        formData.append('ph',$("#ph").val());
        formData.append('password',$("#password").val());
        formData.append('uid',$("#uid").val());
        formData.append('address',$("#address").val());
        formData.append('email',$("#email").val());
        formData.append('ologo',$("#ologo").val());
        formData.append('id',$("#id").val());
        if(typeof (files)==='undefined')
            formData.append('logo','');
        else
            formData.append('logo',files,files.name);
        $.ajax({
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            url: '/configuration/user/newsave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("/user", function (data) {
                        $('#mainContent').html(data);
                        var msg='';
                        if($("#id").val()!=='undefined')msg='User updated successfully!!!';
                        else msg='User created successfully!!!';
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
    initLogin:function(){
        $('#loginForm').parsley();
        $('#loginForm').submit(function(e) {
            e.preventDefault();
            if ( $(this).parsley().isValid() ) {
                USER.submitLoginFrm();
            }
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
            url: '/configuration/user/logincheck',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    window.location.href = '/dashboard';
                } else {
                    $(".loginmessage").css('color','#f90000');
                    $(".loginmessage").html(res.msg);
                    $("body").css('cursor', 'default');
                }
            },
        });

    },
    submitUserroleFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        console.log(USER.userDefaultRole);
  

        //console.log(userrole);


        var data = {
            usertype:$("input[name='usertype']:checked"). val(),
            userid:$("#userid").val(),
            usrnewroll: USER.userDefaultRole,
            };
            
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/configuration/user/userrolesave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                   $('#mainContent').html("<div class='loading'></div>");
                    $.get("/user", function (data) {
                        $('#mainContent').html(data);
                        var msg='';
                        msg='User Type Defined successfully!!!';
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
};