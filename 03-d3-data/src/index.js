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
    let longestPostTab =[];
    let indexCheck = 0;
    users.forEach(user => {

      let userPostsArray = [];
      let userPostsCount = 0;

      // console.log(posts)
      posts.forEach(post => {
        if (user.id == post.userId) {
          indexCheck++;
          userPostsArray.push(post.title)
          userPostsCount ++;
          userPosts.push({
            USER_ID : user.id,
            POST_ID : post.id,
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
        id_user:  user.id,
        nom_utilisateur: user.name,
        ville: user.address.city,
        nom_companie: user.company.name,
        titres_posts: userPostsArray,
        nb_post: userPostsCount,
      })
      //wtf condition mais j'ai pas réussi a faire marcher ça...
      if(longestPostTab.length<=1){
        longestPostTab.push({
          ID_POSTEUR: longestPostUser,
          LE_POST: longestPostTitle,
          POST_LENGTH: longestPost
        })
      }


      //console.log(theTab)
      // console.log(theTab[userCount])
      // let liste = d3.select('liste')
      // .append(userPostsCount);
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


    console.log(longestPost)

  });

