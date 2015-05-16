'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');

var it = require('testit');
var highlight = require('../');

var srcPath = path.join(__dirname,'fixtures','src');
var outputPath = path.join(__dirname,'fixtures','output');
var srcFiles = fs.readdirSync(srcPath);

function readSrcFile(name) {
  return fs.readFileSync(path.join(srcPath, name), {encoding: 'utf8'});
}

function readOutputFile(name) {
  return fs.readFileSync(path.join(outputPath, name+'.html'), {encoding: 'utf8'});
}

srcFiles.forEach( function(file) {
  var mode = path.basename(file, path.extname(file));
  it('Generate formated HTML from '+mode+' code', function() {
    var source = readSrcFile(file);
    var result = highlight(source, mode);
    var expected = readOutputFile(mode);
    assert.equal(result, expected);
  });
});
