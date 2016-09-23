// Test Helper
var addToResults = function(text) {
    var div = document.getElementById('results');

    div.innerHTML = div.innerHTML + '<br />' + text;
    console.log(text);
};

var assertEqual = function(x, y) {
    if(x===y) {
        addToResults("&#10004;");
    } else {
        addToResults("Test Failed! " + x + " was not equal to: " + y);
    }
};

// Code under test

var add = function(x, y) {
    return x + y;
};


// Tests
assertEqual(1, add(1, 0));
assertEqual(2, add(1, 1));
assertEqual(0, add(1, 0)); // failing! this test is just to illustrate a failure and should be deleted!

