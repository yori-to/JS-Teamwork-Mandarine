var radarChart = (function () {
	var ctx,
		chart,
		radarChart = {},
		data = {},
		options = {};

	ctx = document.getElementById('canvas-for-charts').getContext('2d');

	data = {
	    labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running", "Hovering"],
	    datasets: [
	        {
	            label: "My First dataset",
	            fillColor: "rgba(220,220,220,0.2)",
	            strokeColor: "rgba(220,220,220,1)",
	            pointColor: "rgba(220,220,220,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(220,220,220,1)",
	            data: [65, 59, 90, 81, 56, 55, 40, 25]
	        },
	        {
	            label: "My Second dataset",
	            fillColor: "rgba(151,187,205,0.2)",
	            strokeColor: "rgba(151,187,205,1)",
	            pointColor: "rgba(151,187,205,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(151,187,205,1)",
	            data: [28, 48, 40, 19, 96, 27, 100, 5]
	        }
	    ]
	};

	options = {

	};

	function createChart() {
		chart = new Chart(ctx).Radar(data, options);
	}

	radarChart = {
		draw: function() {
			if (!chart) {
				createChart();
			} else {
				chart.clear();
				chart.render();
			}
		}
	};

	return radarChart;

})(); 