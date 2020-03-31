
/////////////////////////////////
// BEEWARM CODE!
//////////////////////////////////


/////////////////////////////////
// SET STATIC VARIABLES
//////////////////////////////////


var width = document.querySelector("#beeswarm").clientWidth;
var height = document.querySelector("#beeswarm").clientHeight;

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

    /*
    var eyeColorScale = d3.scaleOrdinal()
        .domain(eyeColors)
        .range(["brown", "green", "gold", "blue", "black", "grey"])
        .paddingInner(0.5)
        .paddingOuter(0.25);

    */


    // Hair Color
    var hairColorScale = [];

    // Skin Color
    var skinColorScale = [];


    // GROUPINGS FOR Y SCALE

    //Sperm Bank of Origin

    var banks = [];
    donors.forEach(function(d) {
        var thisOne = d.bank;
        if(banks.indexOf(thisOne)<0) {
            banks.push(thisOne);
        }
    });
    
    var bankScale = d3.scaleBand()
        .domain(banks)
        .range([0, width])
        .paddingInner(0.5)
        .paddingOuter(0.25);


    // Height
    var heightScale = [];

    // Weight
    var weightScale = [];

    // Blood Type
    var bloodTypeScale = [];

    var bloodTypes = [];
    donors.forEach(function(d) {
        var thisOne = d.bloodType;
        if(bloodTypes.indexOf(thisOne)<0) {
            bloodTypes.push(thisOne);
        }
    });
    
    var bankScale = d3.scaleBand()
        .domain(bloodTypes)
        .range([0, width])
        .paddingInner(0.5)
        .paddingOuter(0.25);

    // Race
    var raceScale = [];

    // Religion
    var religionScale = [];

    // Jewish Ancestry
    var jewishScale = [];


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
            //axis selector
        } else if (currentColorScale == colorScales[1]) {
            // axis selector
        } else if(currentColorScale == colorScales[2]) {
            // axis selector
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

    currentGroupScale = groupScales[0];
    dropdownGroup.on("change", function() {
        currentGroupScale = this.value;
        if(currentGroupScale == groupScales[0]) {
            //axis selector
        } else if (currentGroupScale == groupScales[1]) {
            // axis selector
        } else if(currentGroupScale == groupScales[2]) {
            // axis selector
        } else if(currentGroupScale == groupScales[3]) {
            // axis selector
        } else if(currentGroupScale == groupScales[4]) {
            // axis selector
        } else if(currentGroupScale == groupScales[5]) {
            // axis selector
        } else if(currentGroupScale == groupScales[6]) {
            // axis selector
        }

        updateBeeswarm();
    });

    /////////////////////////////////
    // MAKE Y AXIS GROUPINGS BASED ON SELECTION FROM DROPDOWN
    //////////////////////////////////


    var x = [];

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
        .attr("stroke-width", 1.5)
        .attr("stroke", "#DBDAD9");

    /////////////////////////////////
    // WRITE FUNCTION TO UPDATE CLUSTERS
    //////////////////////////////////

    function updateBeeswarm() {
        // Enter
        
        // Update

        // Exit

        console.log(currentColorScale, currentGroupScale);

    };
    /////////////////////////////////
    // DRAW THE SPERMIES
    //////////////////////////////////



});





