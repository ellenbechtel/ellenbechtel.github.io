/////////////////////////////////
// Set up all the static variables
//////////////////////////////////

// set the dimensions and margins of the graph
var margin = {top: 20, right: 30, bottom: 0, left: 10},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#potatoes")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


/////////////////////////////////
// Grab inputs and fill in the API
//////////////////////////////////

var emptyAPI = "https://waterservices.usgs.gov/nwis/dv/?format=json";
var state = [];
var countyCd = '42071'; //&countyCd=42071, Lancaster County PA
var site = "01578310"; // Susquehanna river at Conowingo, MD
var sites = [01578310,01104705]; // above site AND the charles river
var stateCd = []; // PA is 42
var birthday = '1992-06-07'; //startDT=
var startDate = '1992-01-01';
var endDate = '1992-12-31';
var paramCode = '00060'; // discharge in cubic feet per second
var que = [];
var sitey = []; // the final, filled-in API query
var info = [];
var siteType = 'ST';
var siteStatus = "all";





/////////////////////////////////
// Fetch and Use data
//////////////////////////////////


function fetchData() {

    /////////////////////////////////
    // Get date submission from button
    var birthday = new Date(document.getElementById("birthdate").value);
        document.getElementById("submission").innerHTML = birthday + " is my birthday. month = " + startDate + " End = " + endDate;
    
    function addDays (date, daysToAdd) {
        var _24HoursInMilliseconds = 86400000;
        return new Date(date.getTime() + daysToAdd * _24HoursInMilliseconds);
     };
    
    // Make dates for 15 days before and after birthday
    var start = addDays(birthday, - 15);
    var end = addDays(birthday, 15);
    
    // Convert to YYYY-MM-DD format
    var startDate = new Date(start.getTime() - (start.getTimezoneOffset() * 60000 ))
        .toISOString()
        .split("T")[0];
    var endDate = new Date(end.getTime() - (end.getTimezoneOffset() * 60000 ))
        .toISOString()
        .split("T")[0];
    
    /////////////////////////////////
    // Parse HUC and Gages data
    d3.csv("data/ref_gages.csv", function(gages) {
        console.log(gages, "gages");
        // get list of sites
        var gageSites = gages.map(function(g) { return g.site_no; });
        console.log(gageSites, "sites");

        /////////////////////////////////
        // Compile API

        // URL chunks
        var urlCounty = "&countyCd=" + countyCd;
        var urlSites = "&sites=" + gageSites; 
        var urlStartDate = "&startDT=" + startDate;
        var urlEndDate = "&endDT=" + endDate;
        var urlStatCD = "&statCd=00003" // 00003 means "mean" values
        var urlParam = "&PARAMETERcD=" + paramCode;
        var urlSiteType = "&siteType=" + siteType;
        var urlSiteStatus = "&siteStatus=" + siteStatus;

        // Compile the URL
        sitey = emptyAPI + urlSites + urlStartDate + urlEndDate + urlStatCD + urlParam;
        // https://waterservices.usgs.gov/nwis/dv/?format=json&sites=1064118,1100693,1104705,432742070225401,1049505,430521070453501,1194796,414945071224100,1477050,1578310,2042770,165258890,1376515,2470629,2323567,2198840,4264331,42950000,370812089055901,370221088314100,7022000,7374000,5137500,5140515,5124000,5102490,6935965,7263650,7074850,7355690,7076634,8211500,8162501,8188810,8030540,8041780,8117300,8473700,9328990,330131114364101,10335000,10172600,10126000,10141000,14246900,12041200,12038400,12200500,14378430,11479560,11530500,11455420,11152500,341859119053301,11194000,11337190&startDT=1992-01-01&endDT=1992-12-31&PARAMETERcD=00060&siteStatus=all

        // should be: //waterservices.usgs.gov/nwis/dv/?format=json&sites=1578310,01104705&startDT=1992-01-01&endDT=1992-12-31&siteType=ST&siteStatus=all
        console.log(sitey, "api"); //

        /////////////////////////////////
        // Call API
        d3.json(sitey, function(error, apiData) {

            // Push the data called into "info"
            info.push(apiData);
            console.log(info, "info");

            var timeseries = info[0].value.timeSeries;
            console.log("timeseries", timeseries);

            var allSites = timeseries.map(function(site) {return site.sourceInfo.siteName; })
            // console.log("all Sites", allSites);

            allSites.sort((a,b) => (a > b) ? 1 : -1);  // sorts by site name alphabetically
            // console.log("sorted sites", allSites);
              
            // check and make sure each site has all days, remove the ones that are bad
            var badGages = [];
            timeseries.forEach(function(gage, index) {
                var array = gage.values[0].value;
                if(array.length !== 31 ) {
                    console.log("oh no!", index);
                    badGages.push(gage.name); // get a list of all the bad gages
                    timeseries.splice(index, 1); // remove 1 item from the array, specifically the item with this index
    
                }
                gage.huc02 = gage.sourceInfo.siteProperty[1].value.slice(0,2); // add property that lists the HUC02 for each gage
            });
            console.log(badGages);

            // Clean up the object so it's just an object with all the gage values

            var birthdayFlow = [
                {date:start, huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
                {date:addDays(start,1), huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
                {date:addDays(start,2), huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
                {date:addDays(start,3), huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
                {date:addDays(start,4), huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
                {date:addDays(start,5), huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
                {date:addDays(start,6), huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
                {date:addDays(start,7), huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
                {date:addDays(start,8), huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
                {date:addDays(start,9), huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
                {date:addDays(start,10), huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
                {date:addDays(start,11), huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
                {date:addDays(start,12), huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
                {date:addDays(start,13), huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
                {date:addDays(start,14), huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
                {date:birthday, huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
                {date:addDays(end,-14), huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
                {date:addDays(end,-13), huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
                {date:addDays(end,-12), huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
                {date:addDays(end,-11), huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
                {date:addDays(end,-10), huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
                {date:addDays(end,-9), huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
                {date:addDays(end,-8), huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
                {date:addDays(end,-7), huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
                {date:addDays(end,-6), huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
                {date:addDays(end,-5), huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
                {date:addDays(end,-4), huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
                {date:addDays(end,-3), huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
                {date:addDays(end,-2), huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
                {date:addDays(end,-1), huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
                {date:end, huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0}
            ];

            console.log(birthdayFlow);

            function addThisGageToFlow() {
                // insert the forEach function in here
            };

            timeseries.forEach(function(gage, index) {
                var this_timeseries = gage.values[0].value;
                // console.log(this_timeseries);
                if(gage.huc02 == 01) {
                    //forEach item in the this_timeseries array
                    this_timeseries.forEach(function(day) {
                        console.log(day.value);
                        birthdayFlow.push(day.value); // this is wrong, it just tacks on the value as another array item after the objects
                    })
                } // add else ifs here

            });
                   
            console.log(birthdayFlow, "birthday flow!")

    


            // add together the relevant gages

            // Reorganize data so it's a row for each date, with columns for each HUC


            /////////////////////////////////
            // Draw Chart
            //////////////////////////////////

            /////////////////////////////////
            // FAAAAKE example  
            d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered_wide.csv", function(data) {

            
                // List of groups = header of the csv files
                var keys = data.columns.slice(1)
            
                // Add X axis
                var x = d3.scaleLinear()
                    .domain(d3.extent(data, function(d) { return d.year; }))
                    .range([ 0, width ]);
                svg.append("g")
                    .attr("transform", "translate(0," + height*0.8 + ")")
                    .call(d3.axisBottom(x).tickSize(-height*.7).tickValues([1900, 1925, 1975, 2000]))
                    .select(".domain").remove()

                // Customization
                svg.selectAll(".tick line").attr("stroke", "#b8b8b8")
            
                // Add X axis label:
                svg.append("text")
                    .attr("text-anchor", "end")
                    .attr("x", width)
                    .attr("y", height-30 )
                    .text("Time (year)");
            
                // Add Y axis
                var y = d3.scaleLinear()
                    .domain([-100000, 100000])
                    .range([ height, 0 ]);
            
                // color palette
                var color = d3.scaleOrdinal()
                    .domain(keys)
                    .range(d3.schemeDark2);
            
                //stack the data?
                var stackedData = d3.stack()
                    .offset(d3.stackOffsetSilhouette)
                    .keys(keys)
                    (data)
                
                // create a tooltip
                var Tooltip = svg
                    .append("text")
                    .attr("x", 0)
                    .attr("y", 0)
                    .style("opacity", 0)
                    .style("font-size", 17)
            
                // Three function that change the tooltip when user hover / move / leave a cell
                var mouseover = function(d) {
                Tooltip.style("opacity", 1)
                d3.selectAll(".myArea").style("opacity", .2)
                d3.select(this)
                    .style("stroke", "black")
                    .style("opacity", 1)
                }
                var mousemove = function(d,i) {
                grp = keys[i]
                Tooltip.text(grp)
                }
                var mouseleave = function(d) {
                Tooltip.style("opacity", 0)
                d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none")
                }
            
                // Area generator
                var area = d3.area()
                    .x(function(d) { return x(d.data.year); })
                    .y0(function(d) { return y(d[0]); })
                    .y1(function(d) { return y(d[1]); })
            
                // Show the areas
                svg
                    .selectAll("mylayers")
                    .data(stackedData)
                    .enter()
                    .append("path")
                        .attr("class", "myArea")
                        .style("fill", function(d) { return color(d.key); })
                        .attr("d", area)
                        .on("mouseover", mouseover)
                        .on("mousemove", mousemove)
                        .on("mouseleave", mouseleave)

            // end d3.csv on fake data
            })

        // d3.json
        })

    // end d3.csv gages
    });

// end fetchData()
}


/////////////////////////////////
// Function is called when the "submit" button is clicked
//////////////////////////////////
