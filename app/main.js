require([
  // Application.
  "app",

  // Main Router.
  "router",

  // Mousetrap for keybindings
  "mousetrap"
],

function(app, Router, Mousetrap) {

  // Define your master router on the application namespace and trigger all
  // navigation from this instance.
  app.router = new Router();

  // Trigger the initial route and enable HTML5 History API support, set the
  // root folder to '/' by default.  Change in app.js.
  Backbone.history.start({ pushState: true, root: app.root });

  // All navigation that is relative should be passed through the navigate
  // method, to be processed by the router. If the link has a `data-bypass`
  // attribute, bypass the delegation completely.
  $(document).on("click", "a:not([data-bypass])", function(evt) {
    // Get the absolute anchor href.
    var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
    // Get the absolute root.
    var root = location.protocol + "//" + location.host + app.root;

    // Ensure the root is part of the anchor href, meaning it's relative.
    if (href.prop && href.prop.slice(0, root.length) === root) {
      // Stop the default event to ensure the link will not cause a page
      // refresh.
      evt.preventDefault();

      // `Backbone.history.navigate` is sufficient for all Routers and will
      // trigger the correct events. The Router's internal `navigate` method
      // calls this anyways.  The fragment is sliced from the root.
      Backbone.history.navigate(href.attr, true);
    }
  });

  // Metronome highlighting
  // app.metronome.addListener("tick", function (t) {
  //   $(".highlight").removeClass("highlight");
  //   $(".track tr:nth-child(" + (t - 1) + ")").addClass("highlight");
  // });

  // Key bindings
  var spaceToggle = false;
  Mousetrap.bind("space", function (e) {
    e.preventDefault();
    if (spaceToggle) {
      app.metronome.stop();
    } else {
      app.metronome.startFrom(0);
      app.metronome.start();
    }
    spaceToggle = !spaceToggle;
  });

});
