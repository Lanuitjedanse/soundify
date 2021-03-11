(function () {
    var btnMore = $(".more");
    var resultNum = $(".result-number");
    var resultName = $(".result-name");
    var resultBox = $(".result-message");

    var offsetIncrease;

    var noResult = $(".no-result");
    var UseInfiniteScroll = location.search.indexOf("scroll=infinite") > -1;

    // $(document).on("click", ".more, .submit-button", function () {
    // refactor code to avoid repetition
    // });

    $(".submit-button").on("click", function () {
        $(".main-results-container").html(""); // clears search

        $(".submit-button").prop("disabled", true); // disable button
        $(btnMore).css({
            visibility: "hidden",
        });
        $(".logo").addClass("bounce-in-top");
        $("h1").addClass("tracking-in-expand");

        var userInput = $("input").val();
        var artistOrAlbum = $("select").val();

        $.ajax({
            method: "GET",
            url: "https://spicedify.herokuapp.com/spotify",
            data: {
                query: userInput,
                type: artistOrAlbum,
            },

            success: function (response) {
                $(".submit-button").prop("disabled", false); // enable button one result is loaded
                // console.log("response: ", response);
                response = response.artists || response.albums;

                var resultsHtml = "";
                console.log("response: ", response);
                for (var i = 0; i < response.items.length; i++) {
                    var defaultImage = "pngwing.com (2).png";
                    if (response.items[i].images.length > 0) {
                        defaultImage = response.items[i].images[0].url;
                    }

                    resultsHtml +=
                        // "<div class='result-box'>" +
                        "<a href='" +
                        response.items[i].external_urls.spotify +
                        "' target='_blank' class='photos'>" +
                        "<img class='photos frame' src='" +
                        defaultImage +
                        "'>" +
                        "</a>" +
                        "<a href='" +
                        response.items[i].external_urls.spotify +
                        "' target='_blank' class='text-artist-album'>" +
                        "<div class='text-artist-album'>" +
                        response.items[i].name +
                        "</div>" +
                        "</a>";
                    // "</div>";

                    $(resultBox).css({
                        visibility: "visible",
                    });
                    $(resultNum).text(response.total);
                    $(resultName).text(userInput);
                }

                if (response.items.length === 0) {
                    $(noResult).css({
                        visibility: "visible",
                    });

                    $(btnMore).css({
                        visibility: "hidden",
                    });
                }

                if (response.next === null) {
                    $(btnMore).css({
                        visibility: "hidden",
                    });
                } else if (response.next != null) {
                    $(btnMore).css({
                        visibility: "visible",
                    });
                }

                $(".main-results-container").html(resultsHtml);

                if (UseInfiniteScroll) {
                    $(btnMore).css({
                        visibility: "hidden",
                    });
                    checkScrollPosition();
                }

                offsetIncrease = 20;

                $(btnMore).off("click"); // remove previous click events to avoid mixed results

                $(btnMore).on("click", function () {
                    $(btnMore).css({
                        visibility: "hidden",
                    });

                    var nextUrl =
                        response.next &&
                        response.next.replace(
                            "api.spotify.com/v1/search",
                            "spicedify.herokuapp.com/spotify"
                        );

                    offsetIncrease += 20;

                    var nextNextUrl = nextUrl.replace(
                        "offset=20",
                        "offset=" + offsetIncrease
                    );

                    $.ajax({
                        method: "GET",
                        url: nextNextUrl,

                        success: function (response) {
                            // console.log("response: ", response);
                            response = response.artists || response.albums;

                            for (var i = 0; i < response.items.length; i++) {
                                var defaultImage = "pngwing.com (2).png";
                                if (response.items[i].images.length > 0) {
                                    defaultImage =
                                        response.items[i].images[0].url;
                                }

                                resultsHtml +=
                                    "<a href='" +
                                    response.items[i].external_urls.spotify +
                                    "' target='_blank' class='photos'>" +
                                    "<img class='photos frame' src='" +
                                    defaultImage +
                                    "'>" +
                                    "</a>" +
                                    "<a href='" +
                                    response.items[i].external_urls.spotify +
                                    "' target='_blank' class='text-artist-album'>" +
                                    "<div class='text-artist-album'>" +
                                    response.items[i].name +
                                    "</div>" +
                                    "</a>";

                                $(resultBox).css({
                                    visibility: "visible",
                                });
                                $(resultNum).text(response.total);
                                $(resultName).text(userInput);
                            }

                            if (response.next === null) {
                                $(btnMore).css({
                                    visibility: "hidden",
                                });
                            } else if (response.next != null) {
                                $(btnMore).css({
                                    visibility: "visible",
                                });
                            }

                            $(".main-results-container").html(resultsHtml);
                            //$(".main-results-container").append(resultsHtml);

                            $("a").on("click", function () {
                                $(noResult).css({
                                    visibility: "hidden",
                                });
                                $(".main-results-container").html("");
                                $(btnMore).css({
                                    visibility: "hidden",
                                });
                                $(resultBox).css({
                                    visibility: "hidden",
                                });
                                $(".logo").removeClass("bounce-in-top");
                                $("h1").removeClass("tracking-in-expand");

                                $("input").val("");
                            });
                        },
                    });
                });

                function checkScrollPosition() {
                    var nextUrl =
                        response.next &&
                        response.next.replace(
                            "api.spotify.com/v1/search",
                            "spicedify.herokuapp.com/spotify"
                        );

                    var nextNextUrl = nextUrl.replace(
                        "offset=20",
                        "offset=" + offsetIncrease
                    );
                    var hasScrolledToBottom =
                        $(document).height() - 150 <=
                        $(document).scrollTop() + $(window).height();

                    offsetIncrease += 20;

                    if (hasScrolledToBottom) {
                        $.ajax({
                            method: "GET",
                            url: nextNextUrl,

                            success: function (response) {
                                // console.log("response: ", response);
                                response = response.artists || response.albums;

                                for (
                                    var i = 0;
                                    i < response.items.length;
                                    i++
                                ) {
                                    var defaultImage = "pngwing.com (2).png";
                                    if (response.items[i].images.length > 0) {
                                        defaultImage =
                                            response.items[i].images[0].url;
                                    }

                                    resultsHtml +=
                                        "<a href='" +
                                        response.items[i].external_urls
                                            .spotify +
                                        "' target='_blank' class='photos'>" +
                                        "<img class='photos frame' src='" +
                                        defaultImage +
                                        "'>" +
                                        "</a>" +
                                        "<a href='" +
                                        response.items[i].external_urls
                                            .spotify +
                                        "' target='_blank' class='text-artist-album'>" +
                                        "<div class='text-artist-album'>" +
                                        response.items[i].name +
                                        "</div>" +
                                        "</a>";

                                    $(resultBox).css({
                                        visibility: "visible",
                                    });
                                    $(resultNum).text(response.total);
                                    $(resultName).text(userInput);
                                }

                                $(".main-results-container").html(resultsHtml);
                                //$(".main-results-container").append(resultsHtml);

                                if (response.next != null) {
                                    checkScrollPosition();
                                }
                            },
                        });
                    } else {
                        setTimeout(checkScrollPosition, 500);
                    }
                }

                $("a").on("click", function () {
                    $(noResult).css({
                        visibility: "hidden",
                    });
                    $(".main-results-container").html("");
                    $(btnMore).css({
                        visibility: "hidden",
                    });
                    $(resultBox).css({
                        visibility: "hidden",
                    });
                    $(".logo").removeClass("bounce-in-top");
                    $("h1").removeClass("tracking-in-expand");

                    $("input").val("");
                    offsetIncrease = 0;
                });
            },
        });
    });

    $("input").on("keydown", function (e) {
        if (e.which === 8) {
            // clears search

            $(resultBox).css({
                visibility: "hidden",
            });
            $(noResult).css({
                visibility: "hidden",
            });

            $(btnMore).css({
                visibility: "hidden",
            });
            $(".logo").removeClass("bounce-in-top");
            $("h1").removeClass("tracking-in-expand");
            $(".main-results-container").html("");
            offsetIncrease = 0;
        }
    });
})();
