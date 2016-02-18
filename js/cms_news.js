
cms_news = {

  app: function() {

    // Required Js
    var required_js = 'js/materialize.min.js';

    // Append Required JS
    if (!$('head script[src="' + required_js + '"]').length > 0) {
      $('head').append('<script type="text/javascript" src="' + required_js + '"></script>');
    }



    // Required CSS
    var required_css = [
      'http://fonts.googleapis.com/icon?family=Material+Icons',
      'css/materialize.min.css',
      'css/cms_news.min.css'
    ];


    // Append Required CSS
    var i = 0;
    var css_html = '';

    $(required_css).each(function () {
      if (!$('head link[href="' + required_css[i] + '"]').length > 0) {
        css_html += '<link href="' + required_css[i] + '" rel="stylesheet">';
      }
      ++i;
    });

    $('head').append(css_html);




    // Destination
    var destination = cms_news_setup.destination;

    // template setup
    var template =
        '<div id="cms_news_pkg" style="display: none;">' +
        ' <div id="cms_news" class="column_wrapper"></div>' +
        ' <div id="cms_news_more" class="videos_more waves-effect waves-light btn" data-cms_allnews="1">view more</div>'
        '</div>';



    $(cms_news_setup.destination).append(template);

    var more_button = '#cms_news_more';



    cms_news_loop();
    function cms_news_loop() {

        $(more_button).addClass('busy');
        var page_number = parseInt($(more_button).attr('data-cms_allnews'));

        $.ajax({
            url: "http://www.warnermusic.ca/feeds/blog_json.php",
            jsonp: "callback",
            dataType: "jsonp",

            data: {
                artist_id: cms_news_setup.artist_id,
                include: 'artist',
                ps: cms_news_setup.qty,
                p: page_number
            },


            success: function (cms_object) {

                //console.log(cms_object);

                var loop_html = '';
                var i = 0;

                //loop
                $(cms_object.blogs).each(function () {

                    var link_url = 'post.php?id=' + cms_object.blogs[i].id + '&title=' + cms_object.blogs[i].title.replace(/[^a-z0-9]/gi, '_').toLowerCase();

                    // dateformat
                    var timezone = 18000;
                    var epoch_date = parseInt(cms_object.blogs[i].timestamp) + timezone;
                    var string_date = new Date(0);
                    string_date.setUTCSeconds(epoch_date);
                    var long_date = string_date.toString();
                    var split_long = long_date.split(" ");
                    var formatted_date = split_long[1] + " " + split_long[2] + ", " + split_long[3];


                    // photo sizes
                    var photo_size = 'width=600&height=600';

                    if( $(window).innerWidth > 768) {
                        photo_size = 'width=300&height=300';
                    }


                    loop_html +=


                        '<a href="' + link_url + '">' +
                        ' <div class="post">' +
                        '   <div class="wrapper column_wrapper">' +

                        '     <div class="photo_wrapper">' +
                        '          <img class="photo" src="http://images.warnermusiccanada.com/prepareimage.php?' + photo_size + '&blog_id=' + cms_object.blogs[i].id + '&type=crop">' +
                        '     </div>' +

                        '    <div class="text_wrapper">' +
                        '        <div class="date">' + formatted_date + '</div>' +
                        '        <h5 class="title">' + cms_object.blogs[i].title + '</h5>' +
                        '    </div>' +

                        '   </div>' +
                        ' </div>' +
                        '</a>';
                    ++i;
                });

                // append html
                $('#cms_news').append(loop_html);


                //update more_button
                loaded_qty = cms_object.p * cms_object.ps;
                total_qty = cms_object.c;

                if (total_qty > loaded_qty ) {
                    $(more_button).attr('data-cms_allnews', ++page_number);
                } else {
                    $(more_button).addClass('exhausted');
                }

                $(more_button).removeClass('busy');
            }
        });
    }


    // more_button click
    $(document).on('click', '#cms_news_more', function() {
        if($(this).hasClass('exhausted')){
        } else {
            if ($(this).hasClass('busy')) {
            } else {
              if(cms_news_setup.view_more == 'inline') {
                cms_news_loop();
              } else {
                window.open(cms_news_setup.view_more,"_self")
              }
            }
        }
    });


  } //end app

};
