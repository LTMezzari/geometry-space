import Player from '../model/Player.js'
import Keys from '../constants/Keys.js'

var canvas
var context

var player

function setup() {
    canvas = document.getElementById('game')
    context = canvas.getContext('2d')

    player = new Player()
    play()
}

function play() {
    update()
    draw(canvas, context)
    setTimeout(play, 100)
}

function update() {

}

function draw() {
    drawScreen()
    player.draw(context)
}

function drawScreen() {
    context.fillStyle = '#AAA'
    context.fillRect(0, 0, canvas.width, canvas.height)
}

function onKeyPress(event) {

}

function onKeyUp(event) {

}

window.onload = setup
window.onkeydown = onKeyPress
window.onkeyup = onKeyUp