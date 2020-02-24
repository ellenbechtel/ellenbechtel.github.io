var render = (function () {

    // keys for concentric circles
    var dataKeys = ['studentNumber', 'femalePercentRatio', 'malePercentRatio', 'intlStudentsPercent']

    // helpers
    var width = 300
    var height = 250

    var t = d3.transition()
        .duration(400)
        .ease(d3.easeLinear)
    // pass in a full value (student number) 
    // and pass in the percentage to calculate number 
    // these are relative to the total students of 'a' uni
    function students(total, part) {
        var percentage = d3.scaleLinear()
            .domain([0, 100]) // pass in a percent
            .range([0, total])

        return percentage(part)
    }

    // colour each circle
    var sequentialScale = d3.scaleSequential()
        .domain([0, 4])
        .interpolator(d3.interpolateRainbow)
    // colour each circle
    var col = d3.scaleOrdinal()
        .domain(dataKeys)
        .range(['#ab6dc5','#9ec94d','#76b021', '#44a4f6'])

    var labels = d3.scaleOrdinal()
        .domain(dataKeys)
        .range(['No. Students: ','Female %: ','Male %: ', 'International %:'])

    function update(data, bindTo) {

        var maxStudents = d3.max(data, function (d) { return d.studentNumber; })
        // area of each circle taking the highest number of students 
        var sqrtScale = d3.scaleSqrt()
            .domain([0, maxStudents])
            .range([0, 110])
        // render grid
        var update = d3.select(bindTo)
            .selectAll('.js-circle')
            .data(data)

        update.exit().remove()

        var enter = update.enter()
            .append('div')
            .attr('class', 'block js-circle')
        // create a title which is a link
        enter.merge(update)
            .append('a')
            .attr('href', function (d) { return d.link; })
            .attr('class', 'block')
            .append('h1')
            .attr('class', 'js-uni-title')
            .append('a')
            .text(function (d) { return d.institution; })
        enter.merge(update).append('h2')
            .attr('class', 'js-rank')
            .text(function (d) { return d.rank; })
        // svg in each grid
        var svg = enter.merge(update).append('svg')
            .attr('class', function (d, i) { return 'js-svg svg-' + i; })
            .attr('width', width)
            .attr('height', height)

        // label for selected circle
        var circleInfo = enter.merge(update)
            .append('h3')
            .attr('class', function (d, i) { return 'block js-circle-info js-circle-info-' + i; })
            .html(function (d) { return ("<span>Staff per student:</span> " + (d.studentStaffRatio)); })

        // append set of circles for each of the datakeys
        // to each grid item
        data.forEach(function(o, n) {
            // extract the data and order it 
            // ensuring circles render largest to smallest
            var list = []
            // create a list using the keys for the circles and current data object
            dataKeys.forEach(function(_k, _n) {
                return list.push(
                    {
                        value: o[_k], // reference the value using the key
                        name: _k // reference the name
                    }
                )
            })
            // sort it in descending order
            list.sort(function(x, y) {
                return d3.ascending(y.value, x.value)
            })
            console.log('list', list)
            // render the set of circles 
            d3.select('.svg-' + n).selectAll('circle')
                .data(list)
                .enter().append('circle')
                .attr('class', function (d, i) { return ("cc c-" + i + " " + (d.name)); })
                .attr('r', function (d) {
                    if (d.name == 'studentNumber') {
                        return sqrtScale(o[d.name])
                    } else {
                        var v = students(o.studentNumber, d.value)
                        console.log('v', v)
                        return sqrtScale(v)
                    }
                })
                .attr('cx', width/2)
                .attr('cy', height/2)
                .style('fill', 'transparent')
                .style('stroke-width', 4)
                .style('stroke', function (d) { return col(d.name); }) 
                .on('mouseover', function(d, i) {
                    mouseoverValues(d.name)
                    mouseOverHighlight(i)
                })
                .on('mouseout', function(d) {
                    mouseOutReset(d)
                })
        })




///// MOUSEOVER

        function mouseoverValues(key) {
            circleInfo
                .html(function (d) { return ("<span>" + (labels(key)) + "</span> " + (d[key])); })
        }

        function mouseOverHighlight(index) {
            d3.selectAll('.cc')
                .interrupt()
                .transition(t)
                .style('opacity', 0.1)
            d3.selectAll('.c-' + index)
                .interrupt()
                .transition(t)
                .style('opacity', 1)
        }
        function mouseOutReset(d) {
            d3.selectAll('.cc')
                .interrupt()
                .transition(t)
                .style('opacity', 1)
            circleInfo
                .html(function (d) { return ("<span>Staff per student:</span> " + (d.studentStaffRatio)); })
        }

        function legend() {
            var legend = d3.select('#legend').append('svg')
                .attr('class', 'js-legend')
                .attr('width', 700)
                .attr('height', 40)
            legend.selectAll('rect.legend-items')
                .data(dataKeys)
                .enter().append('rect')
                .attr('class', 'legend-items')
                .attr('width', 163)
                .attr('height', 30)
                .attr('fill', function (d) { return col(d); }) 
                .attr('y', 0)
                .attr('x', function (d, i) { return i * 166; })
                .on('mouseover', function(d, i) {
                    mouseoverValues(d)
                    mouseOverHighlight(i)
                })
                .on('mouseout', function(d) {
                    mouseOutReset(d)
                })
            legend.selectAll('text.legend-lables')
                .data(dataKeys)
                .enter().append('text')
                .attr('class', 'legend-labels')
                .attr('y', 20)
                .attr('x', function (d, i) { return i * 166 + 10; })
                .text(function (d) { return labels(d); })
            
        }
        legend();
    }

    return update
    
})()

//////////////////////




// JSON



[
    {
        "institution": "Oregon Health and Science University",
        "location": "Portland, Oregon, US",
        "rank": "1",
        "studentNumber": 2861,
        "studentStaffRatio": 1.1,
        "intlStudentsPercent": 2,
        "femalePercentRatio": 65,
        "malePercentRatio": 35,
        "link": "https://www.timeshighereducation.com/world-university-rankings/oregon-health-and-science-university#ranking-dataset/134377"
    },
    {
        "institution": "Saitama Medical University",
        "location": "Tokyo, Japan",
        "rank": "2",
        "studentNumber": 1889,
        "studentStaffRatio": 1.5,
        "intlStudentsPercent": 0,
        "femalePercentRatio": 53,
        "malePercentRatio": 47,
        "link": "https://www.timeshighereducation.com/world-university-rankings/saitama-medical-university#ranking-dataset/608682"
    },
    {
        "institution": "Rush University",
        "location": "Chicago, US",
        "rank": "=3",
        "studentNumber": 1987,
        "studentStaffRatio": 2.2,
        "intlStudentsPercent": 4,
        "femalePercentRatio": 71,
        "malePercentRatio": 29,
        "link": "https://www.timeshighereducation.com/world-university-rankings/rush-university#ranking-dataset/612573"
    },
    {
        "institution": "Tata Institute of Fundamental Research",
        "location": "Mumbai, India",
        "rank": "=3",
        "studentNumber": 579,
        "studentStaffRatio": 2.2,
        "intlStudentsPercent": 1,
        "femalePercentRatio": 33,
        "malePercentRatio": 67,
        "link": "https://www.timeshighereducation.com/world-university-rankings/tata-institute-fundamental-research#ranking-dataset/600172"
    },
    {
        "institution": "Jikei University School of Medicine",
        "location": "Tokyo, Japan",
        "rank": "5",
        "studentNumber": 1034,
        "studentStaffRatio": 0.8,
        "intlStudentsPercent": 0,
        "femalePercentRatio": 44,
        "malePercentRatio": 56,
        "link": "https://www.timeshighereducation.com/world-university-rankings/jikei-university-school-medicine#ranking-dataset/608682"
    }
]










  var colorScale = d3.scaleOrdinal()
  .domain(["Bad", "Neutral", "Good", "Misleading", "none"]) // change this to "too good to be true"
  .range(["#4C6375", "#B1D4CE", "#FED200", "#FA8C00", "none"]);
