define([
  "app"
],

function (app) {

  var Track = {};

  Track.Model = Backbone.Model.extend({});

  Track.View = Backbone.View.extend({

    tagName: 'li',

    template: _.template($("#TrackTemplate").html()),

    events: {
      'keypress .sc-note > input': 'keyHandle'
    },

    initialize: function () {
      var that = this;
      app.metronome.addListener("tick", function (t) {
        that.model.get("hitlist").forEach(function (hit) {
          if (hit.tick === t) {
            that.fire(hit);
          }
        });
      });
    },

    render: function () {
      this.$el.html(this.template({
        trackTitle: this.model.get("title")
      }));
      $("ul").append(this.el);
    },

    fire: function (hit) {
      var node = app.context.createBufferSource();
      node.buffer = hit.buffer;
      node.connect(app.context.destination);
      node.noteOn(0);
    },

    keyHandle: function (e) {
      if (!app.activeBuffer)
        return false;

      var idx = app.buffers.indexOf(app.activeBuffer) + 1
        , label = "C.0" + idx;

      $(e.target).val(label);
      this.buildHitlist();
    },

    buildHitlist: function () {
      var cells = this.$el.find(".sc-note input")
        , hits = [];

      for (var i = 0; i < cells.length; i++) {
        var v = $(cells[i]).val();
        if (v === "....") {
          continue;
        } else {
          var bufferIndex = parseInt($(cells[i]).val().split('.')[1]) - 1;
          hits.push({
            tick: i + 1,
            buffer: app.buffers[bufferIndex]
          });
        }
      }

      this.model.set("hitlist", hits);
    }

  });

  return Track;

});
