import * as d3 from 'd3';
import incomeData from "/data/income_per_person_gdppercapita_ppp_inflation_adjusted.csv";
import lifeData from "/data/life_expectancy_years.csv";
// Pour importer les données
// import file from '../data/data.csv'

//Transformation des données afin qu'elles soient exploitables
import populationData from '../data/population_total.csv'
// Récupère toutes les années
const annees = Object.keys(populationData[0])
//console.log(annees)

let converterSI = (array, variable, variableName) => {

    let convertedVariable = array.map(d => {
        // Trouver le format SI (M, B, k)
        let SI = typeof d[variable.toString()] === 'string' || d[variable.toString()] instanceof String ? d[variable.toString()].slice(-1) : d[variable.toString()];
        // Extraire la partie numérique
        let number = typeof d[variable.toString()] === 'string' || d[variable.toString()] instanceof String ? parseFloat(d[variable.toString()].slice(0, -1)) : d[variable.toString()];
        // Selon la valeur SI, multiplier par la puissance
        switch (SI) {
            case 'M': {
                return {"country": d.country, [variableName] : Math.pow(10, 6) * number};
                break;
            }
            case 'B': {
                return {"country": d.country, [variableName] : Math.pow(10, 9) * number};
                break;
            }
            case 'k': {
                return {"country": d.country, [variableName]: Math.pow(10, 3) * number};
                break;
            }
            default: {
                return {"country": d.country, [variableName] : number};
                break;
            }
        }
    })
    return convertedVariable;
};


let pop = [],
    income = [],
    life = [],
dataCombined = [];

// Merge data
const mergeByCountry = (a1, a2, a3) => {
    let data = [];
    a1.map(itm => {
        let newObject = {
        ...a2.find((item) => (item.country === itm.country) && item),
        ...a3.find((item) => (item.country === itm.country) && item),
        ...itm
    }
    data.push(newObject);
    })
    return data;
}

annees.forEach(annee => {
    pop.push({"annee":annee, "data" : converterSI(populationData, annee, "pop")})
    income.push({"annee":annee, "data" : converterSI(incomeData, annee, "income")})
    life.push({"annee":annee, "data" : converterSI(lifeData, annee, "life")})
    const popAnnee = pop.filter(d => d.annee == annee).map(d => d.data)[0];
    const incomeAnnee = income.filter(d => d.annee == annee).map(d => d.data)[0];
    const lifeAnnee = life.filter(d => d.annee == annee).map(d => d.data)[0];
    dataCombined.push({"annee": annee, "data": mergeByCountry(popAnnee, incomeAnnee, lifeAnnee)})
});


//console.log(dataCombined[221])//2021

let incomeTab = dataCombined[221].data.map(d=> d.income);
let maxIncome = d3.max(incomeTab);

let lifeExpMax = dataCombined[221].data.map(d=> d.life);
let maxLife = d3.max(lifeExpMax)


let popArray = dataCombined[221].data.map(d=>d.pop);
let maxPop = d3.max(popArray)

let index = 0;




//CREATION DU GRAPHIQUE--------------------------------
// set the dimensions and margins of the graph
var margin = { top: 10, right: 20, bottom: 30, left: 50 },
  width = 1000 - margin.left - margin.right,
  height = 420 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");


//CREATION DES AXES------------------------------------
// Add X axis
var x = d3.scalePow()
  .domain([0, maxIncome])
  .range([0, width]);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

// Add Y axis
var y = d3.scaleLinear()
  .domain([40, maxLife])
  .range([height, 0]);
svg.append("g")
  .call(d3.axisLeft(y));

// Add a scale for bubble size
var z = d3.scaleSqrt()
  .domain([0, maxPop])
  .range([0, 30]);

  svg.append('g')
    .selectAll("dot")
    .data(dataCombined[221].data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.income); } )
      .attr("cy", function (d) { return y(d.life); } )
      .attr("r", function (d) { return z(d.pop); } )
      .style("fill", "#69b3a2")
      .style("opacity", "0.7")
      .attr("stroke", "black")


//CREATION DE LA CARTE-----------------------------------------------------
var svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

  //map & projection
  //geo path & selection du type de projection
  let path = d3.geoPath();
  let projection = d3.geoMercator()
    .scale(70)
    .center([0,20])
    .translate([width / 2, height / 2]);
    
    const data = new Map();

    
let colorScale = d3.scaleThreshold()
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 50000000, 100000000])
  .range(d3.schemeBlues[8]);

// Load external data and boot
Promise.all([
  d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson", function(d) {
  })]).then(function(loadData){
      let topo = loadData[0]
    
      let mouseOver = function(d) {
        d3.selectAll(".Country")
          .transition()
          .duration(200)
          .style("opacity", .5)
        d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", 1)
          .style("stroke", "black")
      }
    
      let mouseLeave = function(d) {
        d3.selectAll(".Country")
          .transition()
          .duration(200)
          .style("opacity", .8)
        d3.select(this)
          .transition()
          .duration(200)
          .style("stroke", "transparent")
      }
      console.log(topo) //topo.features
      console.log(pop[221])
      // Draw the map
      svg.append("g")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
          // draw each country
          .attr("d", d3.geoPath()
            .projection(projection)
          )
          .style("stroke","black")
          // set the color of each country
          
          .attr("fill", (d,i) => { 
            let populasse = pop[221].data.find(pop=> pop.country == d.properties.name) || 0 ;
            console.log(populasse)
            if (populasse == 0){
              return('white')
            } else{
              return colorScale(populasse.pop);}
            
          })
          

          .attr("class", function(d){ return "Country" } )
          .style("opacity", .8)
          .on("mouseover", mouseOver )
          .on("mouseleave", mouseLeave )
    
    })
    console.log(pop[221].data)
  
// year.forEach(year=>{
//   //console.log(year)
//   theTable.push({
//     annee: year,
//     data: []
//   })
// })



//   popTransformed.forEach(pop=>{
//     theTable.forEach(table=>{
//     const info = {
//       population: pop.pop,
//       country: pop.country
//     }
//     table.data.push(info); 
//   })
// })




// })




// console.log(theTable)

// console.log(theTable[0].annee)




// incomePP.forEach(inP=>{
//   theTable.forEach(table=>{

//   })
// })





// year.forEach(ye=>{
// lifeExp.forEach(liEx => {
//   //valeur de l année de l index
//   let lifeExpect = liEx[yearStart]

//   //Parcours du fichier life expect
//   popTransformed.forEach(popT => {
//     if (liEx['country'] == popT['country']) {
//       populationTot = popT['pop']
//       countrySel= liEx['country']
//       lifeExpect = liEx[yearStart]
//     }
//   })


//   //parcours du fichier incompe_per_person
//   incomePP.forEach(inP => {
//     //console.log(inP['country'])
//     if(inP['country'] == liEx['country']){
//       theIncome = inP[yearStart]
//     }

//   })
//     let data = { Country: countrySel,
//       income: theIncome,
//       life: lifeExpect,
//       pop: populationTot}



//   yearStart++
// });
// })





//console.log(orderedData)

