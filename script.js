
// ###### Game Board ######

const gameBoard = (() => {
    // var
    let board = []
    let boardSize = 3
    
    // DOM Caching
    const gameContainer = document.querySelector('.game-board-inner');


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

            const xImg = document.createElement('img')
            const oImg = document.createElement('img')
            xImg.setAttribute("src", "img/fiireball-x.svg")
            oImg.setAttribute("src", "img/fiireball-o.svg")
            let gameSquare = document.createElement('div')
            gameSquare.classList.add('game-square')
            gameSquare.setAttribute("data-index", cellIndex)
            //gameSquare.textContent = board[cellIndex]
            gameContainer.appendChild(gameSquare)
            if (board[cellIndex] === "x"){
                gameSquare.appendChild(xImg)
            }
            if (board[cellIndex] === "o"){
                gameSquare.appendChild(oImg)
            }
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
const Player = (name, symbol, isAI) => {
    return {
        name,
        symbol,
        isAI
    }
}


// ###### Game Logic ######
const mainGame = (() => {

    
    let _isGameOver = false;
    let player1 = Player("X-Player", "x", false);
    let player2 = Player("O-Player", "o", true);
    let currentPlayer = player1;

    function swapPlayers() {
        if (currentPlayer === player2 || currentPlayer == undefined) {
            
            currentPlayer = player1;
        } else {
            currentPlayer = player2;
        }
    }

    function placeMove() {
        
        return e => {
            if (gameBoard.getBoard()[e.target.dataset.index] === "") {
                gameBoard.insertMoveToBoard(e.target.dataset.index, currentPlayer);
            }
            if (didWin()) {
                gameEndWin(currentPlayer);
                return
            }
            swapPlayers();
            handleAITurn(currentPlayer)
        };
    }

    function dumbAIMove(currentPlayer) {
        if (currentPlayer.isAI) {
            if (_isGameOver) return
            let randomChoice = Math.floor(Math.random()*9)
            if (gameBoard.getBoard()[randomChoice] === "") {
                gameBoard.insertMoveToBoard(randomChoice, currentPlayer)
            } else {
                dumbAIMove(currentPlayer)
            }
            if (didWin()) {
                gameEndWin(currentPlayer);
            }
        }

        
    }

    function handleAITurn(currentPlayer) {
        if (currentPlayer.isAI) {
            dumbAIMove(currentPlayer)
        } 
        swapPlayers();
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
            _isGameOver = true;
            gameEndDraw()
        }

    }

    // GAME OVER ###     
    gameOverWindow = document.querySelector('.gameover-container')
    gameOverOverlay = document.querySelector('.overlay')
    gameOverMsg = document.getElementById('gameoverMessage')

    function gameOver(currentPlayer) {
        if (currentPlayer) {
            gameoverMessage.textContent = `Congrats ${currentPlayer.name}! Play again?`
        } else {
            gameoverMessage.textContent = `It's a draw! Play again?`
        }

        gameOverOverlay.classList.add('active')
        gameOverWindow.classList.add('active')
    }

    function gameEndDraw(){                                    
        console.log('draw');                                   
        setTimeout(() => {                                     
            gameOver()
        }, 100)
       
    }

    function gameEndWin(currentPlayer){
        console.log(currentPlayer.name + ' has won.');
        setTimeout(() => {
            gameOver(currentPlayer)
        }, 100)
    }    
    
    function restartGame() {
        gameBoard.setBoardSize(gameBoard.getBoardsize())
        currentPlayer = player1;
        _isGameOver = false;
    }
    
    // ##### Settings stuff
    function setPlayers(name1, name2) {
        if (!name1 || !name2) {
            player1.name = "Player 1"
            player2.name = "Player 2"
        }
        player1.name = name1
        player2.name = name2
    }

    function getCurrentPlayer() {
        return currentPlayer;
    }

    return {
        placeMove,
        getCurrentPlayer,
        didWin,
        restartGame,
        setPlayers,
        handleAITurn,
        dumbAIMove
    }

})()


const eventHandler = (() => {
    // DOM Caching
    const restartButton = document.getElementById('restart-btn')
    const settingsButton = document.getElementById('settings-btn')
    const playAgainButton = document.getElementById('playagain-btn')
    const gameOverWindow = document.querySelector('.gameover-container')
    const gameOverOverlay = document.querySelector('.overlay');
    const settingsWindow = document.querySelector('.settings-window-container')
    const applyButton = settingsWindow.querySelector('#apply-btn')
    const closeSettingsButton = settingsWindow.querySelector('#close-settings-btn')

    // Add Listeners to each cell
    function add() { 
        gameCells = document.querySelectorAll('.game-square')
        
        gameCells.forEach(cell => {
            if (!cell.hasChildNodes()) {
                cell.addEventListener('click', mainGame.placeMove());
            }
        });
    }

    function remove() {
        gameCells.forEach(cell => {
        cell.removeEventListener('click', mainGame.placeMove())
        });
    }

    function restartBtn() {
        restartButton.addEventListener('click', () => {
            gameBoard.setBoardSize(gameBoard.getBoardsize())
        })
    }

    function settingsBtn() {
        settingsButton.addEventListener('click', () => {
            settingsWindow.classList.add('active')
            gameOverOverlay.classList.add('active')
        })
    }

    function applyBtn(){
        applyButton.addEventListener('click', () =>{
            settingsWindow.classList.remove('active')
            gameOverOverlay.classList.remove('active')
        })
    }

    function closeSettingsBtn(){
        closeSettingsButton.addEventListener('click', () => {
            settingsWindow.classList.remove('active')
            gameOverOverlay.classList.remove('active')
        })
    }

    function playAgainBtn() {
        playAgainButton.addEventListener('click', () => {
            mainGame.restartGame()
            gameOverWindow.classList.remove('active')
            gameOverOverlay.classList.remove('active')
        })
    }

    return {
        add,
        remove,
        restartBtn,
        settingsBtn,
        playAgainBtn,
        applyBtn,
        closeSettingsBtn,
    }

})()
// TO DO LIST #############
//##### Player name input field

//##### Make it prettier

//##### AI Player random

//##### AI Player minimax

//##### Swap between human vs (human || dumb AI || impossible AI)

gameBoard.renderBoard()
eventHandler.restartBtn()
eventHandler.settingsBtn()
eventHandler.playAgainBtn()
eventHandler.applyBtn()
eventHandler.closeSettingsBtn()