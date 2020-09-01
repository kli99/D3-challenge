// @TODO: YOUR CODE HERE! To create a scatter plot between two of the data variables
// Smokers vs. Age   // Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var margin = {
    top: 20,
    right: 40,
    bottom: 360,
    left: 100
};
// Define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
    .select("scatter")
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
});

//Create Scales
//= ============================================
var xTimeScale = d3.scaleLinear()
    .domain(d3.extent(healthData, d => d.age))
    .range([0, width]);
//.range([chartMargin.left,width - chartMargin.right]);

var yLinearScale1 = d3.scaleLinear()
    .domain([0, d3.max(donutData, d => d.smokes)])
    .range([height, 0]);
//.range([height-chartMargin.bottom,chartMargin.top]);