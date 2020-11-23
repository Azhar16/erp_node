var DEPAPP ={
	initDA: function () {
        $('#frmdepapp').unbind("submit").submit(function(e) {
            e.preventDefault();
            DEPAPP.submitDepreciationFrm();
        });
        $('.btn-p-OS-g').click(function(e) {
            DEPAPP.depappList();
        });
        DEPAPP.depappList();
    },
    depappList:function(){
        $.get("/asset/depapp/getdepreciation/"+$("#year").val(), function (data) {
            var dapp = JSON.parse(data);
            DEPAPP.depAppAddField(dapp,function(stat){
            });
        });
    },
    depAppAddField: function (dapp,cb) {
        var htm="";
        $('.s-ob-s').html("");
        for(var k in dapp) {
            var bg='31414a';
            if(k%2==0)
                bg='38464e';
            htm += '<div class="col-md-12 clsfld" data-acc="'+dapp[k].id+'" style="padding: 10px;background-color: #'+bg+';">';
            htm += '<div class="form-group col-md-6" style="float:left;margin: 0px;">';
            htm += dapp[k].name;
            htm += ' </div>';
            htm += ' <div class="form-group col-md-3" style="float:left;margin: 0px;">';
            htm += ' <input type="number" class="form-control clsfldamtd" placeholder="Amount" value="'+dapp[k].incometax+'" style="text-align: right;">';
            htm += '</div>';
            htm += ' <div class="form-group col-md-3" style="float:left;margin: 0px;">';
            htm += ' <input type="number" class="form-control clsfldamtc" placeholder="Amount" value="'+dapp[k].companyact+'" style="text-align: right;">';
            htm += '</div>';
            htm += '<div style="clear:both;"></div></div>';
        }
   // }
        $('.s-ob-s').append(htm);
        return cb("ok");
    },
    submitDepreciationFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var data = {type:$("#type").val(),data:[]};
        var doc = $(".clsfld");
        doc.each(function(  ) {
            var d=0,c=0;
            if($( this ).find(".clsfldamtd").val()!='')d=$( this ).find(".clsfldamtd").val();
            if($( this ).find(".clsfldamtc").val()!='')c=$( this ).find(".clsfldamtc").val();
           data.data.push({id:$( this ).attr("data-acc"),d:d,c:c}) 
        });
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/asset/depapp/dpreciationsave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    COMMON.shownotification('success','Depreciation Value Update successfully!!!');
                } else {
                    COMMON.shownotification('error','Unable to update Depreciation Value !!!');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
}