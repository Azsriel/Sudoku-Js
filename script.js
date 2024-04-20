let solvedBoard; 
let startBoard; 
let currentBoard;
let selectedCell;
let completed;
let board;

function start() {
    solvedBoard = Array.from({ length: 9 }, () => Array(9).fill(0));
    startBoard = Array.from({ length: 9 }, () => Array(9).fill(0));
    currentBoard = Array.from({ length: 9 }, () => Array(9).fill(0))
    selectedCell = -1;
    completed = [];
    board = document.getElementById("sudoku-board");
}
window.onload = start();

function generatePuzzle(difficulty = "medium") {
    let board = Array.from({ length: 9 }, () => Array(9).fill(0));

    function isValid(board, row, col, num) {
        for (let x = 0; x < 9; x++) {
            if (board[row][x] == num || board[x][col] == num) return false;
        }
        let startRow = Math.floor(row / 3) * 3;
        let startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i + startRow][j + startCol] == num) return false;
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
        while (blacklist.includes(num)) {
            num = Math.floor(Math.random() * (end - start + 1)) + start;
        }
        return num;
    }

    function generateRandomBoard(board) {
        let indexBlacklist = Array(3);
        for (let x = 0; x < 3; ++x) {
            indexBlacklist[x] = generateRandomNumber(0, 2, indexBlacklist);
        }
        //console.log(indexBlacklist);

        for (let x = 0; x < 3; ++x) {
            let nums = Array(9);
            for (let y = 0; y < 9; y++) {
                nums[y] = generateRandomNumber(1, 9, nums);
            }
            let k = 0;
            for (let i = x * 3; i < x * 3 + 3; i++) {
                for (let j = indexBlacklist[x] * 3; j < indexBlacklist[x] * 3 + 3; j++) {
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
    solvedBoard = board.map(row => [...row]);
    removeNumbersFromGrid(board, difficulty);
    startBoard = board.map(row => [...row]);
    currentBoard = board.map(row => [...row]);
    generateBoard(board);
}

function highlightSameNumber(num) {
        
    let cells = document.querySelectorAll(".sudoku-cell");
    let occurences = 0;
    cells.forEach(cell => {
        if (cell.textContent == num) {
            if(completed.includes(num)) {
                cell.classList.add("completed");
            } else {
                occurences++;
                cell.classList.add("selected");
            }
        } else {
            cell.classList.remove("selected");
            cell.classList.remove("completed");
            cell.classList.remove("highlighted");
        }
    });
    if(occurences === 9) {
        completed.push(num);
        return true;
    }
    return false;
}
function hightlightSameGroup(row, col) {
    let cells = document.querySelectorAll(".sudoku-cell");
    cells.forEach(cell => {
        let cellRow = parseInt(cell.dataset.index / 9);
        let cellCol = parseInt(cell.dataset.index % 9);
        if ((parseInt(cellRow / 3) === parseInt(row / 3) && parseInt(cellCol / 3) === parseInt(col / 3)) 
        || cellRow === row || cellCol === col) {
            cell.classList.add("highlighted");
        }
    });
}

function selectCell(cellID) {
    if(selectedCell !== -1) {
        let cell = board.children[selectedCell];
        cell.classList.remove("selected");
    }
    let cells = document.querySelectorAll(".sudoku-cell");
    cells.forEach(cell => {
        cell.classList.remove("highlighted");
        cell.classList.remove("selected");
        cell.classList.remove("completed");
    });
    selectedCell = cellID;
    let cell = board.children[selectedCell];
    
    if(cell.textContent !== "") {
        if(highlightSameNumber(cell.textContent)) {
            selectCell(selectedCell);
        }
        hightlightSameGroup(cell.dataset.index / 9, cell.dataset.index % 9);
    }
    cell.classList.remove("highlighted");
    cell.classList.add("selected");
}

function checkWin() {
    for(let i = 0; i<9; ++i) {
        for(let j = 0; j<9; ++j) {
            if(currentBoard[i][j] !== solvedBoard[i][j]) {
                return false;
            }
        }
    }
    return true;
}

function finish() {
    const s = document.getElementById("start-screen");
    s.style.display = "none";
    const d = document.getElementById("difficulty");
    d.style.display = "none";
    const b = document.getElementById("sudoku-board");
    b.style.display = "none";
    const g = document.getElementById("giveup");
    g.style.display = "none";
    const w = document.getElementById("win");
    w.style.display = "flex";
    const a = document.getElementById("again");
    a.style.display = "flex";

}

function generateBoard(puzzle = null) {
    board.innerHTML = "";

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; ++j) {
            const cell = document.createElement("div");
            cell.classList.add("sudoku-cell");
            if (!puzzle || puzzle[i][j] === 0) {
                cell.textContent = "";
            } else {
                cell.textContent = puzzle[i][j];
            }
            cell.dataset.index = i * 9 + j;
            board.appendChild(cell);

            const cells = document.querySelectorAll(".sudoku-cell");
            cells.forEach(cell => {
                cell.addEventListener("click",selectCell.bind(null,cell.dataset.index) );
            });
        }
    }

    document.addEventListener("keydown", function (event) {
        if (selectedCell === -1) return;
        let cell = board.children[selectedCell];
        cell.classList.remove("error");
        let row = parseInt(cell.dataset.index / 9);
        let col = parseInt(cell.dataset.index % 9);
        let num = parseInt(event.key);
        if((event.key === "Backspace" || event.key === "Escape") && solvedBoard[row][col] !== parseInt(cell.textContent)) {
            if(startBoard[row][col] === 0 && currentBoard[row][col] !== 0) {
                currentBoard[row][col] = 0;
                cell.textContent = "";
            }
        }
        if (isNaN(num) || num < 1 || num > 9) return;
        if(cell.textContent !== "" && solvedBoard[row][col] === parseInt(cell.textContent)) {
            highlightSameNumber(num);
            return;
        }

        if (startBoard[row][col] === 0) {
            currentBoard[row][col] = num;
            cell.textContent = num;
            selectCell(selectedCell);

            if(solvedBoard[row][col] !== num) {
                cell.classList.remove("selected");
                cell.classList.remove("completed");
                cell.classList.add("error");
            }

        }
        if(checkWin()) {
            finish();   
        }
    });
}



function initializeGame(difficulty) {
    const d = document.getElementById("difficulty");
    d.style.display = "none";
    generatePuzzle(difficulty);
    const b = document.getElementById("giveup");
    b.style.display = "flex";
}

var instructionStatus = 1;
function openInstructions() {
    const i = document.getElementById("instructions");
    if (instructionStatus === 1) {
        i.style.display = "block";
        console.log(instructionStatus)
        instructionStatus = 0;
    } else {
        i.style.display = "none";
        instructionStatus = 1;
    }
}

function startGame() {
    start();
    const w = document.getElementById("win");
    w.style.display = "none";
    const s = document.getElementById("start-screen");
    s.style.display = "none";
    const d = document.getElementById("difficulty");
    d.style.display = "flex";
}

function giveUp() {
    generateBoard(solvedBoard); 

    const g = document.getElementById("again");
    g.style.display = "flex";
}

function reload() {
    location.reload();
}