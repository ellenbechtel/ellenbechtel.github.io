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

            var realTimeURL = "https://whiteboard.datawheel.us/api/google-analytics/realtime/random"
            
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
                .text("This is a test blob");





            //////////////////////////////////
            // ENTER UPDATE EXIT, BITCHES!!!!!
            //////////////////////////////////

            var users = [];
                console.log("users1:", users);

            function fetchData() {

                d3.json(realTimeURL, function(error,users) {

                    console.log("users2:", users);
 
                    var circle = svg.selectAll("circle")
                        .data(users)
                        .enter()
                        .append("circle")
                            .attr("cx", width/2)
                            .attr("cy", height/2)
                            .attr("r", 0)
                            .attr("fill","teal")
                        .merge(circle)
                            .transition()
                            .attr("cx", width/2)
                            .attr("cy", height/2)
                            .attr("r", users*3)
                            .attr("fill","teal");
                    
                    circle.exit()
                        .transition()
                        .attr("r", 0)
                        .remove();
                        
                });

            }

            //////////////////////////////////
            // RUN THE WHOLE THING
            //////////////////////////////////

        
            fetchData(); // initialize the data
            setInterval(fetchData, interval);
        



