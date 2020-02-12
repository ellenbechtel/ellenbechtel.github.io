var realtimeURL = "https://whiteboard.datawheel.us/api/google-analytics/realtime/random";
      var frequency = 1 * 1000; // 2 seconds

      var dataMax = 5;
      var data = [];

      var width = window.innerWidth;
      var height = window.innerHeight;
      var margin = {
          top: 20,
          right: 20,
          bottom: 50,
          left: 100
      };

      var chartWidth = width - margin.left - margin.right;
      var chartHeight = height - margin.top - margin.bottom;


      var svg = d3.select("#chart")
        .attr("width", width)
        .attr("height", height);

      var domainValues = d3.range(1, dataMax+1);

        var x = d3.scaleBand()
        .domain(domainValues.reverse())
        .range([margin.left, margin.left + chartWidth])
        .paddingInner(0.2)
        .paddingOuter(0.1);
            

      function fetchData() {

        d3.json(realtimeURL, function(error, users) {

          var dataObject = {
            users: users,
            timestamp: new Date()
          };

          data.unshift(dataObject);
          if (data.length > dataMax) data.pop();
         
          var maximum = d3.max(data, function(d) {
            return d.users;
          });

          var barHeight = d3.scaleLinear()
            .domain([0, maximum])
            .range([0, chartHeight]);

        // Y has to be inside the call function becuase             
        var y = d3.scaleLinear()
            .domain([0, maximum])
            .range([margin.top + chartHeight, margin.top]);
        var yAxis = d3.axisLeft(y);
        svg.select("#y")
            .attr("transform", "translate(" + margin.left + ",0)") // transform only listens to strings, so we have to jump in and out of javascript
            .transition()
            .duration(frequency/2)
            .call(yAxis);

      var barWidth = x.bandwidth();  // make barWidth be dynamic

        var xAxis = d3.axisBottom(x)
            .tickFormat(function(d) {
                var tickData = data[d-1];
                 if (tickData) {
                    var now = new Date();
                    var msAgo = now - tickData.timestamp;
                    var secondsAgo = Math.round(msAgo / 1000);
                    if (secondsAgo === 0) { 
                        return "now";
                    }
                   else {
                        var word = secondsAgo === 1 ? "second" : "seconds";
                        return secondsAgo + " " + word + " ago";
                    }
                 }
                 else {
                        return "";
                }
            });

        svg.select("#x")
            .attr("transform","translate(0," + (margin.top + chartHeight) + ")")
            .transition()
            .duration(frequency/2)
            .call(xAxis);


        // bars        

        var bars = svg.select("#shapes").selectAll(".bar") // first select anything with id="shapes" and put it in there
            .data(data, function(d) {
              return d.timestamp;
            });

        // If you're using duplicate code, it's good practice to 
        function zeroState(selection) {
            selection
                .attr("height", 0)
                .attr("y", y(0));
            };
        
          var enter = bars.enter().append("rect")
            .attr("class", "bar")
            .attr("width", barWidth)
            .call(zeroState)
            .attr("x", function(d, i) {
              return x(i + 1);
            });

          bars.merge(enter)
            .transition().duration(frequency / 2)
            .attr("height", function(d) {
              return barHeight(d.users);
            })
            .attr("y", function(d) {
              return y(d.users);
            })
            .attr("x", function(d, i) {
              return x(i + 1);
            });

          bars.exit()
            .transition().duration(frequency / 2)
            .call(zeroState)
            .remove();

        });

      }

      fetchData();
      setInterval(fetchData, frequency);













      // Scales


      // Y Scale


var recScale = d3.scaleBand()   // how strongly we believe you'll need this vehicle
.domain("false","true") 
.range([0,100]);

var y = d3.scaleBand()
.domain([0,100]) // Scale the Y axis to be the full height of the chart, where false is on the bottom and true is all the way at the top
.range([margin.top + chartHeight, margin.top]);

var yAxis = d3.axisLeft(y);

svg.select("#y")
.attr("transform", "translate(" + margin.left + ",0)") // transform only listens to strings, so we have to jump in and out of javascript
.call(yAxis);

var yAxisLabel = svg.append("text")
.attr("class","axisLabel")
.attr("transform","rotate(-90)")
.attr("x",-chartHeight/2)
.attr("y",margin.left/2)
.text("Recommendation Strength");


// Height Scale

var barHeight = d3.scaleLinear()
.domain("false","true") // this says that when false, start the heigh all t
.range(0, chartHeight);
