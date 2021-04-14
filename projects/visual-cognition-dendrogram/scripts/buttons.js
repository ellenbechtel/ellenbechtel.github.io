
// Buttons
var nodeLabels = d3.selectAll(".node-label");
var checkBox = d3.select("#node-label-toggle")
    .on("click", nodeLabelToggle);

function nodeLabelToggle() {
    // Get the checkbox

    // If the checkbox is checked, display the output text
    if (checkBox._groups[0][0].checked == true){
        console.log("hey",nodeLabels);
        nodeLabels.style("opacity","1");
    } else {
        console.log("nope",nodeLabels);
        nodeLabels.style("opacity","0");
    }
  }


  