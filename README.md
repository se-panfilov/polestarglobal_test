# polestarglobal_test

# Getting started

Just open `index.html` in modern browser.

## Testing

Pre-Requirements:

1. [Node.js][1] (Better if it would be [version 7.2.x][2])
2. Npm or [yarn][3] (I use yarn, but npm is also good)

Install dependencies with

```bash
npm install
```

run unit tests

```bash
npm test
```

run e2e tests

```bash
npm run e2e
```

#Description

Take the attached data set `screening.json` and write a web page (or simple set of pages) to present the data. 

The result set is reasonably large so we need to be able to filter the data by:

* Name
* country check severity (Critical, Warning, Ok)

and sort the data by:

* name
* created
* modified


Things to consider - performance, efficient use of space, usability, cross-browser, test driven development.

You can use whatever server side technology you like (or none at all if you think that's appropriate). 
Just give us some instructions if you use anything *really* eccentric. 

You can use whatever frameworks or libraries you like, but be prepared to justify your use of them.

You should aim to get this test back to us within a day but there is no precise time limit.
  
[1]: https://nodejs.org/en/
[2]: https://nodejs.org/dist/v7.2.1/node-v7.2.1.pkg
[3]: https://yarnpkg.com/
