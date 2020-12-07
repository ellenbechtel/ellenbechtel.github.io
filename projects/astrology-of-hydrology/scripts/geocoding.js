function fetchLocation() {
    /////////////////////////////////
    // Get City and State, clear previously stored values
    //////////////////////////////////
    var HUCmap = d3.select()
    var city = [];
    var state = [];
    var geocodeAPIURL = "http://open.mapquestapi.com/geocoding/v1/address?key=	NkGrSo9aZDYlEaOv3pNN3lvFxuBFmCdK&location=";
    var geocode = [];
    var nwisAPIURL = "https://waterservices.usgs.gov/nwis/dv/?format=json&bBox="
    var lat = [];
    var long = [];
    var birthCoord = [];
    var birthCoordBIG = [];
    var siteStatus = "all"

    city = document.getElementById("city").value;    
    state = document.getElementById("state").value;    


    // http://open.mapquestapi.com/geocoding/v1/address?key=KEY&location=Washington,DC

    console.log(city,state);

    /////////////////////////////////
    // Compile Geocoding URL
    var geocode = geocodeAPIURL + city + "," + state;
    /////////////////////////////////
    // Call API

    d3.json(geocode, function(error, apiData) { 
        console.log(apiData, "lat long");

        lat = apiData.results[0].locations[0].latLng.lat;
        long = apiData.results[0].locations[0].latLng.lng;
        console.log(lat,"lat", long, "long");
        
        birthCoord.push({
            "lat": lat, 
            "long": long,
            "north": (lat+.1).toFixed(4),
            "east": (long+.1).toFixed(4),
            "south": (lat-.1).toFixed(4),
            "west": (long-.1).toFixed(4)
        });

        birthCoordBIG.push({
            "lat": lat, 
            "long": long,
            "north": (lat+.5).toFixed(4),
            "east": (long+.5).toFixed(4),
            "south": (lat-.5).toFixed(4),
            "west": (long-.5).toFixed(4)
        })

        console.log(birthCoord, "inside",  birthCoordBIG, "big");
        // https://waterservices.usgs.gov/nwis/dv/?format=json&bBox=-76.4057,39.9381,-76.2057,40.1381,&siteStatus=,all
        // should be
        // https://waterservices.usgs.gov/nwis/dv/?format=json&bBox=-76.405669,39.938130,-76.205669,40.138130&siteStatus=all

        /////////////////////////////////
        // Compile HUC-retreiving URL
        var nwisAPI = nwisAPIURL + birthCoord[0].west + "," + birthCoord[0].south + "," + birthCoord[0].east  + "," + birthCoord[0].north  + "&siteStatus="  + siteStatus

        /////////////////////////////////
        // Call NWIS API to determine what HUC02 we're in

        d3.json(nwisAPI, function (error, HUCdata) {
    
            var birthHUC = HUCdata.value.timeSeries[0].sourceInfo.siteProperty[1].value.slice(0,2);
            console.log(birthHUC, "birth HUC")

            function highlightBirthHUC(birthHUC) {
                // compile the variable name from the input
                var all_HUCS = d3.selectAll("#scroll-svgs").style("opacity",".1")
                var myHUC = "";
                console.log(birthHUC, "birth HUC inside")
                if (birthHUC="01") {
                    myHUC = d3.select("#_01").attr("class","highlighted_HUC")
                } else if (birthHUC="02") {
                    myHUC = d3.select("#_02").attr("class","highlighted_HUC")
                }    
            }
            
            highlightBirthHUC(birthHUC);
        })
        
    });

    
}



/////////////////////////////////
// Function is called when the "submit" button is clicked
//////////////////////////////////
