var RPURCHASE = {
    initRPL: function () {
        $('#datatablepl').DataTable({
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: {
                url: "/purchase/requisition_purchase/ajaxget",
                type: 'POST',
                data: function (d) {
                    setTimeout(RPURCHASE.initButton, 1000);
                }
            }
        });

        RPURCHASE.initButton();
        COMMON.getUserRole(); 
    },
    initButton:function(){
        COMMON.getUserRole();
        $(".custom-modal-button").on("click", function (e) {
            COMMON.loadCustomModal(this);
        });
         
        
    },
    initRDPL: function () {
        /*var itmid = $("#itmid").val();
        console.log("itmid "+itmid);
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: "/purchase/requisition_purchase/ajaxdetailsget/"+itmid,
                type: 'POST',
                data: function (d) {
                    setTimeout(RPURCHASE.initButton, 1000);
                }
            }
        });*/

        COMMON.getUserRole(); 
    },
};