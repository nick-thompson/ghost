// For tabbing... just do
// inputs = querySelectorAll("input");
// mousetrap.on("tab", inputs.highlightNext()); and wrap highlightNext around
// to the beginning
var 

  // Namespace for storing grid stuffz
  grid = {
    template: doT.template("..."),
    nodes: {
      querySelector...
      get all and by row..
      make a grid of Cells, where each cell has a root element, and a 
      neighbors property which is an array of 4 Cell elements (top, right, bottom, left)
    }
  },

  // This will be an assortment of 
  cells;
(function (window, document, undefined) {

  var Cell = function () {};
  Cell.prototype.setElement = function (el) {
    this.el = el;
  };
  Cell.prototype.bindNeighbors = function (el, index, nodes) {
    this.neighbors = [
        nodes[index - 8] || null
      , nodes[index + 1] || null
      , nodes[index + 8] || null
      , nodes[index - 1] || null
    ];
  };


  $.getJSON("blank.json", function (data) {

    var fragment = document.createElement("div");
    fragment.innerHTML = gridTmpl({ "grid": data.grid });

    var nodes = {};
    nodes.all = fragment.querySelectorAll("td");
    nodes.row = [];
    var rows = Array.prototype.slice.call(fragment.querySelectorAll("tr"));
    rows.forEach(function (row) {
      nodes.row.push(row.querySelectorAll("td"));
    });

    document.body.appendChild(fragment.firstChild);

  });

  var gridTmpl = doT.template([
      "<table>",
        "{{~ it.grid :row:i }}",
          "<tr>",
            "{{~ row :cell:j }}",
              "<td>C#01 .. .. ....</td>",
            "{{~}}",
          "</tr>",
        "{{~}}",
      "</table>"
    ].join(""));

  // cellEdit and cellLock partials...

})(this, this.document);




// Ok so we'll do something like this...

var gridTmpl = doT.template([
    "<table>",
      "{{~ it.grid :row:i }}",
        "<tr>",
          "{{~ row :cell:j }}",
            "<td>C#01 .. .. ....</td>",
          "{{~}}",
        "</tr>",
      "{{~}}",
    "</table>"
  ].join(""));

var frag = document.createElement("div");
frag.innerHTML = gridTmpl.render();

// perform a set of querySelectorAll calls to create references to the dom
// elements we've just created. Make a Cell class that references each table
// cell, bind events to the cell's input text fields, bind a Neighbors param
// that identifies the four surrounding neighbors... then cache a reference
// to the current active cell (top left). Boom. Ok now mousetrap just listens
// for the up arrow -> activeCell.neighbor[top] becomes active. That easy.
// Also, use a querySelectorAll to find all possible inputs on the page, and
// cache a reference to the currently focused input. Then when the user hits
// "tab" override the default action to focus the next index (wrap around
// the grid).

