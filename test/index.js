'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');

var it = require('testit');
var highlight = require('../');
var child_process = require('child_process');

var srcPath = path.join(__dirname,'fixtures','src');
var srcFiles = fs.readdirSync(srcPath);
var source_highlight = path.join(__dirname, '..', 'node_modules', 'codemirror', 'bin', 'source-highlight');

function readSrcFile(name) {
  return fs.readFileSync(path.join(srcPath, name), {encoding: 'utf8'});
}

srcFiles.forEach( function(file) {
  var mode = path.basename(file, path.extname(file));
  it('Generate formated HTML from '+mode+' code', function() {
    var source = readSrcFile(file);
    var result = highlight(source, mode);
    var mime = highlight.CodeMirror.findModeByName(mode).mime;

    var child = child_process.exec( source_highlight, ['-s', mime], {encoding: 'utf8'},
      function(error, stdout, stderr) {
        assert(error == null);
        assert.equal(result, stdout);
    });

    child.stdin.write(source);
    child.stdin.end();
  });
});

it('Handle source code with undefined mode', function() {
    var source = '$ echo "test"';
    var result = highlight(source);
    assert.equal(result, source);
});
