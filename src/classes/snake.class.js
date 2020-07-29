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

    if (this.isColliding(newPos)) return this.die()

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

  isColliding (pos = this.head) {
    return this.isOOB(pos) || this.isCollidingWithSnakes(pos)
  }

  isOOB (pos = this.head) {
    const max = this.#PARENT.game.gridSize
    const Y = pos[0]
    const X = pos[1]
    return (Y < 0 || Y > max) || (X < 0 || X > max)
  }

  isCollidingWithSnakes (pos) {
    return this.#PARENT.game.connectedPlayers.some(p => this.isCollidingWithSnake(p.snake, pos))
  }
  isCollidingWithSnake (snake, pos) {
    const isSame = snake === this

    const movePointer = (segment) => {
      switch (segment.direction) {
        case 0:
          pointer[0] += segment._length
          break
        case 1:
          pointer[1] -= segment._length
          break
        case 2:
          pointer[0] -= segment._length
          break
        case 3:
          pointer[1] += segment._length
          break
      }
    }

    const pointer = [...snake.head]
    const body = snake.body

    return body.some((segment, i) => {
      if (i === 0 && isSame) return movePointer(segment)
      const isY = pointer[0] === pos[0]
      const isX = pointer[1] === pos[1]

      if (isY && isX) return true

      if (isY) {
        if (segment.direction === 1) { if (pos[1] < pointer[1] && pos[1] > (pointer[1] - segment._length)) return true }
        else if (segment.direction === 3) { if (pos[1] > pointer[1] && pos[1] < (pointer[1] + segment._length)) return true }
      } else if (isX) {
        if (segment.direction === 0) { if (pos[0] > pointer[0] && pos[0] < (pointer[0] + segment._length)) return true }
        else if (segment.direction === 2) { if (pos[0] < pointer[0] && pos[0] > (pointer[0] - segment._length)) return true }
      }

      movePointer(segment)
    })
  }

  grow () {
    this.lastSegment._length++
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
