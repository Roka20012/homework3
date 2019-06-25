export default function Gamer() {
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
