
    /////////////////////////////////
    // STATIC VARIABLES
    //////////////////////////////////
                                  
    var width = d3.min([window.innerWidth, 900]);
    var height = d3.min([window.innerHeight, 500]);
    var svg = d3.select("#chart")
      .attr("width", width)
      .attr("height", height);


    var realtimeURL = "https://whiteboard.datawheel.us/api/google-analytics/realtime/random";
    var frequency = 1 * 1000; // 1 second
  

    var dataMax = 8;
    var data = [];
    var fontSize = 20;

    var barWidth = width / dataMax;

      

    var x = d3.scaleLinear()
      .domain([dataMax, 1])
      .range([0, width - barWidth]);

    var colorScale = d3.scaleSequential(d3.interpolatePlasma)
      .domain([60, 180]);
    

//////////////////////////////////
// MAKE OUR FETCH DATA FUNCTION!!
//////////////////////////////////

    function fetchData() {
  
      d3.json(realtimeURL, function(error, users) {

        // Update Header Text
        d3.select("#users").html(users);
                 
        // Name the API data
        var dataObject = {
          users: users,
          timestamp: new Date()
        };

        // Push the API data to a variable called data that we'll use for everything else
        data.unshift(dataObject);
        if (data.length > dataMax) {
          data.pop();
        }

        /* You could also do this as shorthand
          if (data.length > dataMax) data.pop();
        */
        
        
        // Set Scales and Maximums based on the incoming data and what we've already stored
        var maximum = d3.max(data, function(d) {
          return d.users;
        });
        
        var barHeight = d3.scaleLinear()
          .domain([0, maximum])
          .range([0, height]);

                
        //////////////////////////////////
        // DRAW THE BARS
        //////////////////////////////////

        // all enter-update-exits must begin with a selection
        var bars = svg.selectAll(".bar")
          .data(data, function(d) {
            return d.timestamp;
          });

        // enter
        var enter = bars.enter().append("rect")
          .attr("class", "bar")
          .attr("width", barWidth)
          .attr("height", 0)
          .attr("x", function(d, i) {
            return x(i + 1);
            })
          .attr("y", height)
          .attr("fill", function(d, i) {
            return colorScale(d.users)
          });
        
        // update
        bars.merge(enter)
          .transition().duration(frequency/2)
          .attr("height", function(d) {
            return barHeight(d.users);
          })
          .attr("y", function(d) {
            return height-barHeight(d.users);
          })
          .attr("x", function(d, i) {
            return x(i + 1);
            });


        // exit
        bars.exit()
          .transition()
          .duration(frequency/2)
          .attr("height",0)
          .attr("y", height)
          .remove();

                
        //////////////////////////////////
        // LABELS
        //////////////////////////////////


        // Selection
        var labels = svg.selectAll(".label")
            .data(data, function(d) {
                return d.users;
            });

        // Enter
        var enterLabels = labels.enter().append("text")
            //.style("text-anchor","middle")
            .attr("class","label")
            .attr("font-size", fontSize)
            .attr("x", function(d, i) {
                return x(i + 1);
                })  // this needs to have something with barWidth in it
            .attr("y", height); // something to do with barHeight


        // Update, including wrap
        labels.merge(enterLabels)
            .transition()
            .duration(frequency/2)
            
            // The movement!
            .text(function(d) {
                return d.users;
              })            
            .attr("height", function(d) {
              return barHeight(d.users);
              })
            .attr("y", function(d) {
              return height-barHeight(d.users);
              })
            .attr("x", function(d, i) {
              return x(i + 1);
              });
  
  











        
        // Exit
        labels.exit().remove();
              



      });
  
    }
  
    fetchData();
    setInterval(fetchData, frequency);

  