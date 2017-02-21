const fs = require('fs')
const html = fs.readFileSync(__dirname + '/../../../index.html', 'utf8')
const jsdom = require('jsdom-global')()
document.write(html)
let filter = require('../../../js/index').filter
let sorting = require('../../../js/index').sorting
let state = require('../../../js/index').state
const sinon = require('sinon')
const expect = require("chai").expect


describe('state:', () => {

  it('can setData', () => {
    const data = {some: 'some'}

    state.setData(data)

    expect(state.current._data).to.deep.equal(data)
  })

  it('can getData', () => {
    const data = {some: 'some'}
    state.current._data = data

    const result = state.getData()

    expect(result).to.deep.equal(data)
  })

  it('can getDisplayData', () => {
    const expectedData = {some: 'some'}

    const filterMock = sinon.mock(filter)
    filterMock.expects('filterByState').once()

    const sortingMock = sinon.mock(sorting)
    sortingMock.expects('sort').once().returns(expectedData)

    const result = state.getDisplayData()

    expect(result).to.deep.equal(expectedData)

    filterMock.verify()
    filterMock.restore()

    sortingMock.verify()
    sortingMock.restore()
  })


})
