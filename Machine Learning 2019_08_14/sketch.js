Array.prototype.dimSet = function(item, x, y, z) {
    if ((typeof this[x]) != (typeof [])){
        this[x] = [];
        //console.log(1)
    }
    if ((typeof this[x][y]) != (typeof [])){
        //console.log(2)
        this[x][y] = [];
    }
    this[x][y][z] = item
}

Array.prototype.addMany_Unused = function(item, count) {
    for (let i = 0; i <= count -1; i++){
        this.push(item)
    }
}

function sortObj(list, key) {
    function compare(a, b) {
        a = a[1][key];
        b = b[1][key];
        return b - a;
    }
    return list.sort(compare);
}

function addMany(item, count) {
    output = []
    for (let i = 0; i <= count -1; i++){
        output.push(item)
    }
    return output

}

function randint(x){
    x++
    return (Math.floor(Math.random() * x))

}

function cap(x, low, high) {
    if (x <= low){
        x = low;
    } else if (x >= high){
        x = high;
    }
    return x
}

Array.prototype.getDims = function() {
    dims = [];
    for (let i = 0; i <= this.length -1; i++){
        dims.push(this[i].length)

    }
    dims.push(this[this.length -1][0].length)

    return dims
}

Array.prototype.multiClone = function(array) {
    for (let x = 0; x <= array.length -1; x++){
        for (let y = 0; y <= array[x].length -1; y++){
            for (let z = 0; z <= array[x][y].length -1; z++){
                this.dimSet(array[x][y][z], x, y, z)

            }
        }
    }
}

Array.prototype.randomWeights = function(dims) {
    console.log("called")
    for (let x = 0; x <= dims.length -1; x++){
        for (let y = 0; y <= dims[x] -1; y++){
            for (let z = 0; z <= dims[x + 1] -1; z++){
                let _random = randomGaussian()
                this.dimSet(_random, x, y, z)
                console.log(_random)

                //this.dimSet(1, x, y, z)
            }
        }
    }
}

function makeWeights(dims) {
    let weights = [];

    //console.log("called")
    for (let x = 0; x <= dims.length -1; x++){
        for (let y = 0; y <= dims[x] -1; y++){
            for (let z = 0; z <= dims[x + 1] -1; z++){
                let _random = randomGaussian()
                weights.dimSet(_random, x, y, z)
                //console.log(_random)

            }
        }
    }
    return weights
}

Array.prototype.muatate = function() {
    let randX = randint(this.length -1)
    let randY = randint(this[randX].length -1)
    let randZ = randint(this[randX][randY].length -1)

    this[randX][randY][randZ] += random() * 2 -1


}

Array.prototype.calc = function(input) {


    dims = this.getDims()
    if(input.length != this[0].length || input.length != dims[0]){
        console.log("BRUH BRUH BRUH")
    }
    calcList = []
    for(let i = 0; i <= dims.length -1; i++){
        //console.log(addMany(0, dims[i]))
        calcList[i] = addMany(0, dims[i])
    }
    calcList[0] = input
    //console.log(calcList)


    for (let x = 1; x <= this.length; x++){
        for (let y = 0; y <= dims[x] -1; y++){
            let chunk = 0;
            //console.log(y)
            for (let z = 0; z <= dims[x -1] -1; z++){
                //       -=- WEIGHT -=- -=-
                //console.log(this[x -1][z][y], calcList[x -1][z])
                chunk += this[x -1][z][y] * calcList[x -1][z]


            }
            //console.log(x, y)

            calcList[x][y] = chunk;
        }
    }
    //console.log(calcList)
    return calcList[calcList.length -1]
}

function cloneObject(obj) {
    let clonedObj = {};
    let keys = Object.keys(obj)
    for (let i = 0; i <= keys.length -1; i++){
        clonedObj[keys[i]] = obj[keys[i]];
    }
    return clonedObj;
}

function clonePlayer(player) {
    //console.log(player)
    weightsClone = []
    weightsClone.multiClone(player[0])
    objClone = cloneObject(player[1])
    //console.log(weightsClone, objClone)
    return [weightsClone, objClone]

}

function newPlayer(brainId) {
    player = {
        x:400,
        y:400,
        foodX: randint(800),
        foodY: randint(800),
        r: randint(255),
        g: randint(255),
        b: randint(255),
        score:0,
        brainId:brainId,
        update: function(brain, show, randomColours) {
            if (randomColours){
                this.r = randint(255)
                this.g = randint(255)
                this.b = randint(255)
            }
            if(show){
                fill(this.r, this.g, this.b)
                ellipse(this.x, this.y, 20)
                ellipse(this.foodX, this.foodY, 10)
            }
            output = brain.calc([this.foodX - this.x, this.foodY - this.y, 1]);

            this.x += cap(output[0], -1, 1) * 5
            this.y += cap(output[1], -1, 1) * 5

            if (dist(this.x, this.y, this.foodX, this.foodY) < 10){
                this.foodX = random(800)
                this.foodY = random(800)
                this.score += 1


            }



        }

    }
    return player
}

function getPos(x, y, networkDims) {
    let xIncNumber = pWidth / (networkDims.length -1)
    let yIncNumber = pHeight / (Math.max(...networkDims) - 1)

    yPos = padding + y * yIncNumber + pHeight/2 - (yIncNumber * networkDims[x])/2 + yIncNumber/2
    xPos = padding + x * xIncNumber

    return [xPos, yPos]

}

function showNetwork(network, xPos, yPos, xSize, ySize) {
    fill(256,256,256, 128)
    rect(xPos - 15, yPos - 15, xSize + 30 , ySize + 30)
    fill(256)
    dims = network.getDims()
    function getPos(x, y) {
        let xIncNumber = xSize / (dims.length -1)
        let yIncNumber = ySize / (Math.max(...dims) - 1)

        _yPos = yPos + y * yIncNumber + ySize/2 - (yIncNumber * dims[x])/2 + yIncNumber/2
        _xPos = xPos + x * xIncNumber

        //console.log()
        return [_xPos, _yPos]

    }


    for (let x = 0; x <= dims.length - 1; x++) {
        for (let y = 0; y <= dims[x] -1; y++) {
            xyPos = getPos(x, y)

            //console.log(xyPos)
            if (x != network.length){
                for (let z = 0; z <= network[x][y].length -1; z++){
                    nextNodeXY = getPos(x + 1, z)
                    //console.log(network[x][y][z])

                    if(network[x][y][z] < 0){
                        stroke(255, 0, 0, abs(network[x][y][z]) *128)
                    }else{
                        stroke(0,0,255, abs(network[x][y][z]) *128)
                    }

                    line(xyPos[0], xyPos[1], nextNodeXY[0], nextNodeXY[1])
                    stroke(0)
                }
            }
            ellipse(xyPos[0], xyPos[1], 12, 12)
        }
    }
}

function setup() {
    createCanvas(800, 800);
}

let resetColours = false
let speed = 0;
function mouseClicked() {
    //speed++
    resetColours = true
    if (speed == 10){
        speed = 0
    }
}
let highlightedIndex = 0
let first = true;
let player;
let creatures = [];
let creatureCount = 10
let frame = 0
function draw() {


    if(first){

        for (let i = 0; i <= creatureCount -1; i++){
            //console.log(makeWeights([3, 2, 2]), newPlayer(i))
            creatures.push([makeWeights([3, 2, 2]), newPlayer(i)])
        }
        first = false
    }

    for(let it = 0; it <= speed; it++){
        if (it == 0){
            background(50);
            showing = true
        } else{
            showing = false
        }

        frame++
        avgScore = 0
        for (let i = 0; i <= creatureCount -1; i++){
            //console.log(creatures[i])
            creatures[i][1].update(creatures[i][0], showing, resetColours)
            avgScore += creatures[i][1].score

            //console.log(highlightedIndex)
            if(creatures[i][1].score > creatures[highlightedIndex][1].score){

                highlightedIndex = i
            }
        }
        resetColours = false
        if(showing){
            fill(255)
            text("Avg score: " + avgScore / creatureCount, 300, 30)
            text("Frame: " + frame, 300, 70)
            text("Speed: " + speed, 500, 30)
            //console.log(creatures[highlightedIndex][0])
            showNetwork(creatures[highlightedIndex][0], 15, 15, 100, 60)



            textSize(30);
            textAlign(CENTER);
        }

        if (frame == 900){
            frame = 0
            console.log(avgScore / creatureCount)
            sortObj(creatures, "score")
            creatures = creatures.slice(0, creatureCount/2)
            //console.log(creatures)
            for (let i = 0; i <= creatureCount/2 -1; i++){
                creatures[i][1].x = 400
                creatures[i][1].y = 400
                creatures[i][1].score = 0
                creatures[i][1].foodX = randint(800)
                creatures[i][1].foodY = randint(800)

                creatures[i + creatureCount/2] = clonePlayer(creatures[i])
                creatures[i + creatureCount/2][0].muatate()
                creatures[i + creatureCount/2][1].foodX = randint(800)
                creatures[i + creatureCount/2][1].foodY = randint(800)

            }
            //console.log(creatures)
        }

        //console.log(frame)
    }
}
