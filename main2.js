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
        return this.y + "," + this.x;
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

//tree data structure for figuring out moves
class node{
    constructor(movelist,score,playercolor,parent=null){
        this.score = score; //current score of board
        this.movelist = movelist; //all possible moves from the board. May be empty if there are no further moves from this move
        this.playercolor = playercolor; //the current playercolor of this node/
        this.effectivescore = score; //this is the actual effect score of this move, after checking all of the children.
        this.children = []; //these children correspond to each of the move list and its total score.
        this.parent = parent; //
    }
    add(index){
        this.children.push(new node([this.movelist[index]],thus.move_list[index][2],this))
    }
    //find the bext score and the move to make, by traversing down each node to check the score. note that the lower the score, the better it is for black.
    dftraverse(){ //callback is a function to be used when you either reached the last node, or exhaust all the previous 
        (function recurse(currentnode,alpha,beta){
            //apply aplha beta pruning here.
            /**
             * alpha for white, beta for black
             */

            if(!currentnode) return;
            var effscore = currentnode.score;
            //console.log(currentnode.playercolor + "," + currentnode.effectivescore);
            for(var i = 0; i < currentnode.children.length; i++){
                recurse(currentnode.children[i],alpha,beta);
                //onsole.log(currentnode.children[i].playercolor + " " + currentnode.children[i].effectivescore);
                if(currentnode.playercolor == "W"){ //maximiser
                    //get higher score;
                    effscore = Math.max(effscore, currentnode.children[i].effectivescore);
                    alpha = Math.max(alpha,effscore);
                    if(alpha >= beta) break;
                }
                else{ //minimiser
                    //get lower score;
                    effscore = Math.min(effscore, currentnode.children[i].effectivescore);
                    beta = Math.min(beta,effscore);
                    if(beta <= alpha) break;
                }
                //add code to get score here.
            }
            currentnode.effectivescore = effscore;
            //console.log(currentnode.playercolor + "," + currentnode.effectivescore);
        })(this,Number.MIN_SAFE_INTEGER,Number.MAX_SAFE_INTEGER);
    }
}

class chessboard {
    /**
     * This holds the players and the board position. It is also the AI. Currently. it can only be the black player.
     * The black player wants to have the higher 'negative; scire
     */
    constructor(){
        //make an 8 by 8 chessboard, save the locations of all the chess pieces
        this.board = [];
        //scoring for pieces. white has a positive score, black has a negative score
        this.piecescore = {
            "WG": 200,
            "WQ": 9,
            "WR": 5,
            "WB": 3,
            "WK": 3,
            "WP": 1,
            "BG": -200,
            "BQ": -9,
            "BR": -5,
            "BB": -3,
            "BK": -3,
            "BP": -1
        };
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
    addnode(currentnode,currentplayer,numsteps,currentstep=1){ //use the move list of the node to add new node
        //make new child nodes and add them to current node
        //console.log(currentnode);
        //console.log(currentnode.movelist);
        var newplayer;
        if(currentplayer == 'B'){
            newplayer = 'W';
        }
        else{
            newplayer = 'B';
        }
        for(var i = 0; i < currentnode.movelist[0].length; i++){
            currentnode.children.push(new node(null,currentnode.movelist[1][i],newplayer,currentnode));
        }
        if(currentstep < numsteps){ //more moves to check and make, so recursively make new move lists.
            for(var i = 0; i < currentnode.children.length; i++){
                currentnode.children[i].movelist = this.simulatemoves(currentnode.movelist[0][i],newplayer,currentnode.children[i].score);
                this.addnode(currentnode.children[i],newplayer,numsteps,currentstep+1);
            }
        }
    }


    /**
     * Find the next best move.
     * @param {*} playercolor The current playercolor. 'W' for white, 'B' for black
     * @param {*} numsteps How many steps to look forward. default = 2
     */
    bestmove(playercolor,numsteps = 2){
        //turn the board into the input needed for simulatemoves. also calculate total score of board.
        var currentstate = [];
        //console.log(this.board);
        var totalscore = 0;
        for(var j = 0; j < 8; j++){
            currentstate.push([]);
            for(var i = 0; i < 8; i++){
                if(typeof this.board[j][i] == "number"){
                    currentstate[j].push(0);
                }
                else{
                    //console.log(this.board[j][i].name);
                    currentstate[j].push(this.board[j][i].name);
                    totalscore += this.piecescore[this.board[j][i].name];
                }
            }
            //console.log(currentstate);
        }
        console.table(currentstate);
        //console.log(totalscore);
        var movelist = this.simulatemoves(currentstate,playercolor,totalscore);
        console.log(movelist);
        //make parent and add node, then recursive add all child nodes, and their moves..
        var rootplayer = 'B';
        var rootnode = new node(movelist,totalscore,rootplayer);
        this.addnode(rootnode,rootplayer,numsteps);

        //after adding all nodes, find the move with the best score and execute that move.
        rootnode.dftraverse();
        //root node should have best score; find first move with that score and execute that.
        console.log(rootnode);
        for(var k = 0; k < rootnode.children.length; k++){
            if(rootnode.children[k].effectivescore == rootnode.effectivescore){
                //found it. change white, black and board states.
                //step 1: compare current state to this move, and find different pieces, black and/or white.
                var blackpieceoriginalpos = null, blackpiecenewpos = null;
                var whitepieceremoved = null;
                //compare states
                for(var j = 0; j < currentstate.length; j++){
                    for(var i = 0; i < currentstate[j].length; i++){
                        //console.log("checking stuff");
                        //console.log(currentstate[j][i]);
                        //console.log(rootnode.movelist[0][k][j][i]);
                        if(typeof currentstate[j][i] != 'number' && typeof rootnode.movelist[0][k][j][i] == 'number'){
                            //the piece has moved/removed: record the original position
                            //if it is white, it may have been removed due to empassant.
                            if(currentstate[j][i].charAt(0) == "W"){
                                //white piece has been removed
                                whitepieceremoved = j + "," + i;
                            }
                            else{
                                //this black piece is moved; record position
                                blackpieceoriginalpos = j + "," + i;
                            }

                        }
                        else if(typeof currentstate[j][i] == 'number' && typeof rootnode.movelist[0][k][j][i] != 'number'){
                            //the black piece has moved to this position: record the new position
                            blackpiecenewpos = j + "," + i;
                        }
                        else if(typeof currentstate[j][i] != 'number' && typeof rootnode.movelist[0][k][j][i] != 'number' && currentstate[j][i] != rootnode.movelist[0][k][j][i]){
                            //first, check if both pieces are different.
                            //if they are different, record them; black took a white piece
                            blackpiecenewpos = j + "," + i;
                            whitepieceremoved = j + "," + i;
                        }
                    }
                }

                //step 2: delete the piece in black and/or white memory, followed by board memory and move the piece.
                if(whitepieceremoved){
                    delete cb.white[whitepieceremoved];
                    cb.board[parseInt(whitepieceremoved.charAt(0))][parseInt(whitepieceremoved.charAt(2))] = 0;
                }
                cb.black[blackpiecenewpos] = Object.assign(cb.black[blackpieceoriginalpos]);
                cb.black[blackpiecenewpos].y = parseInt(blackpiecenewpos.charAt(0));
                cb.black[blackpiecenewpos].x = parseInt(blackpiecenewpos.charAt(2));
                cb.black[blackpiecenewpos].drawny = parseInt(blackpiecenewpos.charAt(0)) * tile_size;
                cb.black[blackpiecenewpos].drawnx = parseInt(blackpiecenewpos.charAt(2)) * tile_size;
                delete cb.black[blackpieceoriginalpos];
                cb.board[parseInt(blackpiecenewpos.charAt(0))][parseInt(blackpiecenewpos.charAt(2))] = cb.board[parseInt(blackpieceoriginalpos.charAt(0))][parseInt(blackpieceoriginalpos.charAt(2))];
                cb.board[parseInt(blackpieceoriginalpos.charAt(0))][parseInt(blackpieceoriginalpos.charAt(2))] = 0;
                break;

            }
        }
    }
    
    /**
     * given the state of the chessboard, find all possible legal moves to make. returns a move list.
     * @param {*currentstate is a 2D array of the chessboard, given in 2 letters for each piece, and 0 for empty spaces.} 
     * @param {*playercolor is the current player color to be used to move the pieces. either 'W' or 'B'.}
     * @param {*totalscore is the totalscore for the board in this current state} totalscore is zero if every piece is there.
     */
    simulatemoves(currentstate,playercolor,totalscore){
        /**
         * the move list will return all possible moves that can be made with the current state.
         * the move list is in a 3 by X array, where the first element of row is the move result in 8 x 8, and next element is the score of the state
         */
        var move_list = [[],[]];
        
        //iterate through whole board, finding pieces that belong to the playercolor
        for(var j = 0; j < 8; j++){
            for(var i = 0; i < 8; i++){
                if(currentstate[j][i] == 0) continue;
                if(currentstate[j][i].charAt(0) != playercolor) continue;
                //console.log("checking piece moves");
                //got player color piece, find all possible legal moves with that piece and calculate the score of both black and white.
                //console.table(currentstate);
                //console.log(currentstate[j][i]);
                //console.log(currentstate[j][i]);
                //console.table(move_list[0]);
                //console.table(move_list[1]);
                var minj, maxj, mini, maxi, tempj, tempi; //maximum     
                switch(currentstate[j][i].charAt(1)){
                    case "G": //king
                        //console.log("hit king");
                        minj = j - 1 > 0 ? j-1 : 0;
                        maxj =  j + 1 < 8 ? j + 1 : 7;
                        mini = i - 1 > 0 ? i-1 : 0;
                        maxi =  i + 1 < 8 ? i + 1 : 7;
                        for(tempj = minj; tempj <= maxj; tempj++){
                            for(tempi = mini; tempi <= maxi; tempi++){
                                if(tempj == j && tempi == i) continue;
                                //check if piece at location. if not, is valid move.
                                if(currentstate[tempj][tempi] == 0){
                                    //score is the same, as no pieces has been taken
                                    move_list[0].push(this.createstate(currentstate,[j,i],[tempj,tempi]));
                                    move_list[1].push(totalscore);
                                }
                                else if (currentstate[tempj][tempi].charAt(0) != playercolor){
                                    //other player. take the piece and calculate score.
                                    move_list[1].push(totalscore - this.piecescore[currentstate[tempj][tempi]]);
                                    move_list[0].push(this.createstate(currentstate,[j,i],[tempj,tempi]));
                                }
                            }
                        }
                        break;
                    case "Q": //Queen
                    /**
                     * most complicated, as queen can move in all directions with any length.
                     * consider checking its immeditate surroundings, then 'add1' to each direction.
                     * if that direction is 'blocked' by a piece, then do the following:
                     *  1. if it is the enemy, take it and stop checking further in that direction
                     *  2. it it is own piece, then just stop checking in that direction
                     */
                        var queenmovelist = [];
                        var canmovefurther = [];
                        //generaate each move around the queen.
                        minj = j - 1 > 0 ? j-1 : 0;
                        maxj =  j + 1 < 8 ? j + 1 : 7;
                        mini = i - 1 > 0 ? i-1 : 0;
                        maxi =  i + 1 < 8 ? i + 1 : 7;
                        //console.log(minj,mini,maxj,maxi);
                        for(tempj = minj; tempj <= maxj; tempj++){
                            for(tempi = mini; tempi <= maxi; tempi++){
                                if(tempj == j && tempi == i) continue;
                                queenmovelist.push([tempj,tempi])
                                canmovefurther.push(true);
                            }
                        }
                        //console.log(queenmovelist);
                        //console.log(canmovefurther);
                        while(canmovefurther.includes(true)){
                            //so long as the queen can move further, check each direction
                            for(var qm = 0; qm < queenmovelist.length; qm++){
                                if(!canmovefurther[qm]) continue;
                                if(currentstate[queenmovelist[qm][0]][queenmovelist[qm][1]] == 0){
                                    //no one at spot, so possible move.
                                    move_list[0].push(this.createstate(currentstate,[j,i],[queenmovelist[qm][0],queenmovelist[qm][1]]));
                                    move_list[1].push(totalscore);
                                    //move one step further in that direction either vertial, horizontal or diagonal.
                                    if(queenmovelist[qm][0] > j) queenmovelist[qm][0] += 1;
                                    else if (queenmovelist[qm][0] < j) queenmovelist[qm][0] -= 1;
                                    if(queenmovelist[qm][1] > i) queenmovelist[qm][1] += 1;
                                    else if (queenmovelist[qm][1] < i) queenmovelist[qm][1] -= 1;
                                    //if exceeed boundaries, stop
                                    if(queenmovelist[qm][0] > 7 || queenmovelist[qm][0] < 0 || queenmovelist[qm][1] > 7 || queenmovelist[qm][1] < 0) canmovefurther[qm] = false;

                                }
                                else if (currentstate[queenmovelist[qm][0]][queenmovelist[qm][1]].charAt(0) == playercolor){
                                    //own piece, so unable to move further
                                    canmovefurther[qm] = false;
                                }
                                else{
                                    //other player piece. take it and stop moving further.
                                    move_list[1].push(totalscore - this.piecescore[currentstate[queenmovelist[qm][0]][queenmovelist[qm][1]]]);
                                    move_list[0].push(this.createstate(currentstate,[j,i],[queenmovelist[qm][0],queenmovelist[qm][1]]));
                                    canmovefurther[qm] = false;
                                }
                            }
                        }
                        break;
                    case "R": //Rook
                        var rookmovelist = [];
                        var canmovefurther = [];
                        //generaate each move around the rook.
                        minj = j - 1 > 0 ? j-1 : 0;
                        maxj =  j + 1 < 8 ? j + 1 : 7;
                        mini = i - 1 > 0 ? i-1 : 0;
                        maxi =  i + 1 < 8 ? i + 1 : 7;
                        for(tempj = minj; tempj <= maxj; tempj++){
                            if(tempj == j) continue;
                            rookmovelist.push([tempj,i])
                            canmovefurther.push(true);
                        }
                        for(tempi = mini; tempi <= maxi; tempi++){
                            if(tempi == i) continue;
                            rookmovelist.push([j,tempi])
                            canmovefurther.push(true);
                        }
                        while(canmovefurther.includes(true)){
                            //so long as the queen can move further, check each direction
                            for(var qm = 0; qm < rookmovelist.length; qm++){
                                if(!canmovefurther[qm]) continue;
                                if(currentstate[rookmovelist[qm][0]][rookmovelist[qm][1]] == 0){
                                    //no one at spot, so possible move.
                                    move_list[0].push(this.createstate(currentstate,[j,i],[rookmovelist[qm][0],rookmovelist[qm][1]]));
                                    move_list[1].push(totalscore);
                                    //move one step further in that direction either vertial, horizontal or diagonal.
                                    if(rookmovelist[qm][0] > j) rookmovelist[qm][0] += 1;
                                    else if (rookmovelist[qm][0] < j) rookmovelist[qm][0] -= 1;
                                    if(rookmovelist[qm][1] > i) rookmovelist[qm][1] += 1;
                                    else if (rookmovelist[qm][1] < i) rookmovelist[qm][1] -= 1;
                                    //if exceeed boundaries, stop
                                    if(rookmovelist[qm][0] > 7 || rookmovelist[qm][0] < 0 || rookmovelist[qm][1] > 7 || rookmovelist[qm][1] < 0) canmovefurther[qm] = false;

                                }
                                else if (currentstate[rookmovelist[qm][0]][rookmovelist[qm][1]].charAt(0) == playercolor){
                                    //own piece, so unable to move further
                                    canmovefurther[qm] = false;
                                }
                                else{
                                    //other player piece. take it and stop moving further.
                                    move_list[1].push(totalscore - this.piecescore[currentstate[rookmovelist[qm][0]][rookmovelist[qm][1]]]);
                                    move_list[0].push(this.createstate(currentstate,[j,i],[rookmovelist[qm][0],rookmovelist[qm][1]]));
                                    canmovefurther[qm] = false;
                                }
                            }
                        }
                        break;
                    case "B": //Bishop
                        var Bishopmovelist = [];
                        var canmovefurther = [];
                        //generaate each move around the bishop.
                        minj = j - 1 > 0 ? j-1 : 0;
                        maxj =  j + 1 < 8 ? j + 1 : 7;
                        mini = i - 1 > 0 ? i-1 : 0;
                        maxi =  i + 1 < 8 ? i + 1 : 7;
                        for(tempj = minj; tempj <= maxj; tempj++){
                            for(tempi = mini; tempi <= maxi; tempi++){
                                if(tempj == j || tempi == i) continue;
                                Bishopmovelist.push([tempj,tempi])
                                canmovefurther.push(true);
                            }
                        }
                        while(canmovefurther.includes(true)){
                            //so long as the queen can move further, check each direction
                            for(var qm = 0; qm < Bishopmovelist.length; qm++){
                                if(!canmovefurther[qm]) continue;
                                if(currentstate[Bishopmovelist[qm][0]][Bishopmovelist[qm][1]] == 0){
                                    //no one at spot, so possible move.
                                    move_list[0].push(this.createstate(currentstate,[j,i],[Bishopmovelist[qm][0],Bishopmovelist[qm][1]]));
                                    move_list[1].push(totalscore);
                                    //move one step further in that direction either vertial, horizontal or diagonal.
                                    if(Bishopmovelist[qm][0] > j) Bishopmovelist[qm][0] += 1;
                                    else if (Bishopmovelist[qm][0] < j) Bishopmovelist[qm][0] -= 1;
                                    if(Bishopmovelist[qm][1] > i) Bishopmovelist[qm][1] += 1;
                                    else if (Bishopmovelist[qm][1] < i) Bishopmovelist[qm][1] -= 1;
                                    //if exceeed boundaries, stop
                                    if(Bishopmovelist[qm][0] > 7 || Bishopmovelist[qm][0] < 0 || Bishopmovelist[qm][1] > 7 || Bishopmovelist[qm][1] < 0) canmovefurther[qm] = false;

                                }
                                else if (currentstate[Bishopmovelist[qm][0]][Bishopmovelist[qm][1]].charAt(0) == playercolor){
                                    //own piece, so unable to move further
                                    canmovefurther[qm] = false;
                                }
                                else{
                                    //other player piece. take it and stop moving further.
                                    move_list[1].push(totalscore - this.piecescore[currentstate[Bishopmovelist[qm][0]][Bishopmovelist[qm][1]]]);
                                    move_list[0].push(this.createstate(currentstate,[j,i],[Bishopmovelist[qm][0],Bishopmovelist[qm][1]]));
                                    canmovefurther[qm] = false;
                                }
                            }
                        }
                        break;
                    case "K": //knight
                        var knightmovelist = [];
                        minj = j - 2 > 0 ? j-2 : 0;
                        maxj =  j + 2 < 8 ? j + 2 : 7;
                        mini = i - 2 > 0 ? i-2 : 0;
                        maxi =  i + 2 < 8 ? i + 2 : 7;
                        //console.log(minj,mini,maxj,maxi);
                        var diffj, diffi;
                        for(tempj = minj; tempj <= maxj; tempj++){
                            for(tempi = mini; tempi <= maxi; tempi++){
                                if(tempj == j && tempi == i) continue;
                                diffj = Math.abs(tempj - j);
                                diffi = Math.abs(tempi - i)
                                //console.log(diffj);
                                if((diffj == 2 && diffi == 1) || (diffj == 1 && diffi == 2))knightmovelist.push([tempj,tempi])
                            }
                        }
                        //console.log(knightmovelist);
                        for(var kn = 0; kn < knightmovelist.length; kn++){
                            if(currentstate[knightmovelist[kn][0]][knightmovelist[kn][1]] == 0){
                                //no one at spot, so possible move.
                                move_list[0].push(this.createstate(currentstate,[j,i],knightmovelist[kn]));
                                move_list[1].push(totalscore);

                            }
                            else if (currentstate[knightmovelist[kn][0]][knightmovelist[kn][1]].charAt(0) != playercolor){
                                //other player piece. take it and stop moving further.
                                move_list[1].push(totalscore - this.piecescore[currentstate[knightmovelist[kn][0]][knightmovelist[kn][1]]]);
                                move_list[0].push(this.createstate(currentstate,[j,i],knightmovelist[kn]));
                            }
                        }
                        break;
                    case "P": //Pawn
                        //check if pawn at initial position. if it is, allow movement of up to 2, otherwise movement of one only.
                        if(currentstate[j][i].charAt(0) == "W"){
                            //white
                            if(j == 0) continue; //reach end of line.
                            if(j == 6){
                                maxj = 5;
                                minj = 4;
                            }
                            else {
                                maxj = minj = j - 1 > 0 ? j - 1: 0; 
                            }
                        }
                        else if (currentstate[j][i].charAt(0) == "B"){
                            //black
                            if(j == 7) continue; //reach end of line 
                            if(j == 1){
                                maxj = 3;
                                minj = 2;
                            }
                            else{
                                maxj = minj = j + 1 < 8 ? j + 1: 7; 
                            }
                        }
                        //check a few things:
                        //1. move 1 or 2 forward to an empty space (make sure that no one is blocking)
                        //2. take forward left or take forward right
                        //3. empassant
                        var forwardmove = true
                        for(tempj = minj; tempj <= maxj; tempj++){
                            if(currentstate[tempj][i] == 0 && forwardmove){
                                move_list[0].push(this.createstate(currentstate,[j,i],[tempj,i]));
                                move_list[1].push(totalscore);
                            }
                            else{
                                //postion directly forward it blocked, so don't bother checking.
                                forwardmove = false;
                            }
                            //console.log(forwardmove);
                        }
                        if(i != 0){
                            if(currentstate[j][i].charAt(0) == "W"){
                                if(typeof currentstate[j-1][i-1] == "number"){

                                }
                                else if(currentstate[j-1][i-1].charAt(0) == "B"){
                                    //can move diagonal forward
                                    move_list[1].push(totalscore - this.piecescore[currentstate[j-1][i-1]]);
                                    move_list[0].push(this.createstate(currentstate,[j,i],[j-1,i-1]));
                                }
                            }
                            else{
                                if(typeof currentstate[j+1][i-1] == "number"){

                                }
                                else if(currentstate[j+1][i-1].charAt(0) == "W"){
                                    move_list[1].push(totalscore - this.piecescore[currentstate[j+1][i-1]]);
                                    move_list[0].push(this.createstate(currentstate,[j,i],[j+1,i-1]));
                                }
                            }
                        }
                        if(i != 7){
                            if(currentstate[j][i].charAt(0) == "W"){
                                if(typeof currentstate[j-1][i+1] == "number"){

                                }
                                else if(currentstate[j-1][i+1].charAt(0) == "B"){
                                    //can move diagonal forward
                                    move_list[1].push(totalscore - this.piecescore[currentstate[j-1][i+1]]);
                                    move_list[0].push(this.createstate(currentstate,[j,i],[j-1,i+1]));
                                }
                            }
                            else{
                                if(typeof currentstate[j+1][i+1] == "number"){

                                }
                                else if(currentstate[j+1][i+1].charAt(0) == "W"){
                                    move_list[1].push(totalscore - this.piecescore[currentstate[j+1][i+1]]);
                                    move_list[0].push(this.createstate(currentstate,[j,i],[j+1,i+1]));
                                }
                            }
                        }
                        break;
                    default:
                        break;
                    
                }
            }
        }

        return move_list
    }
    /**
     * Create a new 8x8 grid given the old grid, the oldposition of a piece, and the new position.
     * @param {*} currentstate 8x8 grid of the chessboard state 
     * @param {*} oldposition y and x coordinates of the old position of the piece. values given likes this: [3.1]
     * @param {*} newposition y and x coordinates of the new position of the piece. values given likes this: [3.1]
     */
    createstate(currentstate,oldposition, newposition){
        var newstate = JSON.parse(JSON.stringify(currentstate));
        newstate[newposition[0]][newposition[1]] = newstate[oldposition[0]][oldposition[1]];
        newstate[oldposition[0]][oldposition[1]] = 0;
        return newstate;
    }
}

const cb = new chessboard();
cb.print_board();
cb.show_board();
console.log("complete test");