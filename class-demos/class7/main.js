window.onload = () => {
  // to dynamically create elements with javascript we need 3 things:
  // 1. create the element and store in a variable
  // 2. modify that element as needed (does it need styling? does it have text?)
  // 3. add the element to the page

  // with this for loop, we are adding 50 elements to the page instead of needing to hard code it
  for (let i = 0; i < 50; i++) {
    // step 1: create the tag that will be added to the page and store in a variable
    const span = document.createElement("span");
    // creating specifically the text node that will go inside it. we could also use .textContent or .innerHTML
    const node = document.createTextNode(" created " + i);

    // step 2: modify the new element as needed
    span.appendChild(node);
    span.classList.add("text-body");

    // step 3: add new element to document.body (the body tag of our html)
    document.body.appendChild(span);
  }

  // call the time function 1 time, which will change all the spans to have time data
  time();

  // call the time function once every 1000ms
  // 2 parameters:
  // 1. function (action) to be executed
  // 2. time before the setInterval function loops (in ms)
  setInterval(time, 1000);
};

// declaring new function so that it happens when i call it, not instantaneously
function time() {
  // creates a new instance of the date class from vanilla js
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
  const date = new Date();

  // retrieving all the elements with the 'text-body' class
  let allSpans = document.getElementsByClassName("text-body");

  // loop through all th elements
  for (let i = 0; i < 50; i++) {
    // change the text of the element to use the time
    allSpans[i].textContent = date.toLocaleTimeString();
  }
}
