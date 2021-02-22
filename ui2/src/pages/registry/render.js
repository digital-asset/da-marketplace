import * as d3 from "d3";

export const render = (el, data) => {

  const width = el.offsetWidth;
  const height = 400;

  const tree = d3.tree().size([width - 20, height - 20]);
  const renderLink = d3.linkVertical().x(d => d.x).y(d => d.y);

  const root = d3.hierarchy(data);
  const nodes = root.descendants();
  const links = root.links();

  tree(root);

  const svg = d3.select(el).append("svg")
    .attr("width", width)
    .attr("height", height)
  .attr("viewBox", [0, -10, width, height]);

  const link = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 0.5)
    .selectAll(".link")
    .data(links)
    .enter()
      .append("g");
  link.insert("path", ".node")
    .attr("class", "link")
    .attr("d", renderLink);
  link.append("rect")
    .attr("x", d => 0.5 * (d.source.x + d.target.x) - 30)
    .attr("y", d => 0.5 * (d.source.y + d.target.y) - 6)
    .attr("width", 60)
    .attr("height", 12)
    .attr("rx", 2)
    .attr("ry", 2)
    .attr("stroke-width", 0)
    .attr("fill", "#f2f2f2");
  link.append("text")
    .text(d => d.target.data.linkText)
    .attr("x", d => 0.5 * (d.source.x + d.target.x))
    .attr("y", d => 0.5 * (d.source.y + d.target.y))
    .attr("stroke-width", 0)
    .attr("fill", "black")
    .attr("dominant-baseline", "central")
    .style("text-anchor", "middle")
    .style("font-size", "10px")

  const node = svg.append("g")
    .selectAll(".node")
    .data(nodes).enter()
      .append("g")
      .attr("transform", d => `translate(${d.x},${d.y})`);

  node.append("rect")
    .attr("x", -50)
    .attr("y", -10)
    .attr("width", 100)
    .attr("height", 20)
    .attr("rx", 6)
    .attr("ry", 6)
    .attr("stroke", "black")
    .attr("stroke-width", 0.5)
    .attr("fill", d => d.data.type === "Claim" ? "#a4c2f4" : "#b6d7a8");

  node.append("text")
    .text(d => d.data.text || d.data.tag)
    .attr("dominant-baseline", "central")
    .style("text-anchor", "middle");

  const legend = svg.append("g")
    .attr("transform", d => `translate(${width - 60},7)`);
  legend.append("rect")
    .attr("x", -55)
    .attr("y", -15)
    .attr("width", 110)
    .attr("height", 70)
    .attr("rx", 2)
    .attr("ry", 2)
    .attr("stroke", "black")
    .attr("stroke-width", 0.5)
    .attr("fill", "transparent");
  legend.append("text")
    .text("Legend:")
    .style("text-anchor", "middle");
  legend.append("rect")
    .attr("x", -50)
    .attr("y", 10)
    .attr("width", 100)
    .attr("height", 20)
    .attr("rx", 2)
    .attr("ry", 2)
    .attr("fill", "#a4c2f4");
  legend.append("text")
    .text("Claim")
    .attr("y", 20)
    .attr("dominant-baseline", "central")
    .style("text-anchor", "middle");
  legend.append("rect")
    .attr("x", -50)
    .attr("y", 30)
    .attr("width", 100)
    .attr("height", 20)
    .attr("rx", 2)
    .attr("ry", 2)
    .attr("fill", "#b6d7a8");
  legend.append("text")
    .text("Observation")
    .attr("y", 40)
    .attr("dominant-baseline", "central")
    .style("text-anchor", "middle");
}
