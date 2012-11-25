
/**
 * Cell constructor for binding data to DOM elements and efficiently
 * caching element references
 *
 * @param {DOMElement} root
 */

function Cell (root) {
  this.root = root;
}

/**
 * Bind child inputs to update cell data on blur
 */

Cell.prototype.bindInputs = function () {
  var that = this;
  this.inputs = Array.prototype.slice.call(this.root.querySelectorAll("input"));
  inputs.forEach(function (input) {
    input.addEventListener("blur", function (e) {
      that.update();
    });
  });
};

/**
 * Read input values and update data accordingly
 */

Cell.prototype.update = function () {
  this.note = this.inputs[0].substr(0, 2);
  this.instrument = this.inputs[0].substr(2, 4);
};


var grid = {

    template: doT.template([
      "<table>",
        "{{~ it.grid :row:i }}",
          "<tr>",
            "{{~ row :cell:j }}",
              "<td>",
                "<input type=\"text\" placeholder=\"....\" value=\"{{= (cell.note || \"\") + (cell.instrument || \"\") }}\">",
                "<input type=\"text\" placeholder=\"..\" value=\"{{= (cell.gain || \"\") }}\">",
                "<input type=\"text\" placeholder=\"..\" value=\"{{= (cell.pan || \"\") }}\">",
                "<input type=\"text\" placeholder=\"....\" value=\"{{= (cell.effect || \"\") + (cell.effectValue || \"\") }}\">",
              "</td>",
            "{{~}}",
          "</tr>",
        "{{~}}",
      "</table>"
    ].join(""))

  , nodes: {}
  , cells: []

}

var fragment = document.createElement("div");

$.getJSON("js/fixtures/blank.json", function (data) {

  fragment.innerHTML = grid.template({ grid: data.grid });

  grid.nodes.rows = Array.prototype.slice.call(fragment.querySelectorAll("tr"));
  document.body.appendChild(fragment.firstChild);

  // Profiling: 26.6ms including paint
  // 200 BPM at 8 LPB expects a redraw every 37.5ms
  // Limiting the BPM and LPB at those values leaves at least 10.9ms for 
  // scheduling sounds. Should be ok... right?
  window.highlightNextRow = (function () {
    var i = 0
      , len = grid.nodes.rows.length;
    return function () {
      grid.nodes.rows[i].classList.remove("highlight");
      if (++i >= len) { i -= len; }
      grid.nodes.rows[i].classList.add("highlight");
    };
  })();

});


