function iniciarPartida() {
    let numFiles = parseInt(prompt("Introdueix el nombre de files (entre 10 i 30)"));
    let numColum = parseInt(prompt("Introdueix el nombre de columnes (entre 10 i 30)"));

    // Remove the content of the 'taulell' element
    document.getElementById("taulell").innerHTML = "";

    let files;
    let colum;

    if (numFiles < 10) {
        files = 10;
    } else if (numFiles > 30) {
        files = 30;
    } else {
        files = numFiles;
    }

    if (numColum < 10) {
        colum = 10;
    } else if (numColum > 30) {
        colum = 30;
    } else {
        colum = numColum;
    }

    // Append the new table to the 'taulell' element
    document.getElementById("taulell").appendChild(crearTaulell(files, colum));
}

// Declare mines outside of the crearTaula function
var mines;

function crearTaulell(files, colum) {
    // Function to create the game board
    function crearTaula() {
        var taula = document.createElement('table');
        // Generate mines when the game board is created
        mines = generarMines();

        for (var i = 0; i < files; i++) {
            var fila = document.createElement('tr');

            for (var j = 0; j < colum; j++) {
                var cella = document.createElement('td');
                var button = document.createElement('button');

                // Assignem les coordenades com atributs de dades
                button.dataset.x = i;
                button.dataset.y = j;

                button.style.backgroundImage = "url('fons20px.jpg')";
                button.style.zIndex=6;
                button.style.backgroundSize = "cover";
                button.style.width = "20px";
                button.style.height = "20px";

                var cellId = 'cell_' + i + '_' + j;
                cella.id = cellId;
                
                button.onclick = function () {
                    this.disabled = true;
                    var x = this.dataset.x;
                    var y = this.dataset.y;
                    let con = 'cell_' + x + '_' + y;
                    // for (let n = 0; n < mines.length; n++) {
                    //     // Change the background image for all mines
                    //     document.getElementById('cell_' + mines[n].x + '_' + mines[n].y).innerHTML = "";
                    //     document.getElementById('cell_' + mines[n].x + '_' + mines[n].y).style.backgroundImage = "url('mina20px.jpg')";
                    // }
                    if (esMina(x, y)) {
                        alert('Que has perdut.');
                        let buttons = document.getElementById('taulell').querySelectorAll('button');
                        buttons.forEach(function(button) {
                            button.disabled = true;
                        });
                        for (let n = 0; n < mines.length; n++) {
                            // Change the background image for all mines
                            document.getElementById('cell_' + mines[n].x + '_' + mines[n].y).innerHTML = "";
                            document.getElementById('cell_' + mines[n].x + '_' + mines[n].y).style.backgroundImage = "url('mina20px.jpg')";
                        }
                       
                    } else {
                        const minesAdjacents = contarMinesAdjacents(x, y, mines);
                        if(minesAdjacents==0){
                            revealEmptycosta(x, y, mines);
                        }
                        document.getElementById(con).textContent = minesAdjacents;
                        
                    }
                    
                }

                cella.appendChild(button);
                fila.appendChild(cella);
            }

            taula.appendChild(fila);
        }

        return taula;
    }

    // Function to determine if a cell contains a mine
    function esMina(x, y) {
        for (var i = 0; i < mines.length; i++) {
            if (mines[i].x == x && mines[i].y == y) {
                // Change the background image for the button with a mine
                //document.getElementById('cell_' + x + '_' + y).style.backgroundImage = "url('mina20px.jpg')";
                return true;
            }
        }
        return false;
    }

    // Function to generate mines randomly
    function generarMines() {
        var mines = [];
        var total = files * colum;
        var quantitatMines = parseInt((total / 100) * 17);

        for (var n = 0; n < quantitatMines; n++) {
            var x = Math.floor(Math.random() * files);
            var y = Math.floor(Math.random() * colum);
            mines.push({ x: x, y: y });
        }
        console.log(mines);
        return mines;
    }

    // Function to count adjacent mines
    function contarMinesAdjacents(x, y, mines) {
        let count = 0;
        // x-1,y
        // x-1,y-1
        // x-1,y+1
        // x,y-1
        // x,y+1
        // x+1,y
        // x+1,y-1
        // x+1,y+1
        if (esMina(x-1,y, mines)) {
            count++;
        }
        if (esMina(x-1,y-1, mines)) {
            count++;
        }
        if (esMina(x-1,y+1, mines)) {
            count++;
        }
        if (esMina(x,y-1, mines)) {
            count++;
        }
        if (esMina(x,y+1, mines)) {
            count++;
        }
        if (esMina(x+1,y, mines)) {
            count++;
        }
        if (esMina(x+1,y-1, mines)) {
            count++;
        }
        if (esMina(x+1,y+1, mines)) {
            count++;
        }

        return count;
    }

    function revealEmptycosta(x, y, mines) {
        const cellId = 'cell_' + x + '_' + y;
        const cell = document.getElementById(cellId);
        const minesAdjacents = contarMinesAdjacents(x, y, mines);
    
        cell.textContent = minesAdjacents;
        
        if (minesAdjacents === 0) {
            for (let i = x - 1; i <= x + 1; i++) {
                for (let j = y - 1; j <= y + 1; j++) {
                    if (i >= 0 && i < files && j >= 0 && j < colum) {
                        const adjacentCellId = 'cell_' + i + '_' + j;
                        const adjacentCell = document.getElementById(adjacentCellId);
    
                        if (!isNaN(adjacentCell.textContent)) {
                            revealEmptycosta(i, j, mines);
                        } else if (parseInt(adjacentCell.textContent) !== 0 || esMina(i,j)) {
                            break; // Stop recursion if adjacent cell's minesAdjacents is not 0
                        }
                    }
                }
            }
        }
    }
    
    


    return crearTaula();
}

