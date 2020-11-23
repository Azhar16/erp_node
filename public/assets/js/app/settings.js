var SETTINGS = {
    /*sales additional fields functions start here*/
    salesAcc: [],
        
    initS: function (acc, row,termrow) {
        COMMON.getUserRole();
        this.salesAcc = acc;
        $(".b-ss-aa").on("click", function (e) {
            SETTINGS.offerAddField('','',0,'');
        });
        SETTINGS.offerLoadRow(row,function(stat){
            SETTINGS.offerAddField('','',0,'');
        });
        $(".b-term-c").on("click", function (e) {
            SETTINGS.offerAddTerm('','',0,'');
        });
        SETTINGS.offerLoadTermRow(termrow,function(stat){
            SETTINGS.offerAddTerm('','',0,'');
        });
        $('#frmOfferSettings').submit(function(e) {
            e.preventDefault();
            SETTINGS.submitGeneralFrm();
        });
    },
    initcomcat: function (row){
        COMMON.getUserRole();
        $(".b-ss-aa").on("click", function (e) {
            SETTINGS.componentAddField('',0,'');
        });
        SETTINGS.componentLoadRow(row,function(stat){
            SETTINGS.componentAddField('',0,'');
        });
        $('#frmcomponentSettings').submit(function(e) {
            e.preventDefault();
            SETTINGS.submitComponentFrm();
        });
    },
    initCN: function(curnc){
      COMMON.getUserRole();
      $(".b-term-c").on("click", function (e) {
            SETTINGS.currencyAddTerm('','',0,'');
        });
        SETTINGS.currencyLoadTermRow(curnc,function(stat){
            SETTINGS.currencyAddTerm('','',0,'');
        });
        $('#frmcurrencySettings').submit(function(e) {
            e.preventDefault();
            SETTINGS.submitCurrencyFrm();
        });
    },
    componentLoadRow:function(row,cb){
        for(var k in row) {
            SETTINGS.componentAddField(row[k].component_name);
        }
        return cb('ok');
    },
    componentAddField: function (component_name) {
            var htm = '<div class="col-md-12 clsfld">';
            htm += '<div class="form-group col-md-4" style="float:left;">';
            htm += ' <input type="text" class="form-control clsfldname" placeholder="Component Name" value="'+component_name+'">';
            htm += ' </div>';
            htm += '<div class="form-group col-md-1" style="float:left;">';
            htm += ' <button class="btn btn-icon waves-effect waves-light btn-danger m-b-5 b-ss-r"> <i class="fa fa-remove"></i> </button>';
            htm += ' </div>';
            htm += '</div>';
            $('.d-s-s-af').append(htm);
            SETTINGS.componentInitDynamic();

    },
    componentInitDynamic:function(){
        $(".b-ss-r").on("click", function (e) {
            $( this ).closest( ".clsfld" ).remove();;
        });
    },
    offerAccOpt:function(acc,cb){
        var htm='';
        for(var k in SETTINGS.salesAcc) {
            if(acc==SETTINGS.salesAcc[k].id)
                htm +='<option selected value="'+SETTINGS.salesAcc[k].id+'">'+SETTINGS.salesAcc[k].name+'</option>';
            else
                htm +='<option value="'+SETTINGS.salesAcc[k].id+'">'+SETTINGS.salesAcc[k].name+'</option>';
        }
        return cb(htm);
    },
    offerLoadRow:function(row,cb){
        for(var k in row) {
            SETTINGS.offerAddField(row[k].name,row[k].code,row[k].amount,row[k].account);
        }
        return cb('ok');
    },
    offerAddField: function (fname,code,famount,faccount) {
        SETTINGS.offerAccOpt(faccount,function(opt){
            var htm = '<div class="col-md-12 clsfld">';
            htm += '<div class="form-group col-md-4" style="float:left;">';
            htm += ' <input type="text" class="form-control clsfldname" placeholder="Name" value="'+fname+'">';
            htm += ' </div>';
            htm += ' <div class="form-group col-md-2" style="float:left;">';
            htm += ' <input type="text" class="form-control clsfldcode" placeholder="Code" value="'+code+'">';
            htm += '</div>';
            htm += ' <div class="form-group col-md-2" style="float:left;">';
            htm += ' <input type="text" class="form-control clsfldamt" placeholder="0.00" value="'+famount.toFixed(2)+'">';
            htm += '</div>';
            htm += '<div class="form-group col-md-3" style="float:left;">';
            htm += ' <select class="form-control select2 select2-hidden-accessible dlsfldacc" tabindex="-1" aria-hidden="true">'+opt+'</select>';
            htm += '</div>';
            htm += '<div class="form-group col-md-1" style="float:left;">';
            htm += ' <button class="btn btn-icon waves-effect waves-light btn-danger m-b-5 b-ss-r"> <i class="fa fa-remove"></i> </button>';
            htm += ' </div>';
            htm += '</div>';
            $('.d-s-s-af').append(htm);
            SETTINGS.offerInitDynamic();
        });
    },
    offerInitDynamic:function(){
        $(".dlsfldacc").select2();
        $(".b-ss-r").on("click", function (e) {
            $( this ).closest( ".clsfld" ).remove();;
        });
    },
    
    offerLoadTermRow:function(termrow,cb){
        for(var k in termrow) {
            SETTINGS.offerAddTerm(termrow[k].name,termrow[k].msg);
        }
        return cb('ok');
    },
    offerAddTerm: function (fname,fmsg) {
            var htm = '<div class="col-md-12 clstermfld">';
            htm += '<div class="form-group col-md-4" style="float:left;">';
            htm += ' <input type="text" class="form-control clsfldname" placeholder="Name" value="'+fname+'">';
            htm += ' </div>';
            htm += '<div class="form-group col-md-4" style="float:left;">';
            htm += ' <input type="text" class="form-control clsfldmsg" placeholder="Message" value="'+fmsg+'">';
            htm += ' </div>';
            htm += '<div class="form-group col-md-1" style="float:left;">';
            htm += ' <button class="btn btn-icon waves-effect waves-light btn-danger m-b-5 b-ss-r"> <i class="fa fa-remove"></i> </button>';
            htm += ' </div>';
            htm += '</div>';
            $('.d-s-term-af').append(htm);
            SETTINGS.offerTermInitDynamic();
            },
    offerTermInitDynamic:function(){
        $(".dlsfldacc").select2();
        $(".b-ss-r").on("click", function (e) {
            $( this ).closest( ".clstermfld" ).remove();;
        });
    },
    currencyLoadTermRow:function(termrow,cb){
        for(var k in termrow) {
            SETTINGS.currencyAddTerm(termrow[k].name,termrow[k].val);
        }
        return cb('ok');
    },
    currencyAddTerm: function (fname,fval) {
            var htm = '<div class="col-md-12 clscurrencyfld">';
            htm += '<div class="form-group col-md-4" style="float:left;">';
            htm += ' <input type="text" class="form-control clscurrencyfldname" placeholder="Currency" value="'+fname+'">';
            htm += ' </div>';
            htm += '<div class="form-group col-md-4" style="float:left;">';
            htm += ' <input type="number" step=".01" class="form-control clscurrencyfldval" placeholder="Current value in Indian rupees" value="'+fval+'">';
            htm += ' </div>';
            htm += '<div class="form-group col-md-1" style="float:left;">';
            htm += ' <button class="btn btn-icon waves-effect waves-light btn-danger m-b-5 b-ss-r"> <i class="fa fa-remove"></i> </button>';
            htm += ' </div>';
            htm += '</div>';
            $('.d-s-term-af').append(htm);
            SETTINGS.currencyTermInitDynamic();
            },
    currencyTermInitDynamic:function(){
        $(".dlsfldacc").select2();
        $(".b-ss-r").on("click", function (e) {
            $( this ).closest( ".clscurrencyfld" ).remove();;
        });
    },
    submitGeneralFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var addfield=[],addTerm=[];
        $('.clsfld').each(function(  ) {
            if($( this ).find(".clsfldname").val()!='' && $( this ).find(".clsfldamt").val()!='')
           addfield.push({name:$( this ).find(".clsfldname").val(),code:$( this ).find(".clsfldcode").val(),amount:$( this ).find(".clsfldamt").val(),account:$( this ).find(".dlsfldacc").val()}) 
        });
        $('.clstermfld').each(function(  ) {
            if($( this ).find(".clsfldname").val()!='')
           addTerm.push({name:$( this ).find(".clsfldname").val(),msg:$( this ).find(".clsfldmsg").val()}) 
        });
        var data = {
            /* offer no*/
            offerNote:$("#offer_custome_note").val(),
            offerprefix:$("#prefix").val(),
            offercenter:$("#center").val(),
            offersufix:$("#sufix").val(),
            offerdivider:$("#divider").val(),
            /* enquiry no*/
            enquiryprefix:$("#enquiry_prefix").val(),
            enquirycenter:$("#enquiry_center").val(),
            enquirysufix:$("#enquiry_sufix").val(),
            enquirydivider:$("#enquiry_divider").val(),
            /* workorder no*/
            wo_prefix:$("#wo_prefix").val(),
            wo_center:$("#wo_center").val(),
            wo_sufix:$("#wo_sufix").val(),
            wo_divider:$("#wo_divider").val(),
            /* plan no*/
            plan_prefix:$("#plan_prefix").val(),
            plan_center:$("#plan_center").val(),
            plan_sufix:$("#plan_sufix").val(),
            plan_divider:$("#plan_divider").val(),
            /* amendment no*/
            amenmentprefix:$("#amendment_prefix").val(),
            amenmentcenter:$("#amendment_center").val(),
            amenmentsufix:$("#amendment_sufix").val(),
            amenmentdivider:$("#amendment_divider").val(),
            /* asset no*/
            asset_prefix:$("#asset_prefix").val(),
            asset_center:$("#asset_center").val(),
            asset_sufix:$("#asset_sufix").val(),
            asset_divider:$("#asset_divider").val(),
            /* purchase order no*/
            po_prefix:$("#po_prefix").val(),
            po_center:$("#po_center").val(),
            po_sufix:$("#po_sufix").val(),
            po_divider:$("#po_divider").val(),
            /* purchase enquiry no*/
            pe_prefix:$("#pe_prefix").val(),
            pe_center:$("#pe_center").val(),
            pe_sufix:$("#pe_sufix").val(),
            pe_divider:$("#pe_divider").val(),
            /* offer additional field*/
            addfield:addfield,
            /*offer terms & conditions*/
            addTerm:addTerm,



        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/configuration/settings/generalsave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    COMMON.shownotification('success','Custom offer id updated successfully!!!');
                } else {
                    COMMON.shownotification('error','Unable to update Custom offer id!!!');
                    $(".loginmessage").html('');
                }
                $("body").css('cursor', 'default');
            },
        });
    },
    submitComponentFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var data = {addfield:[]};
        var doc = $(".clsfld");
        doc.each(function(  ) {
            if($( this ).find(".clsfldname").val()!='')
           data.addfield.push({name:$( this ).find(".clsfldname").val()}) 
        });
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/configuration/settings/componentcategorysave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    COMMON.shownotification('success','Component Category updated successfully!!!');
                } else {
                    COMMON.shownotification('error','Unable to update Component Category!!!');
                    $(".loginmessage").html('');
                }
                $("body").css('cursor', 'default');
            },
        });
    },
    submitCurrencyFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var addfield=[];
        $(".clscurrencyfld").each(function(  ) {
            if($( this ).find(".clscurrencyfldname").val()!='')
           addfield.push({name:$( this ).find(".clscurrencyfldname").val(),val:$( this ).find(".clscurrencyfldval").val()}) 
        });
        var data = {
            addfield:addfield
        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/configuration/settings/currencysave',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code == 1) {
                    COMMON.shownotification('success','Currency updated successfully!!!');
                } else {
                    COMMON.shownotification('error','Unable to update Currency!!!');
                    $(".loginmessage").html('');
                }
                $("body").css('cursor', 'default');
            },
        });
    },
    
    
};