const fs = require('fs')
const html = fs.readFileSync(__dirname + '/../../../index.html', 'utf8')
const jsdom = require('jsdom-global')()
document.write(html)
let dateUtils = require('../../../js/index').dateUtils
const sinon = require('sinon')
const expect = require("chai").expect


describe('dateUtils:', () => {

  describe('getHumanReadyDate.', () => {
    it('happy path', () => {

      const dateStr = '2016-07-19T10:01:51.008066Z'

      const result = dateUtils.getHumanReadyDate(dateStr)

      expect(result).to.be.equal('19.06.2016')

    })

    it('shall throw error when no date', () => {
      expect(() => dateUtils.getHumanReadyDate(null)).to.throw('getHumanReadyDate: no date string')
    })

  })


})
