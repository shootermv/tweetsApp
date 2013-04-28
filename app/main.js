require([
  "namespace",

// Libs
  "jquery",
  "use!backbone",

// Modules
  "modules/tweet"
],

function (namespace, $, Backbone, Tweet) {

    window.Library = new Tweet.Collection();

    // Defining the application router, you can attach sub routers here.
    var Router = Backbone.Router.extend({
        routes: {
            "": "index"
        },

        index: function () {
            $("#content").html('<div class="loading"><img src="loading.gif"></div>');

                Library.fetch({
                    timeout:1000,
                    success: function () {
                        var view = new Tweet.Views.List({ collection: Library });



                        view.render(function (el) {
                            $("#content").html(el);
                        })
                    }, //end of success


                    error: function (response) {

                        $("#content").html('<div class="error">Sorry, something went wrong... try to <a href="/index.html">reload the page</a></div>');
                    }
                })//end of fetch


        }
    });

    // Shorthand the application namespace
    var app = namespace.app;

    // Treat the jQuery ready function as the entry point to the application.
    // Inside this function, kick-off all initialization, everything up to this
    // point should be definitions.
    $(function () {
        app.router = new Router();
        Backbone.history.start();
    });


});
