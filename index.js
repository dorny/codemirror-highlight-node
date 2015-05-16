'use strict';

var fs = require('fs');
var vm = require('vm');
var path = require('path');
var format = require('util').format;
var resolve = require('resolve').sync;
var escape = require('escape-html');
var CodeMirror = require('codemirror/addon/runmode/runmode.node.js');

var cache = {};
cache[require.resolve('codemirror')] = CodeMirror;

// copy & pasted from https://github.com/ForbesLindesay/highlight-codemirror
CodeMirror.loadMode = function (name) {
  function loadFile(filename) {
    if (filename in cache) {
      return cache[filename];
    }

    var exports = (cache[filename] = {});
    var moduleObject = {exports: exports};
    function childRequire(name) {
      if (/^codemirror/.test(name)) {
        return loadFile(require.resolve(name));
      }
      else {
        return loadFile(resolve(name, {basedir: path.dirname(filename)}));
      }
    }

    var source = fs.readFileSync(filename, 'utf8');
    vm.runInNewContext(source, { CodeMirror: CodeMirror, module: moduleObject, exports: exports, require: childRequire }, filename);
    return (cache[filename] = moduleObject.exports);
  }

  return loadFile(/^[A-Za-z0-9]+$/.test(name) ? require.resolve('codemirror/mode/' + name + '/' + name + '.js') : path.resolve(name));
};

function highlight(string, modeSpec) {
  var html = '';
  CodeMirror.runMode(string, modeSpec, function (text, style) {
    if (text === '\n') {
      html += '\n';
      return;
    }

    var content = escape(text);
    if (style) {
      var className = 'cm-' + style.replace(/ +/g, ' cm-');
      content = format('<span class="%s">%s</span>', className, content);
    }
    html += content;
  });

  return html;
};

// main exported function
CodeMirror.highlightCode = function(code, modeSpec) {
  if ( typeof modeSpec === 'string') {
    modeSpec = CodeMirror.findModeByName(modeSpec);
  }
  CodeMirror.loadMode(modeSpec.mode);
  return highlight(code, modeSpec.mime);
}

// re-export CodeMirror
CodeMirror.highlightCode.CodeMirror = CodeMirror;

// load built in mode specs
CodeMirror.loadMode(require.resolve('codemirror/mode/meta.js'));

// export highlightCode
module.exports = CodeMirror.highlightCode;
