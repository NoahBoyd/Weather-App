window.addEventListener("load", () => {

    // html variables
    let app = $('.app');
    let clock = $('.clock');
    let location = $('.location');
    let date = $('.date');
    let refresh = $('.refresh-button');
    let tempSwitch = $('.swap-deg');
    let currentIcon = $('.current-weather-icon');
    let currentCondition = $('.current-weather-string');
    let currentTempurature = $('.current-weather-temp');
    let tempuratureSymbol = $('.tempSymbol');
    let currentHumidity = $('.humidity-level');
    let currentWindSpeed = $('.current-wind-speed');
    let sunriseTime = $('.sunrise-time');
    let sunsetTime = $('.sunset-time');
    // address bar variables
    let addressBar = $('.address-input');
    let addressSubmit = $('.address-submit')[0];
    let regionSelector = $('#region-state')[0];
    let currentLat = "";
    let currentLong = "";
    let loadedOnce = false;

    // api variables

    // ********************************Functions**************************************************
    // parse data recieved from api, into dropdown menu for user to select
    function fillDropdown(data) {

        // clear current select options
        if (regionSelector.length > 0) {
            $('#region-state').children().remove();
        }
        // add placeholder option to select so that change function works better
        var opt = document.createElement('option');
        opt.value =  "null";
        opt.innerHTML = "Select from dropdown";
        regionSelector.appendChild(opt);

        // add options from api call data
        for (let i = 0; i < data.length; i++) {
            if (data[i].state != undefined) {
                var opt = document.createElement('option');
                opt.value =  `${data[i].lat},${data[i].lon}`;
                opt.innerHTML = `${data[i].name}, ${data[i].state} (${data[i].country})`;
                regionSelector.appendChild(opt);
            } else {
                var opt = document.createElement('option');
                opt.value =  `${data[i].lat},${data[i].lon}`;
                opt.innerHTML = `${data[i].name} (${data[i].country})`;
                regionSelector.appendChild(opt);
            }
        }
    }

    // call weather api using lat and long as param
    function getWeatherFromLatLon(lat, long) {
        fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&appid=cc1fc1434a02b931351f6df1c56cb39b')
                .then(response => {
                    return response.json();
                })
                .then(data => {
                     console.log(data);
                    populateApp(data);
                })
                        // hide dropdown
        hideDropdown();

        // update app info for chosen location
    }

    // show dropdown bar
    function showDropdown() {
            $(regionSelector).css('display', 'block');
    }

    function hideDropdown() {
        $(regionSelector).css('display', 'none');
    }

    function populateApp(data) {
        // update fields
        if (($(app).css('width')) === '300px') {
            $(location).text(data.name);
        } else {
            $(location).text(data.name + ", " + data.sys.country);
        }
        
        $(date).text(getDate());
        $(currentCondition).text(data.weather[0].main);
        $('.desc').text(data.weather[0].description);
        $(currentTempurature).text(formatTemp(data.main.temp));
        // move symbol to the right for larger numbers
        if (formatTemp(data.main.temp) > 100 || formatTemp(data.main.temp) < 0) {
            $(tempuratureSymbol).css('left', $(tempuratureSymbol).css('left') + 15) ;
        }
        $(currentIcon).attr('src', 'images/icons/wi-' + data.weather[0].main + '.svg')
        // if in change temp symbol dynamically
        if ($(".celcius")[0].classList.contains('active-deg')) {
            $(tempuratureSymbol).attr('src', 'images/icons/wi-celsius.svg')
        } else if ($(".farenheit")[0].classList.contains('active-deg')) {
            $(tempuratureSymbol).attr('src', 'images/icons/wi-fahrenheit.svg')
        }

        $(currentHumidity).text(data.main.humidity + "%");
        $(currentWindSpeed).text(Math.floor((data.wind.speed * 2.237)) + " mph");

        $(sunriseTime).text(formatUTC(data.sys.sunrise));
        $(sunsetTime).text(formatUTC(data.sys.sunset));

        loadedOnce = true;
        
    }

    function getDate() {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    let month = monthNames[today.getMonth()];
    today = month + ' ' + dd + ', ' + yyyy;
    return today;
    }

    function formatTemp(temp) {
        // check for active class on deg
        if ($(".celcius")[0].classList.contains('active-deg')) {
            return Math.floor(temp - 273.15);
        }

        if ($(".farenheit")[0].classList.contains('active-deg')) {
            return Math.floor((temp - 273.15) * (9/5) + 32);
        }
    }

    function formatUTC(timestamp) {
        // Create a new JavaScript Date object based on the timestamp
        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
        var date = new Date(timestamp * 1000);
        // Hours part from the timestamp
        var hours = date.getHours();
        // Minutes part from the timestamp
        var minutes = "0" + date.getMinutes();
        var formattedTime;
        if (hours > 12) {
            formattedTime = (hours - 12) + ":" + minutes.substr(-2) + " PM";
        } else {
            formattedTime = hours + ":" + minutes.substr(-2) + " AM";
        }
        // var formattedTime = hours + ':' + minutes.substr(-2);
        return formattedTime;
    }

    function saveToLocalStorage(lat, long) {
        localStorage.setItem('latitude', lat);
        localStorage.setItem('longitude', long);
    }
    

    function showTime(){
        var date = new Date();
        var h = date.getHours(); 
        var m = date.getMinutes(); 
        var s = date.getSeconds(); 
        var session = "AM";
        
        // set background based on current time
        if (h < 5 || h > 19) {
            // settings for night time styles
            $('.icon').css('filter', 'invert(100%) sepia(0%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%)');
            $('.app').css('background', 'linear-gradient(180deg, rgb(20, 20, 20) 40%, rgb(24, 24, 199) 100%)')
            $('.top-row').css('color', 'white');
            $('.bottom-row').css('color', 'white');
            $('.weather-status').css('color', 'white');
            $('body').css('background-color', 'black');
        } else {
            // settings for daytime styles
            $('.icon').css('filter', 'none');
            $('.app').css('background', 'linear-gradient(180deg, rgba(143,181,255,1) 20%, rgba(255,238,148,1) 100%)')
            $('.top-row').css('color', 'black');
            $('.bottom-row').css('color', 'black');
            $('.weather-status').css('color', 'black');
            $('body').css('background-color', 'black');
        }
        
        if(h == 0){
            h = 12;
        }
        
        if(h > 12){
            h = h - 12;
            session = "PM";
        }
        
        h = (h < 10) ? "0" + h : h;
        m = (m < 10) ? "0" + m : m;
        s = (s < 10) ? "0" + s : s;
        
        var time = h + ":" + m + " " + session;
        document.getElementById("DigitalCLOCK").innerText = time;
        document.getElementById("DigitalCLOCK").textContent = time;
        
        setTimeout(showTime, 1000);
        
    }

    // ********************************Code executes on load**************************************************
    showTime();

    // set up app if local storage exists
    if (localStorage.latitude === undefined || localStorage.longitude === undefined) {
        // do nothing
    } else {
        // call api from saved storage
        currentLat = localStorage.latitude;
        currentLong = localStorage.longitude;
        getWeatherFromLatLon(currentLat, currentLong);
    }

    // ********************************handlers**************************************************

    // call geolocation api, call fillDropdown to populate choices for user
    addressSubmit.addEventListener('click', function() {
        let userInput = addressBar.val();

        if (userInput.length > 0) {
            // test query to api
            fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + userInput + '&limit=10&appid=cc1fc1434a02b931351f6df1c56cb39b')
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    // console.log(data);
                    fillDropdown(data);
                    showDropdown();
                })
        }
    })

    // when user selects a location from dropdown
    $('#region-state').on('change', function() {
        if ($(this).val() != 'null') {
            // // console.log($(this).val());
            let latlong = $(this).val().split(',');
            // // console.log(latlong);
            // call weather function
            // // console.log(latlong[0], latlong[1]);
            currentLat = latlong[0];
            currentLong = latlong[1];
            saveToLocalStorage(currentLat, currentLong);
            getWeatherFromLatLon(latlong[0], latlong[1]);
        }

    })
    
    $(tempSwitch).on("click", function() {
        $(".celcius")[0].classList.toggle('active-deg');
        $(".farenheit")[0].classList.toggle('active-deg');
        if (loadedOnce) {
            getWeatherFromLatLon(currentLat, currentLong);
        }
    })

    // refresh button event. Only works if page has loaded once
    $(refresh).on("click", function() {
        if (loadedOnce) {
            getWeatherFromLatLon(currentLat, currentLong);
        }

    })

})