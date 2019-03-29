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
renderSquence();
for(let k in data){
	renderDataTD(data[k], k);
}
let res = groupResult();
renderRateAndRes(res);
let stage = getBuyStage(res);
renderBuyStage(stage);