


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


    function insertMoveToBoard(dataCellIndex, currentPlayer){
        
        board[dataCellIndex] = currentPlayer.symbol
        renderBoard()
    }

    
    function getBoardsize() {
        return boardSize
    }

    return {
        // return public stuff
        setBoardSize,
        insertMoveToBoard,
        renderBoard,
        board,
        getBoardsize,
        
    }
})();



const Player = (name, symbol) => {
    return {
        name,
        symbol,

    }
}


const mainGame = (() => {

    player1 = Player("X-Player", "x")
    player2 = Player("O-Player", "o")

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
            console.log(e.target.dataset.index)
            if (e.target.textContent === "") {
              gameBoard.insertMoveToBoard(e.target.dataset.index, currentPlayer)
            }
            if (didWin()) {
                console.log(`Congrats! ${currentPlayer.name} won!`)
            }
            swapPlayers()
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

        //columns
        for (let i = 0; i < boardDimension ; i++) {

            winCases = [];

            for (let j = 0; j < boardDimension ; j++) {
                winCases.push(gameBoard.board[j*3+i])
            }

            if (_checkWinConditions(winCases)) return true
        }

        // rows
        for (let i = 0; i < boardDimension; i++) {

            winCases = []
            
            for (let j = 0; j < boardDimension; j++) {
                winCases.push(gameBoard.board[i*3+j])
                
            }

            if (_checkWinConditions(winCases)) return true

        }


        // diagonals
        winCases = []

        for (let i = 0; i < boardDimension; i++) {
            winCases.push(gameBoard.board[i*(boardDimension+1)])
           
        }
        if (_checkWinConditions(winCases)) return true
        
        

        winCases = []
        
        for (let i = 0; i < boardDimension; i++) {
            winCases.push(gameBoard.board[i*2+(boardDimension-1)])
         
        }

        if (_checkWinConditions(winCases)) return true


        // tie
        if (gameBoard.board.indexOf('') == -1) {
            console.log("It's a draw!")
            gameEndDraw()
        }

    }


    function gameEndDraw(){

    }


    function gameEndWin(currentPlayer) {
        
    }


    return {
        placeMove,
        currentPlayer,
        didWin,
        swapPlayers,
        player1,
        player2,
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