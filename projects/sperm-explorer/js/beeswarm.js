
/////////////////////////////////
// BEEWARM CODE!
//////////////////////////////////


/////////////////////////////////
// SET STATIC VARIABLES
//////////////////////////////////


var width = document.querySelector("#beeswarm").clientWidth;
var height = document.querySelector("#beeswarm").clientHeight;

transitionTime = 1 * 1000; // 1 second

/*
var margin = {
    top: 20,
    right: 150,
    bottom: 100,
    left: 50
  };

var chartWidth = width - margin.left - margin.right;
var chartHeight = height - margin.top - margin.bottom;

// Use chartWidth and chartHeight as dimensions of the beeswarm chart, because it takes into account the margins.  Maybe we don't need the margins?
*/

var svg = d3.select("#beeswarm")
    .attr("width", width)
    .attr("height", height);


/////////////////////////////////
// UPLOAD DATA
//////////////////////////////////

d3.csv("./donors.csv", function(donors) {
    
    console.log(donors);

    /////////////////////////////////
    // MAKE SCALES
    //////////////////////////////////

    // COLOR SCALES

    // Eye Color
    var eyeColors = [];
    donors.forEach(function(d) {
        var thisOne = d.eye;
        if(eyeColors.indexOf(thisOne)<0) {
            eyeColors.push(thisOne);
        }
    });

    
    var eyeColorScale = d3.scaleOrdinal()
        .domain(eyeColors)
        .range(["brown", "green", "gold", "blue", "black", "grey"]);  // pick colors


    // Hair Color
    var hairColorScale = [];

    // Skin Color
    var skinColorScale = [];


    // GROUPINGS FOR Y SCALE

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


    // Height  -- FIGURE OUT THE BANDS HERE
    var heightScale = [];


    // Weight  -- FIGURE OUT THE BANDS HERE
    var weightScale = [];


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



    /////////////////////////////////
    // MAKE DROPDOWNS
    //////////////////////////////////

    // Color Dropdown Options
    var dropdownColor = d3.select("#dropdownColor");
    var colorScales = ["Eye Color", "Hair Color", "Skin Tone"];
    var currentColorScale = colorScales[0];
    
    colorScales.forEach(function(o) {
        dropdownColor.append("option")
            .property("value", o)
            .text(o);
    });

    currentColorScale = colorScales[0];
    dropdownColor.on("change", function() {
        currentColorScale = this.value;
        if(currentColorScale == colorScales[0]) {
            // select the correct scale from above
        } else if (currentColorScale == colorScales[1]) {
            // select the correct scale from above
        } else if(currentColorScale == colorScales[2]) {
            // select the correct scale from above
        }
        updateBeeswarm();
    });


    // Groupings Dropdown Options
    var dropdownGroup = d3.select("#dropdownGroup");
    var groupScales = ["Sperm Bank", "Height", "Weight", "Blood Type", "Race", "Religion", "Jewish Ancestry"];
    var currentGroupScale = groupScales[0];
    
    groupScales.forEach(function(o) {
        dropdownGroup.append("option")
            .property("value", o)
            .text(o);
    });


    // Initialize with Blood Type for now
    currentGroupScale = groupScales[3]; // make this dynamic
    domainValues = bloodTypes; // make this dynamic

    console.log(currentColorScale, currentGroupScale);

    // Update the beeswarm with each change of the dropdown
    dropdownGroup.on("change", function() {
        currentGroupScale = this.value;
        if(currentGroupScale == "Sperm Bank") {
            domainValues = banks;
        } else if (currentGroupScale == "Height") {
            //domainValues = ;
        } else if(currentGroupScale == "Weight") {
            //domainValues = ;
        } else if(currentGroupScale == "Blood Type") {
            domainValues = bloodTypes;
        } else if(currentGroupScale == "Race") {
            domainValues = races;
        } else if(currentGroupScale == "Religion") {
            domainValues = religions;
        } else if(currentGroupScale == "Jewish Ancestry") {
            domainValues = jews;
        }

        updateBeeswarm();
    });

    /////////////////////////////////
    // MAKE Y AXIS GROUPINGS BASED ON SELECTION FROM DROPDOWN
    //////////////////////////////////


    var xScale = d3.scaleOrdinal()
        .domain([currentGroupScale])
        .range([0, width]);  // Range bands?

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
    // WRITE FUNCTION TO ENTER / UPDATE / EXIT CLUSTERS
    //////////////////////////////////

    function zeroState(selection) {
        selection  
            .attr("opacity", 0);
    }


    function updateBeeswarm() {
        
        // Put all the spermies in a group on the svg canvas
        var spermies = svg.select("#spermSwarm").selectAll(".spermies")
            .data(donors); // How do I select a certain property based on what the selected groupings are?

        // Enter
        var enter = spermies.enter()
            .append("circle")
            .attr("class","spermies")
            .attr("r", 3)
            .attr("cx", function(d) { return xScale(d.bloodType); })  // I want this to be based on whatever group is selected in the dropdown
            .attr("cy", function() { return height/2; });  // The cy I don't care about - as long as it's within the correct scale band
        
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

                
        console.log(currentColorScale, currentGroupScale);

    };
    /////////////////////////////////
    // DRAW THE SPERMIES
    //////////////////////////////////



});





