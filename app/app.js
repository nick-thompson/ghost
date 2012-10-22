define([
  "jquery",
  "lodash",
  "backbone",
  "metronome"
],

function($, _, Backbone, Metronome) {

  // Provide a global location to place configuration settings and module
  // creation.
  return {
    root: "/",
    context: new webkitAudioContext(),
    metronome: new Metronome(140, 4),
    measures: 4,
    linesPerBeat: 4
  };

});
