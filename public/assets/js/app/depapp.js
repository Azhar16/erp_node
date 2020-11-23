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
        $.get("/asset/depapp/getDepreciationRate/"+$("#assettype").val(), function (data) {
            var arate = JSON.parse(data);
            console.log("arate "+arate.length);
             console.log("arate1 "+arate[0].useful_life);
            if(arate.length > 1){
            DEPAPP.depAppAddField(arate,function(stat){
               
            });
            }else{
                DEPAPP.depAppAddBlankField(arate[0],function(stat){
               
            });
            }
        });
    },
    depAppAddField: function (arate,cb) {
        var htm="";
        $('.s-ob-s').html("");
        for(var k in arate) {
            var bg='31414a';
            if(k%2==0)
                bg='38464e';
            htm += '<div class="col-md-12 clsfld" data-depid="'+arate[k].depid+'" data-aid = "'+arate[k].id+'"  style="padding: 10px;background-color: #'+bg+';">';
            htm += '<div class="form-group col-md-6 clsflife" style="float:left;margin: 0px;">';
            htm += arate[k].deplife;
            htm += ' </div>';
            htm += ' <div class="form-group col-md-3" style="float:left;margin: 0px;">';
            htm += ' <input type="number" step=".01" class="form-control clsfldamtd" step=".01" placeholder="WDV rate" value="'+arate[k].income_tax.toFixed(2)+'" style="text-align: right;">';
            htm += '</div>';
            htm += ' <div class="form-group col-md-3" style="float:left;margin: 0px;">';
            htm += ' <input type="number" step=".01" class="form-control clsfldamtc" step=".01" placeholder="SLM rate" value="'+arate[k].company_act.toFixed(2)+'" style="text-align: right;">';
            htm += '</div>';
            htm += '<div style="clear:both;"></div></div>';
        }
   // }
        $('.s-ob-s').append(htm);
        return cb("ok");
    },
    depAppAddBlankField: function (ulife,cb) {
        var htm="";
        $('.s-ob-s').html("");
        for(var i = 1;i<=ulife.useful_life;i++) {
            var bg='31414a';
            if(i%2==0)
                bg='38464e';
            htm += '<div class="col-md-12 clsfld" data-depid="" data-aid = "'+ulife.id+'" style="padding: 10px;background-color: #'+bg+';">';
            htm += '<div class="form-group col-md-6 clsflife" style="float:left;margin: 0px;">';
            htm += i;
            htm += ' </div>';
            htm += ' <div class="form-group col-md-3" style="float:left;margin: 0px;">';
            htm += ' <input type="number" step=".01" class="form-control clsfldamtd" placeholder="Amount" style="text-align: right;">';
            htm += '</div>';
            htm += ' <div class="form-group col-md-3" style="float:left;margin: 0px;">';
            htm += ' <input type="number" step=".01" class="form-control clsfldamtc" placeholder="Amount" style="text-align: right;">';
            htm += '</div>';
            htm += '<div style="clear:both;"></div></div>';
        }
   // }
        $('.s-ob-s').append(htm);
        //return cb("ok");
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
            if($( this ).find(".clsflife").html()!='')e=$( this ).find(".clsflife").html();
           data.data.push({id:$( this ).attr("data-depid"),atype:$( this ).attr("data-aid"),c:c,d:d,e:e}) 
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