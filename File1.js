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
  Installs: Number(obj.Installs.replace(/,/g, '')),
  Price: Number(obj.Price.replace('$', '')),
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


      function SumOfthefirstValue(array){
        return array
        .map(subArray => subArray[1])
        .reduce((acc,value) => acc + value, 0)

      }
      function SumOfthesecondValue(array){
        return array
        .map(subArray => subArray[2])
        .reduce((acc,value) => acc + value, 0)

      }

      const AllInstall = SumOfthefirstValue(array_groupedData_Category_Installs)    
      console.log(AllInstall)
       
      const AllAvgPrice = SumOfthesecondValue(array_groupedData_Category_Installs)/ array_groupedData_Category_Installs.length;



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
      .attr("height", h + margin.top + margin.bottom)
      .attr("class", "bar")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
      //Title
      svg.append("text")
      .attr("x", (w / 2))
      .attr("y", 0 - (margin.top / 3))
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("font-weight", "bold")
      .style("fill","black")
      .text("Sum of Installs and Average of Price by Category");


      document.getElementById("block1").innerHTML = `Summ of the Install: ${AllInstall}`;
      document.getElementById("block2").innerHTML = `Average of the Price: ${AllAvgPrice}`;





        // chart2


       const margin1 = { top: 150, right: 50, bottom: 60, left: 160 };
       const w1 = 600 - margin1.left - margin1.right;
       const h1 = 634 - margin1.top - margin1.bottom;


       var svg1 = d3.select("#chart2")
       .append("svg")
       .attr("width", w1 + margin1.left + margin1.right)
       .attr("height", h1 + margin1.top + margin1.bottom)
       .attr("class", "bar")
       .append("g")
       .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");

      
      
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
          tooltip.html("Application: " + "<br/>Installs: " + d[1])
              .style("left", (event.pageX) + "px")
              .style("top", (event.pageY - 28) + "px")
        })
        .on("mouseout", function(d) {
          tooltip.transition()
              .duration(500)
              .style("opacity", 0);
        });
        //title
        svg1.append("text")
        .attr("x", (w1 / 2))
        .attr("y", 0 - (margin1.top / 9))
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .style("fill","black")
        .text("Top 10 most installed app");


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
            .attr("height", h2 + margin2 * 2) // Increase the height to accommodate the title
            .append("g")
            .attr("transform", `translate(${w2 / 2}, ${(h2 / 2) + margin2})`); // Move the chart down to make space for the title
        
        // Add the title
        svg2.append("text")
            .attr("x", 0) // Center the title horizontally
            .attr("y", -h2 / 2 - margin2 / 9) // Position the title above the chart
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .text("Content Rating Distribution");
        
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
        
        // Append the arcs to the SVG
        const arcs = svg2.selectAll('path')
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
                tooltip.html(`Content rating: ${d.data[0]}<br>Number of applications: ${d.data[1]}`)
                    .style('left', (event.pageX + 5) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
        
                // Highlight selected arc and make others gray
                arcs.attr('fill', arcData => (arcData.data[0] === d.data[0]) ? color(arcData.data[0]) : 'gray');
            })
            .on('mouseout', function() {
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
        
                // Restore original colors on mouseout
                arcs.attr('fill', arcData => color(arcData.data[0]));
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
        
                // Toggle selected state of legend item
                svg2.selectAll('.legend').classed('selected', false);
                d3.select(this).classed('selected', !isSelected);
        
                // Grey out all slices except the selected one
                arcs.attr('fill', arcData => (arcData.data[0] === d) ? color(d) : 'gray');
        
                // Update tooltip with number of applications for the selected content rating
                const selectedData = data.find(item => item[0] === d);
                tooltip.transition()
                    .duration(200)
                    .style('opacity', .9);
                tooltip.html(`Content rating: ${d}<br>Number of applications: ${selectedData[1]}`)
                    .style('left', (event.pageX + 5) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
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
const margin4 = { top: 150, right: 10, bottom: 60, left: 150 };
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
.attr("y", 0 - (margin4.top / 9))
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
  
// currentData = averageRatingArray.slice(0,n);
// // Select All button
// d3.selectAll("button")
//   .on("click", function() {
//     let id = d3.select(this).attr("id");
//     if (id == "add") {
//         if (currentData.length < averageRatingArray.length) {
//                 currentData.push(Data[currentData.length]);
//               }
//     } else if (id == "remove"){
//       if (
//         currentData.length != 0
//         ) {
//           currentData.pop();
//         }
//         else {
//           currentData = Data.slice(0, 20);
//         }
//         xScale4.domain([0, d3.max(currentData, function(d){
//           return d[1].AverageRating;
//         }),
//         ]);
//         yScale4.domain(currentData.map(function (d) {return d[1].Category}));


//         let bars =svg4.selectAll("rect").data(currentData);
//         bars.enter()
//         .append("rect")
//         .attr("x", 0)
//         .attr("y", (d, i) => yScale4(d[1].Category))
//         .attr("width", d => xScale4(d[1].AverageRating) - 30)
//         .attr("height", yScale4.bandwidth())
//         .attr("fill", function (d){
//           return "rgb(0, " + d[1].AverageRating + ",0)";
//         })
//         .merge(bars)
//         .transition()
//         .delay(200) //1,000 ms or 1 second // tgian bat dau transition
//         .duration(200) // tIME duration FOR CHANGE TO
//         .ease(d3.easeLinear)
//         .attr("x", 0)
//         .attr("y", function (d) {
//           return yScale(d[1].Category);})
//         .attr("width", function (d) {return xScale(d[1].AverageRating);})
//         .attr("height", yScale.bandwidth());
        
//         bars.exit().transition().duration(500).attr("y", h4).remove();

//         let label1 = svg.selectAll(".attr1").data(currentData);
//         // before merge() is starting point
//         label1
//           .enter()
//           .append("text")
//           .text(function (d) {
//             return d[1].Category;
//           })
//     }
//   });





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

const margin5 = { top: 150, right: 150, bottom: 60, left: 100 };
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
  .attr('r', 6)
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
  .attr("stroke-width", 2)
  .attr("d", d3.line()
    .x(function(d) { return xScale5(d[0]); })
    .y(function(d) { return yScale5(d[1]); })
  );
  //Title
  svg5.append("text")
  .attr("x", (w5 / 2))
  .attr("y", 0 - (margin5.top / 9))
  .attr("text-anchor", "middle")
  .style("font-size", "20px")
  .style("font-weight", "bold")
  .style("fill","black")
  .text("Sum of install by rating");

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





//chart6




const groupedData = newData.reduce((acc, obj) => {
  const { Category, App, Rating, Installs, Price } = obj;
  if (!acc[Category]) {
    acc[Category] = [];
  }
  acc[Category].push({ Category, App, Rating, Installs, Price });
  return acc;
}, {});

const Chart6_Array = Object.values(groupedData).flat();



const margin6 = { top: 50, right: 300, bottom: 60, left: 130 };
const w6 = 1000 - margin6.left - margin6.right;
const h6 = 800 - margin6.top - margin6.bottom;

const svg6 = d3.select("#chart6")
  .append("svg")
  .attr("width", w6 + margin6.left + margin6.right)
  .attr("height", h6 + margin6.top + margin6.bottom)
  .append("g")
  .attr("transform", `translate(${margin6.left},${margin6.top})`);

  // Add X axis
  const xScale6 = d3.scaleLinear()
  .domain([0, d3.max(Chart6_Array, d => d.Price)])
  .range([0, w6]);
  svg6.append("g")
  .attr("transform", `translate(0, ${h6})`)
  .call(d3.axisBottom(xScale6).ticks(3));
    // Add X axis label:
  svg6.append("text")
  .attr("text-anchor", "end")
  .attr("x", w6)
  .attr("y", h6+50)
  .text("Price");
  // Add Y axis
const yScale6 = d3.scaleLinear()
  .domain([1, d3.max(Chart6_Array, d => d.Rating)])
  .range([h6, 0]);
  svg6.append("g")
  .call(d3.axisLeft(yScale6));
    // Add Y axis label:
    svg6.append("text")
    .attr("text-anchor", "end")
    .attr("x", 0)
    .attr("y", -20 )
    .text("Rating")
    .attr("text-anchor", "start");

const z = d3.scaleSqrt()
  .domain([0, d3.max(Chart6_Array, d => d.Installs)])
  .range([2, 30]);

// Combining different d3 color schemes to create a larger palette
const customColorPalette = [
  "#fbb4ae", "#f3381f", "#f765eb", "#7165f7", "#e2f31c", "#1ce2f3", "#f31c76",
  "#f32e1c", "#2e1cf3", "#b9700a", "#120301", "#895406", "#068954", "#5a5a00", "#a65628",
  "#f781bf", "#8c8c8c", "#66c2a5", "#fb5617", "#5874b3", "#da4ba2", "#317105", "#935fd0",
  "#5a268e", "#523416", "#87deb3", "#e2f625", "#6ef9c1", "#1010f0", "#f625e2", "#f0d347",
  "#1234d9", "#ec5e19", "#19a7ec", "#711109", "#25f225", "#5d5a57"
];

const myColor = d3.scaleOrdinal()
  .domain(Chart6_Array.map(d => d.Category))
  .range(customColorPalette);


  // -1- Create a tooltip div that is hidden by default:
  const tooltip6 = d3.select("#chart6")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "black")
  .style("border-radius", "5px")
  .style("padding", "10px")
  .style("color", "white");




  // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
  const showTooltip = function(event, d) {
    tooltip6.transition().duration(200);
    tooltip6.style("opacity", 1)
      .html(`App: ${d.App}<br>Category: ${d.Category}<br>Installs: ${d.Installs}<br>Price: ${d.Price}<br>Rating: ${d.Rating}`)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 10) + "px");

  };

  const moveTooltip = function(event, d) {
    tooltip6.style("left", (event.pageX + 10) + "px")
    .style("top", (event.pageY - 10) + "px");    
  };

  const hideTooltip = function(event, d) {
    tooltip6.transition().duration(200).style("opacity", 0);
  };

  // What to do when one group is hovered
  const highlight = function(event, d){
    // reduce opacity of all groups
    d3.selectAll(".bubbles").style("opacity", 0.009);
    // expect the one that is hovered
    d3.selectAll("."+d).style("opacity", 1);
  }
  // And when it is not hovered anymore
  const noHighlight = function(event, d){
    d3.selectAll(".bubbles").style("opacity", 1);
  }



  // Add dots
svg6.append('g')
  .selectAll("dot")
  .data(Chart6_Array)
  .join("circle")
    .attr("class", function(d) { return "bubbles " + d.Category; })
    .attr("cx", d => xScale6(d.Price))
    .attr("cy", d => yScale6(d.Rating))
    .attr("r", d => z(d.Installs))
    .style("fill", d => myColor(d.Category))
    .on("mouseover", showTooltip)
    .on("mousemove", moveTooltip)
    .on("mouseleave", hideTooltip);

    // Add legend: circles
const valuesToShow = [1000,100000000, 500000000, 1000000000];
const xCircle = 650;
const xLabel = 540;

svg6.selectAll(".legendCircles")
  .data(valuesToShow)
  .enter()
  .append("circle")
    .attr("class", "legendCircles")
    .attr("cx", xCircle)
    .attr("cy", d => h6 - 100 - z(d))
    .attr("r", d => z(d))
    .style("fill", "none")
    .attr("stroke", "black");

// Add legend: segments
svg6.selectAll(".legendSegments")
  .data(valuesToShow)
  .enter()
  .append("line")
    .attr("class", "legendSegments")
    .attr('x1', d => xCircle + (z(d) / 2) - 3)
    .attr('x2', xLabel + 200)
    .attr('y1', d => h6 - 100 - z(d) * 2)
    .attr('y2', d => h6 - 100 - z(d) * 2)
    .attr('stroke', 'black')
    .style('stroke-dasharray', '3,3');

// Add legend: labels
svg6.selectAll(".legendLabels")
  .data(valuesToShow)
  .enter()
  .append("text")
    .attr("class", "legendLabels")
    .attr('x', xLabel + 201)
    .attr('y', d => h6 - 100 - z(d) * 2)
    .text(d => d / 1) // Ensure text is displayed as numbers
    .style("font-size", 15)
    .attr('alignment-baseline', 'middle');

// Legend title
svg6.append("text")
  .attr('x', xCircle)
  .attr("y", h6 - 100 + 30)
  .text("Installs")
  .attr("text-anchor", "middle");



const size = 10;
const allgroups = Array.from(new Set(Chart6_Array.map(d => d.Category)));

// Update the circles based on checkbox change
function updateCircles() {
  const activeCategories = allgroups.filter(category => d3.select("#checkbox-" + category).property("checked"));

  // Hide circles not in activeCategories
  svg6.selectAll("circle.bubbles")
    .style("display", d => (activeCategories.includes(d.Category) ? null : "none"));

  // Hide legend elements if corresponding circles are hidden
  svg6.selectAll(".legendCircles")
    .style("display", d => {
      const installs = d3.select(this).datum();
      return (activeCategories.some(cat => z(installs) === z(cat))) ? null : "none";
    });
  
  svg6.selectAll(".legendSegments")
    .style("display", d => {
      const installs = d3.select(this).datum();
      return (activeCategories.some(cat => z(installs) === z(cat))) ? null : "none";
    });
  
  svg6.selectAll(".legendLabels")
    .style("display", d => {
      const installs = d3.select(this).datum();
      return (activeCategories.some(cat => z(installs) === z(cat))) ? null : "none";
    });
}

// Create checkboxes for each category
const legendContainer = d3.select("#legend")
  .selectAll("div")
  .data(allgroups)
  .enter()
  .append("div")
    .style("display", "flex")
    .style("align-items", "center");

legendContainer.append("input")
  .attr("type", "checkbox")
  .attr("id", d => "checkbox-" + d)
  .attr("checked", true)
  .on("change", function(event, d) {
    updateCircles(); // Call updateCircles on checkbox change
  });

legendContainer.append("label")
  .attr("for", d => "checkbox-" + d)
  .text(d => d)
  .style("margin-left", "8px")
  .style("color", d => myColor(d));

// Select All button
d3.select("#legend")
  .append("div")
  .attr("class", "legend-control")
  .append("button")
  .text("Select All")
  .on("click", function() {
    legendContainer.selectAll("input[type=checkbox]")
      .property("checked", true);
    updateCircles(); // Call updateCircles after selecting all
  });

// Clear All button
d3.select("#legend")
  .append("div")
  .attr("class", "legend-control")
  .append("button")
  .text("Clear All")
  .on("click", function() {
    legendContainer.selectAll("input[type=checkbox]")
      .property("checked", false);
    updateCircles(); // Call updateCircles after clearing all
  });

// Call updateCircles initially
updateCircles();



svg6.selectAll("myrect")
  .data(allgroups)
  .join("circle")
    .attr("cx", 655)
    .attr("cy", (d, i) => 4 + i * (size + 5))
    .attr("r", 6)
    .style("fill", d => myColor(d))
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight);

// Add labels beside legend dots
svg6.selectAll("mylabels")
  .data(allgroups)
  .enter()
  .append("text")
    .attr("x", 655 + size * .8)
    .attr("y", (d, i) => i * (size + 5) + (size / 2))
    .style("fill", d => myColor(d))
    .text(d => d)
    .attr("text-anchor", "left")
    .style("font-size", 13)
    .style("alignment-baseline", "middle")
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight);





    };
    reader.readAsText(file);
  }
