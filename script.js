const info_board = document.getElementById("infoBoard")
const game_board = document.getElementById("gameBoard")
const rect = game_board.getBoundingClientRect();
const score_board = document.getElementById("scoreboard")
const button = document.getElementById("butt")
const Gameover_board = document.getElementById("gamOver")
let Block_height = (rect.height/15)
let Block_width = (rect.width/9)
let InactiveBlocks = []
let score = 0
let validRows = []
let ranX
let block
const colors = [
    "#FF3B30", // Bright Red
    "#FF9500", // Bright Orange
    "#FFD60A", // Bright Yellow
    "#30D158", // Bright Green
    "#0A84FF", // Bright Blue
    "#BF5AF2"  // Bright Purple

];
button.onclick = startgame
function updateBoardSize(){
    const rect = game_board.getBoundingClientRect();
 Block_height = (rect.height/15)
 Block_width = (rect.width/9)
}

let keyDown = false
this.Aray = []
const blockmat = {

    // A - I Piece (4×4)
    A: [
        [0,0,1,0],
        [0,0,1,0],
        [0,0,1,0],
        [0,0,1,0]
    ],

    // B - O Piece (2×2)
    B: [
        [1,1],
        [1,1]
    ],

    // C - T Piece (3×3)
    C: [
        [1,1,1],
        [0,1,0],
        [0,0,0]
    ],

    // D - L Piece (3×3)
    D: [
        [1,0,0],
        [1,0,0],
        [1,1,0]
    ],

    // E - J Piece (3×3)
    E: [
        [0,0,1],
        [0,0,1],                                           
        [0,1,1]
    ],

    // F - S Piece (3×3)
    F: [
        [0,1,1],
        [1,1,0],                                             
        [0,0,0]
    ],

    // G - Z Piece (3×3)
    G: [
        [1,1,0],
        [0,1,1],
        [0,0,0]
    ],
    H: [[1]]

};
let Game_Matrix = []
// Create Game matrix
for (let i = 0; i < 15; i++) {
    const rows = []
   for (let j = 0; j < 9; j++) {
    rows.push(0)
    
   }
   Game_Matrix.push(rows)
    
}




class Block {
    constructor(x,y,color){
        this.x = x
        this.y = y
        this.color = color
        this.block = document.createElement("div")
        
    }
    create(){
        
        this.block.style.position = "absolute"
        
        game_board.appendChild(this.block)
        this.block.style.backgroundColor = this.color
        this.block.style.height = `${Block_height}px`
        this.block.style.width = `${Block_width}px`
        this.block.style.left = `${this.x * Block_width}px`
        this.block.style.top = `${this.y *(Block_height)}px`
    }
    destroy(){
        let index = InactiveBlocks.indexOf(this)
        if(index !== -1){
            InactiveBlocks.splice(index,1)
        }
        this.block.remove()
         Game_Matrix[this.y][this.x] = 0;
    }
    Remove(){
        this.block.remove()
    }
    
    update(){
        this.y += 1
this.block.style.top = `${this.y * Block_height}px`


    }

  
   
}
class BlockA {
    constructor(x,color,mat){
        this.fallTimer = 0;
        this.lastTime = undefined;
        this.xpos = x
        this.x = (x*Block_width)
        this.interval = 700
        this.color = color
        this.count = 0
        this.blocks = []
        this.mat = mat
        this.size = this.mat.length
         this.active = true
         this.destroy = false
         this.placehold = []
for (let i = 0; i < this.size; i++) {
             for (let j = 0; j < this.size; j++) {
               if (this.mat[i][j] == 0) {continue}
               const pixel = new Block(this.xpos + (j),
                                (i),
                                this.color)
                this.blocks.push(pixel)
             }
            
        }
}

update() {
    this.blocks.forEach(block => block.update())
};
canMovedown(){
    for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
            let a = this.xpos+ j
            let b = this.count + i
           if(this.mat[i][j] == 0){
            continue
           }
           if(!inside(a,b+1) ){
             
             return false
           }
           if(Game_Matrix[b+1][a] === 1){
            
            return false
           }
        }
        
     }
    
    return true
}

RotateMatrix(){
  let d = this.size - 1
  let cloneMat = []
  for (let k = 0; k < this.size; k++) {
      let row = []
    for (let l = 0; l < this.size; l++) {
        row.push(0)
        
    }
    cloneMat.push(row)
  }
  for (let i = 0; i < this.size; i++) {
   for (let j = 0; j < this.size; j++) {
           cloneMat[i][j] = this.mat[j][d-i]
   }
    
  }

//    return cloneMat
this.placehold = cloneMat

};
Rotate(){
    this.RotateMatrix()
    if(this.isRotationLegal()){
        this.mat = this.placehold
      this.blocks.forEach(block=>{
         
        block.Remove()
      })
      this.blocks = []

      for (let i = 0; i < this.size; i++) {
             for (let j = 0; j < this.size; j++) {
               if (this.mat[i][j] == 0) {continue}
               const pixel = new Block(this.xpos + (j),
                                (this.count +i),
                                this.color)
                this.blocks.push(pixel)
                pixel.create()
             }
            
        }
    }
}
isRotationLegal() {
    for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {

            if (this.placehold[i][j] === 0)
                continue;

            let y = this.count + i;
            let x = this.xpos + j;

            if (!inside(x, y)){
                console.log("Illegal")
                return false;
                      
            }
            if (Game_Matrix[y][x] === 1){
                console.log("Illegal")
                return false;
                
            } 
        }
    }
 console.log("Legal")

    return true;
   
}
canspawn(){
     for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {

            if (this.mat[i][j] === 0)
                continue;

            let y = this.count + i;
            let x = this.xpos + j;

           
            if (Game_Matrix[y][x] === 1){
                console.log("Illegal")
                return false;
                
            } 
        }
    }
    return true
}
create(){
    this.blocks.forEach(block => {
        block.create()
        
    });
}
replace() {
    for (let i = 0; i < this.size; i++) {
       for (let j = 0; j < this.size; j++) {
          

            if(this.mat[i][j] === 0){
                continue
            }
            let x = Number(this.xpos + j)
            let y = Number(this.count + i)
            //  const pixel = new Block((Block_width*x),
            //                     (Block_height*y),
            //                     this.color)
            //   pixel.create()
             updatemat(x,y)

        
       }
        
    }
    this.blocks.forEach(block=>{
        InactiveBlocks.push(block)
    })
}

 moveHorizontal(dir){

    let newX = this.xpos + dir


    // check boundaries
    for(let i=0;i<this.size;i++){
        for(let j=0;j<this.size;j++){

            if(this.mat[i][j] === 0)
                continue

            let x = newX + j
            let y = this.count + i


            if(!inside(x,y)){
                return
            }

            if(Game_Matrix[y][x] === 1){
                return
            }
        }
    }


    // update matrix position
    this.xpos = newX


    // update visual blocks
    this.blocks.forEach(block=>{
        block.x += dir
        block.block.style.left = `${block.x*Block_width}px`
    })


}
move(currentTime) {

    // First frame
    if (this.lastTime === undefined) {
        this.lastTime = currentTime;
    }

    // Time since previous frame
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Add elapsed time
    this.fallTimer += deltaTime;

    // Soft drop speed
    const fallSpeed = keyDown ? 100 : 700;

    // Time to move one row?
    if (this.fallTimer >= fallSpeed) {

        this.fallTimer = 0;

        if (this.canMovedown()) {

            this.count++;
            this.update();
           

        } else {

            this.replace();
            checkblocks()
            remove();
            
            return; 

        }

    }

    
    requestAnimationFrame(this.move.bind(this));

}
}




// functions that updates gamematrix 
function create(){

 block = new BlockA(2,colors[5],blockmat["E"])
 
 block.create()
 
requestAnimationFrame(block.move.bind(block));
return block


}
function remove() {
     
   
    block = null
    const alphabet = {1:"A", 2:"B", 3:"C",4:"D",5:"E",6:"F",7:"G",8:"H"}
    let num = Math.floor((Math.random() * 8) + 1)
    block = new BlockA(
         Math.floor((Math.random() * 5) + 1),
        colors[Math.floor(Math.random() * colors.length)],
        
        blockmat[alphabet[num]]
    );
    if(block.canspawn()){
     block.create()
     
   requestAnimationFrame(block.move.bind(block));
    }
    else{
        block = null
       showgame()
    }


}
create()
function inside(x,y){
    if(y>=0 && y<15 && x>=0 && x<9){
        return true
    }
  
    return false
}
function updatemat(x,y){

  Game_Matrix[y][x] = 1
  
}

document.addEventListener("keydown", (event)=>{

    if(event.key === "ArrowLeft"){
        block.moveHorizontal(-1)
    }

    if(event.key === "ArrowRight"){
        block.moveHorizontal(1)
    }
    if(event.key === " "){
        block.Rotate()
    }

   

})
document.addEventListener("keyup", (event)=>{

    if(event.key === "ArrowDown"){
        keyDown = false;
    }

});
// Screen-touch 
// game_board.addEventListener("touchstart", (event)=>{

//     event.preventDefault();

//     let touch = event.touches[0];

//     // position of finger relative to the game board
//     let rect = game_board.getBoundingClientRect();

//     let touchY = touch.clientY - rect.top;
//     let touchX = touch.clientX - rect.left;
//     let Heightboundary = 3*(rect.height/4)

//     // quater half of screen = soft drop
//     if(touchY > Heightboundary){

//         keyDown = true;

//     }

//     else{

//         if(touchX < rect.width / 2){

//             block.moveHorizontal(-1);

//         }
//         else{

//             block.moveHorizontal(1);

//         }

//     }

// });
// game_board.addEventListener("touchend", ()=>{

//     keyDown = false;

// });


let touchStartX = 0;
let touchStartY = 0;

let touchEndX = 0;
let touchEndY = 0;

game_board.addEventListener("touchstart", (event) => {

    event.preventDefault();

    let touch = event.touches[0];

    touchStartX = touch.clientX;
    touchStartY = touch.clientY;

});
function checkblocks(){
    validRows = []
    for (let i = 0; i < 15; i++) {
        let count = 0
        for (let j = 0; j < 9; j++) {
            
           if(Game_Matrix[i][j] !== 1){
            break
           }
           count++

        }
        if(count === 9){
             validRows.push(i)
        }
        
    }
    if(validRows.length == 0) return
    for (let index = 0; index < validRows.length; index++){
        clearRow(validRows[index])
        score++

    }
    score_board.innerHTML = score

    
}
function clearRow(row){
     [...InactiveBlocks].forEach(block=>{
        if(block.y === row){
            block.destroy()

        }
     })
     
     InactiveBlocks.forEach(block=>{
        if(block.y<row){
            block.y += 1
            block.block.style.top = `${block.y * Block_height}px`

        }
     })
     Game_Matrix = Array.from({length:15},()=>Array(9).fill(0));
         InactiveBlocks.forEach(block=>{
        Game_Matrix[block.y][block.x] = 1;
    });

}

game_board.addEventListener("touchend", (event) => {

    event.preventDefault();

    let touch = event.changedTouches[0];

    touchEndX = touch.clientX;
    touchEndY = touch.clientY;


    let swipeX = touchEndX - touchStartX;
    let swipeY = touchEndY - touchStartY;


    let threshold = 30; // minimum swipe distance
    // touch Rotate peiece
     if(swipeX<threshold){
     block.Rotate()
     }     

    // Horizontal swipe
    if(Math.abs(swipeX) > Math.abs(swipeY)){

        if(swipeX > threshold){

            // swipe right
            block.moveHorizontal(1);

        }

        else if(swipeX < -threshold){

            // swipe left
            block.moveHorizontal(-1);

        }

    }


    // Vertical swipe
    else{

        if(swipeY > threshold){

            // swipe down = faster falling
            keyDown = true;

            setTimeout(()=>{
                keyDown = false;
            },200);

        }

    }

});

 
document.addEventListener("keydown", (event)=>{

    if(event.key === "ArrowDown"){

        event.preventDefault();
        keyDown = true;

    }

});

function showgame(){
    Gameover_board.style.visibility = "visible"
   
}
function startgame(){
    Game_Matrix = Array.from({ length: 15 }, () => Array(9).fill(0));
    InactiveBlocks.forEach(block=>{
        block.Remove()
    })
    InactiveBlocks = []
    create()
    Gameover_board.style.visibility = "hidden"
}
window.addEventListener("resize", () => {

    updateBoardSize();

    block.blocks.forEach(pixel => {

        pixel.block.style.width = `${Block_width}px`;
        pixel.block.style.height = `${Block_height}px`;

        pixel.block.style.left = `${pixel.x * Block_width}px`;
        pixel.block.style.top = `${pixel.y * Block_height}px`;

    });
    InactiveBlocks.forEach(pixel=>{
         pixel.block.style.width = `${Block_width}px`;
        pixel.block.style.height = `${Block_height}px`;

        pixel.block.style.left = `${pixel.x * Block_width}px`;
        pixel.block.style.top = `${pixel.y * Block_height}px`;
    })

});