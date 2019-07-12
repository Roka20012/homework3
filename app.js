/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj));
}

Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key));
}

const RESET_VALUE = 2;
const DEFAULT_WIN_SCORES = 100;

let scores, activePlayer, current, manualWinScores;
const diceElement1 = document.querySelector('.dice-1');
const diceElement2 = document.querySelector('.dice-2');
const inputWinScores = document.querySelector('.input-scores');
const player1Element = document.getElementById("name-0");
const player2Element = document.getElementById("name-1");
const showWinnersBtn = document.querySelector(".show-winners");

function Gamer() {
  let _score = 0;

  this.getScore = function() {
    return _score;
  }

  this.setScore = function(score) {
    _score = score;
  }

  this.resetScore = function() {
    _score = 0;
  }
}

let player1 = new Gamer();
let player2 = new Gamer();

const initGame = () => {
  if(inputWinScores.disabled) {
    inputWinScores.value = "";
    inputWinScores.disabled = !inputWinScores.disabled;
  } 

  askSetPlayersNames();
  player1.resetScore();
  player2.resetScore();
  manualWinScores = 0;
  current = 0;
  activePlayer = 0;
  scores = [0, 0];

  document.querySelector(`.player-0-panel`).classList.add('active');
  document.querySelector(`.player-1-panel`).classList.remove('active');

  document.querySelector('#current-0').textContent = 0;
  document.querySelector('#current-1').textContent = 0;
  document.querySelector('#score-0').textContent = 0;
  document.querySelector('#score-1').textContent = 0;
  diceElement1.style.display = 'none';
  diceElement2.style.display = 'none';
}

const askSetPlayersNames = _ => {
  let winners = localStorage.getObj("winners") ? localStorage.getObj("winners") : false;

  player1.name = prompt("Enter player1 name:", "Vitalik") || "Игрок 1";
  while(!!winners[player1.name]) {
    if(confirm(player1.name + " already exist, it is you?")) break;
    player1.name = prompt("Enter player1 name:", "Vitalik") || "Игрок 1";
  }
    
  player2.name = prompt("Enter player2 name:", "Bro") || "Игрок 2";
  while(!!winners[player2.name]) {
    if(confirm(player2.name + " already exist, it is you?")) break;
    
    player2.name = prompt("Enter player2 name:", "Vitalik") || "Игрок 2";
  }

  while(player1.name === player2.name) {
      player2.name = prompt("Can not be two " + player1.name + " enter new name", "") || "Player2";
      while(!!winners[player2.name]) {
        if(confirm(player2.name + " already exist, it is you?")) break;
        
        player2.name = prompt("Enter player2 name:", "Bro") || "Игрок 2";
      }
  }

  player1Element.textContent = player1.name;
  player2Element.textContent = player2.name;
}

initGame();

document.querySelector('.btn-roll').addEventListener('click', function() {
  if(!inputWinScores.disabled) {
    inputWinScores.disabled = !inputWinScores.disabled;
  } 

  let dice1 = Math.floor(Math.random() * 6) + 1;
  let dice2 = Math.floor(Math.random() * 6) + 1;

  diceElement1.src = `dice-${dice1}.png`;
  diceElement1.style.display = 'block';
  diceElement2.src = `dice-${dice2}.png`;
  diceElement2.style.display = 'block';

  if (dice1 !== RESET_VALUE && dice2 !== RESET_VALUE && dice1 !== dice2) {
    current += dice1 + dice2;
    document.getElementById('current-'+activePlayer).textContent = current;

    if(activePlayer) {
      player2.setScore(scores[activePlayer] + current);
    } else {
      player1.setScore(scores[activePlayer] + current);
    }

    if (scores[activePlayer] + current >= (manualWinScores || DEFAULT_WIN_SCORES)) {
      activePlayer ? winner = player2 : winner = player1;
      let winnerName = winner.name;
      winner.winCount ? winner.winCount++ : winner.winCount = 1;

      if(localStorage.getObj("winners")) {
        let winners = localStorage.getObj("winners");
        
        console.log(winner.winCount);
        console.log("winner", winnerName);
        winners[winnerName] = winners[winnerName] ? ++winners[winnerName] : winner.winCount;
        console.log("winners", winners);
        localStorage.setObj("winners", winners);
      } else {
        let winners = {};
        winners[winnerName] = winner.winCount;
        localStorage.setObj("winners", winners);
      }

      alert(`${winner.name} won!!!`);
      initGame();
    }
    
  } else {
    if(activePlayer) {
      player2.setScore(scores[activePlayer]);
    } else {
      player1.setScore(scores[activePlayer]);
    }
    changePlayer();
  }
});

const changePlayer = () => {
  current = 0;
  document.getElementById('current-'+activePlayer).textContent = 0;
  document.querySelector(`.player-${activePlayer}-panel`).classList.toggle('active');
  activePlayer = +!activePlayer;
  diceElement1.style.display = 'none';
  diceElement2.style.display = 'none';
  document.querySelector(`.player-${activePlayer}-panel`).classList.toggle('active');
}

document.querySelector('.btn-hold').addEventListener('click', function() {
  if(!inputWinScores.disabled) {
    inputWinScores.disabled = !inputWinScores.disabled;
  }

  scores[activePlayer] += current;
  activePlayer ? player2.setScore(scores[activePlayer]) : player1.setScore(scores[activePlayer]);
  let allScore = activePlayer ? player2.getScore() : player1.getScore();
  document.querySelector(`#score-${activePlayer}`).textContent = allScore;
  changePlayer();
});


document.querySelector('.btn-new').addEventListener('click', function() {
  initGame();
});

const setWinScores = ({target}) => manualWinScores = target.valueAsNumber;
const showWinners = _ => { 
  let winners = localStorage.getObj("winners") ? localStorage.getObj("winners") : false;
  let winnersList = "";

  if(!winners) {
    alert("Nothing to show");
  } else {
    for(let key in winners) {
      winnersList += `${key} win ${winners[key]} times\n`;
    }
    alert(winnersList);
  }
};

inputWinScores.addEventListener("keyup", setWinScores);
showWinnersBtn.addEventListener("click", showWinners);
