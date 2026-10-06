// Compiles src/app.jsx -> app.js so the browser does not need to run Babel at load time.
const fs = require('fs');
const path = require('path');
const Babel = require('@babel/standalone');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'src/app.jsx'), 'utf8');

// The UMD builds expose React / ReactDOM / LucideReact as globals; lucide's UMD expects `window.react`.
const prelude = `(function () {
'use strict';
const { useState, useEffect, useRef } = React;
const { createRoot } = ReactDOM;
const { Linkedin, Instagram, ArrowUpRight, X } = LucideReact;
`;

const { code } = Babel.transform(source, {
  presets: [[Babel.availablePresets.react, { runtime: 'classic' }]],
  compact: false,
  comments: false,
});

fs.writeFileSync(path.join(root, 'app.js'), `${prelude}${code}\n})();\n`);
console.log('Built app.js');
