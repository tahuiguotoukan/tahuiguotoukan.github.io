function renderSquence() {
	let table = document.getElementById('dataTable');
	table.innerHTML = '<tr><td>序号</td><td>期数</td></tr>';
	sequence.forEach((v, k) => {
		var tr = '<tr><td>' + (k+1) +'</td><td>' + v +'</td></tr>'
		table.innerHTML += tr;
	})
}
function renderDataTD(d,title) {
	let len = sequence.length;
	let table = document.getElementById('dataTable');
	let trList = table.getElementsByTagName('tr');
	trList[0].innerHTML += '<td>' + title + '</td>';
	for(let i = 0; i < len; i++){
		if(trList[i+1] && d[i] != null){

			trList[i+1].innerHTML += '<td>' + d[i] + '</td>';
		}
	}
}
function renderRateAndRes(d) {
	let len = sequence.length;
	let table = document.getElementById('dataTable');
	let trList = table.getElementsByTagName('tr');
	trList[0].innerHTML += '<td>胜率</td>';
	for(let i = 0; i < len; i++){
		if(trList[i+1] && d[i] != null){
			if(d[i].res === 0){
				trList[i+1].innerHTML += '<td class="wrong">' + d[i].rate + '</td>';
			}else {
				trList[i+1].innerHTML += '<td>' + d[i].rate + '</td>';
			}
			
		}
	}
}
function groupResult() {
	let len = sequence.length;
	let wrong = 0;
	let arr = [];
	for(let i = 0; i < len; i++){
		arr[i] = {
			res: 1,
		};
		for(let k in data){
			if(data[k][i] === 0){
				arr[i].res = 0;
				wrong++;
				break;
			}
		}
		let = rate = 1 - wrong/(i+1);
		arr[i].rate = parseInt(rate*1000)/10 + '%';
		arr[i].rateNum = parseInt(rate*1000)/10;
	}
	return arr;
}
function getBuyStage(d) 
{
	console.log(d)
	let data = d;
	let result = [];
	let start = 0;
	let loop = function () {
//		满足条件停止递归
		if(start === (data.length)){
			
			return false;
		}
		let oldstart = start;
		//先获取起始值
		for(let i = start; i < data.length; i++){
			if(data[i].res === 0 && data[i].rateNum <= 66.6){
				start = i+1;
				break;
			}
		}
		//说明没有满足条件的起始值了，遍历完成
		if(oldstart === start){
			return false;
		}
		//获取盈利区间的数据
		let arr = [];
		for(let i = start; i < data.length; i++){
			arr.push({
				index: i+1,
				res: data[i].res,
				rateNum: data[i].rateNum,
				rate: data[i].rate
			})
			if((data[i].res === 0 && data[i].rateNum > 66.6) || (i === (data.length -1))){
				start = i+1;
				result.push(arr);
				//递归遍历获取所有盈利区间
				loop();
				break;
			}
		}
		
	}
	loop();
	console.log(result);
	return result;
}
function renderBuyStage(d)
{
	let res = document.getElementById('stageRelust');
	res.innerHTML = '';
	for(let i = 0; i < d.length; i++){
		let item = d[i];
		let p = document.createElement('p');
		let errNum = 0;
		let count = item.length
		for(let j = 0; j < count; j++){
			if(item[j].res === 0){
				errNum++;
			}
		}
		let winBase = parseInt(((count - errNum)*48.6 - count*30)*100)/100;
		p.innerHTML = 
		'机会出现次数：' + (i+1)
		+'&nbsp;&nbsp;&nbsp;&nbsp;买入开始位置序号：' + item[0].index
		+'&nbsp;&nbsp;&nbsp;&nbsp;买入总局数：' + count 
		+ '&nbsp;&nbsp;&nbsp;&nbsp;输局数：' + errNum 
		+ '&nbsp;&nbsp;&nbsp;&nbsp;盈利基数：' + winBase;
		res.appendChild(p);
	}
}
function calculateWinInEachPeriod(d){
	let arr = [];
	d.forEach((v, i) => {
		if(i === 0){
			if(v.res === 0){
				arr.push(-30);
			}else{
				arr.push(18.6);
			}
		}else{
			if(v.res === 0){
				arr.push(arr[i-1] - 30);
			}else{
				arr.push(arr[i-1] + 18.6);
			}
		}
	})
	return arr;
}

function renderChart(){
	let arr = calculateWinInEachPeriod(res);
	var ctx = document.getElementById('myChart').getContext('2d');
	let a = [];
	for(var i = 0; i < arr.length;i++)
   { 
    a.push((i+1)/3*(18.6*2-30));//将数组arr2中的值写入data
   }
	var chart = new Chart(ctx, {
	    // The type of chart we want to create
	    type: 'line',
	
	    // The data for our dataset
	    data: {
	        labels: sequence,
	        datasets: [
		        {
		            label: '实际值',
		            backgroundColor: 'rgb(255, 255, 255, 0)',
		            borderColor: 'rgb(255, 99, 132)',
		            data: arr
		        },
		        {
		            label: '理论值',
		            backgroundColor: 'rgb(255, 255, 255, 0)',
		            borderColor: 'rgb(245, 199, 132)',
		            data: a
		        }
	        ]
	    },
		
	    // Configuration options go here
	    options: {}
	    
	    //只要低于理论值的时候买入，持有一段时间在下一个波峰开始下行的时候退场，而且高点与理论值的差值越来越稳定
	});
	 
}
renderSquence();
for(let k in data){
	renderDataTD(data[k], k);
}
let res = groupResult();
renderRateAndRes(res);
let stage = getBuyStage(res);
renderBuyStage(stage);
console.error(calculateWinInEachPeriod(res));
renderChart();