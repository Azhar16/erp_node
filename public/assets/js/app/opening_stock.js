var OPENINGSTOCK ={
	initOS: function () {
        $('#frmdepapp').unbind("submit").submit(function(e) {
            e.preventDefault();
            OPENINGSTOCK.submitOSFrm();
        });
        $('.btn-p-OS-g').click(function(e) {
            OPENINGSTOCK.OSList();
        });
        OPENINGSTOCK.OSList();
    },
    OSList:function(){
        $.get("/product/opening_stock/getOpeningStock/"+$("#category").val(), function (data) {
            var dapp = JSON.parse(data);
            OPENINGSTOCK.OSAddField(dapp,function(stat){
               
            });
        });
    },
    OSAddField: function (dapp,cb) {
        var htm="";
        $('.s-ob-s').html("");
        for(var k in dapp) {
            var bg='31414a';
            if(k%2==0)
                bg='38464e';
            htm += '<div class="col-md-12 clsfld" data-acc="'+dapp[k].id+'" data-ocq="'+dapp[k].current_stock+'" data-oq="'+dapp[k].quantity+'" style="padding: 10px;background-color: #'+bg+';">';
            htm += '<div class="form-group col-md-6" style="float:left;margin: 0px;">';
            htm += dapp[k].specification+' '+dapp[k].code;
            htm += ' </div>';
            htm += ' <div class="form-group col-md-3" style="float:left;margin: 0px;">';
            htm += ' <input type="number" class="form-control clsfldamtd" placeholder="Amount" value="'+dapp[k].rate+'" style="text-align: right;">';
            htm += '</div>';
            htm += ' <div class="form-group col-md-3" style="float:left;margin: 0px;">';
            htm += ' <input type="number" class="form-control clsfldamtc" placeholder="Amount" value="'+dapp[k].quantity+'" style="text-align: right;">';
            htm += '</div>';
            htm += '<div style="clear:both;"></div></div>';
        }
   // }
        $('.s-ob-s').append(htm);
        return cb("ok");
    },
    submitOSFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var data = {category:$("#category").val(),data:[]};
        var doc = $(".clsfld");
        doc.each(function(  ) {
            var d=0,c=0;
            if($( this ).find(".clsfldamtd").val()!='')d=$( this ).find(".clsfldamtd").val();
            if($( this ).find(".clsfldamtc").val()!='')c=$( this ).find(".clsfldamtc").val();
            if($( this ).attr("data-ocq") != '')ocq=$( this ).attr("data-ocq");
            if($( this ).attr("data-oq") != '')oq=$( this ).attr("data-oq");
           data.data.push({id:$( this ).attr("data-acc"),d:d,c:c,ocq:ocq,oq:oq}) 
        });
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/product/opening_stock/openingStocksave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    COMMON.shownotification('success','Opening Stock Update successfully!!!');
                } else {
                    COMMON.shownotification('error','Unable to update Opening Stock Value !!!');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
}