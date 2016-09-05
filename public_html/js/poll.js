$(document).ready(function(){

	google.charts.load('current', {packages: ['corechart','bar']});
	//Listen to the form for a submit event
	$('#poll').submit(function(event){
		//Stop the form from submitting
		event.preventDefault();



		// Find the checked option
		var voteValue = $('[name=vote]:checked').val();

		// Make sure someone has checked one of the options
		if( voteValue == undefined){
			// Display an error message
			$('#message').html('Please select your vote!');
			$('#message').removeClass('success').addClass('error');
		}
		if(voteValue == undefined) return;

		//AJAX
		$.ajax({
			type: 'get',
			url:'api/poll.php',
			data: {
				vote:voteValue
			},
			success: function(dataFromServer){
				console.log(dataFromServer);

				if(dataFromServer['status'] === false){

					$('#message').removeClass('success').addClass('error');
					$('#message').html(dataFromServer['message']);

				}else{

					$('#message').removeClass('error').addClass('success');
					$('#message').html(dataFromServer['message']);

					google.charts.setOnLoadCallback(drawBarChart);

					function drawBarChart(){

						//Prepare the data for the graph
						//Creating 3 columns in the table
						//Rows must send related data to each of the columns or there will be an error
						var data = google.visualization.arrayToDataTable([
									['Vote', 'Number of Votes', { role:'style'}],
					        ['Yes', parseFloat(dataFromServer['totalYes']), '#4cae4c'],
					        ['No', parseFloat(dataFromServer['totalNo']), '#d43f3a'],
						]);

						//Set the Options for the graph
						var options = {
							title: 'Do you like ice-cream?',
							legend: 'none',
							// hAxis: {format:'#'},
							animation:{
								duration: 1000,
								easing: 'out',
								startup: true
								}
						};

						//Set where you want the chart to go
						var chart = new google.visualization.BarChart(document.getElementById('container'));

						//Draw the Chart
						chart.draw(data, options);

					}
				}
			},
			error: function(){
				console.log("Connot connect to server.");
			}

		});




	});
});
