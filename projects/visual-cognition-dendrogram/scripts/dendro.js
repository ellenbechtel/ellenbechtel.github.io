
// set the dimensions and margins of the graph
var width = 700
var height = 700
var radius = width / 2 // radius of the dendrogram
var json = "https://spreadsheets.google.com/feeds/cells/1nIicYXU8mvfRoOoD1MbJCaGa6p_r95eAHgW2DDMIH-Y/1/public/full?alt=json"
var test = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_dendrogram.json"

// Static Variables

// append the svg object to the body of the page
var svg = d3.select("#dendrogram")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id","#dendrogram-svg")
  .append("g")
    .attr("transform", "translate(" + radius + "," + radius + ")");

// Node Style
var rad = 5;

// Link Style


// This is the data from the Google Sheet
var vcData = [];
console.log(vcData, "vc")

// // Now let's nest it properly
// var nest = d3.nest()
//     .key(function(d){
//         return d.Tier_1;
//     })
//     .key(function(d){
//         return d.Tier_2;
//     })
//     .key(function(d){
//         return d.Tier_3;
//     })
//    .entries(vcData);

// var finalData = {key: "Visual Cognition", values: nest};
var root = d3.stratify()
 .id(function(d) { 
  console.log(d,"inside") 
  return d.id; })
 .parentId( function(d) { return d.parentId; })
 (vcData);

var finalData = root;
console.log(finalData,"final")



// Now draw! Create the cluster layout:
var cluster = d3.cluster()
    .size([360, radius - 60]);  // 360 means whole circle. radius - 60 means 60 px of margin around dendrogram

// Give the data to this cluster layout:
var root = d3.hierarchy(finalData, function(d) {
  return d.values;
});
cluster(root);

// Features of the links between nodes:
var linksGenerator = d3.linkRadial()
  .angle(function(d) { return d.x / 180 * Math.PI; })
  .radius(function(d) { return d.y; });

// Add the links between nodes:
svg.selectAll('path')
.data(root.links())
.enter()
.append('path')
  .attr("d", linksGenerator)
  .attr("class","link");


// Tooltip
var tooltip = d3.select("#dendrogram")
  .append("div")
    .style("opacity",1)
    .attr("class", "tooltip")


// Extra Content
var details = d3.select("#details")
  .style("opacity",1);
var topic = d3.select("#topic");

// hover
var mouseover = function(d){
  tooltip.style("opacity",1)
  d3.select(this)
    .style("stroke", "black")
    .style("opacity", 1);
};

// mouse move
var mousemove = function(d) {

  tooltip
    .text(d.data.key)
      .style("left", (d3.event.pageX + 5) + "px")
      .style("top", (d3.event.pageY + 20) + "px");

}

// mouse leave
var mouseleave = function(d) {
  tooltip
    .style("opacity", 0)
  d3.select(this)
    .attr("class", "visited")
  
}

// click
var click = function(d){
  console.log(d, "d")
  // details.html(d.data.key);
  topic.text(d.data.key);
}



// Add a circle for each node.
svg.selectAll("g")
  .data(root.descendants())
  .enter()
  .append("g")
  .attr("transform", function(d) {
      return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
  })
  .append("circle")
    .attr("class","node")
    .attr("r", rad)
  .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave)
  .on("click", click);


