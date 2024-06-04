 
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


        // Top10chart


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
          tooltip.html("Category: " + d[0] + "<br/>Installs: " + d[1])
              .style("left", (event.pageX) + "px")
              .style("top", (event.pageY - 28) + "px")
        })
        .on("mouseout", function(d) {
          tooltip.transition()
              .duration(500)
              .style("opacity", 0);
        });




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
       

       
      


    };



    reader.readAsText(file);
  }
