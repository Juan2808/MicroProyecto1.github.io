
let players = []; // Array para almacenar los nombres de los jugadores
let currentPlayerIndex = 0; // Indice dde jugador
let boardSize = 0; // Tamaño del carton de bingo
let drawnNumbers = []; // Array para almacenar los numeros ya sacados
let gameOver = false; // Variable para terminar el juego
let turns = 0; // Contador de turnos

//Funcion para iniciar el juego
function startGame() {
  const playerNamesInputs = document.querySelectorAll('[id^="player-name-"]');
  const boardSizeSelect = document.getElementById('board-size');

  //Obtener nombres de jugadores
  players = Array.from(playerNamesInputs).map(input => input.value.trim());

  //Verificar si se han ingresado nombres de jugadores
  if (players.some(player => player === '')) {
    document.getElementById('error-message').style.display = 'block';
    alert('Por favor ingresa los nombres de los cuatro jugadores.');
    return; 
  }
  document.getElementById('error-message').style.display = 'none';

  //tamaño del carton
  boardSize = parseInt(boardSizeSelect.value);

  //Inicializar las variables del juego
  currentPlayerIndex = 0;
  drawnNumbers = [];
  gameOver = false;
  turns = 0;

  //mostrar juego
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('bingo-game').style.display = 'block';

  //Mostrar informacion del primer jugador
  updatePlayerInfo();
  //Generar carton de bingo para cada jugador
  generateBoards();
}


// Funcion para generar un numero aleatorio entre 1 y 50
function generateRandomNumber() {
  return Math.floor(Math.random() * 50) + 1;
}

function generateBoardForPlayer(playerIndex) {
    const boardContainer = document.createElement('div');
    boardContainer.classList.add('board');
  
    // Conjunto para almacenar los numeros generados
    const numbersSet = new Set();
  
    // Generar casillas del carton
    for (let i = 0; i < boardSize; i++) {
      const row = document.createElement('div');
      
      for (let j = 0; j < boardSize; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
  
        // Generar numero unico y asegurarse de que no se repita
        let randomNumber;
        do {
          randomNumber = generateRandomNumber();
        } while (numbersSet.has(randomNumber));
  
        // Agregar numero generado al conjunto
        numbersSet.add(randomNumber);
  
        cell.textContent = randomNumber;
        row.appendChild(cell);
      }
      boardContainer.appendChild(row);
    }
  
    // Agregar el carton generado al contenedor del jugador correspondiente
    const boardsContainer = document.getElementById('boards');
    boardsContainer.appendChild(boardContainer);
  
    // Agregar el nombre del jugador debajo de su tablero
    const playerName = players[playerIndex];
    const playerNameElement = document.createElement('div');
    playerNameElement.classList.add('player-name');
    playerNameElement.textContent = playerName;
    boardContainer.appendChild(playerNameElement);
  }
  

// Funcion para generar los cartones de bingo para cada jugador
function generateBoards() {
  for (let i = 0; i < players.length; i++) {
    generateBoardForPlayer(i);
  }
}

// Funcion para actualizar la informacion del jugador actual
function updatePlayerInfo() {
  document.getElementById('player-info').textContent = `Turno de ${players[currentPlayerIndex]}`;
}

// Funcion para sacar un número de bingo
function drawNumber() {
  if (!gameOver) {
    // Generar numero aleatorio y contar 1 
    turns ++; 
    let number;
    do {
      number = generateRandomNumber();
    } while (drawnNumbers.includes(number)); // Validar que el numero no haya sido sacado antes
    drawnNumbers.push(number);

    // Mostrar numero en pantalla y contar el turno
    document.getElementById('drawn-number').textContent = `Número sacado: ${number}`;

    document.getElementById('contador').textContent = `Turno: ${turns}`;

    // Actualizar carton del jugador actual
    updateBoard(number);

    // Verificar si gano alguien
    checkWin();

    // Pasar al siguiente jugador o finalizar el juego
    nextTurn();
  }
}

// Función para actualizar el carton del jugador actual
function updateBoard(number) {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    if (cell.textContent == number) {
      cell.classList.add('marked'); // Marcar la casilla si coincide con el numero sacado
    }
  });
}

// Funcion para verificar si el jugador actual ha ganado
function checkWin() {
  const currentPlayerBoard = document.querySelectorAll('.board')[currentPlayerIndex];
  const markedCells = currentPlayerBoard.querySelectorAll('.marked');

  if (markedCells.length === boardSize * boardSize) {
      // Si todas las celdas del tablero están marcadas, el jugador ha completado el tablero
      const playerName = players[currentPlayerIndex];
      const playerScore = localStorage.getItem(playerName) || 0;
      localStorage.setItem(playerName, parseInt(playerScore) + 5);
      // Finalizar el juego
      endGame();
  }
}

// Funcion para pasar al siguiente turno
function nextTurn() {

  if (turns >= 25 || gameOver) {
    endGame();
  } else {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    updatePlayerInfo();
  }
}

function endGame() {

    // borrar los tableros anteriores
    const boardsContainer = document.getElementById('boards');
    boardsContainer.innerHTML = '';
  
    // Mostrar victorias acumuladas
    const scoreBoard = document.getElementById('scoreboard');
    scoreBoard.innerHTML = 'Victorias por carton lleno: ';
    for (let i = 0; i < players.length; i++) {
      const playerScore = localStorage.getItem(players[i]) || 0;
      localStorage.setItem(players[i], parseInt(playerScore));
      scoreBoard.innerHTML += `<p>${players[i]}: ${playerScore}</p>`;
    }
  
    // Mostrar menu principal otra vez
    document.getElementById('main-menu').style.display = 'block';
    document.getElementById('bingo-game').style.display = 'none';

    //reiniciar variables 
    players = [];
    currentPlayerIndex = 0;
    boardSize = 0;
    drawnNumbers = [];
    gameOver = false;
    turns = 0;
  }

  