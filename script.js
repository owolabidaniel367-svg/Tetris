const info_board = document.getElementById("infoBoard")
const game_board = document.getElementById("gameBoard")
const rect = game_board.getBoundingClientRect();
const Block_height = (rect.height/15)
const Block_width = (rect.width/9)
const colors = [
    "#FF3B30", // Bright Red
    "#FF9500", // Bright Orange
    "#FFD60A", // Bright Yellow
    "#30D158", // Bright Green
    "#0A84FF", // Bright Blue
    "#BF5AF2"  // Bright Purple
];
let keyDown = false
this.Aray = []
const blockmat = {

    // A - I Piece (4×4)
    A: [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
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
    ]

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
        this.block.style.left = `${this.x}px`
        this.block.style.top = `${this.y}px`
    }
    update(){
        this.y += Block_height
this.block.style.top = `${this.y}px`


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
for (let i = 0; i < this.size; i++) {
             for (let j = 0; j < this.size; j++) {
               if (this.mat[i][j] == 0) {continue}
               const pixel = new Block(this.x + (Block_width*j),
                                (Block_height*i),
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
    // if(inside(this.count + 1)){
    //     return true
    // }
    return true
}

checkcolision(){

   
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
        block.x += dir * Block_width
        block.block.style.left = `${block.x}px`
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
            remove();
            return; 

        }

    }

    
    requestAnimationFrame(this.move.bind(this));

}
}


let block = new BlockA(2,colors[5],blockmat["E"])

// functions that updates gamematrix 
function create(){

 
 
 block.create()
requestAnimationFrame(block.move.bind(block));
return block


}
function remove() {
    block = null
    const alphabet = {1:"A", 2:"B", 3:"C",4:"D",5:"E",6:"F",7:"G"}
    block = new BlockA(
        Math.floor(Math.random() * 5),
        colors[Math.floor(Math.random() * colors.length)],
        blockmat[alphabet[Math.floor((Math.random() * 6)+1)]]
    );
     block.create()
   requestAnimationFrame(block.move.bind(block));
   
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
  console.log(Game_Matrix)
}

document.addEventListener("keydown", (event)=>{

    if(event.key === "ArrowLeft"){
        block.moveHorizontal(-1)
    }

    if(event.key === "ArrowRight"){
        block.moveHorizontal(1)
    }

   

})
document.addEventListener("keyup", (event)=>{

    if(event.key === "ArrowDown"){
        keyDown = false;
    }

});
// Screen-touch 
game_board.addEventListener("touchstart", (event)=>{

    event.preventDefault();

    let touch = event.touches[0];

    // position of finger relative to the game board
    let rect = game_board.getBoundingClientRect();

    let touchY = touch.clientY - rect.top;
    let touchX = touch.clientX - rect.left;


    // lower half of screen = soft drop
    if(touchY > rect.height / 2){

        keyDown = true;

    }

    else{

        if(touchX < rect.width / 2){

            block.moveHorizontal(-1);

        }
        else{

            block.moveHorizontal(1);

        }

    }

});
game_board.addEventListener("touchend", ()=>{

    keyDown = false;

});

 
document.addEventListener("keydown", (event)=>{

    if(event.key === "ArrowDown"){

        event.preventDefault();
        keyDown = true;

    }

});