
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
              "<td>C#01 .. .. ....</td>",
            "{{~}}",
          "</tr>",
        "{{~}}",
      "</table>"
    ].join(""))

  , nodes: {}
  , cells: []

}

var fragment = document.createElement("div");

$.getJSON("blank.json", function (data) {

  document.body.appendChild(fragment.firstChild);

});

