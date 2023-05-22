const { JSDOM } = require("jsdom");
const d3 = require("d3");
const sharp = require("sharp");

async function createImage(data) {
	const dom = new JSDOM(`<!DOCTYPE html><body></body>`);
	const body = d3.select(dom.window.document.querySelector("body"));

	// Set the dimensions and margins of the graph
	const margin = { top: 10, right: 30, bottom: 40, left: 100 },
		width = 460 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	// Append the svg object to the body of the page
	const svg = body
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.attr("xmlns", "http://www.w3.org/2000/svg")
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Add X axis
	const x = d3.scaleLinear().domain([0, 100]).range([0, width]);
	svg
		.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x))
		.selectAll("text")
		.attr("transform", "translate(-10,0)rotate(-45)")
		.style("text-anchor", "end");

	// Y axis
	const y = d3
		.scaleBand()
		.range([0, height])
		.domain(
			data.map(function (d) {
				return d.deck;
			})
		)
		.padding(1);
	svg.append("g").call(d3.axisLeft(y));

	// Lines
	svg
		.selectAll("myline")
		.data(data)
		.enter()
		.append("line")
		.attr("x1", function (d) {
			return x(d.accuracy);
		})
		.attr("x2", x(0))
		.attr("y1", function (d) {
			return y(d.deck);
		})
		.attr("y2", function (d) {
			return y(d.deck);
		})
		.attr("stroke", "grey");

	// Circles
	svg
		.selectAll("mycircle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", function (d) {
			return x(d.accuracy);
		})
		.attr("cy", function (d) {
			return y(d.deck);
		})
		.attr("r", "4")
		.style("fill", "#69b3a2")
		.attr("stroke", "black");

	const buffer = await sharp(Buffer.from(body.html())).png().toBuffer();
	return buffer;
}

exports.createImage = createImage;
