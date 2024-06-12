  function handleFileSelect(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
      const csv = event.target.result;
      const lines = csv.split('\n');
      const headers = lines[0].split(',');
      const dataArray = [];

      for (let i = 1; i < lines.length; i++) {
        const data = lines[i].split(',');
        const obj = {};

        for (let j = 0; j < headers.length; j++) {
          obj[headers[j]] = data[j];
        }

        dataArray.push(obj);
      }

      console.log(dataArray)

      const allKeys = [];

// Iterate over each object and extract keys
dataArray.forEach(obj => {
    Object.keys(obj).forEach(key => {
        if (!allKeys.includes(key)) {
            allKeys.push(key);
        }
    });
});

// Print all keys
console.log(allKeys);

      const newData = dataArray.map(obj => ({
        ...obj,
        Rating: Number(obj.Rating),
        Reviews: Number(obj.Reviews),
        Installs: Number(obj.Installs),
        Price: Number(obj.Price),
        Content_Rating: obj.Content_Rating

      }));

      console.log(newData)

      const groupedData_Category_Installs = newData.reduce((acc, obj) => {
        const { Category, Installs, Price } = obj;
        if (!acc[Category]) {
          acc[Category] = { Category, Installs: 0, Price: 0, count:0};
        }
        acc[Category].Installs += Installs;
        acc[Category].Price += Price;
        acc[Category].count++;

        return acc;
      }, {});

      console.log(groupedData_Category_Installs);

      const averagesArray = [];
    for (const [Category, values] of Object.entries(groupedData_Category_Installs)) {
      const averagePrice = values.Price / values.count;
      const SumOfInstall = values.Installs;
      averagesArray.push({ Category, SumOfInstall: SumOfInstall, AveragePrice: averagePrice });
}

      const  array_groupedData_Category_Installs = Object.values(averagesArray).map(obj => Object.values(obj));

      console.log(array_groupedData_Category_Installs);

      const groupedData_ContentRating_Percent = dataArray.reduce((acc,obj) => {
        if (obj && obj.Content_Rating) { // Check if obj and Content_Rating exist
          if (!acc[obj.Content_Rating]) {
              acc[obj.Content_Rating] = 0;
          }
          acc[obj.Content_Rating]++;
      }
      return acc;


      },{});



      const data = Object.entries(groupedData_ContentRating_Percent)
      console.log(data)

      const groupedData_App_Installs = newData.reduce((acc, obj) => {
        const { App, Installs } = obj;
        acc[App] = (acc[App] || 0) + Installs;
        return acc;
      }, {});


      // Convert the object into an array of key-value pairs
      let entries = Object.entries(groupedData_App_Installs);

// Sort the array by values in descending order
      entries.sort((a, b) => b[1] - a[1]);

// Take the top 10 elements
       let top10Entries = entries.slice(0, 10);
       console.log(top10Entries);
      
      // Output the array of objects to the console
      // You can further process dataArray as needed here
      //chart1
      // Category, Rating and Install chart
      const margin = { top: 20, right: 50, bottom: 50, left: 30 };
      const w = 1100 - margin.left - margin.right;
      const h = 500 - margin.top - margin.bottom;

      var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

      

      var svg = d3.select("#chart1")
      .append("svg")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h  + margin.top + margin.bottom)
      .attr("class", "bar")
      .append("g")
      .attr("transform", "translate(80, 20)");

      const yScale = d3.scaleLinear()
      .domain([0, d3.max(array_groupedData_Category_Installs.map(innerArray => innerArray[1]))])  // Input domain
      .range([h , 0]); 


      const zScale = d3.scaleLinear()
      .domain([0, d3.max(array_groupedData_Category_Installs.map(innerArray => innerArray[2]))])  // Input domain
      .range([h , 0]); 

      console.log(d3.min(array_groupedData_Category_Installs.map(d => d[1])))


      const xScale = d3.scaleBand()
      .domain(array_groupedData_Category_Installs.map(d => d[0]))
      .range([0, w])
      .padding(0.1);


      var yAxis = d3.axisLeft().scale(yScale).ticks(5);;
      var xAxis = d3.axisBottom().scale(xScale);
      var zAxis = d3.axisRight().scale(zScale);



      svg.append("g")
      .call(yAxis)
      svg.selectAll("text")
      .style("font-size", "10px");
      
      svg.append("g")
      .call(xAxis)
      .attr("transform", `translate(0, 430)`)
      .selectAll("text")
      .attr("transform", "rotate(-45)")


      svg.append("g")
        .call(zAxis)
        .attr("transform", `translate(1000, 0)`)


      
    

      var rect = svg.selectAll("rect")
       .data(array_groupedData_Category_Installs)
       .enter()
       .append("rect")
       .attr("x", (d, i) => xScale(d[0]))  // Use the xScale to position bars
       .attr("y", d => yScale(d[1])) 
       .attr("width", 30)
       .attr("class", "bar")
       .attr("height", d => h - yScale(d[1]))
       .attr("fill", function(d , i) {
         return "rgb(0, 0, " + Math.round(255 / array_groupedData_Category_Installs.length) * i + ")";
        })
        .on("mouseover", function(event, d) {
          tooltip.transition()
              .duration(200)
              .style("opacity", .9);
          tooltip.html("Category: " + d[0] + "<br/>Sum of Installs: " + d[1])
              .style("left", (event.pageX) + "px")
              .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
          tooltip.transition()
              .duration(500)
              .style("opacity", 0);
        });
        const line = d3.line()
        .x(d => xScale(d[0]))
        .y(d => zScale(d[2]));



        svg.append("path")
        .datum(array_groupedData_Category_Installs)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("d", line);


        svg.selectAll(".dot")
        .data(array_groupedData_Category_Installs)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d[0]))
        .attr("cy", d => zScale(d[2]))
        .attr("r", 5)
        .attr("fill", "red")
        .on("mouseover", function(event, d) {
          // Show tooltip on mouseover
          d3.select(".tooltip")
              .style("opacity", 1)
              .html("Category: " + d[0] + "<br>:Average of Price " + d[2])
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 30) + "px");
      })
      .on("mouseout", function() {
          // Hide tooltip on mouseout
          d3.select(".tooltip").style("opacity", 0);
      });


        // chart2


       const margin1 = { top: 20, right: 20, bottom: 50, left: 30 };
       const w1 = 500 - margin1.left - margin1.right;
       const h1 = 500 - margin1.top - margin1.bottom;


       var svg1 = d3.select("#chart2")
      .append("svg")
      .attr("width", w1 + margin1.left + margin1.right)
      .attr("height", h1  + margin1.top + margin1.bottom)
      .attr("class", "bar")
      .append("g")
      .attr("transform", "translate(100, 20)");

      
      
      const yScale1 = d3.scaleBand()
      .domain(top10Entries.map(d => d[0]))
      .range([h1, 0])
      .padding(0.1);


      const xScale1 = d3.scaleLinear()
      .domain([0, d3.max(top10Entries.map(innerArray => innerArray[1]))])  // Input domain
      .range([0 , w1]); 

      var yAxis1 = d3.axisLeft().scale(yScale1);
      var xAxis1 = d3.axisBottom().scale(xScale1);


      svg1.append("g")
      .call(yAxis1)
      svg1.selectAll("text")
      .style("font-size", "10px");


      svg1.append("g")
      .call(xAxis1)
      .attr("transform", `translate(0, 430)`)
      .selectAll("text")
      .attr("transform", "rotate(-45)")


      var rect1 = svg1.selectAll("rect")
       .data(top10Entries)
       .enter()
       .append("rect")
       .attr("x", 10)  // Use the xScale to position bars
       .attr("y", d => yScale1(d[0])) 
       .attr("width",  d =>  xScale1(d[1]) - 30 )
       .attr("height", 30)
       .attr("class", "bar")
       .attr("fill", function(d , i) {
         return "rgb(0, 0, " + Math.round(255 / top10Entries.length) * i + ")";
        })
        .on("mouseover", function(event, d) {
          tooltip.transition()
              .duration(200)
              .style("opacity", .9);
          tooltip.html("Application: " + d[0] + "<br/>Installs: " + d[1])
              .style("left", (event.pageX) + "px")
              .style("top", (event.pageY - 28) + "px")
        })
        .on("mouseout", function(d) {
          tooltip.transition()
              .duration(500)
              .style("opacity", 0);
        });



        //chart3
        const w2 = 450;
        const h2 = 450;
        const margin2 = 40;
        const legendRectSize = 18;
        const legendSpacing = 4;

        const radius = Math.min(w2, h2) / 2 - margin2;


        const svg2 = d3.select("#chart3")
            .append("svg")
            .attr("width", w2 + 200)
            .attr("height", h2)
            .append("g")
            .attr("transform", `translate(${w2 / 2}, ${h2 / 2})`);
           


            const color = d3.scaleOrdinal()
            .domain(data.map(d => d[0]))
            .range(d3.schemeCategory10);

        // Compute the position of each group on the pie
        const pie = d3.pie()
            .value(d => d[1]);

        // Generate the arcs
        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);


            const arcs = svg2.selectAll('path')
            .data(pie(data))
            .join('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data[0]))
            .attr('stroke', 'white')
            .style('stroke-width', '2px');


        // Append the arcs to the SVG
        svg2.selectAll('path')
            .data(pie(data))
            .join('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data[0]))
            .attr('stroke', 'white')
            .style('stroke-width', '2px')
            .on('mouseover', function(event, d) {
              tooltip.transition()
                  .duration(200)
                  .style('opacity', .9);
              tooltip.html(`Category: ${d.data[0]}<br>Value: ${d.data[1]}`)
                  .style('left', (event.pageX + 5) + 'px')
                  .style('top', (event.pageY - 28) + 'px');
          })
          .on('mouseout', function() {
              tooltip.transition()
                  .duration(500)
                  .style('opacity', 0);
          });


        // Add labels
        const legend = svg2.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => `translate(${w2 / 2 + 50}, ${-h2 / 2 + i * (legendRectSize + legendSpacing)})`)
        .on('click', function(event, d) {
            const isSelected = d3.select(this).classed('selected');
            arcs.each(function(arcData) {
                if (arcData.data[0] === d) {
                    d3.select(this)
                        .attr('fill', isSelected ? color(arcData.data[0]) : 'gray');
                }
            });
            d3.select(this).classed('selected', !isSelected);
        });


        legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .attr('fill', color)
        .attr('stroke', color);

       legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(d => d);




        //chart4



// Compute average rating for each category
const groupedData_Category_AverageRating = newData.reduce((acc, obj) => {
  const { Category, Rating } = obj;
  if (!acc[Category]) {
    acc[Category] = { Category: 0, Rating: 0, count: 0 };
  }
  acc[Category].Rating += Rating;
  acc[Category].count++;

  return acc;
}, {});

const avgArray = [];
// Calculate average rating for each category
for (const [Category] of Object.entries(groupedData_Category_AverageRating)) {
  const averageRating = groupedData_Category_AverageRating[Category].Rating / groupedData_Category_AverageRating[Category].count;
  avgArray.push({Category, AverageRating: averageRating});
}

// Convert the avgArray into an array of key-value pairs
const averageRatingArray = Object.entries(avgArray);

// // Sort the array by average rating in descending order
// averageRatingArray.sort((a, b) => b[1].AverageRating - a[1].AverageRating);


// // Take top 10 entries
// const top10Entries4 = averageRatingArray.slice(0, 10);

// Define SVG dimensions and margins
const margin4 = { top: 50, right: 10, bottom: 60, left: 150 };
const w4 = 600 - margin4.left - margin4.right;
const h4 = 800 - margin4.top - margin4.bottom;

// Create SVG element
const svg4 = d3.select("#chart4")
  .append("svg")
  .attr("width", w4 + margin4.left + margin4.right)
  .attr("height", h4 + margin4.top + margin4.bottom)
  .attr("class", "bar")
  .append("g")
  .attr("transform", "translate(" + margin4.left + "," + margin4.top + ")");

// Define scales
const yScale4 = d3.scaleBand()
  .domain(averageRatingArray.map(d => d[1].Category))
  .range([h4, 0])
  .padding(0.1);

const xScale4 = d3.scaleLinear()
  .domain([3.9, 4.5])
  .range([0, w4]);

// // Define axes
// const yAxis4 = d3.axisLeft().scale(yScale4);
// const xAxis4 = d3.axisBottom().scale(xScale4);

// Define axes
svg4.append("g")
.attr("transform", "translate(0," + h4 + ")")
.call(d3.axisBottom(xScale4).ticks(5).tickFormat(d3.format(".3s")))
.append("text")
.attr("x", w4 / 2)
.attr("y", 20)
.attr("dy", "0.71em")
.attr("fill", "#000")
.style("font-size", "12px")
.text("Average Rating");

svg4.append("g")
    .call(d3.axisLeft(yScale4));

// Add chart title
svg4.append("text")
.attr("x", (w4 / 2))
.attr("y", 0 - (margin4.top / 2))
.attr("text-anchor", "middle")
.style("font-size", "20px")
.style("font-weight", "bold")
.style("fill","black")
.text("Average Rating of each Category");

// Create bars
svg4.selectAll("rect")
  .data(averageRatingArray)
  .enter()
  .append("rect")
  .attr("x", 0)
  .attr("y", (d, i) => yScale4(d[1].Category))
  .attr("width", d => xScale4(d[1].AverageRating) - 30)
  .attr("height", yScale4.bandwidth())
  .attr("class", "bar")
  .attr("fill", function(d, i) {
    return "rgb(0, 0, " + Math.round(255 / averageRatingArray.length) * i + ")";
  })
  .on("mouseover", function(event, d) {
    tooltip.transition()
      .duration(200)
      .style("opacity", .9);
    tooltip.html("Category: " + d[1].Category + "<br/>Average Rating: " + d[1].AverageRating.toFixed(2))
      .style("left", (event.pageX) + "px")
      .style("top", (event.pageY - 28) + "px")
  })
  .on("mouseout", function(d) {
    tooltip.transition()
      .duration(500)
      .style("opacity", 0);
  });







//chart 5




const groupedData_Rating_Installs = newData.reduce((acc, obj) => {
  const { Rating, Installs } = obj;
  if (!acc[Rating]) {
    acc[Rating] = { Rating, Installs: 0 };
  }
  acc[Rating].Installs += Installs;

  return acc;
}, {});

console.log(groupedData_Rating_Installs);

// Convert the object into an array of key-value pairs and sort it by Rating
let ratingInstalls = Object.entries(groupedData_Rating_Installs)
  .map(([rating, data]) => [parseFloat(rating), data.Installs])
  .sort((a, b) => a[0] - b[0]);

const margin5 = { top: 50, right: 150, bottom: 60, left: 100 };
const w5 = 800 - margin5.left - margin5.right;
const h5 = 800 - margin5.top - margin5.bottom;

const svg5 = d3.select("#chart5")
  .append("svg")
  .attr("width", w5 + margin5.left + margin5.right)
  .attr("height", h5 + margin5.top + margin5.bottom)
  .append("g")
  .attr("transform", "translate(" + margin5.left + "," + margin5.top + ")");

const xScale5 = d3.scaleLinear()
  .domain([1, 5])
  .range([0, w5]);
svg5.append("g")
  .attr("transform", "translate(0," + h5 + ")")
  .call(d3.axisBottom(xScale5));

const yScale5 = d3.scaleLinear()
  .domain([0, d3.max(ratingInstalls, d => d[1])])
  .range([h5, 0]);
svg5.append("g")
  .call(d3.axisLeft(yScale5));

// This allows to find the closest X index of the mouse:
const bisect = d3.bisector(function(d) { return d[0]; }).left;

// Create the circle that travels along the curve of chart
const focus = svg5
  .append('g')
  .append('circle')
  .style("fill", "none")
  .attr("stroke", "black")
  .attr('r', 8.5)
  .style("opacity", 0);

// Create the text that travels along the curve of chart
const focusText = svg5
  .append('g')
  .append('text')
  .style("opacity", 0)
  .attr("text-anchor", "left")
  .attr("alignment-baseline", "middle");

// Add the line
svg5
  .append("path")
  .datum(ratingInstalls)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 1.5)
  .attr("d", d3.line()
    .x(function(d) { return xScale5(d[0]); })
    .y(function(d) { return yScale5(d[1]); })
  );

// Create a rect on top of the svg area: this rectangle recovers mouse position
svg5
  .append('rect')
  .style("fill", "none")
  .style("pointer-events", "all")
  .attr('width', w5)
  .attr('height', h5)
  .on('mouseover', mouseover)
  .on('mousemove', mousemove)
  .on('mouseout', mouseout);

function mouseover() {
  focus.style("opacity", 1);
  focusText.style("opacity", 1);
}

function mousemove(event) {
  // recover coordinate we need
  const x0 = xScale5.invert(d3.pointer(event)[0]);
  const i = bisect(ratingInstalls, x0, 1);
  const selectedData = ratingInstalls[i];
  focus
    .attr("cx", xScale5(selectedData[0]))
    .attr("cy", yScale5(selectedData[1]));
  focusText
    .html(null)
    .attr("x", xScale5(selectedData[0]) + 15)
    .attr("y", yScale5(selectedData[1]))
    .append('tspan')
      .attr('x', xScale5(selectedData[0]) + 15)
      .attr('dy', '1.2em')
      .text("Rating: " + selectedData[0])
    .append('tspan')
      .attr('x', xScale5(selectedData[0]) + 15)
      .attr('dy', '1.2em')
      .text("Installs: " + selectedData[1]);
}

function mouseout() {
  focus.style("opacity", 0);
  focusText.style("opacity", 0);
}






    };
    reader.readAsText(file);
  }
