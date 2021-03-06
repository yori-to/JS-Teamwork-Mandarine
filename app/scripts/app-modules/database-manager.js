(function (database) {

	var databaseManager,
		moviesFromLocalStorage,
		defaultMovieTitles,
		defaultMovieProperties,
		$movieForm = $('#movie-form'),
		$divMessage = $('<span id="message-from-movie-form" style="display: none" />'),
		$buttonSubmitMovie = $('#submit-movie-form'),
		$buttonSaveToLocalStorage = $('#save-movie-form'),
		inputs = {
			title: document.getElementById('movie-title'),
			rating: document.getElementById('movie-rating'),
			genre: document.getElementById('movie-genre'),
			ticketPrice: document.getElementById('movie-ticket-price'),
			duration: document.getElementById('movie-duration'),
			action: document.getElementById('movie-action-factor'),
			comedy:document.getElementById('movie-comedy-factor'),
			drama: document.getElementById('movie-drama-factor')
		};

// ************************** Default Titles *************************************
	defaultMovieTitles = [
		'Rambo',
		'Titanic',
		'American Pie',
		'Shrek',
		'Video Game High School'
	];
// *******************************************************************************

// ************************** Default Properties (For titles) ********************
	defaultMovieProperties = [
		{
			'Rating': 8,
			'Genre': 'Action',
			'Ticket Price': 5,
			'Duration': 8,
			'Action Factor': 9,
			'Comedy Factor': 5,
			'Drama Factor': 7
		},
		{
			'Rating': 9,
			'Genre': 'Drama',
			'Ticket Price': 7,
			'Duration': 9,
			'Action Factor': 5,
			'Comedy Factor': 4,
			'Drama Factor': 8
		},
		{
			'Rating': 6,
			'Genre': 'Comedy',
			'Ticket Price': 4,
			'Duration': 8.2,
			'Action Factor': 6,
			'Comedy Factor': 10,
			'Drama Factor': 2
		},
		{
			'Rating': 10,
			'Genre': 'Comedy',
			'Ticket Price': 5,
			'Duration': 7.2,
			'Action Factor': 7,
			'Comedy Factor': 9,
			'Drama Factor': 3
		},
		{
			'Rating': 7,
			'Genre': 'SciFi',
			'Ticket Price': 0.1,
			'Duration': 4.5,
			'Action Factor': 10,
			'Comedy Factor': 8,
			'Drama Factor': 8
		}
	];
// *******************************************************************************


// ************************** Setup Local Storage ********************************
	if (localStorage.getItem('moviesCollection')) {
		moviesFromLocalStorage = JSON.parse(localStorage.getItem('moviesCollection'));
		addMoviesFromLocalStorage(moviesFromLocalStorage);
	} else {
		loadDefaults();
		updateLocalStorage();
	}

	function updateLocalStorage() {
		var propertiesToStore = database.getPropertyNames();
		propertiesToStore.push('title');
		localStorage.setItem('moviesCollection', JSON.stringify(database.getAllMovies(), propertiesToStore));
	}

	function addMoviesFromLocalStorage(movies) {
		movies.forEach(function(movie) {
			var title = movie.title,
				propertyNames = database.getPropertyNames();
				properties = {};

			propertyNames.forEach(function(property) {
				properties[property] = movie[property];
			});

			try {
				database.addNew(title, properties);
			} 
			catch (error) {
				console.log(error.message);
				if (error.message === 'The database already contains a movie by that name') {
					return;
				} else {
					throw error;
				}
			}	
		});
	}

	function loadDefaults() {
		var i,
			len;

		if (defaultMovieTitles.length !== defaultMovieProperties.length) {
			throw new Error('"defaultMovieTitles" and "defaultMovieProperties" must be of the same length');
		}

		for (i = 0, len = defaultMovieTitles.length; i < len; i += 1) {
			database.addNew(defaultMovieTitles[i], defaultMovieProperties[i]);
		}
	}
// *******************************************************************************	
	function addMovie() {
		try {	
		database.addNew( 
			inputs.title.value , {
			'Rating': inputs.rating.valueAsNumber,
			'Genre': inputs.genre.value,
			'Ticket Price': inputs.ticketPrice.valueAsNumber,
			'Duration': inputs.duration.valueAsNumber,
			'Action Factor': inputs.action.valueAsNumber,
			'Comedy Factor': inputs.comedy.valueAsNumber,
			'Drama Factor': inputs.drama.valueAsNumber
			});

		displayMessage($divMessage, 'Movie submited succesfully!', $movieForm, 'green');
		radarChartLegend.updateAutocompleteSuggestions();
		checkWhichChartIsDrawnAndRedraw();

		} catch (error) {
			displayMessage($divMessage, error.message, $movieForm, 'red');
		}
	}

	function setNumberInputsStepAttribute(inputFields) {
		var step = 0.1,
			prop;
		for (prop in inputFields) {
			if (inputFields[prop].type === 'number') {
				inputFields[prop].setAttribute('step', step);
			}
		}	
	}

	function displayMessage(messageHolder, message, parrentElement, color) {
		// in case multiple click in short time
		if (messageHolder.is(':visible')) {
			if (message === messageHolder.text()) {
				return;
			} else {
				// first stop is for delay, second for animation
				messageHolder.stop().stop();
			}
		}

		messageHolder.text(message);

		if (color === 'green') {
			messageHolder.attr('style', 'background-color: rgba(178, 227, 86, 0.95)');
		} else if (color === 'red') {
			messageHolder.attr('style', 'background-color: rgba(233, 68, 68, 0.95)');
		}

		messageHolder.delay(1500).animate({
			opacity: 0
		}, 500, function() {
			messageHolder.hide();
		});
	}

	function checkWhichChartIsDrawnAndRedraw() {
		if (bubbleChart.isDrawn()) {
			console.log('buble');
			bubbleChart.remove();
			bubbleChart.draw();
		} else if (doughnutChart.isDrawn()) {
			console.log('dough');
			doughnutChart.remove(); 
			doughnutChart.draw();
		} else if (lineChart.isDrawn()) {
			console.log('line');
			lineChart.remove();
			lineChart.draw();
		} else if (pieChart.isDrawn()) {
			console.log('pie');
			pieChart.remove();
			pieChart.draw();
		} else if(polarChart.isDrawn()) {
			console.log('polar');
			polarChart.remove();
			polarChart.draw();
		} else if (pyramidChart.isDrawn()) {
			console.log('pyramid');
			pyramidChart.remove();
			pyramidChart.draw();
		}
	}

// ************************** #movie-form events ********************************	
	$movieForm.on('keydown', function(evt) {
		// if Enter
		if (evt.keyCode === 13) {
			addMovie();
			evt.preventDefault();
		// if Esc	
		} else if(evt.keyCode === 27) {
			var $movieFormButton = $('#toggle-movie-form');
			$movieFormButton.click();
			// Take focus to the button, else you can still type in the form
			$movieFormButton.focus();
		}
	});

	$buttonSubmitMovie.on('click', addMovie);

	$buttonSaveToLocalStorage.on('click', function() {
		try {
			updateLocalStorage();
			displayMessage($divMessage, 'Database saved locally', $movieForm, 'green');	
		} catch (error) {
			displayMessage($divMessage, error.message, $movieForm, 'red');
		}
	});

// *******************************************************************************	 	
	setNumberInputsStepAttribute(inputs);

	$divMessage.appendTo($movieForm);

})(movieDatabase);
