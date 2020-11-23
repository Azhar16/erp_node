var usersavedrole={}
var COMMON = {
    /*
     * 
     * @param 
     * shortCutFunction=success/info/warning/error
     * msg=message need to show
     * @returns {undefined}
     */
    shownotification: function (shortCutFunction, msg) {

        var title = '';
        toastr.options = {
            closeButton: false,
            debug: false,
            newestOnTop: false,
            progressBar: true,
            positionClass: 'toast-top-center',
            preventDuplicates: false,
            onclick: null
        };

        toastr.options.showDuration = 300;
        toastr.options.hideDuration = 1000;
        toastr.options.timeOut = 5000;
        toastr.options.extendedTimeOut = 1000;
        toastr.options.showEasing = 'swing';
        toastr.options.hideEasing = 'linear';
        toastr.options.showMethod = 'fadeIn';
        toastr.options.hideMethod = 'fadeOut';

        if (!msg) {
            msg = getMessage();
        }

        $('#toastrOptions').text('Command: toastr["'
                + shortCutFunction
                + '"]("'
                + msg
                + (title ? '", "' + title : '')
                + '")\n\ntoastr.options = '
                + JSON.stringify(toastr.options, null, 2)
                );

        var $toast = toastr[shortCutFunction](msg, title); // Wire up an event handler to a button in the toast, if it exists
        $toastlast = $toast;

        if (typeof $toast === 'undefined') {
            return;
        }
    },
    getCurrentFiscalYear: function () {
        var today = new Date();
        var curMonth = today.getMonth();
        var fiscalYr = [];
        if (curMonth > 3) {
            fiscalYr = [today.getFullYear(), (today.getFullYear() + 1)];
        } else {
            fiscalYr = [(today.getFullYear() - 1), today.getFullYear()];
        }
        return fiscalYr;
    },
    loadCustomModal:function(trg,fnc=null){
        Custombox.modal.closeAll();
        $('.custom-modal-title').html($(trg).attr('data-title'));
                var modal = new Custombox.modal({
                    content: {
                        effect: 'fadein',
                        target: '.modal-demo'
                    }
                });
                console.log($(trg).attr('data-href'));
                modal.open();
                $.get($(trg).attr('data-href'), function (data) {
                    $('.modalbody').html(data);
                    $("#modal_tag").val('on');
                    $('.hide-for-modal').remove();
                });
                document.addEventListener('custombox:content:close', function() {
                    if(typeof fnc==='function')
            fnc();
          });
    },
    amountToWord:function(num){
        var a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
        var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

        var myarr = num.toFixed(2).toString().split(".");
        console.log(myarr);
        if ((num = myarr[0].toString()).length > 9) return 'overflow';
        n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        console.log(n);
        if (!n) return; var str = '';
        str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
        str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
        str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
        str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
        if(typeof myarr[1]!=='undefined' && Number(myarr[1])>0){
            str += (n[5] != 0) ?  (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]])  : '';
            str += ((str != '') ? 'and ' : '') + (a[Number(myarr[1])] || b[myarr[1][0]] + '' + a[myarr[1][1]]) + ' paisa only ' ;
        }
        else
            str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + '' + a[n[5][1]]) + 'only ' : '';
        str = "rupees "+str;
        return str;
    },
    printContent:function(cont){
        var mywindow = window.open('', 'Print', 'height=600,width=800');

        mywindow.document.write('<html><head><title>Print</title>');
        mywindow.document.write('</head><body >');
        mywindow.document.write(cont);
        mywindow.document.write('</body></html>');

        mywindow.document.close();
        mywindow.focus();
        mywindow.print();
        mywindow.close();
        //return true;
    },
    xlsContent:function(elt,fn){
        var wb = XLSX.utils.table_to_book(elt, {sheet:"Sheet JS"});
	return XLSX.writeFile(wb, fn+'.xlsx');
    },
    printPdf:function(form,pname){
        
        var   
         cache_width = form.width(),  
         a4 = [595.28, 841.89]; // for a4 size paper width and height  
    
            getCanvas().then(function (canvas) {  
                var  
                 img = canvas.toDataURL("image/png"),  
                 doc = new jsPDF({  
                     unit: 'px',  
                     format: 'a4'  
                 });  
                doc.addImage(img, 'JPEG', 0, 0);  
                doc.save(pname+'.pdf');  
                form.width(cache_width);  
                $("div").css('background-color','');
                $("div").css('color','');
                $("h1").css('color','');
                $("h2").css('color','');
                $("div").css('font-size','');
            });  
        
  
        // create canvas object  
        function getCanvas() {  
            $("div").css('background-color','white');
            $("div").css('color','black');
            $("div").css('font-size','10px');
            $("h1").css('color','black');
            $("h2").css('color','black');
            form.width((a4[0] * 1.33333) ).css('max-width', 'none');  
            return html2canvas(form, {  
                imageTimeout: 2000,  
                removeContainer: true  
            });  
        }  
  


    },
    getUserRole:function(){
        COMMON.ajax_check_user_logged_in();
    $(".userrole-cls").each(function() {
        var data = $(this).attr('data-permission');
        var data_arr = data.split("-");
        if(data_arr.length == 2){
          if(usersavedrole.modules[data_arr[0]].submodule[data_arr[1]].permission != 1){
            $(this).css("display", "none");
          }
          else{
            $(this).css("display", "block");
          }
       }
       else  if(data_arr.length == 3){
          if(usersavedrole.modules[data_arr[0]].submodule[data_arr[1]].item[data_arr[2]] != 1){
             $(this).css("display", "none");
          }
          else{
            $(this).css("display", "block");
          }
       }



      });
    },
    ajax_check_user_logged_in:function(){
       $.ajax({
            url: "/ajaxlogincheck",
            type: "GET",
            complete: function (data) {
              usersavedrole = JSON.parse(data.responseText);
            },
       });
    },

};


(function ($) {  
        $.fn.html2canvas = function (options) {  
            var date = new Date(),  
            $message = null,  
            timeoutTimer = false,  
            timer = date.getTime();  
            html2canvas.logging = options && options.logging;  
            html2canvas.Preload(this[0], $.extend({  
                complete: function (images) {  
                    var queue = html2canvas.Parse(this[0], images, options),  
                    $canvas = $(html2canvas.Renderer(queue, options)),  
                    finishTime = new Date();  
  
                    $canvas.css({ position: 'absolute', left: 0, top: 0 }).appendTo(document.body);  
                    $canvas.siblings().toggle();  
  
                    $(window).click(function () {  
                        if (!$canvas.is(':visible')) {  
                            $canvas.toggle().siblings().toggle();  
                            throwMessage("Canvas Render visible");  
                        } else {  
                            $canvas.siblings().toggle();  
                            $canvas.toggle();  
                            throwMessage("Canvas Render hidden");  
                        }  
                    });  
                    throwMessage('Screenshot created in ' + ((finishTime.getTime() - timer) / 1000) + " seconds<br />", 4000);  
                }  
            }, options));  
  
            function throwMessage(msg, duration) {  
                window.clearTimeout(timeoutTimer);  
                timeoutTimer = window.setTimeout(function () {  
                    $message.fadeOut(function () {  
                        $message.remove();  
                    });  
                }, duration || 2000);  
                if ($message)  
                    $message.remove();  
                $message = $('<div ></div>').html(msg).css({  
                    margin: 0,  
                    padding: 0,  
                    background: "#000",  
                    opacity: 0.7,  
                    position: "fixed",  
                    top: 10,  
                    right: 0,  
                    fontFamily: 'Tahoma',  
                    color: '#fff',  
                    fontSize: 10,  
                    borderRadius: 12,  
                    width: 'auto',  
                    height: 'auto',  
                    textAlign: 'center',  
                    textDecoration: 'none'  
                }).hide().fadeIn().appendTo('body');  
            }  
        };  
    })(jQuery);
    
