type snakeBodySegment = {
  _length: number,
  direction: AllowedDirections
}

class Snake {
  private parent: Player
  head: coord
  id: string
  body: snakeBodySegment[]
  nextDirection: AllowedDirections
  prevDirection: AllowedDirections
  counter: number
  flags: {
    dead: boolean
  }

  constructor(parent: Player, id: string = global.uuid()) {
    this.parent = parent
    this.head = [0, 0]
    this.id = id
    this.body = []
    this.nextDirection = AllowedDirections.right
    this.prevDirection = AllowedDirections.right
    this.counter = 0
    this.flags = {
      dead: false
    }
  }

  get game () {
    return this.parent.game
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

  resetPosition (x: number = 0, y: number = 0, length: number = 10, direction: AllowedDirections = this.prevDirection): void {
    this.head = [y, x]
    this.body = [{
      _length: length,
      direction
    }]
  }

  move (): void {
    const nextDirection: AllowedDirections = (Math.abs(this.nextDirection - this.prevDirection) === 2) ? this.prevDirection : this.nextDirection
    // const newPos = [...this.head]
    const newPos = _.clone(this.head)
    let index = 0
    let op = -1
    switch (nextDirection) {
      case AllowedDirections.right:
        index = 1
        op = 1
        break
      case AllowedDirections.left:
        index = 1
        break
      case AllowedDirections.down:
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


  grow (): void {
    this.lastSegment._length++
  }

  die (): void {
    this.flags.dead = true
    this.game.onSnakeDead(this.parent)
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
