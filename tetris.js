function randint(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
class tetris {
    constructor() {
        this.blocks = [
            { '1': [1, 4], '2': [2, 4], '3': [3, 4], '4': [4, 4] },
            { '1': [1, 4], '2': [2, 4], '3': [3, 4], '4': [3, 5] },
            { '1': [1, 5], '2': [2, 5], '3': [3, 4], '4': [3, 5] },
            { '1': [1, 4], '2': [2, 4], '3': [2, 5], '4': [3, 5] },
            { '1': [1, 5], '2': [2, 4], '3': [2, 5], '4': [3, 4] },
            { '1': [1, 4], '2': [1, 5], '3': [2, 4], '4': [2, 5] },
            { '1': [1, 4], '2': [2, 4], '3': [2, 5], '4': [3, 4] }
        ]
    }
    start() {
        let row;
        this.board = [];
        for (row = 0; row < 25; row++) {
            this.board.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        }
        this.off = false;
        this.alive = true;
        this.score = 0;
        this.que = randint(0, 6)
        this.block()
    }
    block() {
        this._burn();
        if (this.board[4].includes(1)) {
            this.alive = false;
            return
        }
        this.falling = { ...this.blocks[this.que] }
        this.que = randint(0, 6);
        this._set();
        this.off = false;
    }
    motion() {
        if (!this._colision_bot() && !this.off) {
            this._retire()
            this.falling['1'][0] += 1;
            this.falling['2'][0] += 1;
            this.falling['3'][0] += 1;
            this.falling['4'][0] += 1;
            this._set()
            return
        }
        this.off = true;
        this.block()
    }
    left() {
        if (this._collison_left() || this.off) {
            return
        }
        this._retire()
        this.falling['1'][1] -= 1;
        this.falling['2'][1] -= 1;
        this.falling['3'][1] -= 1;
        this.falling['4'][1] -= 1;
        this._set()
    }
    right() {
        if (this._collison_right() || this.off) {
            return
        }
        this._retire()
        this.falling['1'][1] += 1;
        this.falling['2'][1] += 1;
        this.falling['3'][1] += 1;
        this.falling['4'][1] += 1;
        this._set()
    }
    flip() { }
    _set() {
        let i;
        let val = Object.values(this.falling)
        for (i = 0; i < val.length; i++) {
            this.board[val[i][0]][val[i][1]] = 1
        }
    }
    _retire() {
        let i;
        let val = Object.values(this.falling)
        for (i = 0; i < val.length; i++) {
            this.board[val[i][0]][val[i][1]] = 0
        }
    }
    _burn() {

    }
    _is_square() {

    }
    _colision_bot() {
        let i;
        let val = Object.values(this.falling);
        for (i = 0; i < val.length; i++) {
            if (val[i][0] == 24 || (this.board[val[i][0] + 1][val[i][1]] == 1 && this._check(val[i][0] + 1, val[i][1]))) { console.log('bot'); return true }
        }
        return false
    }
    _collison_right() {
        let i;
        let val = Object.values(this.falling);
        for (i = 0; i < val.length; i++) {
            if (val[i][1] == 9 || (this.board[val[i][0]][val[i][1] + 1] == 1 && this._check(val[i][0], val[i][1] + 1))) { console.log('right'); return true }
        }
        return false
    }
    _collison_left() {
        let i;
        let val = Object.values(this.falling);
        for (i = 0; i < val.length; i++) {
            if (val[i][1] == 0 || (this.board[val[i][0]][val[i][1] - 1] == 1 && this._check(val[i][0], val[i][1] - 1))) { console.log('left'); return true }
        }
        return false
    }

    _check(v1, v2) {
        let i;
        let val = Object.values(this.falling)
        for (i = 0; i < val.length; i++) {
            if (v1 == val[i][0] && v2 == val[i][1]) { return false }
        }
        return true
    }
}
class engine {
    constructor(canvas) {
        this.canvas = document.getElementById(canvas);
        this.canvas.height = 800;
        this.canvas.width = 400;
        this.canvas.style.display = 'block'
        this.game = new tetris();
        this.pause = false;
        this.cvs = this.canvas.getContext('2d')
        this.start();
        this.down_lock = false;
        this.up_lock = false;
        this.left_lock = false;
        this.right_lock = false;
    }
    start() {
        this.game.start();
        let self = this;
        this.fps = setInterval(() => { self.run(self) }, 200)
    }
    run(self) {
        console.log(self.game.alive)
        if (!self.game.alive) { alert('GAME OVER!\n' + self.game.score.toString()); clearInterval(self.fps) }
        self.game.motion();
        self.draw();
        document.addEventListener('keydown', (e) => {
            if (e.key == 'ArrowDown' && !this.down_lock) { this.down_lock = true; this.game.motion() }
            else if (e.key == 'ArrowUp' && !this.up_lock) { this.up_lock = true; this.game.flip() }
            else if (e.key == 'ArrowLeft' && !this.left_lock) { this.left_lock = true; this.game.left() }
            else if (e.key == 'ArrowRight' && !this.right_lock) { this.right_lock = true; this.game.right() }
        })
        document.addEventListener('keyup', (e) => {
            if (e.key == 'ArrowDown') { this.down_lock = false }
            else if (e.key == 'ArrowUp') { this.up_lock = false; }
            else if (e.key == 'ArrowLeft') { this.left_lock = false; }
            else if (e.key == 'ArrowRight') { this.right_lock = false; }
        })
    }
    draw() {
        this.cvs.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let row, cell;
        for (row = 5; row < this.game.board.length; row++) {
            for (cell = 0; cell < this.game.board[row].length; cell++) {
                if (this.game.board[row][cell] == 1) {
                    this.cvs.fillStyle = 'black';
                    this.cvs.fillRect(40 * cell, 40 * (row - 5), 40, 40)
                    this.cvs.fillStyle = 'green';
                    this.cvs.fillRect(40 * cell + 1, 40 * (row - 5) + 1, 38, 38);
                }
            }
        }
    }
}