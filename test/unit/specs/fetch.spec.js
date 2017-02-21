const fs = require('fs')
const html = fs.readFileSync(__dirname + '/../../../index.html', 'utf8')
const jsdom = require('jsdom-global')()
document.write(html)
const fetch = require('../../../js/index').fetch
const sinon = require('sinon')
const expect = require("chai").expect

describe('fetch:', () => {

  it('can getScreening', () => {

    const mock = sinon.mock(fetch)
    mock.expects('fetchData').returns({results: []}).once()

    const cb = function () {

    }

    fetch.getScreening(cb)

    mock.verify()
    mock.restore()
  })
})
