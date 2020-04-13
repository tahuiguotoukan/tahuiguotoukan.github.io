var game = {
	init:{
		rowNum : 20,//初始化表格的行
		colNum : 20,//初始化表格的列
		foodNum : 10,//初始化食物数量
		speed: 200,//初始化蛇的移动速度
		foodColor: 'red',//食物颜色
		snakeBodyColor: '#6F3',//蛇身体的颜色
		snakeHeadColor: 'black',//蛇头的颜色
		backgroundColor: 'yellow',//表格的颜色
		direction : 'right',//默认蛇的移动方向,右
		state: '',
		snakePosition : ["10-7","10-8","10-9","10-10"],//蛇每节身体的坐标，横纵坐标以-隔开
		initFrame:function() {//加载游戏界面
			game.pfunction.loadWall();
			game.pfunction.loadSnake();
			game.pfunction.loadFood(game.init.foodNum);
			game.init.initEvent();
		},
		initEvent:function(){
			$("#start").unbind("click");
			$("#start").bind("click", function() {//开始按钮事件
				if($(this).val() == "再来一局") {
					game.gamerestart();
					return;
				}
				game.init.direction = "right";
				$(this).hide();
				game.init.state = setInterval(function() {
					var len = game.pfunction.getSnakeSize();//得到蛇的长度
					if(game.init.direction == "right") {//向右移动
						//得到蛇头的将要到达的坐标，向右移动x坐标不变，y坐标+1
						var x = game.pfunction.getX(len-1);
						var y =game.pfunction.getY(len-1) + 1;
						if(y>=game.init.rowNum) {//判断蛇是否撞到了墙
							game.gameover();return;
						}
					}else if(game.init.direction == "left") {//向左移动
						//得到蛇头的将要到达的坐标，向左移动x坐标不变，y坐标-1
						var x = game.pfunction.getX(len-1);
						var y =game.pfunction.getY(len-1) - 1;
						if(y<0) {
							game.gameover();return;
						}
					}else if(game.init.direction == "up") {//向上移动
						//得到蛇头的将要到达的坐标，向上移动x坐标-1，y坐标不变
						var x = game.pfunction.getX(len-1) - 1;
						var y =game.pfunction.getY(len-1);
						if(x<0) {
							game.gameover();return;
						}
					}else if(game.init.direction == "down") {//向下移动
						//得到蛇头的将要到达的坐标，向下移动x坐标+1，y坐标不变
						var x = game.pfunction.getX(len-1) + 1;
						var y =game.pfunction.getY(len-1);
						if(x>=game.init.colNum) {
							game.gameover();return;
						}
					}
					game.pfunction.judgeWhetherIsSnakeBody(x+"-"+y);//判断蛇是都撞到了自己的身体，若是游戏结束
					game.pfunction.judgeWhetherIsFood(x+"-"+y);//判断将要前进的方向是否是食物
					game.pfunction.addHead(x+"-"+y);//蛇头前一个位置变成蛇头
					game.pfunction.createFood();//如果蛇吃掉了一个食物，重新产生一个食物，没有则不产生
					game.pfunction.loadSnake();//重新把蛇显示出来
				},game.init.speed);
			});
			
			$(document).keydown(function(event){ //键盘按下事件
				var e = event || window.event || arguments.callee.caller.arguments[0];
          		if(e && e.keyCode==87){ // 按 w 
					if(game.init.direction == "down") {
						game.init.direction = "down"
						return;
					}
               		game.init.direction = "up";
              	}
              	if(e && e.keyCode==65){ // 按 a 
					if(game.init.direction == "right") {
						game.init.direction = "right"
						return;
					}
                  	game.init.direction = "left";
                }            
             	if(e && e.keyCode==83){ // 按 s
					if(game.init.direction == "up") {
						game.init.direction = "up"
						return;
					}
                	game.init.direction = "down";
           		}
				if(e && e.keyCode==68){ // 按 d
					if(game.init.direction == "left") {
						game.init.direction = "left"
						return;
					}
               		game.init.direction = "right";
           		}
			}); 
		}
	},
	pfunction:{
		loadWall:function() {//动态产生整个表格，也就是蛇活动的区域
			for(var i=0;i<game.init.rowNum;i++) {
				$TR = $("<tr/>").attr("id",i);
				for(var j=0;j<game.init.colNum;j++) {
					$TD = $("<td/>").attr("id",i+"-"+j).attr("class","empty")
									.css("background",game.init.backgroundColor);
					$TR.append($TD);
				}
				$("#frameTable").append($TR);
			}
		},
		loadSnake:function() {//遍历蛇身的坐标，把蛇在界面上显示出来
			for(var i=0;i<game.pfunction.getSnakeSize();i++) {
				var position = game.init.snakePosition[i];
				if(i == game.pfunction.getSnakeSize()-1) {
					$("#"+position).css("background",game.init.snakeHeadColor);
				}else {
					$("#"+position).css("background",game.init.snakeBodyColor);
				}
				$("#"+position).attr("class","snake");
			}
		},
		loadFood:function(foodNum) {//随机产生foodNum个食物
			var i = 0;
			while(i<foodNum) {
				var x = parseInt(Math.random()*19);
				var y = parseInt(Math.random()*19);
				var seat = x+"-"+y;
				if($("#"+seat).attr("class") == "snake" || $("#"+seat).attr("class") == "food") {
					continue;
				}
				$("#"+seat).css("background",game.init.foodColor);
				$("#"+seat).attr("class","food");
				i++;	
			}
		},
		getX:function(index) {
			return parseInt(game.init.snakePosition[index].split("-")[0]);
		},
		getY:function(index) {
			return parseInt(game.init.snakePosition[index].split("-")[1])
		},
		removeFoot:function() {//移除蛇尾
			return game.init.snakePosition.splice(0,1);
		},
		addHead:function(head) {//添加蛇头
			game.init.snakePosition.push(head);
		},
		getSnakeSize:function() {//得到此时蛇的长度
			return game.init.snakePosition.length;
		},
		judgeWhetherIsFood:function(pre) {
			if($("#"+pre).attr("class") != "food") {
				var foot = game.pfunction.removeFoot();
				$("#"+foot).css("background",game.init.backgroundColor);
				$("#"+foot).attr("class","empty");
			}
		},
		judgeWhetherIsSnakeBody:function(pre) {
			if($("#"+pre).attr("class") == "snake") {
				game.gameover();
			}
		},
		createFood:function() {//遍历整个界面的食物，如果食物少了一个，重新产生一个食物
			var foodNo = 0;
			for(var i=0;i<game.init.rowNum;i++) {
				for(var j=0;j<game.init.colNum;j++) {
					if($("#"+i+"-"+j).attr("class") == "food") {
						foodNo++;
					}
				}
			}
			if(foodNo<game.init.foodNum) {
				game.pfunction.loadFood(1);
			}
		},
	},
	gamerestart:function() {//再来一局，重新初始化界面
		for(var i=0;i<game.init.rowNum;i++) {
			for(var j=0;j<game.init.colNum;j++) {
				$("#"+i+"-"+j).attr("class","empty").css("background",game.init.backgroundColor);
			}
		}	
		game.init.snakePosition = ["10-7","10-8","10-9","10-10"];
		game.pfunction.loadSnake();
		game.pfunction.loadFood(game.init.foodNum);
		$("#start").val("开始");
	},
	gameover:function() {//游戏结束
		clearInterval(game.init.state);
		$("#start").val("再来一局");
		$("#start").show();
		alert("game over");
	}
};
 
$(function() {
	game.init.initFrame();
});
