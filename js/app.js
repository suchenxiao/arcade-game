// 横纵单位长度
const xUnit = 101, yUnit = 83;
// 玩家及敌人位置（y轴）修正值
const playerOffset = -10 , enemyOffset = -20;

// 这是我们的玩家要躲避的敌人 
var Enemy = function() {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多

    // 敌人的图片，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
	this.reset();
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    (this.x / xUnit < 6) ? (this.x += dt * this.speed) : this.reset();
    if(this.impact(player) && !player.over) {
        setTimeout(function(){player.gameOver()}, 10);
    }

};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// 判定敌人是否与玩家碰撞
Enemy.prototype.impact = function(player) {
    return ((this.y - enemyOffset == player.y - playerOffset) && (Math.abs(this.x - player.x) < xUnit/2));
}
// 设置敌人随机值
Enemy.prototype.reset = function(){
    this.col = -2 * Math.random();
    this.row = Math.floor(4 * Math.random() + 1);
    this.speed = 500 * Math.random() + 200;
	this.x = this.col * xUnit;
	this.y = this.row * yUnit + enemyOffset;
}

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
var Player = function(col, row, char) {

    // 玩家的图片
    this.chars = ['boy', 'cat-girl', 'horn-girl', 'pink-girl', 'princess-girl']
    this.sprite = 'images/char-' + this.chars[char] + '.png';
	this.col = col;
	this.row = row;
	this.reset();
}
Player.prototype.update = function() {
    if((this.y - playerOffset) / yUnit == 0 && !this.won) {
        setTimeout(function(){player.gameWon()}, 10)
    }
};
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
//控制玩家移动
Player.prototype.handleInput = function(key) {
    switch(key)
    {
    case 'up':
      {((this.y - playerOffset) / yUnit >= 1 ) ? (this.y -= yUnit) : false; break;}
    case 'down':
      {((this.y - playerOffset) / yUnit <= 4 ) ? (this.y += yUnit) : false; break;}
    case 'left':
      {(this.x / xUnit >= 1 ) ? (this.x -= xUnit) : false; break;}
    case 'right':
      {(this.x / xUnit <= 3 ) ? (this.x += xUnit) : false; break;}
    default:
      {}
    }
};
//重置玩家位置
Player.prototype.reset = function() {
    this.x = this.col * xUnit;
	this.y = this.row * yUnit + playerOffset;
	this.won = false;
	this.over = false;
}
//游戏成功
Player.prototype.gameWon = function() {
    this.won = true;
    alert("YES");
    this.reset();
}
//游戏失败
Player.prototype.gameOver = function() {
    this.over = true;
    alert("NO!");
    this.reset();
}

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
var enemy1 = new Enemy();
var enemy2 = new Enemy();
var enemy3 = new Enemy();
var enemy4 = new Enemy();
var allEnemies = [enemy1, enemy2, enemy3, enemy4];

var player1 = new Player(2, 5, 0);
var player2 = new Player(2, 5, 1);
var player3 = new Player(2, 5, 2);
var player4 = new Player(2, 5, 3);
var player5 = new Player(2, 5, 4);
var player = player3;

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Player.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
