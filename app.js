const Gameboard = (
  () => {
    let boardData = new Array(9);
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

    return { getBoardData, getWinner, setWinner, getWinPatterns, place }
  }
)();

function createPlayer(name, sign) {
  return { name, sign }
}

const Game = (
  () => {
    let currentPlayer;

    function start() {
      let player1 = createPlayer('xajx', 'X')
      let player2 = createPlayer('xplo', 'O')
      currentPlayer = player1;
      game_loop(player1, player2)
    }

    function game_loop(player1, player2) {

      while (true) {
        console.log('\n', Gameboard.getBoardData().slice(0, 3))
        console.log(Gameboard.getBoardData().slice(3, 6))
        console.log(Gameboard.getBoardData().slice(6, 9))

        if (Gameboard.getWinner() == '') {
          if (currentPlayer == player1) {
            playTurn(player1);
          }
          else {
            playTurn(player2);
          }
          checkWinAndDraw(currentPlayer);
          changeCurrentPlayer(player1, player2);
        } else {
          if (Gameboard.getWinner() == 'none') {
            declareDraw();
          } else {
            declareWinner()
          }
          return;
        }
      }
    }

    function playTurn(player) {
      index = getUserInput()
      Gameboard.place(index, player.sign)
    }

    function getUserInput() {
      return prompt('Enter index of board array to place ' + currentPlayer.sign)
    }

    function checkWinAndDraw(player) {
      let boardData = Gameboard.getBoardData()
      let currentArr;

      let draw = boardData.values().every((e) => { return e !== undefined })
      if (draw) {
        return Gameboard.setWinner('none');
      }
      Gameboard.getWinPatterns().forEach((winPatternArr) => {
        currentArr = [boardData[winPatternArr[0]], boardData[winPatternArr[1]], boardData[winPatternArr[2]]];
        win = currentArr.every((e) => { return e == player.sign })
        if (win) {
          return Gameboard.setWinner(player)
        }
      })
    }


    function changeCurrentPlayer(player1, player2) {
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

    return { start }
  }
)();

Game.start()
console.log(Gameboard.getBoardData())
