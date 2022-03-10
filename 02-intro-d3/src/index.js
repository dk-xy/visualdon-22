import * as d3 from 'd3';

// C'est ici que vous allez écrire les premières lignes en d3!

d3.select("cOne").attr("fill","red");
console.log("hello")


//creation canvas---------------------------
let svg = d3.select("body").append("g")
    .append("svg")
    .attr("width", "1000")
    .attr("height", "1000")
    .style("background-color", "trasparent");



const gpOne = svg.append("g").append("svg")
const gpTwo = svg.append("g").append("svg")
const gpThree = svg.append("g").append("svg")

const c1 = gpOne.append("circle")
        .attr("cx","50").attr("cy","50").attr("r","40")
        .attr("fill", "red").attr("fill-opacity","1");

const c2 = gpTwo.append("circle")
        .attr("cx","150").attr("cy","150").attr("r","40")
        .attr("fill", "red").attr("fill-opacity","1")

const c3 = gpThree.append("circle")
        .attr("cx","250").attr("cy","250").attr("r","40")
        .attr("fill", "red").attr("fill-opacity","1")




//Changer couleur, déplacer les cercles
c2.attr("fill", "orange");



gpOne.append("text")
    .text("Hello")
    .attr("x","50")
    .attr("y","100")
    .style("text-align","center");

gpTwo.append("text")
    .text("to the")
    .attr("x", "150")
    .attr("y","180");

gpThree.append("text")
    .text("World !!")
    .attr("x", "250")
    .attr("y","280");

c3.on("click", ()=>{
    d3.selectAll("circle").attr("cx", "50")
})

const data = [20, 5, 25, 8, 15]


const myDiv = d3.select(".my-div")
        .append("svg")
        .attr("width", 1200)
        .attr("height", 100)
        .style('background-color', 'transparent')

const divRect = myDiv.append("svg")
        

divRect.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
                .attr("x", (d,i) => i * 30)
                .attr("y", (d) => divRect.attr("height") - d+50)
                .attr("width", 20)
                .attr("height", d => d)
                .attr('fill', 'lightblue')

//deplacement
// cercle1.attr("cx", "100");
// cercle2.attr("cx", "200");
//d3.select(".cTwo").attr("fill","red")
//let groupeCercle = d3.selectAll(".cOne, .cTwo");
//groupeCercle.attr("transform", "translate(50,0)")
