// window : the browser window
// .onload : the event that triggers when the browser has loaded all of the content. we ONLY use the load event because it waits for everything to be on the page
// https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event
// = () => {} : anonymous function, which will automatically be called when the event is triggered. so when we use anonymous functions, they happen instantaneously, as opposed to waiting for a call to happen
window.onload = () =>{
    console.log('the webpage has loaded')
    alert('page has loaded')

    // document : variable that exists as a part of js which is a reference to the html page
    let paragraphs = document.getElementsByTagName('p')
    console.log(paragraphs)
    // retrieving a specific paragraph to modify
    // we can only modify one thing at a time
    paragraphs[0].innerHTML = "new content with js"

    // grabs all the elements that have a specific class
    let blue = document.getElementsByClassName('blue')
    console.log(blue)
    blue[1].textContent += "hehe haha"

    // grabs a SINGLE element, because only one ID can exist on a page at a time
    let important = document.getElementById('important')
    important.style.fontSize = '72px'
    
}