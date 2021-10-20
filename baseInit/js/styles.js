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

    $("#showRaw").on("click", function() {
        $("#rawGraph p").css("display", "block");
    });

    $("#showAverage").on("click", function() {
        $("#averagedGraph p").css("display", "block");
    });

    $("#showBaseline").on("click", function() {
        $("#baselineGraph p").css("display", "block");
    });

    $("#showMovingAverage").on("click", function() {
        $("#movingAverageGraph p").css("display", "block");
    });


});