
// Mixpanel 
(function (f, b) { if (!b.__SV) { var e, g, i, h; window.mixpanel = b; b._i = []; b.init = function (e, f, c) { function g(a, d) { var b = d.split("."); 2 == b.length && ((a = a[b[0]]), (d = b[1])); a[d] = function () { a.push([d].concat(Array.prototype.slice.call(arguments, 0))); }; } var a = b; "undefined" !== typeof c ? (a = b[c] = []) : (c = "mixpanel"); a.people = a.people || []; a.toString = function (a) { var d = "mixpanel"; "mixpanel" !== c && (d += "." + c); a || (d += " (stub)"); return d; }; a.people.toString = function () { return a.toString(1) + ".people (stub)"; }; i = "disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" "); for (h = 0; h < i.length; h++) g(a, i[h]); var j = "set set_once union unset remove delete".split(" "); a.get_group = function () { function b(c) { d[c] = function () { call2_args = arguments; call2 = [c].concat(Array.prototype.slice.call(call2_args, 0)); a.push([e, call2]); }; } for (var d = {}, e = ["get_group"].concat(Array.prototype.slice.call(arguments, 0)), c = 0; c < j.length; c++) b(j[c]); return d; }; b._i.push([e, f, c]); }; b.__SV = 1.2; e = f.createElement("script"); e.type = "text/javascript"; e.async = !0; e.src = "undefined" !== typeof MIXPANEL_CUSTOM_LIB_URL ? MIXPANEL_CUSTOM_LIB_URL : "file:" === f.location.protocol && "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//) ? "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js" : "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js"; g = f.getElementsByTagName("script")[0]; g.parentNode.insertBefore(e, g); } })(document, window.mixpanel || []);

// Papa Parse
var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS4KVWJwcNP7aUdCz7uZYtHqLRyRGDjVtgu67239vXZtmH281W5nsCa7M2VC_rZ8LHGPtYq_WSu-8lT/pub?output=csv';

// Init Papa Parse
function init() {
    Papa.parse(public_spreadsheet_url, {
        download: true,
        header: true,
        complete: getSpreadsheetData
    })
}

// Near entry of your product, init Mixpanel
function mixPanelInit() {

    mixpanel.init("372c78393bb6b85077f63964af7652f6", {
        debug: true,
        track_pageview: true,
        persistence: "localStorage",
    });

}

function alertMessage(headline, message) {
    const messageElement = document.createElement('p');
    const headlineElement = document.createElement('h2');
    messageElement.textContent = message;
    headlineElement.textContent = headline;
    const targetElement = document.getElementById('message');
    targetElement.appendChild(headlineElement);
    targetElement.appendChild(messageElement);
}

window.addEventListener('DOMContentLoaded', init)

function getSpreadsheetData(results) {

    // after parsing Spreadsheet
    var spreadSheetData = results.data
    console.log("Spreadsheet Data:", spreadSheetData);

    // get user detail from welcome url
    const urlParams = new URLSearchParams(window.location.search);
    console.log("urlParams", urlParams)
    console.log("urlParams.size", urlParams.size)
    console.log("localStorage.getItem('email')", localStorage.getItem('email'))

    // no localStorage or urlParams == ACCESS DENIED
    if ((urlParams.size === 0) && (localStorage.getItem('email') === null)) {
        alertMessage("ACCESS DENIED", "Please use the welcome url that you received from Tom or Joel")
        console.log("ACCESS DENIED", "No urlParams or local storage, so show lock screen, and tell them to use the url")
    }

    // yes localStorage exists, but no URLParams, so tell Mixpanel to link up user, if in spreadsheet
    if ((localStorage.getItem('email')) && (urlParams.size === 0)) {

        const value = { email: localStorage.getItem('email') };
        const userInSpreadsheet = spreadSheetData.find(element => element.email === value.email) !== undefined; // true

        if (userInSpreadsheet) {
            mixPanelInit()
            mixpanel.identify(localStorage.getItem('email'))
            // alertMessage("ACCESS GRANTED", "User has localStorage, no urlParams, is Identified in Mixpanel, and in spreadsheet")
            console.log("ACCESS GRANTED", "User has localStorage, no urlParams, is Identified in Mixpanel, and in spreadsheet")
            document.body.classList.remove('access-denied');
        } else {
            alertMessage("ACCESS DENIED", "User has localStorage, no urlParams, and NOT spreadsheet")
            consoleMessage("ACCESS DENIED", "your localStorage value does not have access")
        }
    }

    // if urlParams exists, but no localStorage, Create and init mixpanel, create localStorage if in spreadsheet
    if ((urlParams.size == 3) && (localStorage.getItem('email') === null)) {

        const userEmail = urlParams.get('e');
        const userFirstName = urlParams.get('fname');
        const userLastName = urlParams.get('lname');

        // test if user's email is in the spreadsheat data
        const value = { email: userEmail };
        const userInSpreadsheet = spreadSheetData.find(element => element.email === value.email) !== undefined; // true


        if (userInSpreadsheet) {
            mixPanelInit()
            mixpanel.identify(userEmail)
            mixpanel.people.set({
                '$email': userEmail,
                '$fname': userFirstName,
                '$lname': userLastName,
                // Add anything else about the user here
            });
            localStorage.setItem('email', userEmail);
            // alertMessage("ACCESS GRANTED" , "User Created in Mixpanel, User is in Spreadsheet, locaStorage created")
            console.log("ACCESS GRANTED" , "User Created in Mixpanel, User is in Spreadsheet, locaStorage created")
            document.body.classList.remove('access-denied');
        } else {
            alertMessage("ACCESS DENIED", "User is not authorized")
        }

    }
    // if urlParams exists, but so does localStorage, PREFER localStorage value and test for access
    if ((urlParams.size == 3) && (localStorage.getItem('email'))) {

        // test if user's email is in the spreadsheat data
        const value = { email: localStorage.getItem('email') };
        const userInSpreadsheet = spreadSheetData.find(element => element.email === value.email) !== undefined; // true

        if (userInSpreadsheet) {
            mixPanelInit()
            mixpanel.identify(localStorage.getItem('email'))
            // alertMessage("ACCESS GRANTED, you are already identified as " + localStorage.getItem('email')+ ".  Please dont use this url anymore!")
            console.log("ACCESS GRANTED, you are already identified as " + localStorage.getItem('email')+ ".  Please dont use this url anymore!")
            document.body.classList.remove('access-denied');
        } else {
            alertMessage("ACCESS DENIED, " + localStorage.getItem('email') + " is not in authorized")
            console.log("ACCESS DENIED, " + localStorage.getItem('email') + " is not in authorized")
        }



    }

}

