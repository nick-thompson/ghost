define([
  "app"
],

function (app) {

  var ControlView = Backbone.View.extend({

    initialize: function () {
      $("#bpm-control input").change(function () {
        app.metronome.setBPM(parseInt( $(this).val() ));
      });

      $("#lpb-control input").change(function () {
        var lpb = parseInt($(this).val());

        // Value checking
        if (lpb < 1 || lpb > 16) {
          $(this).val(app.linesPerBeat);
          return false;
        }

        // Update app variables
        app.metronome.setResolution(lpb);
        app.linesPerBeat = lpb;

        // Reapply highlighting
        var f = lpb + "n + 2";
        $(".beatAccent").removeClass("beatAccent");
        $(".track tr:nth-child(" + f + ")").addClass("beatAccent");
      });

      $("#sample-load").change(function () {
        var url = $(this).val()
          , parts = url.split('/')
          , name = parts[parts.length - 1];

        $(this).val('');

        var request = new XMLHttpRequest()
          , that = this;

        app.buffers = app.buffers || [];

        request.open("GET", url, true);
        request.responseType = "arraybuffer";
        request.onload = function () {
          app.context.decodeAudioData(request.response, function (buffer) {
            app.buffers.push(buffer);
            $(".instrument-panel ol").append("<li data-bufferindex=\"" +
              (app.buffers.length - 1) + "\">" + name + "</li>");
            if (!app.activeBuffer) {
              app.activeBuffer = buffer;
            }
          });
        };
        request.send();
      });

      $(".instrument-panel ol").on("click", "li", function () {
        var idx = parseInt( $(this).data("bufferindex") );
        app.activeBuffer = app.buffers[idx];
        $(this).parent().children().removeClass("active");
        $(this).addClass("active");
      });
    }

  });

  return {
    ControlView: ControlView
  }

});
