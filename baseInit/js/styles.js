//jQuery for styling webpages
$(document).ready(function () {

    var limit = 2;

    //When clicked moves pages
    $("#splash>h1").click(function () {
        location.href = "welcome.html";
    });

    //Limits the amount of checked boxes in oldHTML
    $("input.checkOption").on('change', function(evt) {
        if($(this).siblings(":checked").length >= limit) {
            this.checked = false;
        }

    });


});