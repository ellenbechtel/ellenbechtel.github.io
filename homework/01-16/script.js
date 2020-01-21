 // CREDITS TO 3 LITTLE CIRCLES FROM MIKE BOSTOCK https://bost.ocks.org/mike/circles/ AND HELP FROM STEVEN BRAUN

            //////////////////////////////////
            // MAKE SVG AND API DATA
            //////////////////////////////////

            var width = document.querySelector("#chart").clientWidth;
            var height = 500;
            var margin = {
              top: 50,
              left: 50,
              right: 50,
              bottom: 50,  
            };
          
            var svg = d3.select("body")
                .append("svg")
                .attr("width",width)
                .attr("height",height);

            var realTimeURL = "https://whiteboard.datawheel.us/api/google-analytics/realtime/51808252"
            
            var interval = 10 * 1000; // 10 seconds
       




            // TESTING
            var testCircle = svg.append("circle")
                .attr("cx",30)
                .attr("cy",30)
                .attr("r",20)
                .attr("fill","yellow");


            svg.append("text")
                .attr("x",30)
                .attr("y",30)
                .attr("stroke","black")
                .text("This is a test circle");



            
            //////////////////////////////////
            // INITIALIZE THE VIZ WITH THE FIRST CALL OF THE API
            //////////////////////////////////

            var users = [];

            function fetchData() {
                d3.json(realTimeURL, function(error,users) {  // Is this the first place where "users" gets declared a variable?

                    console.log("users:", users);

                    d3.select("#users").html(users);

                    var circle = svg.selectAll("circle")
                        .data(users)
                        .enter()
                        .append("circle")
                            .attr("cx", 100)
                            .attr("cy", 100)
                            .attr("r", users*10)
                            .attr("fill","teal");
                   
                });
            }

            //////////////////////////////////
            // ENTER UPDATE EXIT, BITCHES!!!!!
            //////////////////////////////////

            function updateData() {
                d3.json(realTimeURL, function(error,users) {
 
                    var nextCirc = svg.selectAll("circ")
                        .data(users);
                    
                    nextCirc.enter().append("circ")
                        .attr("cx", width/2)
                        .attr("cy", height/2)
                        .attr("r", 0)
                        .attr("fill","teal")
                    .merge(nextCirc)
                        .transition()
                        .attr("cx", width/2)
                        .attr("cy", height/2)
                        .attr("r", users*15)
                        .attr("fill","teal");
                    
                    nextCirc.exit()
                        .transition()
                        .attr("r", 0)
                        .remove();
                        
                });
            }

            //////////////////////////////////
            // RUN THE WHOLE THING
            //////////////////////////////////

        
            fetchData(); // initialize the data
            updateData();
            setInterval(updateData, interval);
        
           
    