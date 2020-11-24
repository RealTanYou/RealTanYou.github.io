// chess960 with ai
// Initial position, first (bottom) row: rook, knight, bishop, queen, king, bishop, knight, and rook; second row: pawns

const min_x = 0, min_y = 0, max_x = 7, max_y = 7;
const num_to_let = {
    0:'a',1:'b',2:'c',3:'d',4:'e',5:'f',6:'g',7:'h'
};
const blacktiles = [0,2,4,6], whitetiles = [1,3,5,7]; //for first row
function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

/**
 * 0 [][][][][][][][] black here
 * 1 [][][][][][][][] black here
 * 2 [][][][][][][][]
 * 3 [][][][][][][][]
 * 4 [][][][][][][][]
 * 5 [][][][][][][][]
 * 6 [][][][][][][][] white here
 * 7 [][][][][][][][] white here
 *   0 1 2 3 4 5 6 7
 * 
 * note that indexes in programming assume that the positive x axis runs downwards, not upwards.
 * when getting and setting the name of each piece, use 2 letter phrasing
 */

class piece {
    constructor (y,x,colour, image, name){
        this.x = x; //current position of the piece on the board
        this.y = y;
        this.drawnx = x * tile_size;
        this.drawny = y * tile_size;
        this.colour = colour; //only black or white
        this.imagepiece = new Image(); //for visual representation of the piece'
        this.imagepiece.src = image;
        this.imagepiece.drawnx = x * tile_size;
        this.imagepiece.drawny = y * tile_size;
        this.imagepiece.onload = drawthispiece;
        //this.imagepiece.onmousedown = drawthispiece;
        //this.imagepiece.onmouseleave = drawthispiece;
        //this.imagepiece.onmouseup = drawthispiece;
        //this.imagepiece.onmousemove = drawthispiece;
        this.name = name; //rook, bishop etc
        this.width = 0; //width and height for hitbox.
        this.height = 0;
        this.movecount = 0;
    }
    move(new_x, new_y){
        return false;
    }
    get_pos(){
        //should return in proper chess format
        return this.y+1 + "," + num_to_let[this.x];
    }
    show(){
        //ctx.font = "30px Arial";
        //ctx.fillStyle = 'rgba(125,125,125,1)'
        //this.width = ctx.measureText(this.name).width;
        //this.height = 30;
        //ctx.fillText(this.name,this.drawnx + 25,this.drawny + 50);
        //console.log(this.imagepiece.src);
        this.imagepiece.drawnx = this.drawnx;
        this.imagepiece.drawny = this.drawny;
        ctx.drawImage(this.imagepiece,this.drawnx,this.drawny,100,100);
    }
    toString(){
        //var newtext = Text()
        return this.name;
    }
}

function drawthispiece(){
    ctx.drawImage(this,this.drawnx,this.drawny,100,100);
}

class king extends piece {
    constructor(x,y,colour,image,name){
        super(x,y,colour,image,name);
    }
    move(new_x, new_y){
        let sucessful_move = false;
        //king can move one square in any direction
        if(new_x != this.x || new_y != this.y){
            //allow the move only if the new position given is diffrent from the current position.
            if(Math.abs(this.x - new_x) <= 1 && Math.abs(this.y - new_y) <= 1){
                //check that the new position moved is exactly one position 
                sucessful_move = true;
            }
        }
        return sucessful_move;
    }

}

class queen extends piece{
    constructor(x,y,colour,image,name){
        super(x,y,colour,image,name);
    }
    move(new_x, new_y){
        /**
         * queen can move vertial, horizontal and diagonal direction for any length, but not over other pieces(to be coded later)
         */
        let sucessful_move = false;
        if(new_x != this.x || new_y != this.y){
            //chack that the new_x and new_y do not exceed boundaries. also ensure that it is only in the 8 cardinal directions
            let diff_x = Math.abs(new_x - this.x), diff_y = Math.abs(new_y - this.y);
            if(diff_x <= max_x && diff_y <= max_y && (diff_x == diff_y || (diff_y == 0 || diff_x == 0))){
                //check if 8 directions
                sucessful_move = true;
            }
        }
        return sucessful_move;
        
    }
}

class rook extends piece{
    constructor(x,y,colour,image,name){
        super(x,y,colour,image,name);
    }
    move(new_x, new_y){
        /**
         * rook can vertical and horizontal of any length, except over other pieces
         * rook can perform a special move with the king called castling
         */
        let sucessful_move = false;
        if(new_x != this.x || new_y != this.y){
            //chack that the new_x and new_y do not exceed boundaries. also ensure that it is only in the 4 cardinal directions
            let diff_x = Math.abs(new_x - this.x), diff_y = Math.abs(new_y - this.y);
            console.log("difference: " + diff_x + "," + diff_y);
            if(diff_x <= max_x && diff_y <= max_y && (diff_y == 0 || diff_x == 0)){
                sucessful_move = true;
            }
        }
        return sucessful_move;
    }
}

class bishop extends piece{
    constructor(x,y,colour,image,name){
        super(x,y,colour,image,name);
    }
    move(new_x, new_y){
        /**
         * bishop can move diagonal direction for any length, but not over other pieces(to be coded later)
         */
        let sucessful_move = false;
        if(new_x != this.x && new_y != this.y){
            //chack that the new_x and new_y do not exceed boundaries. also ensure that it is only in the diagonal directions
            let diff_x = Math.abs(new_x - this.x), diff_y = Math.abs(new_y - this.y);
            if(diff_x <= max_x && diff_y <= max_y && diff_x == diff_y){
                sucessful_move = true;
            }
        }
        return sucessful_move;
        
    }
}

class knight extends piece{
    constructor(x,y,colour,image,name){
        super(x,y,colour,image,name);
    }
    move(new_x, new_y){
        /**
         * knight moves in an 'L' shape and can jump over other pieces.
         */
        let sucessful_move = false;
        if(new_x != this.x && new_y != this.y){
            //chack that the new_x and new_y do not exceed boundaries. also ensure that it is only in the 8 cardinal directions
            let diff_x = Math.abs(new_x - this.x), diff_y = Math.abs(new_y - this.y);
            if((diff_x == 2 && diff_y == 1) || (diff_x == 1 && diff_y == 2)){
                sucessful_move = true;
            }
        }
        return sucessful_move;
        
    }
}

class pawn extends piece {
    constructor(x,y,colour,image,name){
        super(x,y,colour,image,name);
    }
    forwardmove(new_x, new_y){
        let sucessful_move = false;
        /** 
         * pawns can only move forward, unless diagonal capture, en passant or promotion
         * x for pawns are only used for en passant,diagonal movement forward
         * en passant can only happend if the piece to be captured was moved there on the opponent's turn. otherwise, the right to capture it is forfieted\
         * */ 
        
        //right now, code only move forward or back.
        if(new_y != this.y && new_x == this.x){
            let res = new_y - this.y;
            if((this.colour == "white" && res < 0 && res >= -2) || (this.colour == "black" && res > 0 && res <= 2)){
                sucessful_move = true;
            }
            if(Math.abs(res) == 2 && this.movecount == 0 && sucessful_move){
                //first move piece, can be enpassant on.
                if(this.colour == "white") cb.whiteenpassant = this;
                if(this.colour == "black") cb.blackenpassant = this;
                console.log(cb.whiteenpassant);
                console.log(cb.blackenpassant);
                this.movecount+=1;
            }
        }
        return sucessful_move;
    }
    diagonalmove(new_x,new_y){
        let sucessful_move = false;
        if(new_y!= this.y && new_x != this.x){
            let resy = new_y - this.y, resx = Math.abs(new_x - this.x);
            if(resx == 1 && ((this.colour == "white" && resy == -1) || (this.colour == "black" && resy == 1))){
                sucessful_move = true;
            }
        }
        return sucessful_move;
    }
    checkenpassant(newx,newy,otherpawn){
        let sucessful_move = false;
        if(this.diagonalmove(newx,newy)){
            console.log("can move diagonal");
            if(otherpawn instanceof pawn && pawn.colour != this.colour){
                console.log("other piece is pawn and not of same colour");
                if(Math.abs(otherpawn.x - this.x) == 1){
                    //pawn is in correct position.
                    sucessful_move = true;
                }
            }
        }
        return sucessful_move;
    }
}

class chessboard {
    constructor(){
        //make an 8 by 8 chessboard, save the locations of all the chess pieces
        this.board = [];
        for(var i = 0; i < 8; i++){
            this.board.push([0,0,0,0,0,0,0,0]);
        }
        // make 2 players: white and black
        // they are a dictionary of location to piece.
        //all pawns are in the same position, but for chess960, the other pieces are pseudo-randomiszed.
        //The bishops must be placed on opposite-color squares.
        //The king must be placed on a square between the rooks.
        //black follows white placements.
        this.white = {};
        this.black = {};
        //record which piece currently can be enpassant. intialise it to be blank.
        this.whiteenpassant = "";
        this.blackenpassant = "";

        let availabletiles = [0,1,2,3,4,5,6,7]; // x axis
        let white_loc = 7;
        let black_loc = 0;
        //randomly set the white bishops
        let bish_ran = whitetiles[Math.floor(Math.random() * whitetiles.length)];
        let bish = new bishop(white_loc,bish_ran,"white","images/whitebishop.png","WB");
        this.white[bish.get_pos()] = bish;
        this.board[white_loc][bish_ran] = bish;
        availabletiles.splice(availabletiles.indexOf(bish_ran),1);
        bish_ran = blacktiles[Math.floor(Math.random() * blacktiles.length)];
        bish = new bishop(white_loc,bish_ran,"white","images/whitebishop.png","WB");
        this.white[bish.get_pos()] = bish;
        this.board[white_loc][bish_ran] = bish;
        availabletiles.splice(availabletiles.indexOf(bish_ran),1);
        //randomly set the knights
        for(var i = 0; i < 2; i++){
            bish_ran = availabletiles[random(0,availabletiles.length-1)];
            bish = new knight(white_loc,bish_ran,"white","images/whiteknight.png","WK");
            this.white[bish.get_pos()] = bish;
            this.board[white_loc][bish_ran] = bish;
            availabletiles.splice(availabletiles.indexOf(bish_ran),1);
        }
        //set the queen
        bish_ran = availabletiles[random(0,availabletiles.length-1)];
        bish = new queen(white_loc,bish_ran,"white","images/whitequeen.png","WQ");
        this.white[bish.get_pos()] = bish;
        this.board[white_loc][bish_ran] = bish;
        availabletiles.splice(availabletiles.indexOf(bish_ran),1);
        //set the king in the centre of both thr rooks.
        bish_ran = availabletiles[1];
        bish = new king(white_loc,bish_ran,"white","images/whiteking.png","WG");
        this.white[bish.get_pos()] = bish;
        this.board[white_loc][bish_ran] = bish;
        availabletiles.splice(availabletiles.indexOf(bish_ran),1);
        //finally, the rooks
        for(var i = 0; i < 2; i++){
            bish_ran = availabletiles[random(0,availabletiles.length-1)];
            bish = new rook(white_loc,bish_ran,"white","images/whiterook.png","WR");
            this.white[bish.get_pos()] = bish;
            this.board[white_loc][bish_ran] = bish;
            availabletiles.splice(availabletiles.indexOf(bish_ran),1);
        }
        //finally, add the rest of the pawns
        for(var i = 0; i < 8; i++){
            bish = new pawn(white_loc-1,i,"white","images/whitepawn.png","WP");
            this.white[bish.get_pos()] = bish;
            this.board[white_loc-1][i] = bish;
        }

        //repeat the rest for black, but for the same positions.
        for (var key in this.white) {
            if (this.white.hasOwnProperty(key)) {
                let temp_pos = [black_loc,this.white[key].x];
                switch(this.white[key].name){
                    case "WB":
                        bish = new bishop(temp_pos[0],temp_pos[1],"black","images/blackbishop.png","BB");
                        break;
                    case "WK":
                        bish = new knight(temp_pos[0],temp_pos[1],"black","images/blackknight.png","BK");
                        break;
                    case "WQ":
                        bish = new queen(temp_pos[0],temp_pos[1],"black","images/blackqueen.png","BQ");
                        break;
                    case "WG":
                        bish = new king(temp_pos[0],temp_pos[1],"black","images/blackking.png","BG");
                        break;
                    case "WR":
                        bish = new rook(temp_pos[0],temp_pos[1],"black","images/blackrook.png","BR");
                        break;
                    case "WP":
                        temp_pos[0] = 1;
                        bish = new pawn(temp_pos[0],temp_pos[1],"black","images/blackpawn.png","BP");
                        break;
                    default:
                        break;
                }
                this.board[temp_pos[0]][temp_pos[1]] = bish;
                this.black[bish.get_pos()] = bish;
            }
        }
    }
    print_board(){
        //prints out the pieces in a board like fashion
        let string_board = "";
        for(var j = 0; j < 8; j++){
            let board_line = j+1;
            for(var i = 0; i < 8; i++){
                if(typeof this.board[j][i] == "number"){
                    board_line += "[" + "--" + "]";
                }
                else{
                    board_line += "[" + this.board[j][i].name + "]";
                }
            }
            string_board += board_line + '\n';
        }
        string_board += "  a   b   c   d   e   f   g   h"
        console.log(string_board);
        console.table(this.white);
        console.table(this.black);
    }
    show_board(){
        for(var i = 7; i>=0; i--){
            for(var j = 0; j < 8; j++){
                if(typeof this.board[i][j] == "number"){
                }
                else{
                    this.board[i][j].show();
                }
            }
        }
    }
}

const cb = new chessboard();
cb.print_board();
cb.show_board();
console.log("complete test");