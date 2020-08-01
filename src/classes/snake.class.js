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

  get game () {
    return this.#PARENT.game
  }

  get gameInstance () {
    return this.game.gameInstance
  }

  get firstSegment () {
    return this.body[0]
  }

  get lastSegment () {
    return this.body[this.body.length - 1]
  }

  resetPosition (x = 0, y = 0, length = 10, direction = this.prevDirection) {
    this.head = [y, x]
    this.body = [{
      _length: length,
      direction
    }]
  }

  move () {
    const nextDirection = (Math.abs(this.nextDirection - this.prevDirection) === 2) ? this.prevDirection : this.nextDirection
    const newPos = [...this.head]
    let index = 0
    let op = -1
    switch (nextDirection) {
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
    newPos[index] += op

    if (this.gameInstance.isColliding(newPos)) return this.die()

    if (this.firstSegment && this.firstSegment.direction !== nextDirection) {
      this.body = [{
        direction: nextDirection,
        _length: 0
      }, ...this.body]
    }


    this.lastSegment && (!--this.lastSegment._length) && this.body.pop()
    this.firstSegment && this.firstSegment._length++
    this.head = newPos

    this.prevDirection = nextDirection
  }


  grow () {
    this.lastSegment._length++
  }

  die () {
    this.flags.dead = true
    this.game.onSnakeDead(this.#PARENT)
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
