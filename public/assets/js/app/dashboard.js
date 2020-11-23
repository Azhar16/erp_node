var DVIEW = {
    initRIN: function () {

        $(".s-n-prod").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("product/product/view", function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-n-sales").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("sales/product", function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-n-plan").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("plan/product", function (data) {
                $('#mainContent').html(data);
            });
        });
       
        
   }
};        