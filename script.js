function generateBoard() {
    const board = document.getElementById("sudoku-board");

    board.innerHTML = "";

    for (let i = 0; i < 81; i++) {
      const cell = document.createElement("div");
      cell.classList.add("sudoku-cell");
      const input = document.createElement("input");
        input.type = "text";
        input.classList.add("sudoku-input");
        input.inputmode = "numeric";
        input.pattern = "[1-9]";
        input.maxLength = 1;
        input.addEventListener("input", function(event) {
          const input = event.target;
          const inputValue = input.value.trim();
          const isValidInput = /^\d*$/.test(inputValue) && inputValue.length <= 1;
          if (!isValidInput) {
            input.value = "";
          }
        });
        cell.appendChild(input);
      cell.dataset.index = i;
      board.appendChild(cell);
    }
  }

  function initializeGame() {
    generateBoard();
  }

window.onload = initializeGame;