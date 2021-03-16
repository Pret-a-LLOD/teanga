window.onload = function() {
	$(document).ready(function() {
		// Initialize the event "show tooltip" when you put mouse over the circles
        // representing the services on the 2 step ( create workflow ) 'window'
        ////{
		$(function () {
			$('[data-toggle="tooltip"]').tooltip();
		});
        ////}


		// listing the available colours in bootstrap library to colour the services bubbles
		const colours = ["success", "info", "warning", "danger"];

		// creating the html for services bubbles
        // injecting html
////{
		let all_services = '';
		for (let key in all_jsons) {
			let jsonFile = load_json_file(all_jsons[key]);

			all_services += '<div class="draggable_operator btn btn-'+colours[key % colours.length]+' btn-circle btn-xl" data-nb-action="'+jsonFile.host+'" ';
			all_services += foreach_data_js(jsonFile, "input");
			all_services += foreach_data_js(jsonFile, "output");
			all_services += get_options(jsonFile);
			all_services += ' data-toggle="tooltip" data-placement="top" data-original-title="'+jsonFile.info.description+'">'+jsonFile.info.title+'</div>';
		}

		// injecting the services in the div representing the services area
		$("#services_area").html(all_services);
////}

		// the flowchart part
		const $flowchart = $('#chart_area');
		const $container = $flowchart.parent();

		// preparing input and output bubbles in the chart area
        ////{
		const data = {
			operators: {
				input: {
					top: 20,
					left: 50,
					properties: {
						title: 'Input',
						options: {},
						inputs: {},
						outputs: {
							output_1: {
								label: 'Uploaded Data',
							}
						}
					}
				},
				output: {
					top: 220,
					left: 600,
					properties: {
						title: 'Result',
						options: {},
						inputs: {
							input_1: {
								label: 'Data Result',
							}
						},
						outputs: {}
					}
				}
			}
		};
////}

		// Preparing the flowchart plugin
        // injecting html
////{
		$flowchart.flowchart({
			data: data,
			distanceFromArrow: 0,
			defaultLinkColor: "#5CB85C",
			defaultSelectedLinkColor: "#D95360",

			// listing behaviour on events
			onLinkSelect: function(linkId){
				$("g[data-link_id="+linkId+"] path").addClass("dashed-line");
				return true;
			},

			onLinkUnselect: function() {
				$(".dashed-line").removeClass("dashed-line");
				return true;
			},

			onOperatorSelect: function(operatorId) {

				// on selecting the service, show options panel if it contains
				let operator_options = $flowchart.flowchart('getOperatorOptions', operatorId);
				let options_count = Object.keys(operator_options).length;
				let options_contents;

				if (options_count > 0) {
					options_contents = '';
					for (let i = 0; i < options_count; ++i) {
						let option_label = operator_options["option_" + i].label;
						let option_name = operator_options["option_" + i].name;
						options_contents += option_label.replace(/[_-]/g, " ") +
							'<select class="form-control" name="' + option_name + '" id="' + option_name + '">' + languages + '</select><br>';
					}
					$("#optionsContent").html(options_contents);
					$("#options").show("slide", { direction: "right" }, 400);
				} else {
					$("#options").hide("slide", { direction: "right" }, 400);
				}
				return true;
			},

			onOperatorUnselect: function() {
				return true;
			}
		});
////}

		// event on click on the red button on the
        // bottom of the flowchart. when you click
        // it deletes the selected service
////{
		$('.delete_selected_button').click(function(event) {
			event.preventDefault();
			$flowchart.flowchart('deleteSelected');
		});
////}

		// declaring process list here to be accessible later
////{
		let process_list = {};
		let theWizard = $("#smartwizard");
		theWizard.on("showStep", function(e, anchorObject, stepNumber) {
			if (stepNumber === 2) {
				// event to fire up when click the next button in step 2. it will collect the data from the graph
				// and convert it to a JSON file
				let data = $flowchart.flowchart('getData');
				let links_count = Object.keys(data.links).length;
				let operators_count = Object.keys(data.operators).length;
////}

				// filling the options from the select drop downs into the JSON
                // apparently not working
////{
                //alert($("select").length);
				$.each($("select"), function () {
					let option_name = $(this).attr("id");
					let option_value = $(this).val();
					for (let key in data.operators) {
						if (key === "undefined") continue;
						if (data.operators[key].properties !== "undefined") {
							if (Object.keys(data.operators[key].properties.options.length > 0)) {
								for (let smallkey in data.operators[key].properties.options) {
									if (data.operators[key].properties.options[smallkey].name === option_name) {
										data.operators[key].properties.options[smallkey].value = option_value;
									}
								}
							}
						}
					}
				});
////}
				// check if there is options that aren't filled
				let error = '';////{
				for (let key in data.operators) {
					if (key === "undefined") continue;
					if (data.operators[key].properties !== "undefined") {
						if (Object.keys(data.operators[key].properties.options).length > 0) {
							for (let smallkey in data.operators[key].properties.options) {
								if (data.operators[key].properties.options[smallkey].value === "") {
									error = "Please select options for the " + data.operators[key].properties.title;
								}
							}
						}
					}
				}
////}
				let checking_data;

				// checking if there is any error before continuing
				if (links_count < 1 || operators_count < 3) {////{
					alert("Please add services and / or connect them.");

				} else if (error !== '') {
					alert(error);

				} else {
					let text_holder_value = $("#text_holder").val();
					checking_data = "<p>You textual data is </p><pre>" + text_holder_value + "</pre><br>";
					checking_data += '<p>You want to process it following the steps: </p>';
////}

					let the_order = ["input"];
                    let order_list = services_order(data.links, links_count, "fromOperator", "input", the_order);

					// showing steps and options on Step 3
                    ////{
                    alert("Step3");
					let x = 1;
					let all_options = '';

					process_list.text = text_holder_value;
					process_list.services = {};

					let arrayLength = order_list.length;
					for (let i = 0; i < arrayLength; i++) {
						let key = order_list[i];

						let service_title = data.operators[key].properties.title;

						if (key !== "input" && key !== "output") {
							process_list.services[key] = {};
							process_list.services[key].name     = service_title;
							process_list.services[key].action   = data.operators[key].properties.action;
							process_list.services[key].input    = data.operators[key].properties.inputs.input_0.name;
							process_list.services[key].output   = data.operators[key].properties.outputs.output_0.name;
						}

						if (Object.keys(data.operators[key].properties.options).length > 0) {

							for (let smallkey in data.operators[key].properties.options) {
								let option_name = data.operators[key].properties.options[smallkey].name;
								let option_value = data.operators[key].properties.options[smallkey].value;

								all_options += '<span class="option pull-right">' + option_name.replace(/[_-]/g, " ") + ': ' + option_value + '</span>';

								process_list.services[key].options[option_name] = option_value;
							}
						}
						checking_data += '<pre class="process-steps">Step ' + x + ': ' + service_title + all_options + '</pre>';

						all_options = '';
						x++;
					}

					// temporary check the file
					checking_data += '<pre>' + JSON.stringify(process_list, null, 2) + '</pre>';

					// filling the step 3 with results and continue if everything is ok
					$("#check_workflow").html(checking_data);
				}
			}
		});
////}


// making the operators draggable
////{
		let operatorId = 0;
		let $draggableOperators = $('.draggable_operator');
		$draggableOperators.draggable({
			cursor: "move",
			opacity: 0.7,
			appendTo: 'body',
			zIndex: 1000,
			helper: function() {
				let $this = $(this);
				let data = getOperatorData($this);
				return $flowchart.flowchart('getOperatorElement', data);
			},
			stop: function(e, ui) {
				let $this = $(this);
				let elOffset = ui.offset;
				let containerOffset = $container.offset();
				if (elOffset.left > containerOffset.left &&
					elOffset.top > containerOffset.top &&
					elOffset.left < containerOffset.left + $container.width() &&
					elOffset.top < containerOffset.top + $container.height()) {

					let flowchartOffset = $flowchart.offset();

					let relativeLeft = elOffset.left - flowchartOffset.left;
					let relativeTop = elOffset.top - flowchartOffset.top;

					let positionRatio = $flowchart.flowchart('getPositionRatio');
					relativeLeft /= positionRatio;
					relativeTop /= positionRatio;

					let data = getOperatorData($this);
					data.left = relativeLeft;
					data.top = relativeTop;

					$flowchart.flowchart('addOperator', data);
				}
			}
		});
////}
////{
		theWizard.on("showStep", function(e, anchorObject, stepNumber) {
			if (stepNumber === 3) {
                alert("step4");
				let tasks_count = Object.keys(process_list.services).length;
				let semaphore  = 1; // semaphoring the process to handle the pipelines
				let textual_data = process_list.text;

				setTimeout(function() {
					for (let i = 0; i < tasks_count; i++) {
						if (semaphore === 1){
							semaphore--;

							let this_service 	= process_list.services[i];
							let service_name 	= this_service.name;
							let service_url 	= this_service.action;
							let service_input 	= this_service.input;
							let service_output 	= "output"; //this_service.output

							let operator;
							if (service_url.indexOf('?') > -1){
								operator = "&";
							} else {
								operator = "?";
							}

							$("#results_message").text("Contacting " + service_name + ", please wait ...");
							let complete_url = 'http://' + service_url + '/' + operator + service_input + '=' + textual_data.replace(/ /g, '+');

							if(this_service.options){
								let service_options = '';
								let options_list = this_service.options;
								for (let key in options_list) {
								    let value = options_list[key];
								    service_options += '&' + key + '=' + value;
								}
								complete_url += service_options;
							}

							alert(complete_url);

							$.ajax({
								type: "POST",
								url: "/getdata",
								async:false,
								data: {
									"action" : encodeURI(complete_url)
								},
								success: function(resultData){

									if (resultData != "GET request error") {

										let jsondata = JSON.parse(resultData);
										textual_data = findinJson(jsondata, service_output);

										resultData = JSON.stringify(JSON.parse(resultData),null,2);
										resultData = syntaxHighlight(resultData);

										$("#results").prepend('<div class="panel panel-default" id="panel'+i+'"><div class="panel-heading results"><h4 class="panel-title"><a data-toggle="collapse" data-target="#collapse'+i+'" href="#collapse'+i+'">Result from '+service_name+'</a></h4></div><div id="collapse'+i+'" class="panel-collapse collapse in show"><div class="panel-body"><p class="truncate">The results: "'+textual_data+'" <br>The service URL: <a href="'+complete_url+'">'+complete_url+'</a></p><br><pre>'+resultData+'</pre></div></div></div>');

										semaphore++;

										$("#results_message").text("Finished, all of your results are displayed below.");
									} else {
										$("#results_message").text("Error contacting the service");
									}
								}
							});
						}
					}
				}, 100);
			}
		});
	}); // closing the jquery ready wrapper//}

	let languages = '<option value="">Please Select</option><option value="bg">Bulgarian (bg)</option><option value="hr">Croatian (hr)</option><option value="cs">Czech (cs)</option><option value="da">Danish (da)</option><option value="nl">Dutch (nl)</option><option value="en">English (en)</option><option value="et">Estonian (et)</option><option value="fi">Finnish (fi)</option><option value="fr">French (fr)</option><option value="de">German (de)</option><option value="el">Greek (el)</option><option value="hu">Hungarian (hu)</option><option value="ga">Irish (ga)</option><option value="it">Italian (it)</option><option value="lv">Latvian (lv)</option><option value="lt">Lithuanian (lt)</option><option value="mt">Maltese (mt)</option><option value="pl">Polish (pl)</option><option value="pt">Portuguese (pt)</option><option value="ro">Romanian (ro)</option><option value="sk">Slovak (sk)</option><option value="sl">Slovene (sl)</option><option value="es">Spanish (es)</option><option value="sv">Swedish (sv)</option>';
}; // closing the javascript ready wrapper
