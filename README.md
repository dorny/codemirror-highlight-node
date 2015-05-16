[![Build Status](https://travis-ci.org/dorny/codemirror-highlight-node.png?branch=master)](https://travis-ci.org/dorny/codemirror-highlight-node)
[![Dependency Status](https://gemnasium.com/dorny/codemirror-highlight-node.png)](https://gemnasium.com/dorny/codemirror-highlight-node)

# codemirror-highlight-node

Transforms source code into formatted HTML using [CodeMirror](http://codemirror.net/).
Tabs, whitespaces and new line characters are preserved from original source code.


## Install

```
npm install codemirror-highlight-node
```


## Usage

``` javascript
var highlight = require('codemirror-highlight-node');
highlight('function Test() {}', 'javascript');
// => <span class="cm-keyword">function</span> <span class="cm-variable">Test</span>() {}
```

## API

Loading this module will add two functions to CodeMirror:
 * loadMode(name) - resolve and load requested mode
 * highlightCode(code, modeSpec) - transform soruce code to formatted HTML

As `modeSpec` parameter you can use name (e.g. `"javascript"`), alias (e.g. `"csharp"` for C#) or full modeSpec object required by CodeMirror.
Module exports directly `highlightCode` function. CodeMirror object is also re-exported as `highlightCode.CodeMirror`.


## LICENSE

MIT
