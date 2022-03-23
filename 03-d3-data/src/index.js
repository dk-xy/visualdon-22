// fetch('https://jsonplaceholder.typicode.com/posts')
//   .then(response => response.json())
//   .then(posts => console.log(posts))

// fetch('https://jsonplaceholder.typicode.com/users')
//   .then(response => response.json())
//   .then(users => console.log(users))
import * as d3 from 'd3';
import { csv, json } from 'd3-fetch'

Promise.all([
  json('https://jsonplaceholder.typicode.com/posts', {
  }),
  json('https://jsonplaceholder.typicode.com/users')
])
  .then(([posts, users]) => {
    let longestPost = 0;
    let longestPostUser;
    let longestPostTitle;
    // Do your stuff. Content of both files is now available in stations and svg
    // console.log(posts)
    let theTab = new Array();
    // console.log(users)
    let userCount = 0;
    let userPosts = [];
    let longestPostTab = [];
    let indexCheck = 0;
    users.forEach(user => {

      let userPostsArray = [];
      let userPostsCount = 0;

      // console.log(posts)
      posts.forEach(post => {
        if (user.id == post.userId) {
          indexCheck++;
          userPostsArray.push(post.title)
          userPostsCount++;
          userPosts.push({
            USER_ID: user.id,
            POST_ID: post.id,
            TOTAL_POSTS: userPostsCount,
          })
          //Verif du post le plus long et création du tableau pour recup
          if (post.body.length > longestPost) {
            longestPost = post.body.length
            longestPostUser = user.id
            longestPostTitle = post.title
          }
        }

      });

      //Création tableau utilisateur
      theTab.push({
        id_user: user.id,
        nom_utilisateur: user.name,
        ville: user.address.city,
        nom_companie: user.company.name,
        titres_posts: userPostsArray,
        nb_post: userPostsCount,
      })

      //wtf condition mais j'ai pas réussi a faire marcher ça...
      if (longestPostTab.length <= 1) {
        longestPostTab.push({
          ID_POSTEUR: longestPostUser,
          LE_POST: longestPostTitle,
          POST_LENGTH: longestPost
        })
      }

      userCount++
    })



    console.log(longestPostTab)


    const liste = d3.select("body")
    liste.append('div')
      .data(longestPostTab)
      .enter()
      .append('li')
      .text((d) => `Le poste les plus long est posté par: ${d.ID_POSTEUR}, est long de ${d.POST_LENGTH} `)
    //.text("Le poste le plus long est de: "+longestPost+" caractères")


    liste.append("li")
      .data(theTab)
      .enter()
      .append('li')
      .text((d, i) => `L'utilisateur ${d.nom_utilisateur} a posté: ${d.nb_post} articles `)
    userPosts.forEach(post => {
    });

    //  création du graph
    const data = theTab;
    const range = [0, 20]
    const scaleNo = 0.1;
    const scale = d3.scaleLinear()
      .domain(data)
      .range(range)

    // set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 70, left: 60 },
      width = 1000 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#my_dataviz")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
       .attr("transform",
         "translate(" + margin.left + "," + margin.top + ")");



let domainUsers = users.length;
let domainPosts = posts.length;
//AXE X----------------------------------
      const x = d3.scaleBand()
      .range([ 0, width ])
      .domain(data.map(function(d) { return d.nom_utilisateur; }))
      .padding(0.2);
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
// AXE Y----------------------------------
      const y = d3.scaleLinear()
      .domain([0, 20])
      .range([ height, 0])

      svg.append("g")
      .call(d3.axisLeft(y))

    //CREATION DES BARRES
// Bars
console.log(theTab)
svg.selectAll("mybar")
  .data(theTab)
  .enter()
  .append("rect")
    .attr("x", function(d) { return x(d.nom_utilisateur); })
    .attr("y", function(d) { return y(d.nb_post); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.nb_post); })
    .attr("fill", "#69b3a2")
  });




