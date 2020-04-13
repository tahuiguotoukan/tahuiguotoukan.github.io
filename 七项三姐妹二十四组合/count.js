function renderChart(){
	
	var ctx = document.getElementById('myChart').getContext('2d');
	let datasets = [];
	for(let k in data)
	{
		
		let t = 0;
		let arr = [];
		let item = data[k];
		item.forEach(v => {
			t+=v;
			arr.push(t);
		});
		datasets.push({
			label: k,
			borderColor: `rgb(${Math.floor(Math.random()*255+1)}, ${Math.floor(Math.random()*255+1)}, ${Math.floor(Math.random()*255+1)})`,
			backgroundColor: 'rgba(255,255,255,0)',
			data: arr
		})
	}
	var chart = new Chart(ctx, {
	    // The type of chart we want to create
	    type: 'line',
	
	    // The data for our dataset
	    data: {
	        labels: sequence,
	        datasets: datasets
	    },
		
	    // Configuration options go here
	    options: {}
	    
	    //只要低于理论值的时候买入，持有一段时间在下一个波峰开始下行的时候退场，而且高点与理论值的差值越来越稳定
	});
	 
}
renderChart();