var ARATE ={
	initAR: function () {
        $('#frmarate').unbind("submit").submit(function(e) {
            e.preventDefault();
            ARATE.submitARateFrm();
        });
        $('.btn-p-OS-g').click(function(e) {
            ARATE.arateList();
        });
        ARATE.arateList();
    },
    arateList:function(){
        $.get("/asset/asset_rate/getAssetRate", function (data) {
            var arate = JSON.parse(data);
            if(arate != ''){
            ARATE.arateAddField(arate,function(stat){
               
            });
            }else{
                ARATE.arateAddBlankField();
            }
        });
    },
    arateAddField: function (arate,cb) {
        var htm="";
        $('.s-ob-s').html("");
        for(var k in arate) {
            var bg='31414a';
            if(k%2==0)
                bg='38464e';
            htm += '<div class="col-md-12 clsfld" data-acc="'+arate[k].id+'" style="padding: 10px;background-color: #'+bg+';">';
            htm += '<div class="form-group col-md-6 clsflife" style="float:left;margin: 0px;">';
            htm += arate[k].useful_life;
            htm += ' </div>';
            htm += ' <div class="form-group col-md-3" style="float:left;margin: 0px;">';
            htm += ' <input type="number" class="form-control clsfldamtd" step=".01" placeholder="WDV rate" value="'+arate[k].wdv.toFixed(2)+'" style="text-align: right;">';
            htm += '</div>';
            htm += ' <div class="form-group col-md-3" style="float:left;margin: 0px;">';
            htm += ' <input type="number" class="form-control clsfldamtc" step=".01" placeholder="SLM rate" value="'+arate[k].slm.toFixed(2)+'" style="text-align: right;">';
            htm += '</div>';
            htm += '<div style="clear:both;"></div></div>';
        }
   // }
        $('.s-ob-s').append(htm);
        return cb("ok");
    },
    arateAddBlankField: function () {
        var htm="";
        $('.s-ob-s').html("");
        for(var i = 1;i<=60;i++) {
            var bg='31414a';
            if(i%2==0)
                bg='38464e';
            htm += '<div class="col-md-12 clsfld" data-acc="" style="padding: 10px;background-color: #'+bg+';">';
            htm += '<div class="form-group col-md-6 clsflife" style="float:left;margin: 0px;">';
            htm += i;
            htm += ' </div>';
            htm += ' <div class="form-group col-md-3" style="float:left;margin: 0px;">';
            htm += ' <input type="number" class="form-control clsfldamtd" placeholder="Amount" style="text-align: right;">';
            htm += '</div>';
            htm += ' <div class="form-group col-md-3" style="float:left;margin: 0px;">';
            htm += ' <input type="number" class="form-control clsfldamtc" placeholder="Amount" style="text-align: right;">';
            htm += '</div>';
            htm += '<div style="clear:both;"></div></div>';
        }
   // }
        $('.s-ob-s').append(htm);
        //return cb("ok");
    },
    submitARateFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var data = {type:$("#type").val(),data:[]};
        var doc = $(".clsfld");
        doc.each(function(  ) {
            var d=0,c=0;
            if($( this ).find(".clsfldamtd").val()!='')c=$( this ).find(".clsfldamtd").val();
            if($( this ).find(".clsfldamtc").val()!='')d=$( this ).find(".clsfldamtc").val();
            if($( this ).find(".clsflife").html()!='')e=$( this ).find(".clsflife").html();
           data.data.push({id:$( this ).attr("data-acc"),c:c,d:d,e:e}) 
        });
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/asset/asset_rate/ratesave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    COMMON.shownotification('success','Asset Rate Update successfully!!!');
                } else {
                    COMMON.shownotification('error','Unable to update Asset Rate !!!');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
}