var width = 600,
height = width,
radius = width/2,
maxRad = 20,
distance = 40, // radial spread
duration = 100,
selectedDepth,
depth = 6;

console.log(width, "width")

// colors for nodes
var colors = {
    collapsed: "black",
    expanded: "black",
    leaf: "#000000",
    highlight: "#d9664a"
}


var nodes,links;
var i = 0;


// Extra Content
var tooltip = d3.select("#tooltip")
  .append("div")
    .style("opacity",0)
    .attr("class", "tooltip");
var details = d3.select("#details")
  .style("opacity",1);
var topic = d3.select("#topic");
var topicDesc = d3.select("#topic-description");
var topicImg = d3.select("#topic-image");

// Draw SVG and G
var svg = d3.select("#dendrogram")
    .append("svg")
    .attr("width",width)
    .attr("height",height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("id","dendrogram-svg")
    .attr("class", "svg-content-responsive");

// Draw background circles
var gBackground = svg.append("g")
    .attr("id","background ")
    .attr("transform", "translate(" + radius + "," + radius + ")");

for (i=0; i<depth; i++) {
    gBackground.append("circle")
        .attr("class","background-circle")
        .attr("id", i)
        .attr("r", distance*i)
        .on("click", collapseTo);
};

// Get ready to draw the tree!
var g = svg.append("g")
    .attr("id","tree")
    .attr("transform", "translate(" + radius + "," + radius + ")");
    


// Connector Function
function connector(d) {
    return "M" + project(d.x, d.y)
        + "C" + project(d.x, (d.y + d.parent.y) / 2)
        + " " + project(d.parent.x, (d.y + d.parent.y) / 2)
        + " " + project(d.parent.x, d.parent.y)
};





var treeMap = d3.tree()
    .size([width/1.7,height/1.7]), // this is how much of the circumference the outer ring of nodes takes up
    root;

var nodeSvg, linkSvg, nodeEnter, linkEnter;

d3.json("data/vcContent.json",function(error,treeData){
    if(error) throw error;


    root = d3.hierarchy(treeData,function(d){
        return d.children;
    });

    console.log(treeData, "turns into ", root);

    root.each(function (d) {
        d.name = d.data.name; //transferring name to a name variable
        d.id = i; //Assigning numerical Ids
        i += i;
    });

    root.x0 = height / 2;
    root.y0 = 0;





    update(root);

});

function update(source) {

    nodes = treeMap(root).descendants();
    //links = root.descendants().slice(1);
    links = nodes.slice(1);
    //console.log(links);
    var nodeUpdate;
    var nodeExit;

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * distance; });
    nodeSvg = g.selectAll(".node")
        .data(nodes,function(d) { return d.id || (d.id = ++i); });
       

    //nodeSvg.exit().remove();

    var nodeEnter = nodeSvg.enter()
        .append("g")
        //.attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + project(d.x, d.y) + ")"; });

    nodeEnter.append("circle")
        .attr("r", function(d){ return maxRad/(2*d.data.depth) })
        .style("fill", color)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .on("click",click);


    nodeEnter.append('g')
        .attr("class","node-label-group")    
    .append("text")
        .attr("dy", ".1em")
        .attr("x", function(d) { return d.x < 180 === !d.children ? 10 : -10; })
        .attr("class","node-label")
        .style("text-anchor", function(d) { return d.x < 180 === !d.children ? "start" : "end"; })
        .style("opacity", function(d) {
            // console.log(d, "inside")
            if (d.children) { 
                return 0;
            } else if (d.children = null) {
                return 1;
            } else {
                return 1;
            }
        })
        .attr("transform", function(d) { return "rotate(" + (d.x < 180 ? d.x - 90 : d.x + 90) + ")"; }) // adjust this as needed for text rotation
        .text(function(d) {  return d.data.name; });

    // Transition nodes to their new position.
    var nodeUpdate = nodeSvg.merge(nodeEnter).transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + project(d.x, d.y) + ")"; });


    nodeSvg.select("circle")
        .style("fill", color);

    nodeUpdate.select("text")
        .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = nodeSvg.exit().transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; }) //for the animation to either go off there itself or come to centre
        .remove();

    nodeExit.select("circle")
        .attr("r", 0);

    nodeExit.select("text")
        .style("fill-opacity", 0);

    nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });


    linkSvg = g.selectAll(".link")
        .data(links, function(link) { var id = link.id + '->' + link.parent.id; return id; });
    
    // Transition links to their new position.
    linkSvg.transition()
        .duration(duration);
        // .attr('d', connector);

    // Enter any new links at the parent's previous position.
    linkEnter = linkSvg.enter().insert('path', 'g')
        .attr("class", "link")
        .attr("d", function(d) {
            return "M" + project(d.x, d.y)
                    + "C" + project(d.x, (d.y + d.parent.y) / 2)
                    + " " + project(d.parent.x, (d.y + d.parent.y) / 2)
                    + " " + project(d.parent.x, d.parent.y);
        });
        /*
        function (d) {
            var o = {x: source.x0, y: source.y0, parent: {x: source.x0, y: source.y0}};
            return connector(o);
        });*/

    // Transition links to their new position.
    linkSvg.merge(linkEnter).transition()
        .duration(duration)
        .attr("d", connector);


    // Transition exiting nodes to the parent's new position.
    linkSvg.exit().transition()
        .duration(duration)
        .attr("d", /*function (d) {
            var o = {x: source.x, y: source.y, parent: {x: source.x, y: source.y}};
            return connector(o);
        })*/function(d) {
                    return "M" + project(d.x, d.y)
                            + "C" + project(d.x, (d.y + d.parent.y) / 2)
                            + " " + project(d.parent.x, (d.y + d.parent.y) / 2)
                            + " " + project(d.parent.x, d.parent.y);
                })
        .remove();
};


//testing using depth to open at a specified level
function collapseLevel(d, selectedDepth) {

    if (d.children && d.depth > selectedDepth) { // dynamically set the selectedDepth by clicking on the background circles
        d._children = d.children;
        d._children.forEach(collapseLevel);
        d.children = null;
    } else if (d.children && d.depth < selectedDepth){
        d.children.forEach(collapseLevel);
    }
};

async function collapseTo() {
    let selectedDepth = await d3.select(this).attr("id");
    console.log(selectedDepth, "level, and ", root);
    root.children.forEach(collapseLevel); //iterate each node and collapse excluding node zero
    console.log(root, "after forEach")
    update(root);
}




function expand(d){   
    var children = (d.children)?d.children:d._children;
    if (d._children) {        
        d.children = d._children;
        d._children = null;       
    }
    if(children)
      children.forEach(expand);
}

function expandAll(){
    expand(root); 
    update(root);
}


function color(d) {
  return d._children ? colors.collapsed // collapsed package
      : d.children ? colors.expanded // expanded package
      : colors.leaf; // leaf node
}

function project(x, y) {
  var angle = (x - 90) / 180 * Math.PI, radius = y;
  return [radius * Math.cos(angle), radius * Math.sin(angle)];
}

// click
function click(d) {
    var prompt = d3.select("#prompt").style("display","none");
    console.log(d,"click!!!!")
    var t = {
        name: d.data.name,
        description: d.data.description,
        img: d.data.img
    };

    topic.text(t.name);
    topicDesc.text(t.description);
    topicImg.attr("src",t.img);
    

  if (d.children) { // this system uses a system of toggling data between .children and ._children. Ha!
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);

  d3.selectAll("circle").classed("active", false);
  d3.select(this).classed("active", true);
}

// hover
var mouseover = function(d){
    tooltip.text(d.name)
        .style("opacity",1);
    d3.select(this)
      .style("stroke", "black")
      .style("fill", colors.highlight);
  };

// mouse move
var mousemove = function(d) {
    tooltip
        .style("left", (d3.event.pageX + 8) + "px")
        .style("top", (d3.event.pageY) + "px");
    // d3.selectAll(".node")
    //     .style("opacity", .5);
    d3.select(this)
        .style("stroke", "black")
        .style("fill", colors.highlight);
};
  
// mouse leave
var mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke-width", 0);
  };




// Buttons

// expand all button
var resetButton = d3.select("#reset-button")
  .on("click", expandAll);

// node label toggle
var toggle = false;

d3.select("#node-label-toggle").on("click", function() {
    // if (toggle === false) {
    //     var visibility = "hidden";
    // } else if (toggle === true) {
    //     var visibility = "visible"
    // }
    //  d3.selectAll(".node-label").style("visibility", +(visibility = !visibility));
    d3.selectAll(".node-label").style("opacity", +(toggle = !toggle));
    console.log(toggle,'toggle')
})

// background circle toggle
var toggleCirc = true;

d3.select("#background-circle-toggle").on("click", function() {
    d3.selectAll(".background-circle").style("opacity", +(toggleCirc = !toggleCirc));
})
