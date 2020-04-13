
/////////////////////////////////
// BEEWARM CODE!
//////////////////////////////////

// Last updated at night, when something broke, so I undid everything and this is as far as I'd gotten.
// I used this code: https://bl.ocks.org/SpaceActuary/d6b5ca8e5fb17842d652d0de21e88a05 

/////////////////////////////////
// SET STATIC VARIABLES
//////////////////////////////////


var width = document.querySelector("#beeswarm").clientWidth;
var height = document.querySelector("#beeswarm").clientHeight;

var transitionTime = 1 * 1000; // 1 second
var forceStrength = 0.05;

var margin = {
    top: 20,
    right: 20,
    bottom: 100,
    left: 20 
};

var chartWidth = width-margin.left-margin.right;
var chartHeight = height - margin.top - margin.bottom;

// Use chartWidth and chartHeight as dimensions of the beeswarm chart, because it takes into account the margins.  Maybe we don't need the margins?

var svg = d3.select("#beeswarm")
    .attr("width", width)
    .attr("height", height);


/////////////////////////////////
// UPLOAD DATA
//////////////////////////////////

d3.csv("./donors.csv", function(donors) {
    
    /////////////////////////////////
    // MAKE HEIGHT AND WEIGHT SCALES
    //////////////////////////////////

    // Weight-to-Radius scale
    var weights = [];
    donors.forEach(function(d) {
        var thisOne = d.weight;
        if(weights.indexOf(thisOne)<0) {
            weights.push(thisOne);
        }
    });
    var maxWeight = d3.max(weights);
    var minWeight = d3.min(weights);
    var weightScale = d3.scaleSqrt()
        .domain([minWeight, maxWeight])
        .range([2,10]);


    // Height-to-Height scale
    var heights = [];
    donors.forEach(function(d) {
        var thisOne = d.height;
        if(heights.indexOf(thisOne)<0) {
            heights.push(thisOne);
        }
    });
    var maxHeight = d3.max(heights);
    var minHeight = d3.min(heights);
    var heightScale = d3.scaleLinear()
        .domain([minHeight, maxHeight])
        .range([4,12]);


    /////////////////////////////////
    // MAKE GROUPINGS AND DROPDOWNS
    //////////////////////////////////
    
    // No Alignment
    var all = [];

    // Sperm Bank of Origin
    var banks = [];
    donors.forEach(function(d) {
        var thisOne = d.bank;
        if(banks.indexOf(thisOne)<0) {
            banks.push(thisOne);
        }
    });
    banks = banks.sort();  

    // Blood Types
    var bloodTypes = [];
    donors.forEach(function(d) {
        var thisOne = d.bloodType;
        if(bloodTypes.indexOf(thisOne)<0) {
            bloodTypes.push(thisOne);
        }
    });
    bloodTypes = bloodTypes.sort();  

    // Race
    var races = [];
    donors.forEach(function(d) {
        var thisOne = d.race;
        if(races.indexOf(thisOne)<0) {
            races.push(thisOne);
        }
    });
    races = races.sort();

    // Religion
    var religions = [];
    donors.forEach(function(d) {
        var thisOne = d.religion;
        if(religions.indexOf(thisOne)<0) {
            religions.push(thisOne);
        }
    });
    religions = religions.sort();

    // Jewish Ancestry
    var jews = [];
    donors.forEach(function(d) {
        var thisOne = d.jewish;
        if(jews.indexOf(thisOne)<0) {
            jews.push(thisOne);
        }
    });
    jews = jews.sort();

    // No Alignment
    var all = [];
   
    // GROUP DROPDOWNS
    var dropdownGroup = d3.select("#dropdownGroup");
    var dropdownObj = [
        {label: "All", value: "all"},
        {label: "Sperm Bank", value: "banks"},
        {label: "Blood Type", value: "bloodTypes"},
        {label: "Race", value: "races"},
        {label: "Religion", value: "religions"},
        {label: "Jewish Ancestry", value: "jews"}
    ];

    var currentGrouping = dropdownObj[0].value;

    dropdownObj.forEach(function(o) {
        dropdownGroup.append("option")
            .property("value", o.value)
            .text(o.label);
    });

    var domainsObj = {
        all: all,
        banks: banks,
        bloodTypes: bloodTypes,
        races: races,
        religions: religions,
        jews: jews
    };

    // Update the beeswarm with each change of the dropdown
    

    dropdownGroup.on("change", function() {

        currentGrouping = this.value;

        //splitSpermies(currentGrouping);
        updateBeeswarm(currentGrouping, currentColorScale);
        console.log(currentGrouping);
    
    
    });



    /////////////////////////////////
    // MAKE COLOR SCALES AND DROPDOWNS
    //////////////////////////////////

    // COLOR SCALES

    var strokeColor = d3.scaleOrdinal(d3.interpolateRainbow);
    // None
    var none = ["none"];

    // Eye Color
    var eyeColors = [];
    donors.forEach(function(d) {
        var thisOne = d.eye;
        if(eyeColors.indexOf(thisOne)<0) {
            eyeColors.push(thisOne);
        }
    });
    eyeColors = eyeColors.sort();

    // Hair Color
    var hairColors = [];    
    donors.forEach(function(d) {
        var thisOne = d.hair;
        if(hairColors.indexOf(thisOne)<0) {
            hairColors.push(thisOne);
        }
    });
    hairColors = hairColors.sort();
   
    // Skin Color
    var skinColors = [];
    donors.forEach(function(d) {
        var thisOne = d.skintone;
        if(skinColors.indexOf(thisOne)<0) {
            skinColors.push(thisOne);
        }
    });
    skinColors = skinColors.sort();


    // DROPDOWNS

    // Color Dropdown Options
    var dropdownColor = d3.select("#dropdownColor");

    var dropdownColorObj = [
        //{label: "Nothing", value: "none", colors: "white"},
        {label: "Eye Color", value: "eyeColors", colors: "green"},  // how do I make these arrays of the color options???
        {label: "Hair Color", value: "hairColors", colors: "gray"},
        {label: "Skin Tone", value: "skinColors", colors: "blue"},
    ];

    var currentColorScale = dropdownColorObj[0].values;
    var currentColorOptions = dropdownColorObj[0].colors;
    
    dropdownColorObj.forEach(function(o) {
        dropdownColor.append("option")
            .property("value", o.value)
            .text(o.label);
    });

    var domainsColorObj = {
        none: none,
        eyeColors: eyeColors,
        hairColors: hairColors,
        skinColors: skinColors
    }

    dropdownColor.on("change", function() {
        currentColorScale = this.value;
        // ADD IN COLOR OPTIONS HERE!
        updateBeeswarm(currentGrouping, currentColorScale);
    });
    
    /*
    var colorScale = d3.scaleOrdinal()
        .domain(domainsColorObj[currentColorScale])
        .range(currentColors);
    */

    /////////////////////////////////
    // WRITE FUNCTION TO ENTER / UPDATE / EXIT CAUCUS ALIGNMENTS
    //////////////////////////////////

    function updateBeeswarm(currentGrouping, currentColorScale) {

        /////////////////////////////////
        // MAKE INITIAL SIMULATION
        //////////////////////////////////

        console.log(domainsObj[currentGrouping], chartWidth);

        var xScale = d3.scalePoint()
            .padding(1)
            .rangeRound([0, chartWidth]);
        

        var simulation = d3.forceSimulation(donors)
            .nodes(donors)
            .velocityDecay(0.2)
            .force("gravity", d3.forceManyBody().strength(.15))
            .force("collide", d3.forceCollide().radius(function(d) { return heightScale(d.height) + 2 ; })) 
            //.force("center", d3.forceCenter(chartWidth/2, chartHeight/2)) // I want height to be calculated by height, and width to be centered along the axes for the ordinal scales
            .force("y", d3.forceY().y(height / 2))
            .force("x", d3.forceX().x(width / 2))
            .on("tick", tick);

           
        function tick() {
            spermies
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
         };
        
            
        // Put all the spermies in a group on the svg canvas
        var spermies = svg.select("#spermSwarm").selectAll(".spermies")
            .data(donors); // do I add a key in here?

        // Enter
        var enter = spermies.enter()
            .append("ellipse")
            .attr("class","spermies")
            .attr("fill", "white")
            .attr("rx", function(d) { return weightScale(d.weight); })
            .attr("ry", function(d) { return heightScale(d.height); })
            .attr("cx", function(d,i) { return width*Math.random(); })  
            .attr("cy", function(d,i) { return height*Math.random(); }) 
            //.attr("transform", function(d,i) {return "rotate(" + 180*Math.random() + ")";})
            // .call(d3.drag()
            //     .on("start", dragstarted)
            //     .on("drag", dragged)
            //     .on("end", dragended)
            // )
            ;
        
        // Update
        spermies.merge(enter)
            .transition()
            .duration(transitionTime/4);


        /////////////////////////////////
        // MAKE GROUPINGS
        //////////////////////////////////

        // Make Titles

        function hideTitles() {
            svg.select("#titles").selectAll('.title').exit().transition().remove();
        };

        function showTitles(currentGrouping) {
            var titles = svg.select("titles").selectAll('.title')
                .data(donors);

            titles.enter().append("text")
                .attr("class", "title")
                .merge(titles)
                    .attr('x', function(d) { return xScale(d); })
                    .attr('y', 40)
                    .attr('text-anchor', 'middle')
                    .text(function (d) { return donors[currentGrouping] });

            titles.exit().remove();
        };

        // Split Spermies

        function splitSpermies(currentGrouping) {
            xScale.domain(donors.map(function(d) { return d[currentGrouping]; }));

            if(currentGrouping=="all") {
                hideTitles()
            } else {
                showTitles(currentGrouping, xScale);
            }

            // Reset the 'x' force to draw the bubbles to their centers
            simulation.force('x', d3.forceX().strength(forceStrength).x(function(d){ 
                return xScale(d[currentGrouping]);
            }));

            // @v4 We can reset the alpha value and restart the simulation
            simulation.alpha(2).restart();

        };

         // Update the beeswarm with each change of the dropdown
        dropdownGroup.on("change", function() {

            currentGrouping = this.value;

            splitSpermies(currentGrouping);
            //updateBeeswarm(currentGrouping, currentColorScale);
        
        
        });


        /////////////////////////////////
        // Tooltip
        //////////////////////////////////

        var tooltip = d3.select("#tooltip");

        spermies.on("mouseover", function(d) {
    
            var cx = event.clientX + 10;
            var cy = event.clientY + 130;
    
            tooltip
                .style("visibility","visible")
                .style("left", cx + "px")
                .style("top", cy + "px")
                .html("Donor " + d.donorNum +"<br>" + d.bank);

            svg.selectAll(".spermies")
                .transition()
                .duration(transitionTime/4)
                .attr("opacity",0.2);

            d3.select(this)
                .transition()
                .duration(transitionTime/4)
                .attr("opacity",0.8);
    
        }).on("mouseout", function() {
            tooltip.style("visibility","hidden");
            svg.selectAll(".spermies")
                .transition()
                .duration(transitionTime/4)
                .attr("opacity",0.8);
    
        }).on("click", function() {
            d3.select(this)
                .style("stroke", "#D5B63B") // make this change in order of clickage
                .style("stroke-width", "3")
        })
        

        // add a click out reset??

    };
    /////////////////////////////////
    // DRAW THE SPERMIES
    //////////////////////////////////

    updateBeeswarm(currentGrouping, currentColorScale);

    /////////////////////////////////
    // Dragging
    //////////////////////////////////
    
    // function dragstarted(d,i) {
    //     //console.log("dragstarted " + i)
    //     if (!d3.event.active) simulation.alpha(1).restart();
    //     d.fx = d.x;
    //     d.fy = d.y;
    //   }

    //   function dragged(d,i) {
    //     //console.log("dragged " + i)
    //     d.fx = d3.event.x;
    //     d.fy = d3.event.y;
    //   }
  
    //   function dragended(d,i) {
    //     //console.log("dragended " + i)
    //     if (!d3.event.active) simulation.alphaTarget(0);
    //     d.fx = null;
    //     d.fy = null;
    //     var me = d3.select(this)
    //     console.log(me.classed("selected"))
    //     me.classed("selected", !me.classed("selected"))
        
    //     // d3.selectAll("circle")
    //     //   .style("fill", function(d, i){ return color(d.ID); })
      	
    //     // d3.selectAll("circle.selected")
    //     //   .style("fill", "none")
      	
    //   } 



});














 /////////////////////////////////
    // Tooltip and Selection of Spermies
    //////////////////////////////////  

    // Tooltip Content Functions

    // convert inches to a ft/in format for easier reading
    function convertToFt(inches) {
        var feet = Math.round(inches/12);
        var rInches = Math.round(inches % 12);

        return feet + "ft " + rInches + "in";

    };

    // Age
    function ttAge(age) {
        if(age == true) { return "'<span class='info'>Age at Donation: </span><span class='value'>' + age + '</span><br/>'";
        } else { return "" };
    };

    // Price
    function ttPr(pr) {
        if(pr == true) { return "'<span class='info'>Price per Vial: </span><span class='value'>' + d.price + '</span><br/>'";
        } else { return "" };
    };

    // Look Alikes
    function ttLook(look) {
        if(look == true) { return "'<span class='info'>Look Alikes: </span><span class='value'>' + d.lookAlikes + '</span><br/>'";
        } else { return "" };
    };

    // Hand
    function ttHand(hand) {
        if(hand == true) { return "'<span class='info'>Dominant Hand: </span><span class='value'>' + d.dominantHand + '</span><br/>'";
        } else { return "" };
    };

    // Shoe Size
    function ttShoe(shoe) {
        if(shoe == true) { return "'<span class='info'>Shoe Size: </span><span class='value'>' + d.shoeSize + '</span><br/>'";
        } else { return "" };
    };

    // Face
    function ttFace(f) {
        if(f == true) { return "'<span class='info'>Face Shape: </span><span class='value'>' + d.faceShape + '</span><br/>'";
        } else { return "" };
    };

    // Lips
    function ttLips(l) {
        if(l == true) { return "'<span class='info'>Lips: </span><span class='value'>' + d.lips + '</span><br/>'";
        } else { return "" };
    };

    // Nose
    function ttNose(l) {
        if(l == true) { return "'<span class='info'>Nose: </span><span class='value'>' + d.noseShape + '</span><br/>'";
        } else { return "" };
    };

    // Chest
    function ttChest(l) {
        if(l == true) { return "'<span class='info'>Hairy Chest: </span><span class='value'>' + d.hairyChest + '</span><br/>'";
        } else { return "" };
    };

    // Beard
    function ttBeard(l) {
        if(l == true) { return "'<span class='info'>Beard Color: </span><span class='value'>' + d.beardColor + '</span><br/>'";
        } else { return "" };
    };

    // Eyebrows
    function ttEyebrows(l) {
        if(l == true) { return "'<span class='info'>Eyebrows: </span><span class='value'>' + d.eyebrows + '</span><br/>'";
        } else { return "" };
    };

    // Dimples
    function ttDimp(l) {
        if(l == true) { return "'<span class='info'>Dimples: </span><span class='value'>' + d.dimples + '</span><br/>'";
        } else { return "" };
    };

    // Acne
    function ttAcne(l) {
        if(l == true) { return "'<span class='info'>Acne: </span><span class='value'>' + d.acne + '</span><br/>'";
        } else { return "" };
    };

    // Hair Loss
    function ttLoss(l) {
        if(l == true) { return "'<span class='info'>Hair Loss: </span><span class='value'>' + d.hairLoss + '</span><br/>'";
        } else { return "" };
    };

    // Degree
    function ttDegree(l) {
        if(l == true) { return "'<span class='info'>Degree: </span><span class='value'>' + d.degree + '</span><br/>'";
        } else { return "" };
    };

    // Occupation
    function ttOcc(l) {
        if(l == true) { return "'<span class='info'>Occupation: </span><span class='value'>' + d.occupation + '</span><br/>'";
        } else { return "" };
    };

    // Sign
    function ttSign(l) {
        if(l == true) { return "'<span class='info'>Astrological Sign: </span><span class='value'>' + d.dimples + '</span><br/>'";
        } else { return "" };
    };




    // Tooltip
    var tooltip = d3.select("#tooltip");

    spermies.on("mouseover", function(d) {
        tooltip 
            .style("visibility","visible")
            .html(
                '<span class="info">Donor: </span><span class="value">' + d.donorNum + '</span><br/>' +
                '<span class="info">Bank: </span><span class="value">' + d.bank + '</span><br/>' +
                '<span class="info">Blood Type: </span><span class="value">' + d.bloodType + '</span><br/>' +
                ttAge(d.age) +
                ttPr(d.price) +

                '<br>' +                
                '<span class="info">Body: </span><span class="value">' + convertToFt(d.height) + ', ' + d.weight + 'lbs</span><br/>' +
                '<span class="info">Eye Color: </span><span class="value">' + d.eye + '</span><br/>' +
                '<span class="info">Hair: </span><span class="value">' + d.hairTexture + ' ' + d.hair + '</span><br/>' +
                '<span class="info">Skintone: </span><span class="value">' + d.skintone + '</span><br/>' +
                '<span class="info">Race: </span><span class="value">' + d.race + '</span><br/>' +
                '<span class="info">Ethnic Origin: </span><span class="value">' + d.ethnicity + '</span><br/>' +
                '<span class="info">Religion: </span><span class="value">' + d.religion + '</span><br/>' +
                '<span class="info">Jewish Ancestry: </span><span class="value">' + d.jewish + '</span><br/>' +
                

                '<br>' +
                ttLook(d.lookAlikes) +
                ttHand(d.dominantHand) +
                ttShoe(d.shoeSize) +
                ttFace(d.faceShape) +
                ttLips(d.lips) +
                ttNose(d.noseShape) +
                ttChest(d.hairyChest) +
                ttBeard(d.beardColor) +
                ttEyebrows(d.eyebrows) +
                ttDimp(d.dimples) +
                ttAcne(d.acne) +
                ttLoss(d.hairLoss) +

                '<br>' +
                ttDegree(d.degree) +
                ttOcc(d.occupation) +
                '<span class="info">Astrological Sign: </span><span class="value">' + d.sign + '</span><br/>' +
                '<span class="info">Hobbies: </span><span class="value">' + d.hobbies + '</span><br/>' +
                '<span class="info">Favorite Subject: </span><span class="value">' + d.faveSubjects + '</span><br/>' +
                '<span class="info">Donated because: </span><span class="value">' + d.whyDonate + '</span><br/>' +
                '<span class="info">Staff Description: </span><span class="value">' + d.description + '</span><br/>' +
                '<span class="info">Describes Himself: </span><span class="value">' + d.describesHimself + '</span><br/>'
                
            );