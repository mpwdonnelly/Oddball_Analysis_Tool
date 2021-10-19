//jQuery for styling webpages
$(document).ready(function () {

    var limit = 2;

    $("#splash>h1").click(function () {
        location.href = "welcome.html";
    });

    $("input.checkOption").on('change', function(evt) {
        if($(this).siblings(":checked").length >= limit) {
            this.checked = false;
        }

    });


});