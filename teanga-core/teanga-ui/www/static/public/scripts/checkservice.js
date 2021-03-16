window.onload = function() {
    $(document).ready(function() {

//load_json_file
////{
        function load_json_file(file){
            var jsonFile = {};

            alert(file);
            $.ajax({
                url: file,
                async: false,
                dataType: 'json',
                success: function(data) {
                    jsonFile = data;
                }
            });

            return jsonFile;
        }
////}

//get_service_info
////{
        function get_service_info(thefile){
            info = '<label>Service Name</label>';
            info += '<input class="form-control" type="text" value="'+thefile["name"]+'"><br>';
            info += '<label>Service Description</label>';
            info += '<input class="form-control" type="text" value="'+thefile["description"]+'"><br>';

            return info;
        }
////}

// Function to prepare input and output data from the JSON LD File
//foreach_data_js
////{
        function foreach_data_js(thefile, entry){
            count = thefile[entry].length;
            entries = '';

            for (var i = 0; i < count; ++i) {
                entry_name = thefile[entry][i];
                entries += '<label>'+entry_name.replace(/[_-]/g, " ")+' parameters</label>' +
                    '<input class="form-control" type="text" value="'+thefile["@context"][entry_name]["name"]+'"><br>';
            }

            return entries;

        }
////}

// teanga_compatibility
////{
        function teanga_compatibility(thefile){
            if(thefile["@context"] && thefile["@context"]["input"]["@id"].indexOf("teanga") >= 0){
                newStuff = '<h1>Service Options</h1>';
                newStuff += get_service_info(thefile);
                newStuff += foreach_data_js(thefile, "input");
                newStuff += foreach_data_js(thefile, "output");
                newStuff += '<button id="savebutton" type="submit" class="btn btn-primary">Add Service</button>';

                $("#checkForm").hide();

            } else {
                newStuff = '<br><div class="alert alert-danger">Not a Teanga compatible container.</div>';
            }

            return newStuff;
        }
////}

// .
////{
        $('#checkbutton').prop('disabled',true);
        $('#servicelink').keyup(function(){
            $('#checkbutton').prop('disabled', this.value == "" ? true : false);
        });

        $("#checkbutton").on("click", function(){

            // load json file to a variable
            // Check if the service is Teanga Compatible
            var jsonFile = load_json_file($("#servicelink").val());

            finalResult = teanga_compatibility(jsonFile);

            $("#optionsshow").html(finalResult);

        });

        $("#savebutton").on("click", function(){

            $.ajax({
                type: "POST",
                url: "/writejson",
                async:false,
                data: {
                    "file" : jsonFile
                },
            success: function(data){
                $("#optionsshow").html('<br><div class="alert alert-danger">Service was added</div>');
                     }
            });
        });
////}
    });
}
