/////////////////////////////////
// Set up all the static variables
//////////////////////////////////



/////////////////////////////////
// Grab inputs and fill in the API
//////////////////////////////////

var emptyAPI = "https://waterservices.usgs.gov/nwis/dv/?format=json";
var state = [];
var countyCd = '42071'; //&countyCd=42071, Lancaster County PA
var site = "01578310"; // Susquehanna river at Conowingo, MD
var sites = ["01578310","01104705"]; // above site AND the charles river
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

    // Make comma-separated list of sites from dataframe


    // URL chunks
    var urlCounty = "&countyCd=" + countyCd;
    var urlSites = "&sites=" + sites; // do something clever to separate by a comma
    var urlStartDate = "&startDT=" + startDate;
    var urlEndDate = "&endDT=" + endDate;
    var urlParam = "&PARAMETERcD=" + paramCode;
    var urlSiteType = "&siteType=" + siteType;
    var urlSiteStatus = "&siteStatus=" + siteStatus;

    // set some fake data


/////////////////////////////////
// Make fetch function
//////////////////////////////////

function fetchData() {
    

    // compile API
    sitey = emptyAPI + urlCounty + urlStartDate + urlEndDate + urlParam + urlSiteStatus;
    // 'https://waterservices.usgs.gov/nwis/dv/?format=json&countyCd=55079&startDT=1992-06-07&endDT=1992-06-07&PARAMETERcD=00060&siteStatus=all'
    console.log(sitey, "api"); //


    /////////////////////////////////
    // Call API 
    //////////////////////////////////

    d3.json(sitey, function(error, apiData) {
        info.push(apiData);
        console.log(info, "info");
    })
    
}


/////////////////////////////////
// Call Functions
//////////////////////////////////

fetchData();