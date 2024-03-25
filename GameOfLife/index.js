let unitSlider = document.querySelector("#gridSizeSlider");
let unitLength = document.querySelector("#gridSizeSlider").value;
console.log(document.querySelector("#gridSizeSlider").value);


let colorPicker;
let boxColor = document.querySelector("#colorPicker").value;
let backgroundColor;
let strokeColor = document.querySelector("#colorPicker2").value;
let canvasColor = document.querySelector("#colorPicker3").value;


let lonelySlider= document.querySelector("#loneliness");
let lonelyValue = document.querySelector("#loneliness").value

let columns; /* To be determined by window width */
let rows; /* To be determined by window height */
let currentBoard;
let nextBoard;
let fpsSlider = document.querySelector("#fpsSlider");
let fpsValue = document.querySelector("#fpsSlider").value;
let start = false;
let sliderControls;
let mouseCurrentX = undefined;
let mouseCurrentY = undefined;
let mousePrevX = undefined;
let mousePrevY = undefined;


//pattern
let gosperGliderGun = [
  `........................O
  ......................O.O
  ............OO......OO............OO
  ...........O...O....OO............OO
  OO........O.....O...OO
  OO........O...O.OO....O.O
  ..........O.....O.......O
  ...........O...O
  ............OO`
];

function initGosperGliderGun() {


let rows = gosperGliderGun.split("\n");
let pattern = [];
for (let i = 0; i < rows.length; i++) {
  let row = rows[i].trim();
  pattern.push(row.split(""));
}

for (let i = 0; i < columns; i++) {
  currentBoard[i] = [];
  nextBoard[i] = [];
  for (let j = 0; j < rows[0].length; j++) {
    if (i < pattern.length && j < pattern[i].length) {
      currentBoard[i][j] = pattern[i][j] === "O" ? 1 : 0;
      nextBoard[i][j] = 0;
    } else {
      currentBoard[i][j] = 0;
      nextBoard[i][j] = 0;
    }
  }
}
}


//resizing Window
function windowResized() {
  setup();
  draw();
}

// Small spaceships flying when selecting dropdown box
function init3() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = 0;
      nextBoard[i][j] = 0;
    }
  }
  currentBoard[0][3] = 1;
  currentBoard[1][3] = 1;
  currentBoard[2][3] = 1;
  currentBoard[2][2] = 1;
  currentBoard[1][1] = 1;
}
//Initialize blank game mode
function init() {
  
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = 0;
      nextBoard[i][j] = 0;

    
          if (currentBoard[i][j] == 0) {
            fill(boxColor);
          } else {
            fill(canvasColor);
          }
          stroke(strokeColor);
          rect(i * unitLength, j * unitLength, unitLength, unitLength);
      
    }
  }
}
//Randomize board after selecting "random" button
function init2() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = random() > 0.85 ? 1 : 0;
      nextBoard[i][j] = 0;
      
    }
  }

  
}

function setup() {


  /* Set the canvas to be under the element #canvas*/
  const canvas = createCanvas(windowWidth - 500, windowHeight - 500);
  canvas.parent(document.querySelector("#canvas"));

  /*Calculate the number of columns and rows */
  columns = floor(width / unitLength);
  rows = floor(height / unitLength);

if (windowWidth > windowHeight) {
  unitLength= (windowHeight- 30) / 30
} else {
  unitLength = (windowWidth-30) / 30
}

  /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
  currentBoard = [];
  nextBoard = [];
  for (let i = 0; i < columns; i++) {
    currentBoard[i] = [];
    nextBoard[i] = [];
  }
  // Now both currentBoard and nextBoard are array of array of undefined values.
  init();// Set the initial values of the currentBoard and nextBoard
  noLoop(); 
}

function draw() {

  //Change Number of Grids on canvas via Slider
  unitSlider.addEventListener("input", (e) => {
    const tempUnitSliderValue = e.target.value;
    unitLength.textContent = tempUnitSliderValue;
    const progress = (tempUnitSliderValue / unitLength, max) * 100;
    console.log(tempUnitSliderValue);
    unitLength = tempUnitSliderValue;
  });


// Change FrameRate via Slider
document.querySelector("#fpsSlider").addEventListener("change", (e) => {
  let value = parseInt(e.target.value);
  frameRate(value);
  console.log(value)
});


  background(255);
  generate();

  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (currentBoard[i][j] == 1) {
        fill(boxColor);
      } else {
        fill(canvasColor);
      }
      stroke(strokeColor);
      rect(i * unitLength, j * unitLength, unitLength, unitLength);
    }
  }

//Select the colorPicker Color 
document.querySelector("#colorPicker").addEventListener("change", (e) => {
  boxColor = e.target.value;
    });

//Select the colorPicker2 (Grid Color)
document.querySelector("#colorPicker2").addEventListener("change", (e) => {
  strokeColor = e.target.value;

  });


//Select the colorPicker3 (Canvas Color)
document.querySelector("#colorPicker3").addEventListener("change", (e) => {
  canvasColor = e.target.value;
    console.log(canvasColor)
  });


}

function generate() {
  //Loop over every single box on the board
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      // Count all living members in the Moore neighborhood(8 boxes surrounding)
      let neighbors = 0;
      for (let i of [-1, 0, 1]) {
        for (let j of [-1, 0, 1]) {
          if (i == 0 && j == 0) {
            // the cell itself is not its own neighbor
            continue;
          }
          // The modulo operator is crucial for wrapping on the edge
          neighbors +=
            currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
        }
      }

      // Rules of Life
      if (
        currentBoard[x][y] == 1 &&
        neighbors < document.querySelector("#loneliness").value
      ) {
        // Die of Loneliness
        nextBoard[x][y] = 0;
      } else if (
        currentBoard[x][y] == 1 &&
        neighbors > document.querySelector("#overpopulation").value
      ) {
        // Die of Overpopulation
        nextBoard[x][y] = 0;
      } else if (
        currentBoard[x][y] == 0 &&
        neighbors == document.querySelector("#reproduction").value
      ) {
        // New life due to Reproduction
        nextBoard[x][y] = 1;
      } else {
        // Stasis
        nextBoard[x][y] = currentBoard[x][y];
      }
    }
  }

  // Swap the nextBoard to be the current Board
  [currentBoard, nextBoard] = [nextBoard, currentBoard];
}

function mouseMoved() {
  if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
    return;
  }


  if (mouseCurrentX != undefined && mouseCurrentY != undefined) {
  mousePrevX = mouseCurrentX
  mousePrevY = mouseCurrentY

  if(currentBoard[mousePrevX][mousePrevY]){

  fill(boxColor);

  }else {

  fill(255)


  }
  stroke(strokeColor)
  rect(mousePrevX * unitLength, mousePrevY * unitLength, unitLength, unitLength);
}
  const x = Math.floor(mouseX / unitLength);
  const y = Math.floor(mouseY / unitLength);
  

  

  fill('blue');
  stroke(strokeColor);
  rect(x * unitLength, y * unitLength, unitLength, unitLength);

  mouseCurrentX = x
  mouseCurrentY = y

}



function mouseDragged() {
  /**
   * If the mouse coordinate is outside the board
   */
  if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
    return;
  }
  const x = Math.floor(mouseX / unitLength);
  const y = Math.floor(mouseY / unitLength);
  currentBoard[x][y] = 1;
  fill(boxColor);
  stroke(strokeColor);
  rect(x * unitLength, y * unitLength, unitLength, unitLength);
}

/**
 * When mouse is pressed
 */
function mousePressed() {
  noLoop();
  mouseDragged();
}

/**
 * When mouse is released
 */
function mouseReleased() {
  if (start) {
    loop();
} else {
    noLoop();
}
}

///Reset Game

document.querySelector(".restart").addEventListener("click", (e) => {
  init();
})

///##Random Button###///
document.querySelector("#random").addEventListener("click", (e) => {
  init2();
});

///###Start Animation##///
document.querySelector("#start").addEventListener("click", (e) => {
  
  if (start) {
    
    noLoop()
  start = true;
e.currentTarget.textContent="Start"}
else { 
  loop()
  start = true
};
});

//###stop animation###///
document.querySelector("#stop").addEventListener("click", (e) => {
  if (stop) {
    
    noLoop()
  stop = !false;
e.currentTarget.textContent="Pause"}
else { 
  loop()
  stop = true
};
});

function changeColor() {  
  boxColor = color(
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255)
  );
  strokeColor = color(
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255)
  );

  canvasColor = color(   
  Math.floor(Math.random() * 255),
  Math.floor(Math.random() * 255),
  Math.floor(Math.random() * 255)
);
  };

let changeColorButton = document.querySelector("#color-button");
changeColorButton.addEventListener("click", () => {
 changeColor() = e.target.value
});


// Time stamp on footBar 
let now = new Date();
let dateTime = now.toLocaleTimeString({ hour: 'numeric', minute: 'numeric' });
document.querySelector(".timeDate").innerHTML = dateTime

document.querySelector("#patterSelector select").addEventListener("click", (e) => {
  init3()
} 
)

