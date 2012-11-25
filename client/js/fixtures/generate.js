#!/usr/bin/env node

var fs = require('fs');

var blank = {

    title: "Default"
  , author: null
  , bpm: 140
  , lpb: 4
  , instruments: []
  , grid: []

};

for (var i = 0; i < 32; i++) {
  var row = [];
  for (var j = 0; j < 6; j++) {
    var next = {
        note: null
      , instrument: null
      , gain: null
      , pan: null
      , effect: null
      , effectValue: null
    };
    row.push(next);
  }
  blank.grid.push(row);
}

fs.writeFileSync('blank.json', JSON.stringify(blank, null, 2));
