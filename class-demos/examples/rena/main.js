window.onload = () => {
  let btn = document.getElementById("switch");

  btn.onclick = () => {
    let abstract = document.getElementById("abstract");
    let overwhelming = document.getElementById("overwhelming");

    if (abstract.style.display == "" || abstract.style.display == "none") {
      abstract.style.display = "block";
      overwhelming.style.display = "none";
    } else {
      abstract.style.display = "none";
      overwhelming.style.display = "flex";
    }
  };

  document.addEventListener('mousemove', (e)=>{
    console.log("x:" + e.clientX)
    console.log("y:" + e.clientY)
    console.log(typeof(e.clientX))
  })
};
