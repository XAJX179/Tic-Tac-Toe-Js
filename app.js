const Gameboard = (
  () => {
    let boardData = ['', '', '', '', '', '', '', '', ''];
    let winner = '';
    let winPatterns = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

    function place(index, sign) {
      boardData[index] = sign
    }

    function getBoardData() {
      return boardData;
    }

    function getWinner() {
      return winner;
    }

    function setWinner(player) {
      return winner = player;
    }

    function getWinPatterns() {
      return winPatterns;
    }

    function isEmptyIndex(input) {
      return boardData[input] == ''
    }

    function reset() {
      boardData = ['', '', '', '', '', '', '', '', ''];
      winner = '';
    }

    return { getBoardData, getWinner, setWinner, getWinPatterns, place, isEmptyIndex, reset }
  }
)();

function createPlayer(name, sign) {
  return { name, sign }
}

const Game = (
  () => {
    let currentPlayer;
    let player1;
    let player2;

    function start() {
      player1 = createPlayer('xajx', 'X')
      player2 = createPlayer('xplo', 'O')
      currentPlayer = player1;
    }

    function play_game(input) {
      playTurn(input)
      let game_ended = isWinOrDraw();
      if (game_ended) {
        endGame();
      } else {
        changeCurrentPlayer();
      }
    }

    function playTurn(index) {
      Gameboard.place(index, currentPlayer.sign)
      Display.drawMark(index, currentPlayer.sign)
    }

    function isWinOrDraw() {
      let boardData = Gameboard.getBoardData()
      let currentArr;

      for (const winPatternArr of Gameboard.getWinPatterns()) {
        currentArr = [boardData[winPatternArr[0]], boardData[winPatternArr[1]], boardData[winPatternArr[2]]];

        let win = currentArr.every((e) => { return e == currentPlayer.sign })

        if (win) {
          Gameboard.setWinner(currentPlayer)
          return true;
        }
      }
      let draw = boardData.every((e) => { return e !== '' })
      if (draw) {
        Gameboard.setWinner('none');
        return true;
      }
      return false;
    }

    function endGame() {
      if (Gameboard.getWinner() == 'none') {
        declareDraw();
      } else {
        declareWinner();
      }
      Gameboard.reset();
      Display.resetDisplay();
      return;
    }


    function changeCurrentPlayer() {
      if (currentPlayer == player1) {
        currentPlayer = player2
      } else {
        currentPlayer = player1
      }
    }

    function declareWinner() {
      console.log(`${Gameboard.getWinner().name} won!`)
    }
    function declareDraw() {
      console.log("Draw / Tie")
    }

    return { start, play_game }
  }
)();

const Display = (
  () => {
    let displayContainer = document.querySelector('.container')
    displayContainer.addEventListener('click', (e) => {
      handleInput(e.target)

      console.log('\n', Gameboard.getBoardData().slice(0, 3))
      console.log(Gameboard.getBoardData().slice(3, 6))
      console.log(Gameboard.getBoardData().slice(6, 9))
    })

    function handleInput(elem) {
      let input = elem.dataset.index
      if (elem.dataset.index == undefined) {
        input = elem.parentNode.dataset.index
      }
      if (isValidInput(input)) {
        Game.play_game(input)
      }
    }

    function isValidInput(input) {
      if (isNaN(input) || input == '' || !Gameboard.isEmptyIndex(input)) {
        return false;
      } else {
        return true;
      }
    }

    function drawMark(index, sign) {
      let box = document.querySelector(`.box[data-index="${index}"]`);
      let p = document.createElement('p')
      p.textContent = sign
      box.replaceChildren(p)
    }

    function resetDisplay() {
      let boxes = document.querySelectorAll('.box')
      boxes.forEach((e) => {
        e.replaceChildren()
      })
    }

    return { drawMark, resetDisplay }
  }
)();

Game.start()
