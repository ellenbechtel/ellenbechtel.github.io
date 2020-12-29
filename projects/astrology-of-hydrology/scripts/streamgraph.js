

/////////////////////////////////
// Grab inputs and fill in the API
//////////////////////////////////

var emptyAPI = "https://waterservices.usgs.gov/nwis/dv/?format=json";
var state = [];
var countyCd = '42071'; //&countyCd=42071, Lancaster County PA
var site = "01578310"; // Susquehanna river at Conowingo, MD
var sites = []; // above site AND the charles river
var stateCd = []; // PA is 42
var birthday = '1992-06-07'; //startDT=
var startDate = '1992-01-01';
var endDate = '1992-12-31';
var paramCode = '00060'; // discharge in cubic feet per second
var siteType = 'ST';
var siteStatus = "all";
var colorScheme = ["#4f0b56","#482a70","#41498a","#3287bd","#4da4b1","#67c2a5","#8acda4","#acd7a3","#c8e19e","#e4ea99","#f7eda9","#fcde89","#ffc28a","#e5ccf5", /*"#eeb4d1",*/"#f79cac","#ae3a7d","#890965","#760a60","#620a5b","#420f4e"];





/////////////////////////////////
// Fetch and Use data
//////////////////////////////////


function fetchData() {


    /////////////////////////////////
    // Clear anything that was inside the svg element before (only useful when you reload)   
    d3.select("svg.move-up").remove();
    d3.select("#streamgraph-section").style("padding-bottom",0); // reduce size of this section
    d3.select("#data-sources").style("display","block"); // also display the data section now that the graph is loading
    document.getElementById("button2").innerHTML = "Search Again"; 
    d3.selectAll(".streamgraph-text").style("display","block");
    d3.select(".streamgraph-title").style("display","block").style("opacity","1").style("transition","all .5s");
    d3.select(".chart-title").style("display","block").style("opacity","1").style("transition","all .5s");
    
    // Also clear all the important stored variables
    var birthday = '';
    var start = '';
    var end = '';
    var startDate = '';
    var endDate = '';
    var allDates = [];
    var sitey = []; // the final, filled-in API query
    var birthdayFlow = [];
    var info = [];
    var timeseries = [];
    var allSites = [];


    // set the dimensions and margins of the graph, and recalculate window.innerWidth in case the window has been resized
    var margin = {top: 20, right: 50, bottom: 0, left: 50},
        width = window.innerWidth - margin.left - margin.right,
        height = d3.min([window.innerHeight, 1000]) - margin.top - margin.bottom;

    // append a new svg based on size
    var svg = d3.select("#potatoes")
        .append("svg")
        .classed("move-up","true")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
    /////////////////////////////////
    // Get date submission from button
    function addDays (date, daysToAdd) {
        var _24HoursInMilliseconds = 86400000;
        return new Date(date.getTime() + daysToAdd * _24HoursInMilliseconds);
     };
    
    birthday = new Date(document.getElementById("birthdate").value);       
    
    // Make dates for 15 days before and after birthday
    birthday = addDays(birthday, 1); // need to adjust by 1 for some reason
    start = addDays(birthday, - 15);
    end = addDays(birthday, 15);
    
    
    // Convert to YYYY-MM-DD format
    startDate = new Date(start.getTime() - (start.getTimezoneOffset() * 60000 ))
        .toISOString()
        .split("T")[0];
    endDate = new Date(end.getTime() - (end.getTimezoneOffset() * 60000 ))
        .toISOString()
        .split("T")[0];


   function getYYYYMMDD(d0){
       var d = new Date(d0)
       return new Date(d.getTime() - d.getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0]
   }

   function getLongDate(d0) {
    var d = new Date(d0)
    var n = d.toDateString();
    return n;
   }

   d3.select("#start-date-span").html(getLongDate(start));
   d3.select("#end-date-span").html(getLongDate(end));

    allDates = [
        getYYYYMMDD(start), 
        getYYYYMMDD(addDays(start,1)), 
        getYYYYMMDD(addDays(start,2)), 
        getYYYYMMDD(addDays(start,3)), 
        getYYYYMMDD(addDays(start,4)), 
        getYYYYMMDD(addDays(start,5)), 
        getYYYYMMDD(addDays(start,6)), 
        getYYYYMMDD(addDays(start,7)), 
        getYYYYMMDD(addDays(start,8)), 
        getYYYYMMDD(addDays(start,9)), 
        getYYYYMMDD(addDays(start,10)), 
        getYYYYMMDD(addDays(start,11)), 
        getYYYYMMDD(addDays(start,12)), 
        getYYYYMMDD(addDays(start,13)), 
        getYYYYMMDD(addDays(start,14)), 
        getYYYYMMDD(birthday), 
        getYYYYMMDD(addDays(end,-14)), 
        getYYYYMMDD(addDays(end,-13)), 
        getYYYYMMDD(addDays(end,-12)), 
        getYYYYMMDD(addDays(end,-11)), 
        getYYYYMMDD(addDays(end,-10)), 
        getYYYYMMDD(addDays(end,-9)), 
        getYYYYMMDD(addDays(end,-8)), 
        getYYYYMMDD(addDays(end,-7)), 
        getYYYYMMDD(addDays(end,-6)), 
        getYYYYMMDD(addDays(end,-5)), 
        getYYYYMMDD(addDays(end,-4)), 
        getYYYYMMDD(addDays(end,-3)), 
        getYYYYMMDD(addDays(end,-2)), 
        getYYYYMMDD(addDays(end,-1)), 
        getYYYYMMDD(end)
    ];

    // re-declare birthdayFlow as empty values
    birthdayFlow = [
        {dateFull:start, date:allDates[0], huc01:[],huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(start,1), date:allDates[1], huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(start,2), date:allDates[2], huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(start,3), date:allDates[3], huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(start,4), date:allDates[4], huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(start,5), date:allDates[5], huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(start,6), date:allDates[6], huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(start,7), date:allDates[7], huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(start,8), date:allDates[8], huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(start,9), date:allDates[9], huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(start,10), date:allDates[10], huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(start,11), date:allDates[11], huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(start,12), date:allDates[12], huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(start,13), date:allDates[13], huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(start,14), date:allDates[14], huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:birthday, date:allDates[15], huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(end,-14), date:allDates[16], huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(end,-13), date:allDates[17], huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(end,-12), date:allDates[18], huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(end,-11), date:allDates[19], huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(end,-10), date:allDates[20], huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(end,-9), date:allDates[21], huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(end,-8), date:allDates[22], huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(end,-7), date:allDates[23], huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(end,-6), date:allDates[24], huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(end,-5), date:allDates[25], huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(end,-4), date:allDates[26], huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(end,-3), date:allDates[27], huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(end,-2), date:allDates[28], huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(end,-1), date:allDates[29], huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:end, date:allDates[30], huc01:0,huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0}
    ];

    // Print beginning and end date on the page
    var submissionHTML = "The chart below is centered on that date, <span class='emph'>" + getLongDate(birthday) + ".</span> We've pulled daily flow data for the surrounding month, starting at " + getLongDate(start) + " and ending on " + getLongDate(end) + ".";
    var submissionText = d3.select("#submission").html(submissionHTML);
    document.getElementById("load").innerHTML = "<span id='loading-warning'>Loading may take a moment.</span>"
    submissionText.style("opacity","1").style("transition","all .5s");

    /////////////////////////////////
    // Parse HUC and Gages data
    // d3.csv("data/selected-gages.csv", function(gages) { // Switch for this line to use the selected gages

    d3.csv("data/ref_gages.csv", function(gages) { // Switch for this line to use the climate gages 
    
        // console.log(gages, "gages");
        // get list of site numbers to add to the url
        var gageSites = gages.map(function(g) { return g.site_no; });

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
 
        /////////////////////////////////
        // Call API
        d3.json(sitey, function(error, apiData) {

            // Push the data called into "info"
            info.push(apiData);
            timeseries = info[0].value.timeSeries;
                console.log("timeseries", timeseries);
            allSites = timeseries.map(function(site) {return site.sourceInfo.siteName; })
            allSites.sort((a,b) => (a > b) ? 1 : -1);  // sorts by site name alphabetically
              
            // check and make sure each site has all days, remove the ones that don't
            var badGages = [];
            timeseries.forEach(function(gage, index) {
                var array = gage.values[0].value;
                if(array.length !== 31 ) {
                    badGages.push(gage.name); // get a list of all the bad gages
                    timeseries.splice(index, 1); // remove 1 item from the array, specifically the item with this index
                }
                gage.huc02 = gage.sourceInfo.siteProperty[1].value.slice(0,2); // add property that lists the HUC02 for each gage
            });

            // create a list of empty huc arrays for all 21 hucs
            var huc01 = [];
            var huc02 = [];
            var huc03 = [];
            var huc04 = [];
            var huc05 = [];
            var huc06 = [];
            var huc07 = [];
            var huc08 = [];
            var huc09 = [];
            var huc10 = [];
            var huc11 = [];
            var huc12 = [];
            var huc13 = [];
            var huc14 = [];
            var huc15 = [];
            var huc16 = [];
            var huc17 = [];
            var huc18 = [];
            var huc19 = [];
            var huc20 = [];
            var huc21 = [];

            var HUCInfo = [
                {no:"01",id:"huc01", name:"New England Region", src: "svg/single-hucs_1.svg"},
                {no:"02",id:"huc02", name:"Mid Atlantic Region", src: "svg/single-hucs_2.svg"},
                {no:"03",id:"huc03", name:"South Atlantic-Gulf Region", src: "svg/single-hucs_3.svg"},
                {no:"04",id:"huc04", name:"Great Lakes Region", src: "svg/single-hucs_4.svg"},
                {no:"05",id:"huc05", name:"Ohio Region", src: "svg/single-hucs_5.svg"},
                {no:"06",id:"huc06", name:"Tennessee Region", src: "svg/single-hucs_6.svg"},
                {no:"07",id:"huc07", name:"Upper Mississippi Region", src: "svg/single-hucs_7.svg"},
                {no:"08",id:"huc08", name:"Lower Mississippi", src: "svg/single-hucs_8.svg"},
                {no:"09",id:"huc09", name:"Souris-Red-Rainy Region", src: "svg/single-hucs_9.svg"},
                {no:"10",id:"huc10", name:"Missouri Region", src: "svg/single-hucs_10.svg"},
                {no:"11",id:"huc11", name:"Arkansas-White-Red Region", src: "svg/single-hucs_11.svg"},
                {no:"12",id:"huc12", name:"Texas-Gulf Region", src: "svg/single-hucs_12.svg"},
                {no:"13",id:"huc13", name:"Rio Grande Region", src: "svg/single-hucs_13.svg"},
                {no:"14",id:"huc14", name:"Upper Colorado Region", src: "svg/single-hucs_14.svg"},
                {no:"15",id:"huc15", name:"Lower Colorado Region", src: "svg/single-hucs_15.svg"},
                {no:"16",id:"huc16", name:"Great Basin Region", src: "svg/single-hucs_16.svg"},
                {no:"17",id:"huc17", name:"Pacific Northwest Region", src: "svg/single-hucs_17.svg"},
                {no:"18",id:"huc18", name:"California Region", src: "svg/single-hucs_18.svg"},
                {no:"19",id:"huc19", name:"Alaska Region", src: "svg/single-hucs_19.svg"},
                {no:"20",id:"huc20", name:"Hawaii Region", src: "svg/single-hucs_20.svg"},
                {no:"21",id:"huc21", name:"Carribbean-Puerto Rico Region", src: "svg/single-hucs_21.svg"}
            ];
           
            // Create functions to access any of the info given a number (01, 14, etc)
            function getHUCname(hucIDnum){
                var filtered = HUCInfo.filter(function(huc) { // doing only HUC01 array
                    return huc.no === hucIDnum;
                })
                if(filtered.length == 1) {
                    return filtered[0].name;
                }
            }
           
            // create function to collect all timeseries values and put them in their respective HUC array
            function getHUCArray(hucArray, huc_no) {
                timeseries.forEach(function(gage) {
                    var this_huc = gage.huc02;
                    var this_timeseries = gage.values[0].value;
                    var this_data = this_timeseries.map(function(v) { 
                        // v.value is that gage's timeseries
                        if(this_huc == huc_no) {
                            v.dateTime = v.dateTime.substring(0,10)
                            hucArray.push(v);   
                        }                      
                    }); 
                });
            };


            
            // Get huc arrays for all hucs
            getHUCArray(huc01,01);
            getHUCArray(huc02,02);
            getHUCArray(huc03,03);
            getHUCArray(huc04,04);
            getHUCArray(huc05,05);
            getHUCArray(huc06,06);
            getHUCArray(huc07,07);
            getHUCArray(huc08,08);
            getHUCArray(huc09,09);
            getHUCArray(huc10,10);
            getHUCArray(huc11,11);
            getHUCArray(huc12,12);
            getHUCArray(huc13,13);
            getHUCArray(huc14,14);
            getHUCArray(huc15,15);
            getHUCArray(huc16,16);
            getHUCArray(huc17,17);
            getHUCArray(huc18,18);
            getHUCArray(huc19,19);
            getHUCArray(huc20,20);
            getHUCArray(huc21,21);
            
            // Create function that sums all the flow measurements in a single huc and assigns the total value to that day's total measurement
    
            function getTotalFlow(hucArray, hucIDString) {
                if (hucArray.length >= 1) {
                    for (var i = 0; i <= allDates.length-1; i++) {
                        // in the first step, allDates[0] is YYYY-MM-DD of start date
                        
                        var todaysMeasurements = hucArray.filter(function(measurement) { // doing only HUC01 array
                            return measurement.dateTime === allDates[i];
                        })
                        var flows = todaysMeasurements.map(function(flows) {
                            return +flows.value;                        
                        })
                        
                        var totalFlow = Math.floor(flows.reduce(function(accumulator,flow) {
                            return accumulator + flow;
                        }))
                        birthdayFlow[i][hucIDString] = totalFlow; // This property selection is the only thing that's different! There's gotta be a more elegant way to do this, by writing a reusable function
                    }
                }
            };           
            getTotalFlow(huc01,"huc01");          
            getTotalFlow(huc02,"huc02");
            getTotalFlow(huc03,"huc03");
            getTotalFlow(huc04,"huc04");
            getTotalFlow(huc05,"huc05");
            getTotalFlow(huc06,"huc06");
            getTotalFlow(huc07,"huc07");
            getTotalFlow(huc08,"huc08");
            getTotalFlow(huc09,"huc09");
            getTotalFlow(huc10,"huc10");
            getTotalFlow(huc11,"huc11");
            getTotalFlow(huc12,"huc12");
            getTotalFlow(huc13,"huc13");
            getTotalFlow(huc14,"huc14");
            getTotalFlow(huc15,"huc15");
            getTotalFlow(huc16,"huc16");
            getTotalFlow(huc17,"huc17");
            getTotalFlow(huc18,"huc18");
            getTotalFlow(huc19,"huc19");
            getTotalFlow(huc20,"huc20");
            getTotalFlow(huc21,"huc21");

            // add a property that lists all the column titles, which will be used in the stacking function
            birthdayFlow.columns = [
                "dateFull",
                "date",
                "huc01",
                "huc02",
                "huc03",
                "huc04",
                "huc05",
                "huc06",
                "huc07",
                "huc08",
                "huc09",
                "huc10",
                "huc11",
                "huc12",
                "huc13",
                "huc14",
                "huc15",
                "huc16",
                "huc17",
                "huc18",
                "huc19",
                "huc20",
                "huc21"
            ];

            // See the final resulting dataset we need to make a streamgraph!!
            // console.log(birthdayFlow, "birthday flow!")
            

            /////////////////////////////////
            // Draw Chart
            //////////////////////////////////

                // List of groups = header of the csv files
                var keys = birthdayFlow.columns.slice(2)
                
                // Add X axis
                var x = d3.scaleTime()
                    .domain([start, end])
                    .range([ 0, width]);

                svg.append("g")
                    .attr("class","tick-label")
                    .attr("transform", "translate(0," + height*0.8 + ")")
                    .call(d3.axisBottom(x)
                        .tickSize(-height*.01)
                        .tickFormat(d3.timeFormat("%B %d, %Y"))
                        .tickValues([birthday])) // this is wrong, we need a date
                    .select(".domain").remove()

                // Customization
                svg.selectAll(".tick line")
                    .attr("stroke", "#b8b8b8")
                    .attr("opacity",.4);
            
                // Add X axis label:
                // svg.append("text")
                //     .attr("text-anchor", "end")
                //     .attr("class", "time-label")
                //     .attr("x", width)
                //     .attr("y", height )
                //     .text("Time (date)");
            
                // Add Y axis
                var y = d3.scaleLinear()
                    .domain([-300000, 300000])
                    .range([ height, 0 ]);
            
                // color palette
                var color = d3.scaleOrdinal()
                    .domain(keys)
                    .range(colorScheme);
            
                //stack the data?
                var stackedData = d3.stack()
                    .offset(d3.stackOffsetSilhouette)
                    .keys(keys)
                    (birthdayFlow)
                
                
                // create a tooltip
                var Tooltip = svg
                    .append("text")
                    .attr("x", 30)
                    .attr("y", height*0.8 + 11)
                    .attr("class", "tooltip")
                    .style("opacity", 0)
                    .style("z-index",100)
            
                // Three function that change the tooltip when user hover / move / leave a cell
                var mouseover = function(d) {
                    Tooltip.style("opacity", 1)
                    d3.selectAll(".flow").style("opacity", .2)
                    d3.select(this)
                        .style("opacity", 1)
                }
                var mousemove = function(d,i) {
                    grp = keys[i]
                    Tooltip.text(getHUCname(grp.slice(3,5)))
                }
                var mouseleave = function(d) {
                    Tooltip.style("opacity", 0)
                    d3.selectAll(".flow").style("opacity", 1).style("stroke", "none")
                }
            
                // Area generator
                var area = d3.area()
                    .x(function(d) { return x(d.data.dateFull); })
                    .y0(function(d) { return y(d[0]); })
                    .y1(function(d) { return y(d[1]); })
                    .curve(d3.curveMonotoneX)
            
                // Show the areas
                svg
                    .selectAll("myLayer")
                    .data(stackedData)
                    .enter()
                    .append("path")
                        .attr("class", "flow")
                        .style("fill", function(d) { return color(d.key); })
                        .attr("d", area)
                        .on("mouseover", mouseover)
                        .on("mousemove", mousemove)
                        .on("mouseleave", mouseleave);


                // d3.selectAll("path")
                //     .transition()
                //     .duration(1000)
                //     .attr("d",area)
                // d3.selectAll(".tick-label")
                //     .transition()
                //     .duration(1)
                //     .call(d3.axisBottom(x)
                //         .tickSize(-height*.01)
                //         .tickFormat(d3.timeFormat("%B %d, %Y"))
                //         .tickValues([birthday]))
                //         .select(".domain").remove()

            /////////////////////////////////
            // Export the Chart as an Image
            //////////////////////////////////
                // Set up Export Button
                d3.select('#saveButton').on('click', function(){
                    var svgString = getSVGString(svg.node());
                    svgString2Image( svgString, 2*width, 2*height, 'png', save ); // passes Blob and filesize String to the callback
        
                    function save( dataBlob, filesize ){
                        saveAs( dataBlob, 'D3 vis exported to PNG.png' ); // FileSaver.js function
                    }
                });

                        
            // Below are the functions that handle actual exporting:
            // getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )
            function getSVGString( svgNode ) {
                svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
                var cssStyleText = getCSSStyles( svgNode );
                appendCSS( cssStyleText, svgNode );

                var serializer = new XMLSerializer();
                var svgString = serializer.serializeToString(svgNode);
                svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
                svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

                return svgString;

                function getCSSStyles( parentElement ) {
                    var selectorTextArr = [];

                    // Add Parent element Id and Classes to the list
                    selectorTextArr.push( '#'+parentElement.id );
                    for (var c = 0; c < parentElement.classList.length; c++)
                            if ( !contains('.'+parentElement.classList[c], selectorTextArr) )
                                selectorTextArr.push( '.'+parentElement.classList[c] );

                    // Add Children element Ids and Classes to the list
                    var nodes = parentElement.getElementsByTagName("*");
                    for (var i = 0; i < nodes.length; i++) {
                        var id = nodes[i].id;
                        if ( !contains('#'+id, selectorTextArr) )
                            selectorTextArr.push( '#'+id );

                        var classes = nodes[i].classList;
                        for (var c = 0; c < classes.length; c++)
                            if ( !contains('.'+classes[c], selectorTextArr) )
                                selectorTextArr.push( '.'+classes[c] );
                    }

                    // Extract CSS Rules
                    var extractedCSSText = "";
                    for (var i = 0; i < document.styleSheets.length; i++) {
                        var s = document.styleSheets[i];
                        
                        try {
                            if(!s.cssRules) continue;
                        } catch( e ) {
                                if(e.name !== 'SecurityError') throw e; // for Firefox
                                continue;
                            }

                        var cssRules = s.cssRules;
                        for (var r = 0; r < cssRules.length; r++) {
                            if ( contains( cssRules[r].selectorText, selectorTextArr ) )
                                extractedCSSText += cssRules[r].cssText;
                        }
                    }
                    

                    return extractedCSSText;

                    function contains(str,arr) {
                        return arr.indexOf( str ) === -1 ? false : true;
                    }

                }

                function appendCSS( cssText, element ) {
                    var styleElement = document.createElement("style");
                    styleElement.setAttribute("type","text/css"); 
                    styleElement.innerHTML = cssText;
                    var refNode = element.hasChildNodes() ? element.children[0] : null;
                    element.insertBefore( styleElement, refNode );
                }
            }


            function svgString2Image( svgString, width, height, format, callback ) {
                var format = format ? format : 'png';

                var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL

                var canvas = document.createElement("canvas");
                var context = canvas.getContext("2d");

                canvas.width = width;
                canvas.height = height;

                var image = new Image();
                image.onload = function() {
                    context.clearRect ( 0, 0, width, height );
                    context.drawImage(image, 0, 0, width, height);

                    canvas.toBlob( function(blob) {
                        var filesize = Math.round( blob.length/1024 ) + ' KB';
                        if ( callback ) callback( blob, filesize );
                    });

                    
                };

                image.src = imgsrc;
            }
        

        // d3.json
        })

    // end d3.csv gages
    });

// end fetchData()
}


/////////////////////////////////
// Function is called when the "submit" button is clicked
//////////////////////////////////
