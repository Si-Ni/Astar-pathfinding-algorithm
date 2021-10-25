/*function removeFromArray (arr, elt) {
  for (let i = arr.length - 1; i >=0; i--){
    if(arr[i] == elt) {
      arr.splice(i, 1)
    }
  }
}*/

//educated guess
function heuristic(a, b) {
  let d = dist(a.i, a.j, b.i, b.j);
  //let d = abs(a.i-b.i) + abs(a.j-b.j)
  return d;
}

let cols = 50;
let rows = 50;
let grid = [];

let openSet = [];
let closedSet = [];
let start;
let end;
let w, h;
let path = [];
let diagonal = false;

function Spot(i,j) {
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.neighborsDiagonal = [];
  this.previous = undefined;
  this.wall = false;

  if (random(1) < 0.3) {
    this.wall = true;
  }

  this.show = function(col) {
    fill(col);
    if(this.wall) {
      fill(0);
    }
    noStroke;
    rect(this.i * w, this.j * h, w - 1, h - 1);
  }

  this.addNeighbors = function(grid) {

    let i = this.i;
    let j = this.j;

    if(i < cols - 1){
    this.neighbors.push(grid[i+1] [j]);
    }
    if(i > 0){
    this.neighbors.push(grid[i-1] [j]);
    }
    if(j < rows - 1){
    this.neighbors.push(grid[i] [j+1]);
    }
    if(j > 0){
    this.neighbors.push(grid[i] [j-1]);
    }
    if(i > 0 && j > 0){
      this.neighbors.push(grid[i-1] [j-1]);
      this.neighborsDiagonal.push(grid[i-1] [j-1]);
    }
    if(i < cols-1 && j > 0){
      this.neighbors.push(grid[i+1] [j-1]);
      this.neighborsDiagonal.push(grid[i+1] [j-1]);
    }
    if(i > 0 && j > rows-1){
      this.neighbors.push(grid[i-1] [j+1]);
      this.neighborsDiagonal.push(grid[i-1] [j+1]);
    }
    if(i < cols-1 && j < rows-1){
      this.neighbors.push(grid[i+1] [j+1]);
      this.neighborsDiagonal.push(grid[i+1] [j+1]);
    }
    
  }
}

function setup() {
  createCanvas(800, 800);
  
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
  start.wall = false;
  end.wall = false;

  openSet.push(start);

  console.log(grid)

}

function draw() {

  if(openSet.length > 0) {
    
    let lowestIndex = 0;
    for(let i = 0; i < openSet.length; i++){
      if(openSet[i].f < openSet[lowestIndex].f) {
        lowestIndex = i;
      }
    }

    current = openSet[lowestIndex];

    if(current === end) {
      noLoop();
      console.log("Done")
    }

    
    path = [];
    let temp = current;
    path.push(temp);
    while(temp.previous){
      path.push(temp.previous);
      temp = temp.previous;
    }

    //removeFromArray(openSet, current);
    openSet.splice(lowestIndex, 1)
    console.log(openSet)
    closedSet.push(current);

    let neighbors = current.neighbors;
    for(let i = 0; i < neighbors.length; i++){
      let neighbor = neighbors[i];

        if(!closedSet.includes(neighbor) && !neighbor.wall){
          let tempG;
          if(current.neighborsDiagonal.includes(neighbor)) {
            tempG = current.g + 1.41;
            console.log("diagonal")
          }else {
            tempG = current.g + 1;
            console.log("not");
          }

          let newPath = false;
          if(openSet.includes(neighbor)){
            if(tempG < neighbor.g) {
              neighbor.g = tempG;
              newPath = true;
            }
          }else {
            neighbor.g = tempG;
            newPath = true;
            openSet.push(neighbor);
          }
          
          if(newPath) {
            neighbor.h = heuristic(neighbor, end);    
            neighbor.f = neighbor.g + neighbor.h
            neighbor.previous = current;
          }
        }

    }

  } else {
    console.log("no solution");
    noLoop();
    return;
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

  noFill();
  beginShape();
  for(var i = 0; i < path.length; i++) {
    vertex(path[i].i * w + w/2, path[i].j * h + h/2)
  }
  endShape();
}
