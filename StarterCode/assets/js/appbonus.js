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


// Initial Params
var chosenXAxis = "age";
var chosenYAxis = "smokes";

// 1st set data function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {
    //Create Scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
            d3.max(healthData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);
    //.range([margin.left,width - margin.right]);
    return xLinearScale;
}


function yScale(healthData, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.8,
            d3.max(healthData, d => d[chosenYAxis]) * 1.2
        ])
        .range([height, 0]);

    return yLinearScale;
};


// function used for updating xAxis and yAxis var upon click on axis label

function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
};

function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
};


// function yScale1(healthData, newXScale1) {
//     var yLinearScale1 = d3.scaleLinear()
//         .domain([d3.min(healthData, d => d.healthcare) * 0.8, d3.max(healthData, d => d.smokes)])
//         .range([height, 0]);

//     return yLinearScale1;
// };


// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]))

    return circlesGroup;
};


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

    var label;

    if (chosenXAxis === "age") {
        label = "Age (Median):";
    } else {
        label = "In Poverty(%):";
    }

    // var ylabel;

    // if (chosenYAxis === "smokes") {
    //     ylabel = "Smokes (%):";
    // } else {
    //     ylabel = "Lacks Healthcare (%): ";
    // }

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.abbr}<br>Age: ${d.age}<br>Smokers: ${d.smokes}`);
        });

    //Create tooptip in the chart
    circlesGroup.call(toolTip);

    //  Create event listeners to display and hide the tooltip
    circlesGroup.on("mouseover", function(data) {
            toolTip.show(data, this);
        })
        // onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

};

//Load data from data.csv
d3.csv("data.csv").then(function(healthData, err) {

    if (err) throw err;
    //console.log(healthData);

    //log a list of state abbr names
    var names = healthData.map(data => data.abbr);
    console.log(names);

    // Cast each age, smokers value in healthData as a number using the unary + operator
    healthData.forEach(function(data) {
        data.age = +data.age;
        data.smokes = +data.smokes;
        data.health = +data.healthcare;
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;

        // console.log("Smokes:", data.smokes);
        // console.log("Age:", data.age);
        // console.log("Health:", data.healthcare);
        // console.log("Poverty:", data.poverty);
        // console.log("Obesity:", data.obesity)

    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(healthData, chosenXAxis);


    // Create y scale function
    var yLinearScale = yScale(healthData, chosenYAxis);

    // var yLinearScale = d3.scaleLinear()
    //     .domain([d3.min(healthData, d => d.smokes) * 0.8,
    //         d3.max(healthData, d => d.smokes) * 1.2
    //     ])
    //     .range([0, width]);



    // var yLinearScale1 = d3.scaleLinear()
    //     .domain([d3.min(healthData, d => d.healthcare) * 0.8,
    //         d3.max(healthData, d => d.healthcare) * 1.2
    //     ])
    //     .range([0, width]);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);


    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 20)
        .attr("fill", "pink")
        .classed("stateCircle", true);

    var stateText = chartGroup.selectAll(".text")
        .data(healthData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("dx", d => xLinearScale(d[chosenXAxis]))
        .attr("dy", d => yLinearScale(d[chosenYAxis]))
        .classed("stateText", true)
        .attr("transform", "translate(-0.5, 5.5)");

    // Create group for two x-axis labels
    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var ageLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "age") // value to grab for event listener
        .classed("active", true)
        .text("Age(Median)");

    var povertyLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "poverty") // value to grab for event listener
        .classed("inactive", true)
        .text("In Poverty (%)");

    // Create group for two yaxis labels
    var ylabelsGroup = chartGroup.append("g");

    // append y axis
    var smokesLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 40 - margin.left)
        .attr("x", 20 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "smokes")
        .classed("active", true)
        .text("Smokes (%)");

    var healthLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 20 - margin.left)
        .attr("x", 20 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "healthcare")
        .classed("inactive", true)
        .text("Lacks Healthcare (%)");


    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup, chosenYAxis, xLinearScale, yLinearScale);

    // x axis labels event listener
    xlabelsGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

                // replaces chosenXAxis with value
                chosenXAxis = value;

                // console.log(chosenXAxis)

                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(healthData, chosenXAxis);

                // updates x axis with transition
                xAxis = renderXAxis(xLinearScale, xAxis);

                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, chosenYAxis, yLinearScale);

                // updates tooltips with new info
                // circlesGroup = updateToolTip(chosenXAxis, circlesGroup, chosenYAxis);

                // changes classes to change bold text
                if (chosenXAxis === "age") {
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);

                } else {
                    (chosenXAxis === "poverty")
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });



    // x axis labels event listener
    ylabelsGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
            var valueY = d3.select(this).attr("value");
            if (valueY !== chosenYAxis) {

                // replaces chosenXAxis with value
                chosenYAxis = valueY;

                // console.log(chosenXAxis)

                // functions here found above csv import
                // updates x scale for new data
                yLinearScale = yScale(healthData, chosenYAxis);

                // updates x axis with transition
                yAxis = renderYAxis(yLinearScale, yAxis);

                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, chosenYAxis, yLinearScale);

                // updates tooltips with new info
                //circlesGroup = updateToolTip(chosenXAxis, circlesGroup, chosenYAxis);

                // changes classes to change bold text
                if (chosenYAxis === "smokes") {
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthLabel
                        .classed("active", false)
                        .classed("inactive", true);

                } else {
                    (chosenYAxis === "healthcare")
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });


}).catch(function(error) {
    console.log(error);
});