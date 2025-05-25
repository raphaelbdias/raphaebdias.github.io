// Define your steps data
const stepsData = [
    { number: 1, title: "Candidate Screening", description: "Conduct phone/video interviews to assess qualifications and cultural fit." },
    { number: 2, title: "Interview Process", description: "Coordinate comprehensive interviews, prepare candidates, and negotiate terms." },
    { number: 3, title: "Long List Development", description: "Leverage networks to compile a robust list of potential candidates." },
    { number: 4, title: "Offer & Onboarding", description: "Support clients in extending offers, negotiating compensation, and onboarding seamlessly." },
    { number: 5, title: "Target Candidate Profile", description: "Develop detailed profiles outlining must-have qualifications and skills." },
    { number: 6, title: "Shortlisting", description: "Select top candidates who best match the target profile to advance." }
  ];
  
  // Basic dimensions for the SVG
  const margin = { top: 50, right: 80, bottom: 50, left: 80 };
  const width = 600;   // Total width of the SVG
  const height = 800;  // Total height of the SVG
  
  // Create the SVG inside #timeline
  const svg = d3.select("#timeline")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  
  // Main drawing area
  const drawWidth = width - margin.left - margin.right;
  const drawHeight = height - margin.top - margin.bottom;
  const g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  // Spacing for each step
  const stepSpacing = drawHeight / (stepsData.length - 1);
  
  // A small offset for the curves so they're gentle
  const curveOffset = 50;
  
  // Draw a vertical reference line
  g.append("line")
    .attr("x1", drawWidth / 2)
    .attr("y1", 0)
    .attr("x2", drawWidth / 2)
    .attr("y2", drawHeight)
    .attr("stroke", "#ccc")
    .attr("stroke-width", 2);
  
  // Create a tooltip element
  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "#fff")
    .style("border", "1px solid #ccc")
    .style("border-radius", "4px")
    .style("padding", "8px")
    .style("box-shadow", "0 2px 4px rgba(0,0,0,0.2)")
    .style("pointer-events", "none")
    .style("opacity", 0);
  
  // Create groups for each step
  const stepGroups = g.selectAll(".step")
    .data(stepsData)
    .enter()
    .append("g")
    .attr("class", "step")
    .attr("transform", (d, i) => `translate(${drawWidth / 2}, ${i * stepSpacing})`);
  
  // Circles
  stepGroups.append("circle")
    .attr("r", 15)
    .attr("fill", "#5680e9");
  
  // Step number inside the circle
  stepGroups.append("text")
    .attr("fill", "#fff")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .text(d => d.number);
  
  // Step title (alternating left/right)
  stepGroups.append("text")
    .attr("class", "step-title")
    .attr("x", (d, i) => i % 2 === 0 ? -30 : 30)
    .attr("text-anchor", (d, i) => i % 2 === 0 ? "end" : "start")
    .attr("dy", "-1em")
    .attr("fill", "#5680e9")
    .text(d => d.title);
  
  
  // Add hover events to the entire step group
  stepGroups.on("mouseover", function(event, d) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html(`<strong>${d.title}</strong><br>${d.description}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mousemove", function(event) {
      tooltip.style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function() {
      tooltip.transition().duration(200).style("opacity", 0);
    });
  
  // Curved connectors between steps
  for (let i = 0; i < stepsData.length - 1; i++) {
    const x0 = drawWidth / 2;
    const y0 = i * stepSpacing + 15;   // 15 is the circle radius
    const x1 = drawWidth / 2;
    const y1 = (i + 1) * stepSpacing - 15;
  
    // Control points for a gentle curve
    const cp1x = x0 + (i % 2 === 0 ? -curveOffset : curveOffset);
    const cp1y = y0 + stepSpacing / 2;
    const cp2x = x1 + (i % 2 === 0 ? -curveOffset : curveOffset);
    const cp2y = y0 + stepSpacing / 2;
  
    g.append("path")
      .attr("fill", "none")
      .attr("stroke", "#5680e9")
      .attr("stroke-width", 2)
      .attr("d", `M ${x0} ${y0} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x1} ${y1}`);
  }