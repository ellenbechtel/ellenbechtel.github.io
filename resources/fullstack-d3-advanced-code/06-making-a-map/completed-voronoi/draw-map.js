async function drawMap() {

  // 1. Access data

  const countryShapes = await d3.json("./../world-geojson.json")
  const dataset = await d3.csv("./../data_bank_data.csv")

  const countryNameAccessor = d => d.properties["NAME"]
  const countryIdAccessor = d => d.properties["ADM0_A3_IS"]
  const metric = "Population growth (annual %)"
  // const metric = "Net migration"
  // const metric = "International tourism, receipts (current US$)"
  // const metric = "Population density (people per sq. km of land area)"
  let metricDataByCountry = {}
  dataset.forEach(d => {
    if (d["Series Name"] != metric) return
    metricDataByCountry[d["Country Code"]] = +d["2017 [YR2017]"] || 0
  })

  // 2. Create chart dimensions

  let dimensions = {
    width: window.innerWidth * 0.9,
    margin: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    },
  }
  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right

  const sphere = ({type: "Sphere"})
  const projection = d3.geoEqualEarth()
    .fitWidth(dimensions.boundedWidth, sphere)

  const pathGenerator = d3.geoPath(projection)
  const [[x0, y0], [x1, y1]] = pathGenerator.bounds(sphere)

  dimensions.boundedHeight = y1
  dimensions.height = dimensions.boundedHeight + dimensions.margin.top + dimensions.margin.bottom

  // 3. Draw canvas

  const wrapper = d3.select("#wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  const bounds = wrapper.append("g")
      .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

  // 4. Create scales

  const metricValues = Object.values(metricDataByCountry)
  const metricValueExtent = d3.extent(metricValues)
  const maxChange = d3.max([-metricValueExtent[0], metricValueExtent[1]])
  const colorScale = d3.scaleLinear()
      .domain([-maxChange, 0, maxChange])
      .range(["indigo", "white", "darkgreen"])

  // 5. Draw data

  const earth = bounds.append("path")
      .attr("class", "earth")
      .attr("d", pathGenerator(sphere))

  const graticuleJson = d3.geoGraticule10()
  const graticule = bounds.append("path")
      .attr("class", "graticule")
      .attr("d", pathGenerator(graticuleJson))

  const countries = bounds.selectAll(".country")
    .data(countryShapes.features)
    .join("path")
      .attr("class", d => ["country", countryIdAccessor(d)].join(" "))
      .attr("d", pathGenerator)
      .attr("fill", d => {
        const metricValue = metricDataByCountry[countryIdAccessor(d)] || 0
        return colorScale(metricValue)
      })

  const delaunay = d3.Delaunay.from(
    countryShapes.features,
    d => pathGenerator.centroid(d)[0],
    d => pathGenerator.centroid(d)[1],
  )
  const voronoiPolygons = delaunay.voronoi()
  voronoiPolygons.xmax = dimensions.boundedWidth
  voronoiPolygons.ymax = dimensions.boundedHeight

  const voronoi = bounds.selectAll(".voronoi")
    .data(countryShapes.features)
      .join("path")
      .attr("class", "voronoi")
      .attr("d", (d,i) => voronoiPolygons.renderCell(i))

  // 6. Draw peripherals

  navigator.geolocation.getCurrentPosition(myPosition => {
    const [x, y] = projection([
      myPosition.coords.longitude,
      myPosition.coords.latitude
    ])
    const myLocation = bounds.append("circle")
        .attr("class", "my-location")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 0)
        .transition().duration(500)
        .attr("r", 10)
  })

  // 7. Set up interactions

  voronoi.on("mouseenter", onMouseEnter)
      .on("mouseleave", onMouseLeave)

  const tooltip = d3.select("#tooltip")
  function onMouseEnter(e, datum) {
    tooltip.style("opacity", 1)

    const countryId = countryIdAccessor(datum)
    const metricValue = metricDataByCountry[countryId] || 0

    tooltip.select("#country")
        .text(countryNameAccessor(datum))

    tooltip.select("#value")
        .text(`${d3.format(",.2f")(metricValue)}%`)

    const [centerX, centerY] = pathGenerator.centroid(datum)

    const x = centerX + dimensions.margin.left
    const y = centerY + dimensions.margin.top

    tooltip.style("transform", `translate(`
      + `calc( -50% + ${x}px),`
      + `calc(-100% + ${y}px)`
      + `)`)

    d3.select(`.${countryId}`)
        .classed("is-hovered", true)
  }

  function onMouseLeave() {
    tooltip.style("opacity", 0)
    d3.selectAll(`.country`)
        .classed("is-hovered", false)
  }
}
drawMap()
