alert("loading helper functions");
// Function to prepare input and output data from the JSON LD File
// it converts the input and output of a service to connectors on the
// service bubbles
////{
function foreach_data_js(jsonFile, entry){
			let allPaths = Object.values(jsonFile.paths);

			let allParams = allPaths[0].get.parameters;

			let count = allParams.length;


			let entries_labels = ' data-nb-' + entry + 's-labels="';
			let entries = ' data-nb-' + entry + 's-names="';

			let entry_name;
			for (let i = 0; i < count; ++i) {
				entry_name = "input_text";
				entries += allParams[i].name + ", ";
				entry_name = entry_name.replace(/[_-]/g, " ");
				entries_labels = entries_labels + entry_name + ", ";
			}

			entries = entries.replace(/, \s*$/, "")+'"';
			entries_labels = entries_labels.replace(/, \s*$/, "")+'"';

            output = entries+entries_labels+' data-nb-'+entry+'s="'+count+'"'
			return output;
		}
////}

// Function to prepare service options from the JSON LD File
////{
function get_options(jsonFile){

			let count;
			let options_labels;
			let options;

			if (jsonFile.options) {
				count = jsonFile.options.length;
				options_labels = ' data-nb-options-labels="';
				options = ' data-nb-options-names="';

				for (let i = 0; i < count; ++i) {
					const find_name = jsonFile.options[i];
					options_labels += find_name + ', ';
					options += jsonFile["@context"][find_name].name + ', ';
				}
				options = options.replace(/, \s*$/, "") + '"';
				options_labels = options_labels.replace(/, \s*$/, "") + '"';
				return ' data-nb-options="' + count + '" ' + options + options_labels;
			} else {
				return '';
			}
		}
////}

// function to return json object from json file doing
// post request to the 'readJson' url
////{
		function load_json_file(file){
			file = file.replace('services/','');
			var jsonFile = [];

			$.ajax({
				url: 'readJSON/'+file,
				async: false,
				dataType: 'json',
				success: function (json) {
					jsonFile = json;
				}
			});
			return jsonFile;
		}
////}

// recursive function to find the right order of the services
// it starts from input and follow the links till the end
////{
					let services_order = function (items, all_length, attribute, value, the_order) {
						for (let i = 0; i < all_length; i++) {
							if (typeof items[i] !== "undefined") {
								if (items[i][attribute] === value) {
									let find_more = items[i].toOperator;
									if (find_more === "undefined") continue;
									the_order.push(find_more);
									services_order(items, all_length, attribute, find_more, the_order);

									return the_order;
								}
							}
						}
					};
////}

// function to get the data from the operators
////{
		function getOperatorData($element) {
			let nbInputs = parseInt($element.data('nb-inputs'));
			let nbOutputs = parseInt($element.data('nb-outputs'));
			let nbOptions = parseInt($element.data('nb-options'));

			let data = {
				properties: {
					title: $element.text(),
					action: $element.data('nb-action'),
					options: {},
					inputs: {},
					outputs: {}
				}
			};

			let nbInputsLabels = $element.data('nb-inputs-labels').split(", ");
			let nbOutputsLabels = $element.data('nb-outputs-labels').split(", ");

			let nbInputsNames = $element.data('nb-inputs-names').split(", ");
			let nbOutputsNames = $element.data('nb-outputs-names').split(", ");

			for (let i = 0; i < nbInputs; i++) {
				data.properties.inputs['input_' + i] = {
					label: nbInputsLabels[i],
					name: nbInputsNames[i]
				};
			}

			for (let i = 0; i < nbOutputs; i++) {
				data.properties.outputs['output_' + i] = {
					label: nbOutputsLabels[i],
					name: nbOutputsNames[i]
				};
			}

			if($element.data('nb-options-names')) {
				let nbOptionsLabels = $element.data('nb-options-labels').split(", ");
				let nbOptionsNames = $element.data('nb-options-names').split(", ");
				for (let i = 0; i < nbOptions; i++) {
					data.properties.options['option_' + i] = {
						label: nbOptionsLabels[i],
						name: nbOptionsNames[i],
						value: ""
					};
				}
			}

			return data;
		}
////}


// function to highlight JSON syntax for better display
////{
		function syntaxHighlight(json) {
			json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
			return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
				let cls = 'number';
				if (/^"/.test(match)) {
					if (/:$/.test(match)) {
						cls = 'key';
					} else {
						cls = 'string';
					}
				} else if (/true|false/.test(match)) {
					cls = 'boolean';
				} else if (/null/.test(match)) {
					cls = 'null';
				}
				return '<span class="' + cls + '">' + match + '</span>';
			});
		}
////}


// function to find a result under many levels inside a json
////{
function findinJson(json, output){
    let result;
    if (output === "all_file"){
        result = JSON.stringify(json);
    } else if(output.indexOf('.') > -1) {
        let array = output.split(".");
        for (let i = 0; i < array.length; i++) {
            let item = array[i];
            json = json[item];
        }
        result = json;

    } else {
        result = json[output];
    }
    return result;
}
////}


// Closing the options panel when the user clicks the little x
// THIS SEEMS TO NOT BEING USED
/*////{
$('.close').on('click', function() {
    $('#options').hide("slide", { direction: "right" }, 400);
    return false;
});
*////}

// objectSize  function
// NOT BEING USED
////{
		function objectSize(obj) {
			let size = 0, key;
			for (key in obj) {
				if (obj.hasOwnProperty(key)) size++;
			}
			return size;
		}
////}
