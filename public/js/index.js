$(document).ready(function()
{
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

