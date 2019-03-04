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
	console.error(trList)
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
	console.error(trList)
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
	}
	return arr;
}
renderSquence();
for(let k in data){
	renderDataTD(data[k], k);
}
let res = groupResult();
renderRateAndRes(res);