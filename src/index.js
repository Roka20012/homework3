/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/
import * as game from "./components/logic";

const showWinnersBtn = document.querySelector(".show-winners");
const throwBtn =  document.querySelector('.btn-roll');
const newGameBtn = document.querySelector('.btn-new');
const saveScoreBtn = document.querySelector('.btn-hold');

game.initGame();

throwBtn.addEventListener('click', game.gameLogic);
game.inputWinScores.addEventListener("keyup", game.setWinScores);
showWinnersBtn.addEventListener("click", game.showWinners);
newGameBtn.addEventListener('click', game.initGame);
saveScoreBtn.addEventListener('click', game.saveScore);
