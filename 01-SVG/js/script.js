function domOn(selector, event, callback) {
    domForEach(selector, ele => ele.addEventListener(event, callback));
}

  
  // Param: selecteur + fonction a lancer
  function domForEach(selector, callback) {
    document.querySelectorAll(selector).forEach(callback);
  }
domOn('.rectangleTwo', 'click', evt=>{
    console.log(evt.target)
    if (!evt.target.classList.contains('active')) {
        evt.target.classList.add('active')
    } else {
        evt.target.classList.remove('active')
    }
})

domOn('.cercle', 'mouseover', evt=>{
    console.log(evt.target)
    document.querySelector('.leCercle').setAttribute("r", "90");
    
})

domOn('.cercle', 'mouseleave', evt=>{
    document.querySelector('.leCercle').setAttribute("r", "60");
})


