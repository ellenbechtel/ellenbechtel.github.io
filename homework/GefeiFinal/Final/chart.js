date = [20200304
    ,20200305
    ,20200306
    ,20200307
    ,20200308
    ,20200309
    ,20200310
    ,20200311
    ,20200312
    ,20200313
    ,20200314
    ,20200315
    ,20200316
    ,20200317
    ,20200318
    ,20200319
    ,20200320
    ,20200321
    ,20200322
    ,20200323
    ,20200324
    ,20200325
    ,20200326
    ,20200327
    ,20200328
    ,20200329
    ,20200330
    ,20200331
    ,20200401
    ,20200402
    ,20200403
    ,20200404
]

var margin = {top: 10, right: 10, bottom: 0, left: 10},
    width = window.screen.width - margin.left - margin.right,
    height = window.screen.height - margin.top - margin.bottom,
    innerRadius = 80,
    outerRadius = Math.min(width, height) / 1.3;  

var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("id", "data_svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  

svg.append("g")
        .attr("id", "scaler")
        .attr("transform", "translate(" + width / 2 + "," + ( height/2 )+ ")" + "scale(1.5)"); 

circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('id', 'circle')
            circle.setAttribute('cx', 0);
            circle.setAttribute('cy', 0);
            circle.setAttribute('stroke', 'yellow');
            circle.setAttribute('fill', 'none')
            circle.setAttribute('r', '1100');
            circle.setAttribute('stroke-width', '1000')
            circle.setAttribute('display', 'none')

document.getElementById("scaler").append(circle)

text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.textContent = "Click next"
            text.setAttribute('id', 'legend_text')
            text.setAttribute('x', 1300);
            text.setAttribute('y', 20);
document.getElementById("data_svg").append(text)


list1 = ['grey', 'red', 'blue', 'green', 'yellow']
list2 = ['Death', 'Positive', 'Pending', 'Negtive / Safe', 'High Risk']

for (i = 0; i < list1.length; i++){
    square = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            square.setAttribute('id', 'legend_square')
            square.setAttribute('x', 1525);
            square.setAttribute('y', 785 + i * 25);
            square.setAttribute('width', 20);
            square.setAttribute('height', 20)
            square.setAttribute('stroke', 'none');
            square.setAttribute('fill', list1[i])
    text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.textContent = list2[i]
            text.setAttribute('id', 'legend_text')
            text.setAttribute('x', 1550);
            text.setAttribute('y', 800 + i * 25);

    document.getElementById("data_svg").append(square)
    document.getElementById("data_svg").append(text)
}

d3.csv("data.csv", function(data) {
    document.getElementById("myRange").setAttribute("max", data.length)
    svg = d3.select('#scaler')
  // X scale
  var x = d3.scaleBand()
      .range([0, 1.8 * Math.PI])    
      .align(0)                  
      .domain( data.map(function(d) { return d.date; }) ); 

  // Y scale
  var y = d3.scaleRadial()
      .range([innerRadius, outerRadius])   
      .domain([0, 3000000]); 

    svg.append("g")
        .attr("id", "date_text")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
        .attr("text-anchor", function(d) { return (x(d.date) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
        .attr("transform", function(d) { return "rotate(" + ((x(d.date) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d['negative'])+10) + ",0)"; })
      .append("text")
        .attr("name", function(d){return d.date})
        .attr("display", "none")
        .text(function(d){return(d.date)})
        .attr("transform", function(d) { return (x(d.date) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
        .style("font-size", "11px")
        .attr("alignment-baseline", "middle")

  // Add bars
    svg.append("g")
        .attr("id", "green")
        .selectAll("path")
        .data(data)
        .enter()
        .append("path")
            .attr("name", function(d){return d.date})
            .attr("display", "none")
            .attr("fill", "green")
            .attr("fill-opacity", "1")
            .attr("d", d3.arc()     // imagine your doing a part of a donut plot
            .innerRadius(innerRadius)
            .outerRadius(function(d) { return y(d['negative']); })
            .startAngle(function(d) { return x(d.date); })
            .endAngle(function(d) { return x(d.date) + x.bandwidth(); })
            .padAngle(0.01)
            .padRadius(innerRadius))

     svg.append("g")
        .selectAll("path")
        .data(data)
        .enter()
        .append("path")
            .attr("name", function(d){return d.date})
            .attr("display", "none")
            .attr("fill", "red")
            .attr("fill-opacity", "1")
            .attr("d", d3.arc()     
            .innerRadius(innerRadius)
            .outerRadius(function(d) { return y(d['positive']); })
            .startAngle(function(d) { return x(d.date); })
            .endAngle(function(d) { return x(d.date) + x.bandwidth(); })
            .padAngle(0.01)
            .padRadius(innerRadius))


    svg.append("g")
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
        .attr("name", function(d){return d.date})
        .attr("display", "none")
        .attr("fill", "blue")
        .attr("fill-opacity", "1")
        .attr("d", d3.arc()     
        .innerRadius(innerRadius)
        .outerRadius(function(d) { return y(d['pending']); })
        .startAngle(function(d) { return x(d.date); })
        .endAngle(function(d) { return x(d.date) + x.bandwidth(); })
        .padAngle(0.01)
        .padRadius(innerRadius))
    
    svg.append("g")
        .selectAll("path")
        .data(data)
        .enter()
        .append("path")
            .attr("name", function(d){return d.date})
            .attr("display", "none")
            .attr("fill", "darkgrey")
            .attr("fill-opacity", "1")
            .attr("d", d3.arc()     
            .innerRadius(innerRadius)
            .outerRadius(function(d) { return y(d['death']); })
            .startAngle(function(d) { return x(d.date); })
            .endAngle(function(d) { return x(d.date) + x.bandwidth(); })
            .padAngle(0.01)
            .padRadius(innerRadius))

});

function update(value){
    list = []
    disapear = []

    if(value == 0){
        for(i = 0; i < date.length; i++){
            disapear.push(date[i])
        }
    }

    if(value > 20 && value < date.length){
        document.getElementById("scaler").setAttribute("transform", "translate(" + width / 2 + "," + ( height/2)+ ") scale(0.8)")
    }

    for (i = 0; i < date.length; i++){
        if(i < value) {
            list.push(date[i])
        }
        else{
            disapear.push(date[i])
        }
    }

    for (i = 0; i < list.length; i++){
        e = document.getElementsByName(list[i])
        for (x of e){
            x.setAttribute("display", null)
        }

        f = document.getElementsByName(disapear[i])
        for (x of f){
            x.setAttribute("display", "none")
        }
    }
}

var slider = document.getElementById("myRange");

slider.oninput = function() {
    update(this.value)
    currentValue = this.value
}

var currentValue = 0;

function next(){
    currentValue = +currentValue + 1
    document.getElementById("myRange").setAttribute("value", currentValue)
    update(currentValue)
    if(currentValue > date.length){
        nextStage(currentValue)
    }
}

function nextStage(currentValue){
    index = currentValue - date.length

    console.log(currentValue)
    switch(index){
        case 1:
            startTime();
            text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', '20');
                text.setAttribute('y', 40);
                text.setAttribute('id', 'text1');
                text.setAttribute('fill', 'black');
            document.getElementById("data_svg").appendChild(text);
            document.getElementById('text1').innerHTML = "How is the COVID-19 situation in the US now?";
            // document.getElementById("scaler").setAttribute("transform", "translate(" + width / 2 + "," + ( height/2+100 )+ ") scale(0.5)")
            break;

        case 2:
            text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', '20');
                text.setAttribute('y', 80);
                text.setAttribute('id', 'text2');
                text.setAttribute('fill', 'black');
            document.getElementById("data_svg").appendChild(text);

            text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', '20');
                text.setAttribute('y', 100);
                text.setAttribute('id', 'textmore');
                text.setAttribute('fill', 'black');
            document.getElementById("data_svg").appendChild(text);

            line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', 400);
                line.setAttribute('x2', 600);
                line.setAttribute('y1', 110);
                line.setAttribute('y2', 200);
                line.setAttribute('id', 'line');
                line.setAttribute('stroke-width', 2);
                line.setAttribute('stroke', 'black');
            document.getElementById("data_svg").appendChild(line);

            document.getElementById("date_text").setAttribute("display", "none");
            document.getElementById('text2').innerHTML = "This is where everyone of us at.";
            document.getElementById('textmore').innerHTML = 'Include people who were tested negtive for the virus, and people who had the virus but already recovered.'
            document.getElementById("green").setAttribute("display", "none")
            document.getElementById("scaler").setAttribute("transform", "translate(" + width / 2 + "," + ( height/2)+ ") scale(0.3)")
            document.getElementById('circle').setAttribute('display', null)
            //document.body.style.backgroundColor = "gold"
            // document.getElementById("hh").setAttribute("display", "block")
            break;

        case 3:
            list = ["If everyone do can do those actions together: ",
                    "&#160 &#160 &#160 &#160 Wearing facial mask",
                    "&#160 &#160 &#160 &#160    Keep social distanc at outside",
                    "&#160 &#160 &#160 &#160    Do not leave home unleas have to",
                    "&#160 &#160 &#160 &#160    Do not touch mouse, nose and eyes at outside",
                    "&#160 &#160 &#160 &#160    Wash hands frequently",
                    "&#160 &#160 &#160 &#160   Cleaning and disinfecting the the home"
                    ]

            for (i = 0; i < 7; i++) {
                text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    text.setAttribute('x', '20');
                    text.setAttribute('y', 140 + i * 20);
                    text.setAttribute('id', 'text' + 3 + i);
                    text.setAttribute('fill', 'black');
                document.getElementById("data_svg").appendChild(text);

                document.getElementById("date_text").setAttribute("display", "none");
                document.getElementById('text' + 3 + i).innerHTML = list[i]
            }
            break;

        case 4:
            text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', '20');
                text.setAttribute('y', 300);
                text.setAttribute('id', 'text3');
                text.setAttribute('fill', 'black');
            document.getElementById("data_svg").appendChild(text);

            text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', '20');
                text.setAttribute('y', 320);
                text.setAttribute('id', 'text4');
                text.setAttribute('fill', 'black');
            document.getElementById("data_svg").appendChild(text);

            document.getElementById("date_text").setAttribute("display", "none");
            document.getElementById('text3').innerHTML = "We can protect ourself from getting the virus,"
            document.getElementById('text4').innerHTML = "and stop the virus from spreading."
            document.getElementById('circle').setAttribute('stroke', 'green')
            break;
        

    } 
}

function reset(){
    // currentValue = 0;
    // document.getElementById("myRange").setAttribute("value", currentValue)
    // update(currentValue)
    location.reload();
}

function checkTime(i) {
    text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', '20');
            text.setAttribute('y', 20);
            text.setAttribute('id', 'time-text');
            text.setAttribute('fill', 'black');
            document.getElementById("data_svg").appendChild(text);

    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }
  
  function startTime() {
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth();
    var day = today.getDay();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    // add a zero in front of numbers<10
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('time-text').setAttribute("display", null)
    document.getElementById('time-text').innerHTML = month + " / " + day + " / " + year + "   " + h + ":" + m + ":" + s;
    t = setTimeout(function() {
      startTime()
    }, 500);
  }
