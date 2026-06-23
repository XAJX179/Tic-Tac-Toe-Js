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
    let currentPlayer = '';
    let player1 = '';
    let player2 = '';

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
      restartGame()
      return;
    }

    function restartGame() {
      Gameboard.reset();
      Display.restartDisplay();
    }

    function changeCurrentPlayer() {
      if (currentPlayer == player1) {
        currentPlayer = player2
      } else {
        currentPlayer = player1
      }
    }

    function declareWinner() {
      Display.sendMessage(`${Gameboard.getWinner().name} won!`)
      console.log(`${Gameboard.getWinner().name} won!`)
    }
    function declareDraw() {
      Display.sendMessage("Draw / Tie")
      console.log("Draw / Tie")
    }

    function setCurrentPlayer(player) {
      currentPlayer = player
    }
    function setPlayer1(player) {
      player1 = player
    }
    function getPlayer1() {
      return player1
    }
    function setPlayer2(player) {
      player2 = player
    }
    function getPlayer2() {
      return player1
    }

    function reset() {
      player1 = '';
      player2 = '';
      currentPlayer = '';
    }

    return { play_game, getPlayer1, getPlayer2, setPlayer1, setPlayer2, setCurrentPlayer, reset }
  }
)();

const Display = (
  () => {
    let nameForm = document.querySelector('.name-form')
    let startGameBtn = nameForm.elements["start-game"]
    let displayContainer = document.querySelector('.container')
    let restartBtn = document.querySelector('.restart-btn')

    startGameBtn.addEventListener('click', (e) => {
      if (nameForm.elements["player1"].value == "" || nameForm.elements["player2"].value == "") {
      } else {
        e.preventDefault()
        nameForm.style.display = 'none'
        restartBtn.style.display = 'flex'
        displayContainer.style.display = 'grid'
        Game.setPlayer1(createPlayer(nameForm.elements["player1"].value, "X"))
        Game.setPlayer2(createPlayer(nameForm.elements["player2"].value, "O"))
        Game.setCurrentPlayer(Game.getPlayer1())
      }
    })

    displayContainer.addEventListener('click', (e) => {
      handleInput(e.target)

      console.log('\n', Gameboard.getBoardData().slice(0, 3))
      console.log(Gameboard.getBoardData().slice(3, 6))
      console.log(Gameboard.getBoardData().slice(6, 9))
    })

    restartBtn.addEventListener('click', (e) => {
      e.preventDefault()
      resetAll();
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

    function restartDisplay() {
      let boxes = document.querySelectorAll('.box')
      boxes.forEach((e) => {
        e.replaceChildren()
      })
    }

    function sendMessage(message) {
      let messageDiv = document.querySelector(`.message`);
      let p = document.createElement('p')
      p.textContent = 'Last round: ' + message
      messageDiv.replaceChildren(p)
    }

    function reset() {
      restartDisplay()
      nameForm.style.display = 'block'
      restartBtn.style.display = 'none'
      displayContainer.style.display = 'none'
    }

    function resetAll() {
      Gameboard.reset()
      reset()
      Game.reset()
    }

    return { drawMark, restartDisplay, sendMessage }
  }
)();
