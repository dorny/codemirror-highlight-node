/*
 * codemirror-highlight-node
 * https://github.com/dorny/codemirror-highlight-node
 *
 * Copyright (c) 2015 Michal Dorner
 * Licensed under the MIT license.
 */

'use strict';

var escape = require('escape-html');
var CodeMirror = require('codemirror/addon/runmode/runmode.node.js');

// load built in mode specs
require('codemirror/mode/meta.js');

/**
 * Loads mode into CodeMirror
 * Look at https://github.com/codemirror/CodeMirror/tree/master/mode for list of built in modes
 *
 * @param {string} modeName - name of the mode
 */
CodeMirror.loadMode = function (modeName) {
  if (!CodeMirror.modes[modeName]) {
    require('codemirror/mode/' + modeName + '/' + modeName + '.js');
  }
};

// format soruce code with <span class="...">
function applyCodeHighlighting(string, modeSpec) {
  var html = '';
  var accum = '';
  var curStyle = null;

  var flush = function() {
    if (curStyle) {
      html += '<span class="' + curStyle.replace(/(^|\s+)/g, "$1cm-") + '">' + escape(accum) + '</span>';
    }
    else {
      html += escape(accum);
    }
  }

  CodeMirror.runMode(string, modeSpec, function (text, style) {
    if (style != curStyle) {
      flush();
      accum = text;
      curStyle = style;
    } else {
      accum += text;
    }
  });

  flush();
  return html;
};

// wrap already foramted source code with theme and optionally add line numbers
function applyTheme(formatedCode, theme) {
    var lines = formatedCode.split('\n');

    return '<div class="CodeMirror cm-s-'+(theme.name || 'default')+'">\n'
    +'  <div class="CodeMirror-scroll" draggable="false">\n'
    +'    <div class="CodeMirror-sizer">\n'
    +'      <div class="CodeMirror-lines">\n'
    +'        <div class="CodeMirror-code">\n'
    + lines.reduce( function(acum, line, i) {
        if (theme.lineNumbers) {
            acum += '          <div class="CodeMirror-gutter-wrapper">\n'
                +   '            <div class="CodeMirror-linenumber CodeMirror-gutter-elt">' + i + '</div>\n'
                +   '          </div>\n';
        }
        acum += '          <pre>'+line+'</pre>\n';
        return acum;
    }, '')
    +'         </div>\n'
    +'      </div>\n'
    +'    </div>\n'
    +'  </div>\n'
    +'</div>\n';
}

/**
 * Transforms source code into formatted HTML using Codemirror
 *
 * @param {string} code - source code
 * @param {string | object} modeSpec - name or definiton of mode
 * @param {string | object} theme - name of theme or object {name: <string>, lineNumbers: <bool>}
 */
CodeMirror.highlightCode = function(code, modeSpec, theme) {

  if ( typeof modeSpec === 'string') {
    modeSpec = CodeMirror.findModeByName(modeSpec);
  }

  var formatedCode;
  if (modeSpec != null) {
    CodeMirror.loadMode(modeSpec.mode);
    formatedCode = applyCodeHighlighting(code, modeSpec.mime);
  }
  else {
    formatedCode = code;
  }

  if (theme != null) {
    if (typeof theme === 'string') {
      theme = { name: theme, lineNumbers: false };
    }

    formatedCode = applyTheme(formatedCode, theme);
  }

  return formatedCode;
}

// re-export CodeMirror
CodeMirror.highlightCode.CodeMirror = CodeMirror;

// export highlightCode
module.exports = CodeMirror.highlightCode;
