
// ###### Game Board ######

const gameBoard = (() => {
    // var
    let board = []
    let boardSize = 3
    
    // DOM Caching
    let gameContainer = document.querySelector('.game-board-inner');

    function _createBoardArray(height) {
        board = []
        for (let i = 0; i < height*height; i++) {
            board.push("")           
        }
    }

    _createBoardArray(boardSize)

    function renderBoard(boardArray) {
        

        _clearBoard()

        let cellIndex = 0;

        board.forEach(() => {
            
            let gameSquare = document.createElement('div')
            gameSquare.classList.add('game-square')
            gameSquare.setAttribute("data-index", cellIndex)
            gameSquare.textContent = board[cellIndex]
            gameContainer.appendChild(gameSquare)
            cellIndex++
        })

        eventHandler.add()
        
    }

    function _clearBoard() {
        while (gameContainer.firstChild) {
            gameContainer.removeChild(gameContainer.firstChild)
        }
    }

    function setBoardSize(height) {
        boardSize = height
        _createBoardArray(boardSize)
        gameContainer.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
        gameContainer.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`;      

        renderBoard()

    }

    function resetBoard() {
        board = []
        _createBoardArray
        renderBoard()
    }

    function insertMoveToBoard(dataCellIndex, currentPlayer){
        
        board[dataCellIndex] = currentPlayer.symbol
        renderBoard()
    }

    function getBoard() {
        return board
    }

    function getBoardsize() {
        return boardSize
    }



    return {
        // return public stuff
        setBoardSize,
        insertMoveToBoard,
        renderBoard,
        getBoardsize,
        resetBoard,
        getBoard
        
    }
})();



// ###### Player Factory ######

const Player = (name, symbol) => {
    return {
        name,
        symbol,

    }
}


// ###### Game Logic ######

const mainGame = (() => {

    
    let player1 = Player("X-Player", "x");
    let player2 = Player("O-Player", "o");

    let currentPlayer = player1;

    function swapPlayers() {
        if (currentPlayer === player2 || currentPlayer == undefined) {
            currentPlayer = player1;
        } else {
            currentPlayer = player2;
        }
    }

    function placeMove() {

        console.log('click')


        return e => {
            console.log(e.target.dataset.index);
            if (e.target.textContent === "") {
              gameBoard.insertMoveToBoard(e.target.dataset.index, currentPlayer);
            }
            if (didWin()) {
                gameEndWin(currentPlayer);
            }
            swapPlayers();
        };
        

    }


    function _checkWinConditions(winCases) {
        if (!winCases.includes('') && (!winCases.includes('x') || !winCases.includes('o'))) {
            console.log('someone won.');
            console.log(winCases);
            return true   
        }
    }


    function didWin() {
        let isWinner;
        let winCases = []
        let boardDimension = gameBoard.getBoardsize()
        let board = gameBoard.getBoard()

        //columns
        for (let i = 0; i < boardDimension ; i++) {

            winCases = [];

            for (let j = 0; j < boardDimension ; j++) {
                winCases.push(board[j*boardDimension+i])
            }

            if (_checkWinConditions(winCases)) return true
        }

        // rows
        for (let i = 0; i < boardDimension; i++) {

            winCases = []
            
            for (let j = 0; j < boardDimension; j++) {
                winCases.push(board[i*boardDimension+j])
                
            }

            if (_checkWinConditions(winCases)) return true

        }


        // diagonals
        winCases = []

        for (let i = 0; i < boardDimension; i++) {
            winCases.push(board[i*(boardDimension+1)])
           
        }
        if (_checkWinConditions(winCases)) return true
        
        

        winCases = []
        
        for (let i = 0; i < boardDimension; i++) {
            winCases.push(board[i*2+(boardDimension-1)])
         
        }

        if (_checkWinConditions(winCases)) return true


        // tie
        if (board.indexOf('') == -1) {
            console.log("It's a draw!")
            gameEndDraw()
        }

    }


    function gameEndDraw(){
        console.log('draw');
        setTimeout(() => {
            confirm('Restart game?') ? restartGame() : "gg"
        }, 100)
       
    }

    function gameEndWin(currentPlayer){
        console.log(currentPlayer.name + ' has won.');
        setTimeout(() => {
            confirm('Restart game?') ? restartGame() : "gg"
        }, 100)
    }    
    
    function restartGame() {
        gameBoard.setBoardSize(gameBoard.getBoardsize())
    }


    return {
        placeMove,
        currentPlayer,
        didWin,
    }

})()




const eventHandler = (() => {
    // DOM Caching
    

    // Add Listeners to each cell

    function add() { 
        gameCells = document.querySelectorAll('.game-square')
        
        gameCells.forEach(cell => {
        cell.addEventListener('click', mainGame.placeMove());
        });
    }

    function remove() {
        gameCells.forEach(cell => {
        cell.removeEventListener('click', mainGame.placeMove())
        });
    }

    return {
        add,
        remove
    }

})()


gameBoard.renderBoard()