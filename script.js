function generatePuzzle(difficulty = "medium") {
    let board = Array.from({length: 9}, () => Array(9).fill(0));

    function isValid(board, row, col, num) {
        for(let x = 0; x < 9; x++) {
            if(board[row][x] == num || board[x][col] == num) return false;
        }
        let startRow = Math.floor(row / 3) * 3;
        let startCol = Math.floor(col / 3) * 3;
        for(let i = 0; i<3; i++) {
            for(let j = 0; j<3; j++) {
                if(board[i + startRow][j + startCol] == num) return false;
            }
        }
        return true;
    }
    function solve(board, row = 0, col = 0) {
        if (col === 9) {
          row++;
          col = 0;
          if (row === 9) return true;
        }

        if (board[row][col] !== 0) return solve(board, row, col + 1);

        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solve(board, row, col + 1)) {
              return true;
            }
            board[row][col] = 0;
          }
        }
        return false;
      }

    function generateRandomNumber(start, end, blacklist) {
        let num = Math.floor(Math.random() * (end - start + 1)) + start;
        while(blacklist.includes(num)) {
            num = Math.floor(Math.random() * (end - start + 1)) + start;
        }
        return num; 
    }

    function generateRandomBoard(board) {
        let indexBlacklist = Array(3);
        for(let x = 0; x<3; ++x) {
            indexBlacklist[x] = generateRandomNumber(0, 2, indexBlacklist);
        }
        //console.log(indexBlacklist);

        for(let x = 0; x<3; ++x) {
            let nums = Array(9);
            for(let y = 0; y<9; y++) {
                nums[y] = generateRandomNumber(1, 9, nums);
            }
            let k = 0;
            for(let i = x * 3; i<x * 3 + 3; i++) {
                for(let j = indexBlacklist[x] * 3; j<indexBlacklist[x] * 3 + 3; j++) {
                    board[i][j] = nums[k];
                    k++;
                }
            }
        }

        solve(board);
    }

    function hasUniqueSolution(board) {
        let solutions = 0;
    
        function solve(puzzle, row = 0, col = 0) {
            if (col === 9) {
                col = 0;
                row++;
            }
            if (row === 9) {
                solutions++;
                return solutions < 2;  // Stop early if more than one solution is found
            }
            if (puzzle[row][col] !== 0) {
                return solve(puzzle, row, col + 1);
            }
            for (let num = 1; num <= 9; num++) {
                if (isValid(puzzle, row, col, num)) {
                    puzzle[row][col] = num;
                    if (!solve(puzzle, row, col + 1)) {
                        puzzle[row][col] = 0;
                        return false;
                    }
                    puzzle[row][col] = 0;
                }
            }
            return solutions === 1;
        }
    
        solve([...board.map(row => [...row])]);  // Use a copy of the board to solve
        return solutions === 1;
    }

    const difficultyLevels = {
        "easy": 25,  // Example: remove 25 numbers for easy
        "medium": 35,
        "hard": 45,
        "very hard": 55
    };
    function removeNumbersFromGrid(grid, difficulty) {
        let attempts = 5;  // Attempts to ensure a unique solution
        let counter = difficultyLevels[difficulty];  // Number of cells to remove based on difficulty
        while (counter > 0 && attempts > 0) {
            let row = Math.floor(Math.random() * 9);
            let col = Math.floor(Math.random() * 9);
            while (grid[row][col] === 0) {  // Find a filled cell
                row = Math.floor(Math.random() * 9);
                col = Math.floor(Math.random() * 9);
            }
            const backup = grid[row][col];
            grid[row][col] = 0;
    
            const copy = grid.map(row => [...row]);
            if (!hasUniqueSolution(copy)) {
                grid[row][col] = backup;  // Restore the number if removal breaks uniqueness
                attempts--;
            } else {
                counter--;
            }
        }
    }
    
    generateRandomBoard(board);
    removeNumbersFromGrid(board, difficulty);
    generateBoard(board);
}



function test() {
    generatePuzzle();
}


function generateBoard(puzzle = null) {
    const board = document.getElementById("sudoku-board");

    board.innerHTML = "";

    for (let i = 0; i < 9; i++) {
        for(let j = 0; j<9; ++j) {
            const cell = document.createElement("div");
            cell.classList.add("sudoku-cell");
            if(!puzzle || puzzle[i][j] === 0) {
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
        } else {
            cell.textContent = puzzle[i][j];
        }
        cell.dataset.index = i;
        board.appendChild(cell);
    }
  }
}

  function initializeGame() {
    generateBoard();
  }

window.onload = initializeGame;