
/////////////////////////////////
// BEEWARM CODE!
//////////////////////////////////


/////////////////////////////////
// SET STATIC VARIABLES
//////////////////////////////////


var width = document.querySelector("#beeswarm").clientWidth;
var height = document.querySelector("#beeswarm").clientHeight;

transitionTime = 1 * 1000; // 1 second

var margin = {
    top: 20,
    right: 150,
    bottom: 100,
    left: 50 
};

var chartWidth = width - margin.left - margin.right;
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
        .range([1,5]);


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
        .range([chartHeight, margin.top]);


    /////////////////////////////////
    // MAKE GROUP SCALES AND DROPDOWNS
    //////////////////////////////////

    // Sperm Bank of Origin
    var banks = [];
    donors.forEach(function(d) {
        var thisOne = d.bank;
        if(banks.indexOf(thisOne)<0) {
            banks.push(thisOne);
        }
    });
    banks = banks.sort();  
    var bankScale = d3.scaleBand()
        .domain(banks)
        .rangeRound([0, width])
        .padding(0.5);


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

   
    // GROUP DROPDOWNS
    var dropdownGroup = d3.select("#dropdownGroup");
    var dropdownObj = [
        {label: "Sperm Bank", value: "banks"},
        {label: "Blood Type", value: "bloodTypes"},
        {label: "Race", value: "races"},
        {label: "Religion", value: "religions"},
        {label: "Jewish Ancestry", value: "jews"}
    ];

    var currentGroupScale = dropdownObj[0].value;

    dropdownObj.forEach(function(o) {
        dropdownGroup.append("option")
            .property("value", o.value)
            .text(o.label);
    });

    var domainsObj = {
        banks: banks,
        bloodTypes: bloodTypes,
        races: races,
        religions: religions,
        jews: jews
    };

    // Update the beeswarm with each change of the dropdown
    dropdownGroup.on("change", function() {
        currentGroupScale = this.value;
        updateBeeswarm(currentGroupScale, currentColorScale);
    });

    /////////////////////////////////
    // MAKE Y AXIS GROUPINGS BASED ON SELECTION FROM DROPDOWN
    //////////////////////////////////

    var xScale = d3.scaleBand()
        .domain(domainsObj[currentGroupScale])
        .rangeRound([0, chartWidth]);


    /////////////////////////////////
    // MAKE COLOR SCALES AND DROPDOWNS
    //////////////////////////////////

    // COLOR SCALES

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
        updateBeeswarm(currentGroupScale, currentColorScale);
    });
    
    /*
    var colorScale = d3.scaleOrdinal()
        .domain(domainsColorObj[currentColorScale])
        .range(currentColors);
    */


    /////////////////////////////////
    // DRAW LINE
    //////////////////////////////////

    var line = svg.select("#line");

    line.append("line")
        .attr("class","beeswarmLine")
        .attr("x1", 0)
        .attr("y1", (2*height)/3)
        .attr("x2", width)
        .attr("y2", (2*height)/3)
        .attr("stroke-width", 1)
        .attr("stroke", "#DBDAD9");

    /////////////////////////////////
    // WRITE FUNCTION TO ENTER / UPDATE / EXIT CAUCUS ALIGNMENTS
    //////////////////////////////////

    var simulation = d3.forceSimulation(donors)
        .force("charge", d3.forceManyBody().strength(1))
        .force("collide", d3.forceCollide().radius(6)) // make this more of a padding than a radius
        .force("center", d3.forceCenter(chartWidth/2, chartHeight/2)); // I want height to be calculated by height, and width to be centered along the axes for the ordinal scales


    function zeroState(selection) {
        selection  
            .attr("opacity", 0);
    }


    function updateBeeswarm(currentGroupScale, currentColorScale) {
        
        // Put all the spermies in a group on the svg canvas
        var spermies = svg.select("#spermSwarm").selectAll(".spermies")
            .data(donors); // How do I select a certain property based on what the selected groupings are?

        // Enter
        var enter = spermies.enter()
            .append("circle")
            .attr("class","spermies")
            .attr("opacity", 0.3)
            .attr("fill", "white"/*function(d) { return currentColorScale(d[currentColorScale]); }*/)
            .attr("r", function(d) { return weightScale(d.weight); })
            .attr("cx", function(d) { return xScale(d[currentGroupScale]); })  // I want this to be based on whatever group is selected in the dropdown
            .attr("cy", function(d) { return heightScale(d.height); });  // The cy I don't care about - as long as it's within the correct scale band
        
        // Update

        spermies.merge(enter)
            .transition()
            .duration(transitionTime)
            /*
            .attr("cx", ?)
            .attr("cy", ?)
            */;

        // Exit

        spermies.exit()
            .transition()
            .duration(transitionTime)
            .call(zeroState)
            .remove();

            
        simulation.on("tick", function() {
            spermies.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; })
        });

        var tooltip = d3.select("#tooltip");

        spermies.on("mouseover", function(d) {
    
            var cx = event.clientX + 10;
            var cy = event.clientY + 10;
    
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
                .attr("opacity",1);
    
        }).on("mouseout", function() {
    
            tooltip.style("visibility","hidden");

            svg.selectAll(".spermies")
                .transition()
                .duration(transitionTime/4)
                .attr("opacity",1);
    
        }).on("click", function() {
            d3.select(this)
                .style("stroke","#000")
                .style("stroke-width",2)
        })// HOW DO I ADD A CLICK OUT???;

    };
    /////////////////////////////////
    // DRAW THE SPERMIES
    //////////////////////////////////

    updateBeeswarm(currentGroupScale, currentColorScale);

    /////////////////////////////////
    // TOOLTIP
    //////////////////////////////////




});





