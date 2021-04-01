
// set the dimensions and margins of the graph
var width = 460
var height = 460
var radius = width / 2 // radius of the dendrogram
var json = "https://spreadsheets.google.com/feeds/cells/1nIicYXU8mvfRoOoD1MbJCaGa6p_r95eAHgW2DDMIH-Y/1/public/full?alt=json"
var test = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_dendrogram.json"

// Static Variables

// append the svg object to the body of the page
var svg = d3.select("#dendrogram")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + radius + "," + radius + ")");

// Node Style
var rad = 5;
var fill = "#69b3a2";
var stroke = "black";
var strokeWidth = .5;

// Link Style


// This is the data from the Google Sheet
var vcData = [
    {
      "Tier_1": "Visual Channel",
      "Tier_2": "V1",
      "Tier_3": "",
      "Image URL": "",
      "VC_Name": "Form"
    },
    {
      "Tier_1": "Visual Channel",
      "Tier_2": "V1",
      "Tier_3": "",
      "Image URL": "",
      "VC_Name": "Color"
    },
    {
      "Tier_1": "Visual Channel",
      "Tier_2": "V1",
      "Tier_3": "",
      "Image URL": "",
      "VC_Name": "Movement1"
    },
    {
      "Tier_1": "Visual Channel",
      "Tier_2": "Visual Hierarchy",
      "Tier_3": "",
      "Image URL": "",
      "VC_Name": "Color1"
    },
    {
      "Tier_1": "Visual Channel",
      "Tier_2": "Visual Hierarchy",
      "Tier_3": "",
      "Image URL": "",
      "VC_Name": "Orientation"
    },
    {
      "Tier_1": "Visual Channel",
      "Tier_2": "Visual Hierarchy",
      "Tier_3": "",
      "Image URL": "",
      "VC_Name": "Size"
    },
    {
      "Tier_1": "Visual Channel",
      "Tier_2": "Visual Hierarchy",
      "Tier_3": "",
      "Image URL": "",
      "VC_Name": "Motion"
    },
    {
      "Tier_1": "Visual Channel",
      "Tier_2": "Visual Hierarchy",
      "Tier_3": "",
      "Image URL": "",
      "VC_Name": "Depth"
    },
    {
      "Tier_1": "Data Type",
      "Tier_2": "Qualitative Data",
      "Tier_3": "Nominal data",
      "Image URL": "",
      "VC_Name": "Gender"
    },
    {
      "Tier_1": "Data Type",
      "Tier_2": "Qualitative Data",
      "Tier_3": "Nominal data",
      "Image URL": "",
      "VC_Name": "Hair color"
    },
    {
      "Tier_1": "Data Type",
      "Tier_2": "Qualitative Data",
      "Tier_3": "Nominal data",
      "Image URL": "",
      "VC_Name": "Ethnicity"
    },
    {
      "Tier_1": "Data Type",
      "Tier_2": "Qualitative Data",
      "Tier_3": "Ordinal data",
      "Image URL": "",
      "VC_Name": "First, Second"
    },
    {
      "Tier_1": "Data Type",
      "Tier_2": "Qualitative Data",
      "Tier_3": "Ordinal data",
      "Image URL": "",
      "VC_Name": "Letter grade"
    },
    {
      "Tier_1": "Data Type",
      "Tier_2": "Qualitative Data",
      "Tier_3": "Ordinal data",
      "Image URL": "",
      "VC_Name": "Economic status"
    },
    {
      "Tier_1": "Data Type",
      "Tier_2": "Quantitative Data",
      "Tier_3": "Discrete data",
      "Image URL": "",
      "VC_Name": "Students number"
    },
    {
      "Tier_1": "Data Type",
      "Tier_2": "Quantitative Data",
      "Tier_3": "Discrete data",
      "Image URL": "",
      "VC_Name": "Workers number"
    },
    {
      "Tier_1": "Data Type",
      "Tier_2": "Quantitative Data",
      "Tier_3": "Discrete data",
      "Image URL": "",
      "VC_Name": "Population"
    },
    {
      "Tier_1": "Data Type",
      "Tier_2": "Quantitative Data",
      "Tier_3": "Continuous data",
      "Image URL": "",
      "VC_Name": "Height of children "
    },
    {
      "Tier_1": "Data Type",
      "Tier_2": "Quantitative Data",
      "Tier_3": "Continuous data",
      "Image URL": "",
      "VC_Name": "Speed of cars"
    },
    {
      "Tier_1": "Color",
      "Tier_2": "Color Dimensions",
      "Tier_3": "",
      "Image URL": "",
      "VC_Name": "Hue"
    },
    {
      "Tier_1": "Color",
      "Tier_2": "Color Dimensions",
      "Tier_3": "",
      "Image URL": "",
      "VC_Name": "Satuation"
    },
    {
      "Tier_1": "Color",
      "Tier_2": "Color Dimensions",
      "Tier_3": "",
      "Image URL": "",
      "VC_Name": "Brightness"
    },
    {
      "Tier_1": "Color",
      "Tier_2": "Color Discriminability",
      "Tier_3": "",
      "Image URL": "",
      "VC_Name": "Color perceptions differ"
    },
    {
      "Tier_1": "Color",
      "Tier_2": "Color Discriminability",
      "Tier_3": "Mark types",
      "Image URL": "",
      "VC_Name": "Circles"
    },
    {
      "Tier_1": "Color",
      "Tier_2": "Color Discriminability",
      "Tier_3": "Mark types",
      "Image URL": "",
      "VC_Name": "Rectangular"
    },
    {
      "Tier_1": "Color",
      "Tier_2": "Color Discriminability",
      "Tier_3": "Mark types",
      "Image URL": "",
      "VC_Name": "Lines"
    },
    {
      "Tier_1": "Color",
      "Tier_2": "Color Discriminability",
      "Tier_3": "Robust",
      "Image URL": "",
      "VC_Name": "Identifiable"
    },
    {
      "Tier_1": "Attention",
      "Tier_2": "",
      "Tier_3": "",
      "Image URL": "",
      "VC_Name": "Fomo"
    },
    {
      "Tier_1": "Attention",
      "Tier_2": "Disturbing",
      "Tier_3": "Transition point",
      "Image URL": "",
      "VC_Name": "Symbol"
    },
    {
      "Tier_1": "Attention",
      "Tier_2": "Disturbing",
      "Tier_3": "Transition point",
      "Image URL": "",
      "VC_Name": "Color2"
    },
    {
      "Tier_1": "Attention",
      "Tier_2": "Physiological network",
      "Tier_3": "",
      "Image URL": "",
      "VC_Name": "Alerting"
    },
    {
      "Tier_1": "Attention",
      "Tier_2": "Inattention blindness",
      "Tier_3": "",
      "Image URL": "",
      "VC_Name": "Orienting"
    },
    {
      "Tier_1": "Attention",
      "Tier_2": "Inattention blindness",
      "Tier_3": "",
      "Image URL": "",
      "VC_Name": "Executing"
    },
    {
      "Tier_1": "Attention",
      "Tier_2": "Inattention blindness",
      "Tier_3": "",
      "Image URL": "",
      "VC_Name": "You see what you seek"
    },
    {
      "Tier_1": "Motion",
      "Tier_2": "Internal",
      "Tier_3": "Eye movement",
      "Image URL": "",
      "VC_Name": "Capture objects"
    },
    {
      "Tier_1": "Motion",
      "Tier_2": "Internal",
      "Tier_3": "Gesture",
      "Image URL": "",
      "VC_Name": "Understand contents"
    },
    {
      "Tier_1": "Motion",
      "Tier_2": "Internal",
      "Tier_3": "Mind",
      "Image URL": "",
      "VC_Name": "Decode informtion"
    },
    {
      "Tier_1": "Motion",
      "Tier_2": "Extenal",
      "Tier_3": "",
      "Image URL": "",
      "VC_Name": "Movement2"
    },
    {
      "Tier_1": "Motion",
      "Tier_2": "Extenal",
      "Tier_3": "Variable changing",
      "Image URL": "",
      "VC_Name": "Color3"
    },
    {
      "Tier_1": "Motion",
      "Tier_2": "Extenal",
      "Tier_3": "Variable changing",
      "Image URL": "",
      "VC_Name": "Brightness"
    },
    {
      "Tier_1": "Motion",
      "Tier_2": "Extenal",
      "Tier_3": "Variable changing",
      "Image URL": "",
      "VC_Name": "Shapw"
    },
    {
      "Tier_1": "Motion",
      "Tier_2": "Extenal",
      "Tier_3": "Variable changing",
      "Image URL": "",
      "VC_Name": "Size"
    },
    {
      "Tier_1": "Motion",
      "Tier_2": "Extenal",
      "Tier_3": "Spatial",
      "Image URL": "",
      "VC_Name": "Enhance conceptual inference"
    }
   ];

console.log(vcData, "vc")

// Now let's nest it properly
var nest = d3.nest()
    .key(function(d){
        return d.Tier_1;
    })
    .key(function(d){
        return d.Tier_2;
    })
    .key(function(d){
        return d.Tier_3;
    })
   .entries(vcData);

var finalData = {key: "Visual Cognition", values: nest};

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
  .style("fill", 'none')
  .attr("stroke", '#ccc')


// Tooltip

var tooltip = d3.select("#dendrogram")
  .append("div")
  .style("opacity",1)
  .attr("class", "tooltip")

// hover
var mouseover = function(d){
  tooltip.style("opacity",1)
  d3.select(this)
    .style("stroke", "black")
    .style("opacity", 1);
};

// mouse move
var mousemove = function(d) {
  console.log(d, "d")
  tooltip
    .html(d.data.key)
    .style("left", (d3.mouse(this)[0]+70) + "px")
    .style("top", (d3.mouse(this)[1]) + "px")
}
var mouseleave = function(d) {
  tooltip
    .style("opacity", 0)
  d3.select(this)
    .style("stroke", "none")
    .style("opacity", 0.8)
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
    .attr("r", rad)
    .style("fill", fill)
    .attr("stroke", stroke)
    .style("stroke-width", strokeWidth)
  .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave);


