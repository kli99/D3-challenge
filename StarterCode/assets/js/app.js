// @TODO: YOUR CODE HERE! To create a scatter plot between two of the data variables
// Smokers vs. Age   // Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var margin = {
    top: 20,
    right: 40,
    bottom: 90,
    left: 100
};
// Define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
    .selectAll("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


//Load data from data.csv
d3.csv("data.csv").then(function(healthData) {
    console.log(healthData);

    //log a list of state abbr names
    var names = healthData.map(data => data.abbr);
    console.log(names);

    // Cast each age, smokers value in healthData as a number using the unary + operator
    healthData.forEach(function(data) {
        data.age = +data.age;
        data.smokes = +data.smokes;

        console.log("Smokes:", data.smokes);
        console.log("Age:", data.age);
    });

    //Create Scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.age) * 0.8,
            d3.max(healthData, d => d.age) * 1.2
        ])
        .range([0, width]);
    //.range([margin.left,width - margin.right]);

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.smokes) * 0.8, d3.max(healthData, d => d.smokes)])
        .range([height, 0]);
    //.range([height-margin.bottom,margin.top]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.age))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("r", "15")
        .classed("stateCircle", true)
        // circlesGroup.append("text")
        //     .text(d => d.abbr)
        //     .classed("stateText", true);



    // adding the State abbreviation to the circles
    var stateText = chartGroup.selectAll(".text")
        .data(healthData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("dx", d => xLinearScale(d.age))
        .attr("dy", d => yLinearScale(d.smokes))
        .classed("stateText", true)
        .attr("transform", "translate(-0.5, 5.5)");;

    // Initialize tool tip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.abbr}<br>Age: ${d.age}<br>Smokers: ${d.smokes}`);
        });

    //Create tooptip in the chart
    chartGroup.call(toolTip);

    //  Create event listeners to display and hide the tooltip
    circlesGroup.on("mouseover", function(data) {
            toolTip.show(data, this);
        })
        // onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
    //return circlesGroup;

    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "aText")
        .text("% of Smokes");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "aText")
        .text("Age(Median)");


}).catch(function(error) {
    console.log(error);
});