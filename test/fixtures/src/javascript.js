function Test() {}

Test.prototype.greet = function() {
    console.log("It's WORKING!");
};

var test = new Test();
test.greet();
