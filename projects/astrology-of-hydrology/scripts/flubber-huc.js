var svgFlubber = document.querySelectorAll(".flubber-path");
var pathStrings = Array.from(svgFlubber).map(d => d.getAttribute("d"));

console.log(pathStrings, "path strings");
// Remove all the paths except the first
d3.selectAll(".flubber-path")
  .filter(function(d, i) { return i; })
  .remove();

d3.select(".flubber-path")
  .style("display", "block")
  .call(animate);

function animate(sel) {
  var start = pathStrings.shift(),
      end = pathStrings[0];

  pathStrings.push(start);

  sel
    .datum({ start, end })
    .transition()
    .duration(1500)
    .attrTween("d", function(d){
      return flubber.interpolate(d.start, d.end, { maxSegmentLength: 0.1 })
    })
    .on("end", function() {
      sel.call(animate);
    });
}