define([
  "app",
  "modules/controls",
  "modules/track"
],

function (app, controls, Track) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({

    routes: {
      "": "index"
    },

    index: function () {
      var controlView = new controls.ControlView();
      $("ul").append( _.template( $("#RulerTemplate").html(), {} ) );
      for (var i = 0; i < 8; i++) {
        new Track.View({
          model: new Track.Model({
            hitlist: [],
            title: "Track 0" + i
          })
        }).render();
      }
      $(".track tr:nth-child(4n + 2)").addClass("beatAccent");
    }

  });

  return Router;

});
