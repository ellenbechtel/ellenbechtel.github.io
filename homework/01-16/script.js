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
            
            var interval = 5 * 1000; // 1 second
       
        

            //////////////////////////////////
            // ENTER UPDATE EXIT, BITCHES!!!!!
            //////////////////////////////////

            function fetchData() {

                d3.json(realTimeURL, function(error, users) {

                    console.log("users2:", users);
                    d3.select("#users").html(users);


                    
                    /////////////////////////////////
                    // MAKE THE NODE NETWORK
                    //////////////////////////////////
                                  
                    // Make an array, then for each give it an id of just its index position
                    var nodes = d3.range(users).map(function(d) { return {id: d}; }); 
        

                    // Set the forces
                    var simulation = d3.forceSimulation(nodes)
                        .force("charge", d3.forceManyBody().strength(-2))
                        .force("center", d3.forceCenter(width/2,height/2))
                        .force("collide", d3.forceCollide().radius(10))
                    
                     
                    // Draw circles for nodes
                    var circles = svg.selectAll("circle")
                        .data(nodes/*, function(d) { return d.id; }*/)
                        .enter()
                        .append("circle")
                            .attr("r",5)
                            .attr("fill", "white")
                        /*.merge(circles)
                            .transition()
                            .attr("r",15)
                            .attr("fill","teal")*/;

                    circles.exit()
                        .transition()
                        .duration(300)
                        .attr("r",0)
                        .remove();
                    
                                            
                    simulation.on("tick", function() {
                        circles.attr("cx", function(d) { return d.x; })
                            .attr("cy", function(d) { return d.y; });
                    });
                    





                 
                });

            }

            //////////////////////////////////
            // RUN THE WHOLE THING
            //////////////////////////////////

        
            fetchData(); // initialize the data
            setInterval(fetchData, interval);