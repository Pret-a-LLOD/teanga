window.onload = function() {

    $(function () {

        $('#checkbutton').prop('disabled', true);
        $('#searchInput').keyup(function () {
            $('#checkbutton').prop('disabled', this.value == "" ? true : false);
        });

        $("#checkbutton").on("click", function () {

            $(this).text("Searching ...").prop('disabled', true);

            $("#optionsshow").hide().removeClass('hidden');

            var parameters = { terms: $('#searchInput').val() };
            $.post( './images/search/',parameters, function(data) {

                $("#checkbutton").text("Search").prop('disabled', false);

                var length = data.length,
                    finalResult;
                for (var i = 0; i < length; i++) {

                    finalResult += '<tr>\n' +
                        '<td>'+i+'</td>\n' +
                        '<td><a href="https://hub.docker.com/r/'+data[i]["name"]+'" target="_blank">'+data[i]["name"]+'</a></td>\n' +
                        '<td class="hidden-sm hidden-xs" style="max-width:300px;overflow:hidden; text-overflow:ellipsis;white-space: nowrap">'+data[i]["description"]+'</td>\n' +
                        '<td style="white-space:nowrap">' + data[i]["star_count"] + ' <i class="fa fa-star" aria-hidden="true"></i></td>\n' +
                        '<td><form method="post" action="/services/image/pull"><input type="hidden" name="id" value="'+data[i]["name"]+'"><button type="submit" class="btn btn-primary btn-xs">Pull</button></form></td>\n' +
                        '</tr>';
                }

                $("#optionsshow tbody").html(finalResult);
                $("#optionsshow").show();
            });

        });
    });
}
