// Grab the articles as a json
$.getJSON("/articles", function (data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
});

// Whenever someone clicks a p tag
$(document).on("click", "p", function () {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })

        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);
            // The title of the article
            $("#notes").append("<h2>" + data.title + "</h2>");
            // input title of the note
            $("#notes").append("<input id='titleinput' name='title' >");
            // A textarea to add a new note body
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            // A button to submit a new note, with the id of the article saved to it
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
            // A button to delete a note, with the id of the article saved to it
            $("#notes").append("<button data-id='" + data._id + "' id='deletenote'>Delete Note</button>");
            // If there's a note in the article
            if (data.note) {
                $("#titleinput").val(data.note.title);
                $("#bodyinput").val(data.note.body);
            };
        })
    });

// save note
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input and note textarea 
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .then(function(data) {
      console.log(data);
      $("#notes").empty();
    });
    $("#titleinput").val("");
    // Also, remove the values entered in the input area for note entry
    $("#bodyinput").val("");
});

  //scrape button 
$(document).on("click", "button", function() {
  axios.get("https://www.nytimes.com/").then(function(response) {
    var $ = cheerio.load(response.data);
    $("h2 story-heading").each(function(i, element) {
      var result = {};
      result.headline = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");
        });
    });
});