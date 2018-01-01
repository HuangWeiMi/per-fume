# Perfume.js v0.2.3
[![NPM version](https://badge.fury.io/js/perfume.js.svg)](https://www.npmjs.org/package/perfume.js) [![Build Status](https://travis-ci.org/Zizzamia/perfume.js.svg?branch=master)](https://travis-ci.org/Zizzamia/perfume.js) [![NPM Downloads](http://img.shields.io/npm/dm/perfume.js.svg)](https://www.npmjs.org/package/perfume.js)

> Perfume is a tiny JavaScript library for measuring Short/Long Script, First Meaningful Paint, TTI (Time to Interactivity), annotating them to the DevTools timeline and reporting the results to Google Analytics.


## Installing

npm (https://www.npmjs.com/package/perfume.js):

    npm install perfume.js --save


## Importing library

You can import the generated bundle to use the whole library generated by this starter:

```javascript
import Perfume from 'perfume.js';
```

Additionally, you can import the transpiled modules from `dist/es` in case you have a modular library:

```javascript
import Perfume from 'node_modules/perfume.js/dist/es/perfume';
```

Universal Module Definition

```javascript
import Perfume from 'node_modules/perfume.js/perfume.umd.js';
```


## Start measuring

#### First Meaningful Paint
Page load is a key aspect of how a user perceives the performance of your page. See Measure Performance with the [RAIL Method](https://developers.google.com/web/fundamentals/performance/rail) for more information.

```javascript
const perfume = new Perfume();
perfume.firstPaint(); 
// ⚡️ Perfume.js: firstPaint 601 ms
```

#### Annotate metrics in the DevTools
Performance.mark ([User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API)) is used to create an application-defined peformance entry in the browser's performance entry buffer.

```javascript
perfume.start('fibonacci');
fibonacci(400);
perfume.end('fibonacci', true); 
// ⚡️ Perfume.js: fibonacci 0.14 ms
```
![Performance Mark](https://github.com/Zizzamia/perfume.js/blob/master/docs/src/assets/performance-mark.png)

#### Custom Logging
Save the duration and print it out when and how it best meets your needs.

```javascript
perfume.start('fibonacci');
fibonacci(400);
const duration = this.perfume.end('fibonacci');
perfume.log('Custom logging', duration); 
// ⚡️ Perfume.js: Custom logging 0.14 ms
```

#### Google Analytics
To enable Perfume to send your measures to Google Analytics User timing, set the option `enable:true` and a custom `category:"name"`.

```javascript
const perfume = new Perfume();
perfume.googleAnalytics.enable = true;
perfume.googleAnalytics.category = "userId";
```


## Develop

 - `npm t`: Run test suite
 - `npm start`: Run `npm run build` in watch mode
 - `npm run test:watch`: Run test suite in [interactive watch mode](http://facebook.github.io/jest/docs/cli.html#watch)
 - `npm run test:prod`: Run linting and generate coverage
 - `npm run build`: Generate bundles and typings
 - `npm run lint`: Lints code
 - `npm run commit`: Commit using conventional commit style ([husky](https://github.com/typicode/husky) will tell you to use it if you haven't :wink:)



## Credits
Made with ☕️ by [@zizzamia](https://twitter.com/zizzamia) and
I want to thank some friends and projects for the work they did:

- [Appmetrics.js](https://github.com/ebidel/appmetrics.js?files=1) for inspiring me to start writing this library and giving me some of the base ideas for the class architecture;
- [Popper.js](https://github.com/FezVrasta/popper.js/) for having inspired me to write my first library in typescript;
- [The Contributors](https://github.com/Zizzamia/perfume.js/graphs/contributors) for their much appreciated Pull Requests and bug reports;
- **you** for the star you'll give this project 😉 and for supporting me by giving my project a try 😄



## Copyright and license
Code and documentation copyright 2017 **Leonardo Zizzamia**. Code released under the [MIT license](LICENSE). Docs released under Creative Commons.
