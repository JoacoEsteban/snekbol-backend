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

  resetPosition (x = 0, y = 0, length = 1, direction = this.prevDirection) {
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

    if (this.firstSegment) {
      if (this.firstSegment.direction !== nextDirection) {
        this.body = [{
          direction: nextDirection,
          _length: 0
        }, ...this.body]
      }
    }

    if (this.isColliding(newPos)) return this.die()

    // this.body = [this.head, ...this.body]
    // this.body.pop()
    this.firstSegment && this.firstSegment._length++
    this.lastSegment && (!--this.lastSegment._length) && this.body.pop()
    this.head = newPos
    console.log(this.body)
    // this.nextDirection = null
    this.prevDirection = nextDirection

  }

  isColliding (pos = this.head) {
    return this.OOB(pos) || this.collidingWithSnakes(pos)
  }

  OOB (pos = this.head) {
    const max = this.#PARENT.game.gridSize
    const Y = pos[0]
    const X = pos[1]
    return (Y < 0 || Y >= max) || (X < 0 || X >= max)
  }

  collidingWithSnakes (pos) {
    return this.#PARENT.game.connectedPlayers.some(p => this.collidingWithSnake(p.snake, pos))
  }
  collidingWithSnake (snake, pos) {
    const {head, body} = snake
    const isSame = snake === this

    if (!isSame && snake.head[0] === pos[0] && snake.head[1] === pos[1]) return true // colliding head

    const operate = (seg, l) => {
      switch (seg.direction) {
        case 0:
          start[0] -= l
          break
        case 1:
          start[1] += l
          break
        case 2:
          start[0] += l
          break
        case 3:
          start[1] -= l
          break
      }
    }
    const start = [...head]
    return body.some((seg, i) => {
      // if (isSame && i === 0 && seg) operate(seg, 1)
      if (pos[0] === start[0]) {
        if (pos[1] === start[1]) return true
        if (pos[1] < start[1] && seg.direction === 3 && start[1] - seg._length < pos[1]) return true
        else if (seg.direction === 1 && start[1] + seg._length >= pos[1]) return true
      }
      if (pos[1] === start[1]) {
        if (pos[0] === start[0]) return true
        if (pos[0] < start[0] && seg.direction === 0 && start[0] - seg._length <= pos[0]) return true
        else if (seg.direction === 2 && start[0] + seg._length >= pos[0]) return true
      }

      // operate
      operate(seg, seg._length)
    })
    // return false
  }

  grow () {
    this.lastSegment._length++
    // const newCell = this.body.length > 0 ? [...(_.last(this.body))] : this.head
    // let index = 0
    // let op = -1
    // switch (this.prevDirection) {
    //   case 1:
    //   case 3:
    //     index = 1
    //   case 2:
    //   case 3:
    //     op = 1
    // }
    // newCell[index] += op
    // this.body.push(newCell)
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
