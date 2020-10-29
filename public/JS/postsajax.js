$(document).ready(function() {
    $(".vote-up").submit(function(e) {
        e.preventDefault();

        var postId = $(this).data("id");
        $.ajax({
            type: "PUT",
            url: "/posts/post/" + postId + "/vote-up",
            async: true,
            success: function(data) {
                console.log("voted up!");
            },
            error: function(err) {
                console.log(err);
            }
        });
    });

    $(".vote-down").submit(function(e) {
        e.preventDefault();

        var postId = $(this).data("id");
        $.ajax({
            type: "PUT",
            url: "/posts/post/" + postId + "/vote-down",
            async: true,
            success: function(data) {
                console.log("voted down!");
            },
            error: function(err) {
                console.log(err);
            }
        });
    });
});