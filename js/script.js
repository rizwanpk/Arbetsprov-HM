(function () {
    "use strict";
    var substringMatcher = function (strs) {
        return function findMatches(q, cb) {
            var matches, substrRegex;

            // an array that will be populated with substring matches
            matches = [];

            // regex used to determine if a string contains the substring `q`
            substrRegex = new RegExp(q, 'i');

            // iterate through the pool of strings and for any string that
            // contains the substring `q`, add it to the `matches` array
            $.each(strs, function (i, str) {
                if (substrRegex.test(str)) {
                    matches.push(str);
                }
            });

            cb(matches);
        };
    };
    var countries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua &amp; Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia &amp; Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Cape Verde", "Cayman Islands", "Chad", "Chile", "China", "Colombia", "Congo", "Cook Islands", "Costa Rica", "Cote D Ivoire", "Croatia", "Cruise Ship", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia", "French West Indies", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Kyrgyz Republic", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Pierre &amp; Miquelon", "Samoa", "San Marino", "Satellite", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "St Kitts &amp; Nevis", "St Lucia", "St Vincent", "St. Lucia", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor L'Este", "Togo", "Tonga", "Trinidad &amp; Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks &amp; Caicos", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"];
    /* TypeAhead library. The code below will help to auto complete the search query */
    var autocomplete = function () {
        $('#main-search').typeahead({
            hint: true,
            highlight: true,
            minLength: 1,
        }, {
            name: 'countries',
            source: substringMatcher(countries),
        }).bind('typeahead:select', function (ev, state) {
            searchState(state);
        });
    };

    /* Google public api */
    var searchState = function (state) {
        $.ajax({
            url: 'http://maps.googleapis.com/maps/api/geocode/json?sensor=false&address=' + state,
            type: 'GET',
            success: function (data) {
                displaySearch(data);
            },
        });
    };

    /* The code below will help to get the current date and time */
    var CurrentTime = (function () {
        CurrentTime.prototype.getTimeAndDate = function () {
        var now     = new Date();
        var year    = now.getFullYear();
        var month   = now.getMonth()+1;
        var day     = now.getDate();
        var hour    = now.getHours();
        var minute  = now.getMinutes();
        var second  = now.getSeconds();
        if(month.toString().length == 1) {
            var month = '0'+month;
        }
        if(day.toString().length == 1) {
            var day = '0'+day;
        }
        if(hour.toString().length == 1) {
            var hour = '0'+hour;
        }
        if(minute.toString().length == 1) {
            var minute = '0'+minute;
        }
        if(second.toString().length == 1) {
            var second = '0'+second;
        }
        var dateTime = year+'-'+month+'-'+day+' '+hour+':'+minute;
        return dateTime;
        };
    });

    var displaySearch = function (data) {

        var stateData = [],
            date = new CurrentTime(),
            searchContainer = $('.search-results');

        if ($('ul', searchContainer).length === 0) {
            searchContainer.append('<ul></ul>');
        }

        data = data.results[0].address_components;

        for (var i = 0; i < data.length; i++) {
            var type = data[i].types[0];

            if (type == 'country') {
                stateData.countryShortName = data[i].short_name;
            }
        }

        var str = stateData.countryShortName;
        var res = str.toLowerCase();

        var item = '<li class="item">' +
            '<div class="location">' +
            '<img class="state" src="http://www.geonames.org/flags/x/' + res + '.gif"/>' +
            '</div>' +
            '<div class="date">' + date.getTimeAndDate() + '</div>' +
            '<a href="#" class="remove"></a>' +
            '</li>';

        $('ul', searchContainer).prepend(item);

        removeItem();
        clearInput();
    };

    var clearInput = function () {
        $('#main-search').val('');
    };

    var removeItem = function () {
        $('.search-results .remove').on('click', function (e) {
            e.preventDefault();

            $(e.target).parents('.item').remove();

            if ($('.search-results .item').length === 0) {
                $('.search-results ul').remove();
            }
        });
    };
    autocomplete();
})();
