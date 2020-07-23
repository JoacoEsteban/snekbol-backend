module.exports = class Snake {
  constructor(parent, id = global.uuid(),) {
    this.#PARENT = parent
    this.head = [null, null]
    this.id = id
    this.body = []
    this.nextDirection = 1
    this.prevDirection = 1
    this.counter = 0
    this.flags = {
      dead: false
    }
  }

  #PARENT = null

  move () {
    let goTo = this.nextDirection

    if (Math.abs(goTo - this.prevDirection) === 2) goTo = this.prevDirection

    const newPos = [...this.head]

    let index = 0
    let op = -1
    switch (goTo) {
      case 1:
        index = 1
        op = 1
        break
      case 3:
        index = 1
        break
      case 2:
        op = 1
    }
    goTo === 3 && console.log(index, op, goTo)
    newPos[index] += op

    if (this.isColliding(newPos)) return this.die()

    this.body = [this.head, ...this.body]
    this.body.pop()
    this.head = newPos
    // this.nextDirection = null
    this.prevDirection = goTo

  }

  isColliding (pos = this.head) {
    return this.OOB(pos) || this.collidingWithSnakes()
  }

  OOB (pos = this.head) {
    const max = this.#PARENT.game.gridSize
    const Y = pos[0]
    const X = pos[1]
    return (Y < 0 || Y >= max) || (X < 0 || X >= max)
  }

  collidingWithSnakes () {
    return false
  }

  grow () {
    const newCell = this.body.length > 0 ? [...(_.last(this.body))] : this.head
    let index = 0
    let op = -1
    switch (this.prevDirection) {
      case 1:
      case 3:
        index = 1
      case 2:
      case 3:
        op = 1
    }
    newCell[index] += op
    this.body.push(newCell)
  }

  die () {
    this.flags.dead = true
    this.#PARENT.game.onSnakeDead(this.#PARENT)
  }
}

/*
NEW BODY STRUCTURE
  Snake is now a set of arrays with a direction and length instead of just a set of points
  only x,y is the head
  eg: 
                                 L-D
----------------------- 
--------------x....----
--------------.--------
--------------.--------
--------------.--------
-----x........x-------- HEAD 5,0 [10,1 | 4,0 | 4,1]





COLLISION LOGIC
compare snake head with other snakes vertices
if any coordinate of the vetex matches => compare direction, if direction matches => compare length, if length >= hay colision

*/
