module.exports = class Snake {
  constructor(parent, id = global.uuid(),) {
    this.#PARENT = parent
    this.head = [null, null]
    this.id = id
    this.body = []
    this.nextDirection = null
    this.prevDirection = 1
    this.counter = 0
    this.flags = {
      dead: false
    }
  }

  #PARENT = null

  move () {
    let goTo = this.nextDirection

    switch (goTo) {
      case 0:
        if (this.prevDirection === 2) goTo = this.prevDirection
        break
      case 1:
        if (this.prevDirection === 3) goTo = this.prevDirection
        break
      case 2:
        if (this.prevDirection === 0) goTo = this.prevDirection
        break
      case 3:
        if (this.prevDirection === 1) goTo = this.prevDirection
        break
      default:
        goTo = this.prevDirection
        break
    }

    const newPos = [...this.head]
    switch (goTo) {
      case 0:
        newPos[0]--
        break
      case 1:
        newPos[1]++
        break
      case 2:
        newPos[0]++
        break
      case 3:
        newPos[1]--
        break
    }

    if (this.isColliding(newPos)) return this.die()

    this.body = [this.head, ...this.body]
    this.body.pop()
    this.head = newPos
    this.nextDirection = null
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
    switch (this.prevDirection) {
      case 0:
        newCell[0]--
        break
      case 1:
        newCell[1]--
        break
      case 2:
        newCell[0]++
        break
      case 3:
        newCell[1]++
        break
    }
    this.body.push(newCell)
  }

  die () {
    this.flags.dead = true
    this.#PARENT.game.onSnakeDead(this.#PARENT)
  }
}