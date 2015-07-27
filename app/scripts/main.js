(function main() {
// ************************** Declaration Block **********************************
	var tvDoughnutChart,
		tvLineChart,
		tvBarChart,
		tvRadarChart,
		tvBubbleChart,
		// divWrapper,
		navigation,
		previousChart,
		canvas = document.getElementById('canvas-for-charts');
// *******************************************************************************		

// *************************** Main Magic ****************************************
	canvas.setAttribute('width', 1024);
	canvas.setAttribute('height', 600);

	databaseManager.loadDefaults();

	// Chart.defaults.global.animationEasing = 'easeInOutBounce';

	// divWrapper = document.getElementById('wrapper');
	navigation = document.getElementById('navi');

	tvDoughnutChart = doughnutChart;

	//tvLineChart = loadSecondApp; // To be edited

	//tvBarChart = loadThirdApp; // To be edited

	tvBubbleChart = bubbleChart;

	tvRadarChart = radarChart;

	function removePreviousChart(chart) {
		if (!chart) {
			return;
		}

		chart.remove();
	}
// *******************************************************************************

// *************************** Event Listener/s **********************************
	navigation.addEventListener('click', function(evt) {
		console.log(evt); // For debugging
		var clickedId = evt.target.id;

		removePreviousChart(previousChart);

		switch(clickedId) {
			case 'doughnut-chart-button': 
				tvDoughnutChart.draw();
				previousChart = tvDoughnutChart;
				break;
			case 'line-chart-button': 
				tvLineChart();
				break;
			case 'bar-chart-button': 
				tvBarChart();
				break;		
			case 'radar-chart-button': 
				tvRadarChart.draw();
				previousChart = tvRadarChart;
				break;
			case 'bubble-chart-button': 
				tvBubbleChart.draw();
				previousChart = tvBubbleChart;
				break;
			default: 
				break;	
		}
		
	});
// ******************************************************************************
}());

