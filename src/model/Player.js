import Keys from '../constants/Keys.js'

class Player {
	constructor() {
		this.x = 0
		this.y = 0
		this.size = 10
		this.velocity = 5
	}

	draw(context) {
		context.fillStyle = '#000000'
		context.fillRect(this.x, this.y, this.size, this.size)
	}

	update(keys) {

	}

	move(keyCode) {
		switch (keyCode) {
			case Keys.KEY_DOWN:
				this.y += this.velocity
				break
			case Keys.KEY_UP:
				this.y -= this.velocity
				break
			case Keys.KEY_RIGHT:
				this.x += this.velocity
				break
			case Keys.KEY_LEFT:
				this.x -= this.velocity
				break
		}
	}
}

export default Player