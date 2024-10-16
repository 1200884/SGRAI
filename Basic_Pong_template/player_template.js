import * as THREE from "three";

/*
 * parameters = {
 *  color: Integer,
 *  side: String,
 *  size: Vector2,
 *  speed: Float,
 *  baseline: Float,
 *  keyCodes: { down: String, up: String }
 * }
 */

export default class Player extends THREE.Mesh {
    constructor(parameters, table) {
        super();

        for (const [key, value] of Object.entries(parameters)) {
            Object.defineProperty(this, key, { value: value, writable: true, configurable: true, enumerable: true });
        }
        this.halfSize = this.size.clone().divideScalar(2.0);
        this.baseline *= table.halfSize.x;
        /* To-do #7 - Compute the rackets' lower and upper boundaries
            - both the lower and upper boundaries depend on the table and racket dimensions
            - more specifically, the boundaries depend on parameters table.halfSize.y (the table's half Y-dimension) and this.halfSize.y (the racket's half Y-dimension)
*/
        this.centerLower = -table.halfSize.y+this.halfSize.y;
        this.centerUpper = table.halfSize.y-this.halfSize.y;
        this.centerRearPlayer2 =table.halfSize.x-table.halfSize.x*0.05-this.halfSize.x;
        this.centerRearPlayer1= -table.halfSize.x+table.halfSize.x*0.05+this.halfSize.x; 
        this.centerFrontPlayer1= -table.halfSize.x+table.halfSize.x*0.95-this.halfSize.x;
        this.centerFrontPlayer2= table.halfSize.x-table.halfSize.x*0.95+this.halfSize.x;
        this.keyStates = { down: false, up: false,left:false, right :false };

        /* To-do #2 - Create the racket (a rectangle) with properties defined by the following parameters:
            - width: this.size.x
            - height: this.size.y
            - color: this.color

            - follow the instructions in this example to create the rectangle: https://threejs.org/docs/api/en/geometries/PlaneGeometry.html
*/
        this.geometry = new THREE.PlaneGeometry(this.size.x,this.size.y);
        this.material = new THREE.MeshBasicMaterial({color:this.color, side: THREE.DoubleSide}); 
        const plane = new THREE.Mesh( this.geometry, this.material);
        this.initialize();
    }

    /* To-do #8 - Check the racket's lower and upper boundaries
        - lower boundary: this.centerLower
        - upper boundary: this.centerUpper*/

    checkLowerBoundary() {
        if (this.center.y<this.centerLower) {
            this.center.y=this.centerLower

        }
    }

    checkUpperBoundary() {
        if (this.center.y>this.centerUpper) {
            this.center.y=this.centerUpper

        }
    }
     checkFrontBoundaryPlayer1(){
            if(this.center.x>this.centerFrontPlayer1){
                this.center.x=this.centerFrontPlayer1;
            }
        }
    
     checkFrontBoundaryPlayer2(){
        if(this.center.x<this.centerFrontPlayer2){
            this.center.x=this.centerFrontPlayer2;
        }
     }
     checkRearBoundaryPlayer1(){
        if(this.center.x<this.centerRearPlayer1){
            this.center.x=this.centerRearPlayer1;
        }
     }
     checkRearBoundaryPlayer2(){
        if(this.center.x>this.centerRearPlayer2){
            this.center.x=this.centerRearPlayer2;
        }
     }
    

    initialize() {
        this.center = new THREE.Vector2(this.baseline, 0.0);
        if (this.side == "left") { // Player 1 racket: the center's x-coordinate must be negative
            this.center.x = -this.center.x;
        }
        this.score = 0;
        /* To-do #3 - Set the racket's center position:
            - x: this.center.x
            - y: this.center.y
*/
        this.position.set(this.center.x,this.center.y); 
    }

    update(deltaT) {
        /* To-do #6 - Update the racket's center position
            - current position: this.center.y
            - current speed: this.speed
            - elapsed time: deltaT

            - start by computing the covered distance:
                covered distance = racket speed * elapsed time
            - then compute the racket's new position:
                new position = current position ± covered distance (+ or - depending on which key the user is pressing)
*/
    
        if (this.keyStates.down) {
           this.center.y-=this.speed*deltaT;
            this.checkLowerBoundary();
        }
        if (this.keyStates.up) {
            this.center.y +=this.speed*deltaT;
            this.checkUpperBoundary();
        }
        if(this.keyStates.left){
            if(this.center.x>0){   
                this.center.x-=this.speed*deltaT;
                this.checkFrontBoundaryPlayer2();
            }
            if(this.center.x<0){
                this.center.x-=this.speed*deltaT;
                this.checkRearBoundaryPlayer1();}
           }
        if(this.keyStates.right){
            if(this.center.x>0){   
                this.center.x+=this.speed*deltaT;
                this.checkRearBoundaryPlayer2();
                }
             if(this.center.x<0){
                    this.center.x+=this.speed*deltaT;
                    this.checkFrontBoundaryPlayer1();
                    
            }
           
        }
        this.position.set(this.center.x,this.center.y); 
       // this.scale(1.0,this.size.y/this.initialize.y);
    }
}