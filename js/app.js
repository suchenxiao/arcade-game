// 游戏全局对象
// 存储全局参数及游戏进度
var game = {

    // 图片素材地址
    imgUrl : [
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/Selector.png',
        'images/Star.png'
    ],

    // 角色序号
    charNum : 1,

    // 横纵单位长度
    xUnit : 101,
    yUnit : 83,

    // 玩家及敌人位置（y轴）修正值
    playerOffset : -10,
    enemyOffset : -20,

    // 游戏环节：开始前 游戏中 选择角色 成功 失败 结束
    process : {
        before : false,
        during : false,
        selecting : true,
        win : false,
        fail : false,
        after : false
    }
};

// 游戏环节变更
game.procSet = function(proc){
    for( var p in this.process) { this.process[p] = false; }
    if(this.process[proc] !== undefined) this.process[proc] = true;
};
// 游戏环节进程
game.procShow = function(){
	for( var p in this.process) {
	    if(this.process[p]) return p;
    }
};

// 游戏初始化
game.init = function() {
    this.procSet('before');
};
// 游戏开始
game.start = function() {
    this.procSet('selecting');
    this.pageHidden(this.beforePage);
    this.pageHidden(this.afterPage);
    this.pageShow(this.duringPage);
    this.score.innerHTML = this.score.value = 0;
    this.timer.innerHTML = this.timer.value = 30;
    this.timer.style.width = '0%';
};
// 角色选定
game.charSele = function(){
    this.procSet('during');
    player = new Player(2, 5, game.charNum);
};

// 游戏成功
game.gameWin = function() {
    this.procSet('win');
    this.score.innerHTML = game.score.value += 1;
    star.show(player.x, player.y, 1);
    player.reset();
    this.procSet('during');
};
// 游戏失败
game.gameFail = function() {
    this.procSet('fail');
    this.score.innerHTML = game.score.value -= 1;
    player.reset();
    this.procSet('during');
};
// 游戏结束
game.gameOver = function() {
    this.procSet('after');
    this.finalScore.innerHTML = this.score.value;
    this.pageHidden(this.duringPage);
    this.pageShow(this.afterPage);
};

// 通过键盘按键，控制玩家移动
// 在游戏的不同时期，移动方法不同
game.handleInput = function(key){
    switch(this.procShow()){
        case 'before':
		  break;
		case 'selecting':
		  player.handleInputSelect(key);
		  break;
		case 'during':
		  player.handleInputGame(key);
		  break;
		 default:
		   {}
	}
};

// 游戏计时
// 控制倒计时进度
game.timedCount = function(dt) {
    this.timer.value -= dt;
    if(this.timer.value>0) {
        this.timer.innerHTML = Math.floor(this.timer.value);
        this.timer.style.width = (1 - this.timer.value / 30) * 100 + '%';
	} else {
        this.gameOver();
    }
}

// 游戏辅助内容
// 用于控制游戏开始页、倒计时条及结束页 渐变出现或隐藏
game.pageShow = function(obj){
    obj.style.display = 'flex';
    setTimeout(function(){
        obj.style.opacity = 1;
    }, 500);
}
game.pageHidden = function(obj){
    obj.style.opacity = 0;
    setTimeout(function(){
        obj.style.display = 'none';
    }, 500);
}

// 游戏DOM对象及监视器
game.beforePage = document.getElementsByClassName('before-game')[0];
game.duringPage = document.getElementsByClassName('during-game')[0];
game.afterPage = document.getElementsByClassName('after-game')[0];

game.startBtn = game.beforePage.getElementsByClassName('start')[0];
game.restartBtn = game.afterPage.getElementsByClassName('start')[0];

game.score = game.duringPage.getElementsByClassName('score')[0].getElementsByTagName('span')[0];
game.finalScore = game.afterPage.getElementsByClassName('score')[0];

game.timer = game.duringPage.getElementsByClassName('timer')[0].getElementsByTagName('span')[0];

game.startBtn.addEventListener('click', function(){
    game.start();
});
game.restartBtn.addEventListener('click', function(){
    game.start();
});


// 玩家要躲避的敌人
var Enemy = function() {
    this.sprite = game.imgUrl[0];
	this.reset();
};

// 更新敌人的位置，按时间自动移动
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    (this.x / game.xUnit < 6) ? (this.x += dt * this.speed) : this.reset();
};

// 在屏幕上画出敌人
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// 判定敌人是否与玩家碰撞
Enemy.prototype.impact = function() {
    if((this.y - game.enemyOffset == player.y - game.playerOffset) && (Math.abs(this.x - player.x) < game.xUnit / 2) && (!game.process.fail) ) {
        setTimeout(function(){game.gameFail()}, 10);
    }
};
// 重置敌人的位置及速度
Enemy.prototype.reset = function(){
    this.col = -2 * Math.random();
    this.row = Math.floor(4 * Math.random() + 1);
    this.speed = 500 * Math.random() + 200;
	this.x = this.col * game.xUnit;
	this.y = this.row * game.yUnit + game.enemyOffset;
};

// 玩家控制的角色
// 参数分别对应角色的初始位置及素材图编号
var Player = function(col, row, char) {
    this.sprite = game.imgUrl[char];
	this.col = col;
	this.row = row;
	this.reset();
}
// 判定玩家是否到达终点
Player.prototype.update = function() {
    if((this.y - game.playerOffset) / game.yUnit == 0 && !game.process.win) {
        setTimeout(function(){game.gameWin()}, 10)
    }
};
// 在屏幕上画出玩家角色
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// 重置玩家位置
Player.prototype.reset = function() {
    this.x = this.col * game.xUnit;
    this.y = this.row * game.yUnit + game.playerOffset;
};
// 控制角色移动（选人环节）
Player.prototype.handleInputSelect = function(key) {
    switch(key)
    {
    case 'left':
      if(player5.x > 2 * game.xUnit) {
        allPlayers.forEach(function(player){player.x -= game.xUnit;});
        game.charNum += 1;
      }
      break;
    case 'right':
      if(player1.x < 2 * game.xUnit){
        allPlayers.forEach(function(player){player.x += game.xUnit;});
        game.charNum -= 1;
      }
      break;
    case 'enter':
    case 'space':
      game.charSele();
      break;
    default:
      {}
    }
};
// 控制角色移动（游戏环节）
Player.prototype.handleInputGame = function(key) {
    switch(key)
    {
    case 'up':
      ((this.y - game.playerOffset) / game.yUnit >= 1 ) ? (this.y -= game.yUnit) : false; break;
    case 'down':
      ((this.y - game.playerOffset) / game.yUnit <= 4 ) ? (this.y += game.yUnit) : false; break;
    case 'left':
      (this.x / game.xUnit >= 1 ) ? (this.x -= game.xUnit) : false; break;
    case 'right':
      (this.x / game.xUnit <= 3 ) ? (this.x += game.xUnit) : false; break;
    default:
      {}
    }
};


// 选择角色时的背景框
var SelectBox = function(col, row) {
    Player.call(this, 2, 5, 6);
};
SelectBox.prototype = Object.create(Player.prototype);
SelectBox.prototype.constructor = SelectBox;


// 到达终点后闪现的星星
var Star = function(col, row){
    Player.call(this, 10, 10, 7);
};
Star.prototype = Object.create(Player.prototype);
Star.prototype.constructor = SelectBox;
Star.prototype.reset = function() {
    this.x = 1000;
    this.y = 1000;
}
Star.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// 星星出现的位置及时长
// 参数分别对应星星出现的位置(px)及时间(秒)
Star.prototype.show = function(x, y, sec) {
    this.x = x;
    this.y = y;
	setTimeout(function(){star.reset()}, sec*1000);
};


// 实例化所有的对象
var enemy1 = new Enemy();
var enemy2 = new Enemy();
var enemy3 = new Enemy();
var enemy4 = new Enemy();
// 所有敌人的对象都放入 allEnemies 数组
var allEnemies = [enemy1, enemy2, enemy3, enemy4];

var player1 = new Player(2, 5, 1);
var player2 = new Player(3, 5, 2);
var player3 = new Player(4, 5, 3);
var player4 = new Player(5, 5, 4);
var player5 = new Player(6, 5, 5);
var allPlayers = [player1, player2, player3, player4, player5];
// 玩家选定的角色放入 plater 变量，预设角色1
var player = player1;

var selectBox = new SelectBox();
var star = new Star();


// 这段代码监听游戏玩家的键盘点击事件
// 并且代表将按键的关键词送到 game.handleInput()
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        65: 'left',
        87: 'up',
        68: 'right',
        83: 'down',
        13: 'enter',
        32: 'space'
    };

    game.handleInput(allowedKeys[e.keyCode]);

});
