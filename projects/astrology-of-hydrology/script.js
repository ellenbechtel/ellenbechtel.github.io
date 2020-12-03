

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
var colorScheme = ["#4f0b56","#482a70","#41498a","#3287bd","#4da4b1","#67c2a5","#8acda4","#acd7a3","#c8e19e","#e4ea99","#f7eda9","#fcde89","#ffc28a","#e5ccf5","#eeb4d1","#f79cac","#ae3a7d","#890965","#760a60","#620a5b","#420f4e"];





/////////////////////////////////
// Fetch and Use data
//////////////////////////////////


function fetchData() {

    /////////////////////////////////
    // Clear anything that was inside the svg element before (only useful when you reload)   
    d3.selectAll("svg").remove();

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
        {dateFull:addDays(start,1), date:allDates[1], huc01:[],huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(start,2), date:allDates[2], huc01:[],huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(start,3), date:allDates[3], huc01:[],huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(start,4), date:allDates[4], huc01:[],huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(start,5), date:allDates[5], huc01:[],huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(start,6), date:allDates[6], huc01:[],huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(start,7), date:allDates[7], huc01:[],huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(start,8), date:allDates[8], huc01:[],huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(start,9), date:allDates[9], huc01:[],huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(start,10), date:allDates[10], huc01:[],huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(start,11), date:allDates[11], huc01:[],huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(start,12), date:allDates[12], huc01:[],huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(start,13), date:allDates[13], huc01:[],huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(start,14), date:allDates[14], huc01:[],huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:birthday, date:allDates[15], huc01:[],huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(end,-14), date:allDates[16], huc01:[],huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(end,-13), date:allDates[17], huc01:[],huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(end,-12), date:allDates[18], huc01:[],huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(end,-11), date:allDates[19], huc01:[],huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(end,-10), date:allDates[20], huc01:[],huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(end,-9), date:allDates[21], huc01:[],huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(end,-8), date:allDates[22], huc01:[],huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(end,-7), date:allDates[23], huc01:[],huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(end,-6), date:allDates[24], huc01:[],huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(end,-5), date:allDates[25], huc01:[],huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(end,-4), date:allDates[26], huc01:[],huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(end,-3), date:allDates[27], huc01:[],huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(end,-2), date:allDates[28], huc01:[],huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:addDays(end,-1), date:allDates[29], huc01:[],huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0},
        {dateFull:end, date:allDates[30], huc01:[],huc02:0,huc03:0,huc04:0,huc05:0,huc06:0,huc07:0,huc08:0,huc09:0,huc10:0,huc11:0,huc12:0,huc13:0,huc14:0,huc15:0,huc16:0,huc17:0,huc18:0,huc19:0,huc20:0,huc21:0}
    ];

    // Print beginning and end date on the page
    document.getElementById("submission").innerHTML = birthday + " is my birthday. <br> Start Date = " + startDate + "<br>  End Date = " + endDate;
    
    /////////////////////////////////
    // Parse HUC and Gages data
    d3.csv("data/ref_gages.csv", function(gages) {
    
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
            console.log(sitey, "sitey")

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
                    // console.log("oh no!", index);
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
            //01
            function getTotalFlow(hucArray) {
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
                    birthdayFlow[i].huc01 = totalFlow; // This property selection is the only thing that's different! There's gotta be a more elegant way to do this, by writing a reusable function
                }
            };           
            getTotalFlow(huc01);  

            //02
            function getTotalFlow02(hucArray) {
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
                    birthdayFlow[i].huc02 = totalFlow; // This property selection is the only thing that's different! There's gotta be a more elegant way to do this, by writing a reusable function
                }
            };           
            getTotalFlow02(huc02);  
            //03
            function getTotalFlow03(hucArray) {
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
                    birthdayFlow[i].huc03 = totalFlow; // This property selection is the only thing that's different! There's gotta be a more elegant way to do this, by writing a reusable function
                }
            };           
            getTotalFlow03(huc03);  
            //04
            function getTotalFlow04(hucArray) {
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
                    birthdayFlow[i].huc04 = totalFlow; // This property selection is the only thing that's different! There's gotta be a more elegant way to do this, by writing a reusable function
                }
            };           
            getTotalFlow04(huc04); 
            //05
            function getTotalFlow05(hucArray) {
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
                    birthdayFlow[i].huc05 = totalFlow; // This property selection is the only thing that's different! There's gotta be a more elegant way to do this, by writing a reusable function
                }
            };           
            getTotalFlow05(huc05); 
            //06
            function getTotalFlow06(hucArray) {
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
                    birthdayFlow[i].huc06 = totalFlow; // This property selection is the only thing that's different! There's gotta be a more elegant way to do this, by writing a reusable function
                }
            };           
            getTotalFlow06(huc06); 
            //07
            function getTotalFlow07(hucArray) {
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
                    birthdayFlow[i].huc07 = totalFlow; // This property selection is the only thing that's different! There's gotta be a more elegant way to do this, by writing a reusable function
                }
            };           
            getTotalFlow07(huc07); 
            //08
            function getTotalFlow08(hucArray) {
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
                    birthdayFlow[i].huc08 = totalFlow; // This property selection is the only thing that's different! There's gotta be a more elegant way to do this, by writing a reusable function
                }
            };           
            getTotalFlow08(huc08); 
            //09
            function getTotalFlow09(hucArray) {
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
                    birthdayFlow[i].huc09 = totalFlow; // This property selection is the only thing that's different! There's gotta be a more elegant way to do this, by writing a reusable function
                }
            };           
            getTotalFlow09(huc09); 
            //10
            function getTotalFlow10(hucArray) {
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
                    birthdayFlow[i].huc10 = totalFlow; // This property selection is the only thing that's different! There's gotta be a more elegant way to do this, by writing a reusable function
                }
            };           
            getTotalFlow10(huc10); 
            //11
            function getTotalFlow11(hucArray) {
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
                    birthdayFlow[i].huc11 = totalFlow; // This property selection is the only thing that's different! There's gotta be a more elegant way to do this, by writing a reusable function
                }
            };           
            getTotalFlow11(huc11); 
            //12
            function getTotalFlow12(hucArray) {
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
                    birthdayFlow[i].huc12 = totalFlow; // This property selection is the only thing that's different! There's gotta be a more elegant way to do this, by writing a reusable function
                }
            };           
            getTotalFlow12(huc12); 
            //13
            function getTotalFlow13(hucArray) {
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
                    birthdayFlow[i].huc13 = totalFlow; // This property selection is the only thing that's different! There's gotta be a more elegant way to do this, by writing a reusable function
                }
            };           
            getTotalFlow13(huc13); 
            //14
            function getTotalFlow14(hucArray) {
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
                    birthdayFlow[i].huc14 = totalFlow; // This property selection is the only thing that's different! There's gotta be a more elegant way to do this, by writing a reusable function
                }
            };           
            getTotalFlow14(huc14); 
            //15
            function getTotalFlow15(hucArray) {
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
                    birthdayFlow[i].huc15 = totalFlow; // This property selection is the only thing that's different! There's gotta be a more elegant way to do this, by writing a reusable function
                }
            };           
            getTotalFlow15(huc15);
            //16
            function getTotalFlow16(hucArray) {
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
                    birthdayFlow[i].huc16 = totalFlow; // This property selection is the only thing that's different! There's gotta be a more elegant way to do this, by writing a reusable function
                }
            };           
            getTotalFlow16(huc16);
            //17
            function getTotalFlow17(hucArray) {
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
                    birthdayFlow[i].huc17 = totalFlow; // This property selection is the only thing that's different! There's gotta be a more elegant way to do this, by writing a reusable function
                }
            };           
            getTotalFlow17(huc17);
            //18
            function getTotalFlow18(hucArray) {
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
                    birthdayFlow[i].huc18 = totalFlow; // This property selection is the only thing that's different! There's gotta be a more elegant way to do this, by writing a reusable function
                }
            };           
            getTotalFlow18(huc18);
            //19
            function getTotalFlow19(hucArray) {
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
                    birthdayFlow[i].huc19 = totalFlow; // This property selection is the only thing that's different! There's gotta be a more elegant way to do this, by writing a reusable function
                }
            };           
            getTotalFlow19(huc19);
            //20
            function getTotalFlow20(hucArray) {
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
                    birthdayFlow[i].huc20 = totalFlow; // This property selection is the only thing that's different! There's gotta be a more elegant way to do this, by writing a reusable function
                }
            };           
            getTotalFlow20(huc20);
            //21
            function getTotalFlow21(hucArray) {
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
                    birthdayFlow[i].huc21 = totalFlow; // This property selection is the only thing that's different! There's gotta be a more elegant way to do this, by writing a reusable function
                }
            };           
            getTotalFlow21(huc21);
           
        
            
            // add a property that lists all the column titles
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
            console.log(birthdayFlow, "birthday flow!")
            

            /////////////////////////////////
            // Draw Chart
            //////////////////////////////////

                // List of groups = header of the csv files
                var keys = birthdayFlow.columns.slice(2)
                
                // Add X axis
                var x = d3.scaleTime()
                    .domain([start, end])
                    .range([ 0, width ]);

                console.log(x(birthdayFlow[2].dateFull), "x position, dateFull timescale is working");

                svg.append("g")
                    .attr("transform", "translate(0," + height*0.8 + ")")
                    .call(d3.axisBottom(x)
                        .tickSize(-height*.01)
                        .tickFormat(d3.timeFormat("%m-%d-%Y"))
                        .tickValues([start, birthday, end])) // this is wrong, we need a date
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
                    .domain([-500000, 500000])
                    .range([ height, 0 ]);
                    // console.log(y(birthdayFlow[2].huc01), "y")
            
                // color palette
                var color = d3.scaleOrdinal()
                    .domain(keys)
                    .range(colorScheme);

                    console.log(color(huc01), "color");
            
                //stack the data?
                var stackedData = d3.stack()
                    .offset(d3.stackOffsetSilhouette)
                    .keys(keys)
                    (birthdayFlow)

                    console.log(stackedData, "stack flow Data")
                
                // create a tooltip
                var Tooltip = svg
                    .append("text")
                    .attr("x", 80)
                    .attr("y", 200)
                    .attr("class", "tooltip")
                    .style("opacity", 0)
                    .style("font-size", 17)
            
                // Three function that change the tooltip when user hover / move / leave a cell
                var mouseover = function(d) {
                    Tooltip.style("opacity", 1)
                    d3.selectAll(".myArea").style("opacity", .2)
                    d3.select(this)
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
                    .x(function(d) { return x(d.data.dateFull); 
                    })
                    .y0(function(d) { return y(d[0]); })
                    .y1(function(d) { return y(d[1]); })
                    .curve(d3.curveMonotoneX)
            
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
                        .on("mouseleave", mouseleave);



        

        // d3.json
        })

    // end d3.csv gages
    });

// end fetchData()
}


/////////////////////////////////
// Function is called when the "submit" button is clicked
//////////////////////////////////
