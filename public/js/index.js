$(document).ready(function()
{
    $("#submit").click(function() {
        console.log( "Handler for .click() called." );
        var clientInput = {
            activity: $("#dropdown").val(),
            dateFrom: $("from").val(),
            dateTo: $("to").val(),
            departureCity: $("#departure").val()
        };

        $.post("/", clientInput, function (data){
            if (data) {
                window.location.href = 'http://localhost:8080/public/page2.html'
            }
            
        });
    });

    clientData.getThemes(
    function populateDropdown(result)
    {
        var sabreThemes = result.Themes;
        var dropdown = $("#dropdown");
        
        for (theme in sabreThemes)
        {
            var option = $("<option>");
            var themeVal = sabreThemes[theme].Theme.toLowerCase();
            var themeStr = themeVal;

            option.text(titleCase(themeStr.replace("-", " ")));
            option.attr("value", themeVal);
            dropdown.append(option);
        }
    });

    function titleCase(str) 
    {
        return str.toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase() });
    }
});

