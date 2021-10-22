
//educated guess
function heuristic(a, b) {
  //let d = dist(a.i, a.j, b.i, b.j);
  let d = abs(a.i-b.i) + abs(a.j-b.j)
  return d;
}

let cols = 25;
let rows = 25;
let grid = [];

let openSet = [];
let closedSet = [];
let start;
let end;
let w, h;
let path = [];

function Spot(i,j) {
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.previous = undefined;

  this.show = function(col) {
    fill(col);
    noStroke;
    rect(this.i * w, this.j * h, w - 1, h - 1);
  }

  this.addNeighbors = function(grid) {

    if(this.i < cols - 1){
    this.neighbors.push(grid[this.i+1] [this.j])
    }
    if(this.i > 0){
    this.neighbors.push(grid[this.i-1] [this.j])
    }
    if(j < rows - 1){
    this.neighbors.push(grid[this.i] [this.j+1])
    }
    if(j > 0){
    this.neighbors.push(grid[this.i] [this.j-1])
    }
  }
}

function setup() {
  createCanvas(400, 400);
  
  w = width / cols;
  h = height / rows;

  for (let i = 0; i < cols; i++) {
    grid[i] = [rows]
  }

  for(let i = 0; i < cols; i++){
    for(let j = 0; j < rows; j++){
      grid[i][j] = new Spot(i,j);
    }
  }

  for(let i = 0; i < cols; i++){
    for(let j = 0; j < rows; j++){
      grid[i][j].addNeighbors(grid);
    }
  }

  start = grid[0][0];
  end = grid[cols-1][rows-1];

  openSet.push(start);

  console.log(grid)

}

function draw() {

  if(openSet.length > 0) {
    
    let lowestIndex = 0;
    for(let i = 0; i < openSet.length; i++){
      if(openSet[i] < openSet[lowestIndex].f) {
        lowestIndex = i;
      }
    }

    current = openSet[lowestIndex];

    if(current === end) {
      noLoop();
      console.log("Done")
    }

    openSet.splice(lowestIndex, 1)
    closedSet.push(current);

    let neighbors = current.neighbors;
    for(let i = 0; i < neighbors.length; i++){
      let neighbor = neighbors[i];

        if(!closedSet.includes(neighbor)){
          let tempG = current.g + 1;

          if(openSet.includes(neighbor)){
            if(tempG < neighbor.g) {
              neighbor.g = tempG;
            }
          }else {
            neighbor.g = tempG;
            openSet.push(neighbor);
          }
          
          neighbor.h = heuristic(neighbor, end);    
          neighbor.f = neighbor.g + neighbor.h
          neighbor.previous = current;

        }

    }

  } else {

  }

  background(0);

  for(let i = 0; i < cols; i++) {
    for(let j = 0; j < rows; j++){
      grid[i][j].show(color(255));
    }
  }

  for(let i = 0; i < closedSet.length; i++){
    closedSet[i].show(color(255,0,0));
  }

  for(let i = 0; i < openSet.length; i++){
    openSet[i].show(color(0,255,0))
  }

  for (let i = 0; i < path.length; i++) {
    path[i].show(color(0,0,255));
  }

  path = [];
  let temp = current;
  path.push(temp);
  while(temp.previous){
    path.push(temp.previous);
    temp = temp.previous;
  }

}
