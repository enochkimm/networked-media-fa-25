// the numbers as foods
function numToFood(n) {
    if (n === 0) return "🍚";
    if (n === 1) return "🥩";
    if (n === 2) return "🥔";
    if (n === 3) return "🥚";
    if (n === 4) return "🍗";
    if (n === 5) return "🐟";
    if (n === 6) return "🥦";
    if (n === 7) return "🥙";
    if (n === 8) return "🧅";
    if (n === 9) return "🍖";
    return "";
  }
  
  // make time into food version
  function makeFoodTime(h, m, s, ampm) {
    let hh = (h < 10 ? "0" + h : "" + h);
    let mm = (m < 10 ? "0" + m : "" + m);
    let ss = (s < 10 ? "0" + s : "" + s);
    let str = hh + ":" + mm + ":" + ss + " " + ampm;
  
    let result = "";
    for (let i = 0; i < str.length; i++) {
      let c = str.charAt(i);
      if (c >= "0" && c <= "9") {
        result += numToFood(parseInt(c));
      } else {
        result += c;
      }
    }
    return result;
  }
  
  window.onload = () => {
    let hourHand = document.getElementById("hour-hand");
    let minuteHand = document.getElementById("minute-hand");
    let secondHand = document.getElementById("second-hand");
    let foodTimeText = document.getElementById("digital");
    let mealTitle = document.getElementById("meal-label");
    let mealEmoji = document.getElementById("food-display");
    let mealNote = document.getElementById("reminder");
    let ding = document.getElementById("alarm-sound");
    let mealStatus = document.getElementById("status");
    let mealProgress = document.getElementById("progress");
    let legendBox = document.getElementById("legend");
  
    let ateMorning = false;
    let ateAfternoon = false;
    let ateNight = false;
  
    let now = new Date();
  
    function updateMeals() {
      mealStatus.textContent =
        "Meals: morning " + (ateMorning ? "✅" : "❌") +
        " | afternoon " + (ateAfternoon ? "✅" : "❌") +
        " | night " + (ateNight ? "✅" : "❌");
  
      let total = 0;
      if (ateMorning) total++;
      if (ateAfternoon) total++;
      if (ateNight) total++;
  
      mealProgress.textContent = "Meals eaten: " + total + "/3";
      if (total === 3) {
        mealProgress.textContent += " good job!";
      } else {
        mealProgress.textContent += " u failed";
      }
    }
  
    function updateClock() {
      let h = now.getHours();
      let m = now.getMinutes();
      let s = now.getSeconds();
  
      let ampm = (h >= 12) ? "PM" : "AM";
      let hh = h % 12;
      if (hh === 0) hh = 12;
  
      foodTimeText.textContent = makeFoodTime(hh, m, s, ampm);
  
      let secDeg = (s / 60) * 360;
      let minDeg = (m / 60) * 360;
      let hourDeg = (hh / 12) * 360 + (m / 60) * 30;
  
      secondHand.style.transform = "rotate(" + secDeg + "deg)";
      minuteHand.style.transform = "rotate(" + minDeg + "deg)";
      hourHand.style.transform = "rotate(" + hourDeg + "deg)";
  
      now.setSeconds(now.getSeconds() + 1);
    }
  //show contents based on respective meal time
    function showMeal(when) {
      if (when === "morning") {
        mealTitle.textContent = "Morning - Breakfast";
        mealEmoji.textContent = "🥣🍓🍯";
        mealNote.textContent = "eat some yogurt";
        document.body.style.background = "lightblue";
        document.body.style.color = "black";
        legendBox.style.color = "black";
        legendBox.style.background = "#f1f1f1";
      }
      if (when === "afternoon") {
        mealTitle.textContent = "Afternoon - Lunch";
        mealEmoji.textContent = "🐟🍳🥔";
        mealNote.textContent = "dont overeat";
        document.body.style.background = "gold";
        document.body.style.color = "black";
        legendBox.style.color = "black";
        legendBox.style.background = "#f1f1f1";
      }
      if (when === "night") {
        mealTitle.textContent = "Night - Dinner";
        mealEmoji.textContent = "🍚🍗🥩";
        mealNote.textContent = "overeat. eat everything";
        document.body.style.background = "navy";
        document.body.style.color = "white";
        legendBox.style.color = "white";
        legendBox.style.background = "black";  
      }
      ding.play();
    }
  
    setInterval(updateClock, 1000);
  
    document.getElementById("check-btn").onclick = () => {
      let h = now.getHours();
      if (h === 9) ateMorning = true;
      if (h === 15) ateAfternoon = true;
      if (h === 20) ateNight = true;
      updateMeals();
    };
  
    document.getElementById("skip-btn").onclick = () => {
      let h = now.getHours();
      if (h === 9) ateMorning = false;
      if (h === 15) ateAfternoon = false;
      if (h === 20) ateNight = false;
      updateMeals();
    };
  
    document.getElementById("jump-morning").onclick = () => {
      now = new Date();
      now.setHours(9, 0, 0, 0);
      showMeal("morning");
      updateClock();
    };
  
    document.getElementById("jump-afternoon").onclick = () => {
      now = new Date();
      now.setHours(15, 0, 0, 0);
      showMeal("afternoon");
      updateClock();
    };
  
    document.getElementById("jump-night").onclick = () => {
      now = new Date();
      now.setHours(20, 0, 0, 0);
      showMeal("night");
      updateClock();
    };
  
    updateMeals();
    updateClock();
  };