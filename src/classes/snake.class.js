module.exports = class Snake {
  constructor(id) {
    this.head = [null, null]
    this.id = id
    this.body = []
    this.nextDirection = null
    this.prevDirection = 0
    this.counter = 0
  }

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

    // if (this.isColliding()) return this.gameOver(this) TODO

    this.body = [this.head, ...this.body]
    this.body.pop()
    this.head = newPos
    this.nextDirection = null
    this.prevDirection = goTo
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
}