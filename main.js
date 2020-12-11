const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const scoreCounter = document.querySelector('p');

const width = canvas.width = 800;
const height = canvas.height = 800;

var startx; //to check on mouse move
var starty;
var selectedpiecex = -1, selectedpiecey = -1,selectedpiececolor = "";

var currentplayer = "white";

let tile_size = 100;
let tile_color = 'rgba(255,255,255,0.5)'; //white
let white = 'rgba(255,255,255,0.5)', black = 'rgba(0,0,0,0.5)';
function setup(){
  ctx.fillStyle = 'rgba(255,255,255, 0.25)';
  ctx.fillRect(0, 0, width, height);
}

function draw(){
  ctx.clearRect(0,0,width,height);
  showGrid();
  cb.show_board();
}

function showGrid(){
  for(var i = 0; i < 8; i++){
    for(var j = 0; j < 8; j++){
      if((i+j)%2 == 0) //white
      ctx.fillStyle = white;
      else ctx.fillStyle = black;
      ctx.fillRect(i*tile_size,j*tile_size,tile_size,tile_size);
    }
  }
}

function ispiececlicked(x,y,piece){
  /**
   * check that if the piece is within the same location as the click.
   * 
   */
  //console.log("x is" + piece.x*tile_size);
  //console.log("y is" + piece.y*tile_size);
  //console.log("width is" + piece.width);
  //console.log("heght is" + piece.height);
  return(x >= piece.drawnx && x <= piece.drawnx + tile_size && y <= piece.drawny + tile_size && y >= piece.drawny);
}

function getpiececlicked(event){
  console.log("get piece");
  event.preventDefault();
  startx = event.clientX;
  starty = event.clientY; 
  console.log(event.clientX + "," + event.clientY);
  for(var j = 0; j < cb.board.length; j++){
    for(var i = 0; i < cb.board[j].length; i++){
      //console.log(cb.board[j][i].name);
      if(ispiececlicked(startx,starty,cb.board[j][i])){
        console.log("clicked piece: " + cb.board[j][i].name);
        if(cb.board[j][i].colour != currentplayer) return;
        selectedpiecex = i;
        selectedpiecey = j;
        selectedpiececolor = cb.board[j][i].colour;
      }
    }
  }

}

function movepiece(event){
  if(selectedpiecey< 0 || selectedpiececolor != currentplayer){
    return;
  }
  event.preventDefault();
  console.log("move piece");
  var dx = event.clientX - startx;
  var dy = event.clientY - starty;
  starty = event.clientY;
  startx = event.clientX;
  cb.board[selectedpiecey][selectedpiecex].drawnx += dx;
  cb.board[selectedpiecey][selectedpiecex].drawny += dy;
  draw();
  
}

function releasepiece(event){ //for mouse up
  event.preventDefault();
  console.log("release piece");
  /**
   * lock the piece into the grid location. update cb.board and cb.white and/or black
   * ensure that there isn't it's own piece there, nor it is jumping over obstacles, except knight
   */
  
  //check if there is a piece in the same location as where it will be released. if it is the same colour, return to its original location.
  //otherwise, continue
  let finalx = Math.floor(event.clientX/tile_size);
  let finaly = Math.floor(event.clientY/tile_size);
  let anotherpiece = false;
  if(typeof cb.board[finaly][finalx] != "number"){
    //another piece is at the location.
    console.log("piece here");
    anotherpiece = true;
    if(cb.board[finaly][finalx].colour == cb.board[selectedpiecey][selectedpiecex].colour){
      //same colour, call return piece and exit
      console.log("another same colour piece at location. return.")
      returnpiecetoOriginal(event);
      return;
    } 
  }
  /**
   * for all pieces, check if their moves are legit.
   * After that, check if there are other pieces blocking their movement (except knight because it can jump over, and king as it can only move one space anyway).
   */

  let jdiff = (finaly - selectedpiecey)/Math.abs(selectedpiecey - finaly);
  let idiff = (finalx - selectedpiecex)/Math.abs(selectedpiecex - finalx);
  let successfulenpassant = false;
  if (isNaN(idiff)) idiff = 0;
  if (isNaN(jdiff)) jdiff = 0;
  if(cb.board[selectedpiecey][selectedpiecex] instanceof pawn){
    console.log("checking pawn move legit");
    if(cb.board[selectedpiecey][selectedpiecex].forwardmove(finalx,finaly) && !anotherpiece){ //forward movement
      console.log("can move forward.");
    }
    else if(cb.board[selectedpiecey][selectedpiecex].diagonalmove(finalx,finaly) && anotherpiece){ //diagonal capture
      console.log("can capture diagnonal");
    }
    else if(cb.board[selectedpiecey][selectedpiecex].checkenpassant(finalx,finaly,cb.whiteenpassant) || cb.board[selectedpiecey][selectedpiecex].checkenpassant(finalx,finaly,cb.blackenpassant)){//en passant
      console.log("en passant");
      successfulenpassant = true;
      console.log(successfulenpassant);
    }
    else{
      console.log("pawn movement not allowed. return");
      returnpiecetoOriginal(event);
      return;
    }
  }
  else if(cb.board[selectedpiecey][selectedpiecex].move(finalx,finaly)){
    if((Math.abs(selectedpiecey - finaly) > 1 || Math.abs(selectedpiecex - finalx) > 1)){
      console.log("move legit");
      console.log(idiff + "," + jdiff);
      let checky = selectedpiecey + jdiff, checkx = selectedpiecex + idiff;
      if(!(cb.board[selectedpiecey][selectedpiecex] instanceof king || cb.board[selectedpiecey][selectedpiecex] instanceof knight)){
        while(checky != finaly || checkx != finalx){
          console.log(checkx + "," + checky);
          if(typeof cb.board[checky][checkx] != "number"){
            //there is a piece blocking. return to original location.
            console.log("other pieces blocking you. return.");
            returnpiecetoOriginal(event);
            return;
          }
          checky+= jdiff;
          checkx+= idiff;
        }
      }
    }
  }
  else{
    console.log("move not valid. return.");
    returnpiecetoOriginal(event);
    return;
  }

  cb.board[selectedpiecey][selectedpiecex].drawnx = finalx * tile_size; 
  cb.board[selectedpiecey][selectedpiecex].drawny = finaly * tile_size; 
  if(selectedpiececolor == "white"){
    delete cb.white[cb.board[selectedpiecey][selectedpiecex].get_pos()];
  }
  else if (selectedpiececolor == "black"){
    delete cb.black[cb.board[selectedpiecey][selectedpiecex].get_pos()];
  }
  console.log("setting piece new position and capturing piece at location, except for rook, because rooks are weird.")
  cb.board[selectedpiecey][selectedpiecex].x = cb.board[selectedpiecey][selectedpiecex].drawnx/100;
  cb.board[selectedpiecey][selectedpiecex].y = cb.board[selectedpiecey][selectedpiecex].drawny/100;

  if(selectedpiececolor == "white"){
    if (successfulenpassant){
      delete cb.black[cb.blackenpassant.get_pos()];
      cb.board[cb.blackenpassant.y][cb.blackenpassant.x] = 0;
      console.log("deleted black pawn");
    }
    else if(anotherpiece) delete cb.black[cb.board[finaly][finalx].get_pos()];
    cb.white[cb.board[selectedpiecey][selectedpiecex].get_pos()] = cb.board[selectedpiecey][selectedpiecex];
  }
  else if (selectedpiececolor == "black"){
    if (successfulenpassant){
      delete cb.white[cb.whiteenpassant.get_pos()];
      cb.board[cb.whiteenpassant.y][cb.whiteenpassant.x] = 0;
      console.log("deleted white pawn");
    }
    if(anotherpiece) delete cb.white[cb.board[finaly][finalx].get_pos()];
    cb.black[cb.board[selectedpiecey][selectedpiecex].get_pos()] = cb.board[selectedpiecey][selectedpiecex];
  }
  cb.board[finaly][finalx] = cb.board[selectedpiecey][selectedpiecex];
  cb.board[selectedpiecey][selectedpiecex] = 0;
  //console.log(cb.board[selectedpiecey][selectedpiecex].get_pos());

  selectedpiecey = -1;
  selectedpiecex = -1;
  selectedpiececolor = "";
  /*
  if(currentplayer == "white"){
    currentplayer = "black";
    cb.blackenpassant = "";
  }
  else{
    currentplayer = "white";
    cb.whiteenpassant = "";
  }*/
  cb.blackenpassant = "";
  cb.whiteenpassant = "";
  draw();
  cb.print_board();
  //if(currentplayer == "black"){
    cb.bestmove("B",4);
  //}
  draw();
  cb.print_board();
}

function returnpiecetoOriginal(event){ //if the piece moves out of the canvas, return the piece to its original location.
  if(selectedpiecey< 0 || selectedpiececolor != currentplayer){
    return;
  }
  event.preventDefault();
  console.log("return piece");
  console.log(cb.board[selectedpiecey][selectedpiecex].get_pos());
  /**
   * return the piece to its original location if it dragged out of the play area.
   */
  cb.board[selectedpiecey][selectedpiecex].drawnx = cb.board[selectedpiecey][selectedpiecex].x * tile_size;
  cb.board[selectedpiecey][selectedpiecex].drawny = cb.board[selectedpiecey][selectedpiecex].y * tile_size;
  selectedpiecey = -1;
  selectedpiecex = -1;
  selectedpiececolor = "";
  draw();
  cb.print_board();
}

canvas.onmousedown = function(event){
  getpiececlicked(event);
};

canvas.onmousemove = function(event){
  movepiece(event);
};

canvas.onmouseup = function(event){
  releasepiece(event);
};

canvas.onmouseout = function(event){
  returnpiecetoOriginal(event);
};


//setup();
showGrid();
//let np = new piece(1,1,1,1,"TN");