// 横纵单位长度
const xUnit = 101, yUnit = 83;
// 玩家及敌人位置（y轴）修正值
const playerOffset = -10 , enemyOffset = -20;

// 这是我们的玩家要躲避的敌人 
var Enemy = function(col, row) {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多

    // 敌人的图片，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
	this.col = col;
	this.row = row;
	this.x = col * xUnit;
	this.y = row * yUnit + enemyOffset;
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    this.x += dt*100;
	if(this.impact(player)) {
        player.reset();
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

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
var Player = function(col, row) {

    // 玩家的图片
    this.sprite = 'images/char-boy.png';
	this.col = col;
	this.row = row;
	this.x = col * xUnit;
	this.y = row * yUnit + playerOffset;
}
Player.prototype.update = function(dt) {

};
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
//控制玩家移动
Player.prototype.handleInput = function(key) {
    switch(key)
    {
    case 'up':
      {((this.y - enemyOffset) / yUnit >= 1 ) ? (this.y -= yUnit) :_; break;}
    case 'down':
      {((this.y - enemyOffset) / yUnit <= 5 ) ? (this.y += yUnit) :_; break;}
    case 'left':
      {(this.x / xUnit >= 1 ) ? (this.x -= xUnit) : _; break;}
    case 'right':
      {(this.x / xUnit <= 3 ) ? (this.x += xUnit) : _; break;}
    default:
      {}
    }
};
//重置玩家位置
Player.prototype.reset = function(){
	alert("NO!!!");
    this.x = this.col * xUnit;
	this.y = this.row * yUnit;
}

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
var enemy1 = new Enemy(-0.5, 1);
var enemy2 = new Enemy(-0.5, 2);
var enemy3 = new Enemy(-0.5, 3);
var enemy4 = new Enemy(-0.5, 4);
var allEnemies = [enemy1, enemy2, enemy3, enemy4];

var player = new Player(2, 5);

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
