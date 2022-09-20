var isPaused = true;
var isGoldeScore = false;
var isOsaekomi = false;
var isOsaekomiPaused = true;

var timer = setInterval(function(){}, 1000);
var timerOsaekomi = setInterval(function(){}, 1000);

var standardTime = 5;
var count = standardTime;
var countOsaekomi = 0;

var shido = [0, 0];
var score = [0, 0];
var color = ["white", "blue"];

hideText();

/* Commands */
$(document).keydown( (e) => commandList(e.key) );
$(".iniciar").click( () => resetAll() );
$(".white .text-area").click( () => applyWazari(0));
$(".blue .text-area").click( () => applyWazari(1));
$(".white .cards").click( () => {applyShido(0)});
$(".blue .cards").click( () => {applyShido(1)});
$(".timer-text").click( () => startCountDown() );
$(".osaekomi-branco").click( () => startOsaekomiTimer(0));
$(".osaekomi-azul").click( () => startOsaekomiTimer(1));
$(".close").click( function () {
  $(".info-menu").removeClass("show-menu");
  $(".info-menu").addClass("hide-menu");
  $(".overlay").css("width", "0");
} );
$(".info").click( () => {
  $(".info-menu").addClass("show-menu");
  $(".info-menu").removeClass("hide-menu");
  $(".overlay").css("width", "100%");
});
$(".min-2").click( () => setStandardTime(2));
$(".min-3").click( () => setStandardTime(3));
$(".min-4").click( () => setStandardTime(4));
$(".reset-btn").click( () => resetAll() );
$(".gs-btn").click( () => startGoldenScore() );
$(".toketa").click( () => cancelOsaekomi() );


function commandList(key){
  switch (key) {
    case ' ':
      startCountDown();
      break;
    case 'Enter':
      resetAll();
      break;

    case 'q':
      applyIppon(0);
      break;
    case 'w':
      applyWazari(0);
      break;
    case 'e':
      applyShido(0);
      break;
    case 'r':
      applyWinner(0);
      break;
    case 'a':
      removeIppon(0);
      break;
    case 's':
      removeWazari(0);
      break;
    case 'd':
      removeShido(0);
      break;
    case 'f':
      removeIppon(0);
      break;
    case '1':
      startOsaekomiTimer(0);
      break;

    case 'y':
      applyIppon(1);
      break;
    case 'u':
      applyWazari(1);
      break;
    case 'i':
      applyShido(1);
      break;
    case 'o':
      applyWinner(1);
      break;
    case 'h':
      removeIppon(1);
      break;
    case 'j':
      removeWazari(1);
      break;
    case 'k':
      removeShido(1);
      break;
    case 'l':
      removeIppon(1);
      break;
    case '9':
      startOsaekomiTimer(1);
      break;

    case 'b':
      startGoldenScore();
      break;
    case '0':
      cancelOsaekomi();
      break;

    case 'ArrowRight':
      plusOneSecond();
      break;
    case 'ArrowLeft':
      minusOneSecond();
      break;
    case '2':
      setStandardTime(2);
      break;
    case '3':
      setStandardTime(3);
      break;
    case '4':
      setStandardTime(4);
      break;

    default: console.log(key);

  }
}

/* Control Commands */
function endFight(){
  isPaused = true;
  isOsaekomi = false;

  clearInterval(timer);
  clearInterval(timerOsaekomi);
}

function applyIppon(i){
  score[i] = 100;
  endFight();
  showScore(i);
}

function applyShido(i){
  if(shido[i] < 3){
    shido[i]++;
  }
  checkShidoWinner(i);
  showShido(i);
}

function applyWazari(i){
  if(score[i] === 0){
    score[i]++;
    if(isGoldeScore){
      applyWinner(i);
    } else {
      showScore(i);
    }
  } else if(score[i] === 1){
    score[i] = 100;
    showScore(i);
    endFight();
  }
  //showScore(i);
}

function applyWinner(i){
  console.log("apply winner");
  selectedColor = color[i];
  $("." + selectedColor + " .text-area" + " .score-text").text("Vencedor");
  endFight();
}

function removeIppon(i){
  score[i] = 0;
  showScore(i);
}

function removeShido(i){
  if(shido[i] > 0){
    shido[i]--;
  }
  if(shido[i] == 2){
    showScore(0);
    showScore(1);
  }
  showShido(i);
}

function removeWazari(i){
  if(score[i] > 0){
    if(score[i] === 1) {score[i]--;}
    else{score[i] = 1;}
  }
  showScore(i);
}

function resetAll(){
  isPaused = true;
  isGoldeScore = false;
  isOsaekomi = false;
  isOsaekomiPaused = true;

  for(var i = 0; i<2; i++){
    shido[i] = 0;
    score[i] = 0;

    showShido(i);
    showScore(i);
  }
  $(".osaekomi-text").text("00");

  clearInterval(timer);
  clearInterval(timerOsaekomi);

  $(".golden-score-text").hide();
  $(".osaekomi-text").hide();
  $(".timer-text").show();
  setCount();
  countOsaekomi = 0;
  $(".timer-text").text(formatTime(standardTime));
  setTimerTextColor();

  $(".iniciar").hide();
}

/* Cronometer */
function cancelOsaekomi(){
  clearInterval(timerOsaekomi);
  countOsaekomi = 0;
  $(".osaekomi-text").hide();
  $(".osaekomi-text").text("00");
  $(".osaekomi-text").removeClass("is-paused");
  $(".white").removeClass("yellow");
  $(".blue").removeClass("yellow");
  isOsaekomi = false;
  isOsaekomiPaused = true;
}

function countDown(){
  if(!isPaused){
    count--;
    if(count < 0){
      var audio = new Audio("gong00.wav");
      audio.play();
      plusOneSecond();
      clearInterval(timer);
      isPaused = true;
      setTimerTextColor();
      $(".timer-text").text(formatTime(0));

      if(!isOsaekomi){
        winner = whoWinner();
        if(winner === 3){
          isGoldeScore = true;
        } else{
          applyWinner(winner);
        }
      }
    }
  }
  $(".timer-text").text(formatTime(count));
}

function countUpOsaekomi(i){
  if(!isOsaekomiPaused){
    countOsaekomi++;

    var countOsaekomiText = countOsaekomi;
    if(countOsaekomi<10){
      countOsaekomiText = "0" + countOsaekomi;
    }

    $(".osaekomi-text").text(countOsaekomiText);

    if(countOsaekomi === 10){
      applyWazari(i);
    } else if(countOsaekomi === 20){
      clearInterval(timerOsaekomi);
      $(".osaekomi-text").addClass("is-paused");
      applyIppon(i);
    }
  }
}

function countUp(){
  if(!isPaused){
    count++;
    $(".timer-text").text(formatTime(count));
  }
}

function minusOneSecond(){
  if(count > 0){
    count--;
    $(".timer-text").text(formatTime(count));
  }
}

function plusOneSecond(){
  count++;
  $(".timer-text").text(formatTime(count));
}

function setCount(){
  count = standardTime;
}

function setStandardTime(newTime){
  standardTime = newTime * 60;
  setCount();
}

function startCountDown(){
  if(isPaused){
    if(!isGoldeScore){
      timer = setInterval(countDown, 1000);
    } else {
      $(".golden-score-text").show();
      timer = setInterval(countUp, 1000);
    }
  } else{
    clearInterval(timer);
  }
  isPaused = !isPaused;
  setTimerTextColor();
}

function startGoldenScore(){
  isGoldeScore = true;
  isPaused = false;
  setTimerTextColor();
  clearInterval(timer);
  startCountDown();
}

function startOsaekomiTimer(i){
  if(isOsaekomi){
    isOsaekomiPaused = true;
    isOsaekomi = false;
    clearInterval(timerOsaekomi);
    $(".osaekomi-text").addClass("is-paused");
  } else {
    isOsaekomiPaused = false;
    isOsaekomi = true;
    clearInterval(timerOsaekomi);
    $(".osaekomi-text").removeClass("is-paused");
    $(".osaekomi-text").show();
    timerOsaekomi = setInterval(function(){countUpOsaekomi(i)}, 1000);
    $("." + color[i]).addClass("yellow");
  }
}

/* General Use Functions */
function checkShidoWinner(i){
  if(shido[i] === 3){
    applyWinner(toggleIndex(i));
  }
}

function indexOfMax(arr) {
    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }
    return maxIndex;
}

function formatTime(time){
  var min = Math.floor(time / 60);
  var sec = time % 60;

  if(sec < 10){sec = "0" + sec;}

  return min + ":" + sec;
}

function hideText(){
  $(".card").hide();
  $(".text").hide();
  $(".score-text").show();
}

function setTimerTextColor(){
  if(isPaused){
    $(".timer-text").addClass("is-paused");
  } else {
    $(".timer-text").removeClass("is-paused");
  }
}

function showShido(i){
  selectedColor = color[i];
  if(shido[i] === 0){
    $("." + selectedColor + " .card").hide();
  } else if(shido[i] === 1){
    $("." + selectedColor + " .red-card").hide();
    $("." + selectedColor + " .yellow-card1").show();
    $("." + selectedColor + " .yellow-card2").hide();
  } else if(shido[i] === 2){
    $("." + selectedColor + " .red-card").hide();
    $("." + selectedColor + " .yellow-card1").show();
    $("." + selectedColor + " .yellow-card2").show();
  } else if(shido[i] === 3){
    $("." + selectedColor + " .red-card").show();
    $("." + selectedColor + " .yellow-card1").hide();
    $("." + selectedColor + " .yellow-card2").hide();
  }
}

function showScore(i){
  selectedColor = color[i];
  if(score[i] < 100){
    $("." + selectedColor + " .score-text").text(score[i]);
  } else if(score[i] === 100){
    $("." + selectedColor + " .score-text").text("IPPON");
  }
}

function toggleIndex(i){
  if(i === 0){
    return 1;
  } else if(i === 1){
    return 0;
  }
}

function whoWinner(){
  if(score[0] === score[1]){
    return 3;
  } else{
    return indexOfMax(score);
  }
}
