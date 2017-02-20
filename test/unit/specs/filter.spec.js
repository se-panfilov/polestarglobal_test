const fs = require('fs')
const html = fs.readFileSync(__dirname + '/../../../index.html', 'utf8')
const jsdom = require('jsdom-global')()
document.write(html)
let filter = require('../../../js/index').filter
const sinon = require('sinon')
const expect = require("chai").expect

describe('filter:', () => {

  describe('filterBy.', () => {
    it('happy path', () => {
      const data = [
        {
          name: 'Collins obasuyi Screening Profile',
          created: '2016-07-19T10:01:51.008066Z',
          modified: '2016-07-19T10:01:51.030835Z',
          country_check_severity: '70-WARNING'
        },
        {
          name: 'bbb',
          created: '2016-07-19T10:01:51.008066Z',
          modified: '2016-07-19T10:01:51.030835Z',
          country_check_severity: '70-WARNING'
        }
      ]

      const field = 'name'
      const val = 'Collins obasuyi Screening Profile'
      const isStrict = true

      const spy = sinon.spy(data, 'filter')

      const result = filter.filterBy(data, field, val, isStrict)

      expect(result).to.have.length(1)
      expect(result).to.deep.equal([data[0]])

      sinon.assert.calledWith(spy)
      spy.restore()
    })

    it('shall throw error when no data', () => {
      const data = null
      const field = 'name'
      const val = 'Collins obasuyi Screening Profile'
      const isStrict = true

      expect(() => filter.filterBy(data, field, val, isStrict)).to.throw('filterBy: data shall be passed')
    })

    it('shall throw error when no field', () => {
      const data = [{name: 'aaa'}]
      const field = null
      const val = 'Collins obasuyi Screening Profile'
      const isStrict = true

      expect(() => filter.filterBy(data, field, val, isStrict)).to.throw('filterBy: field shall be passed')
    })

  })

  describe('getFiltersValues.', () => {

    it('happy path', () => {
      const expecedVal = {
        [filter.fields.name.name]: filter.state[filter.fields.name.name],
        [filter.fields.country_check_severity.name]: filter.state[filter.fields.country_check_severity.name]
      }

      const result = filter.getFiltersValues()

      expect(result).to.deep.equal(expecedVal)
    })

  })

  describe('filterByState.', () => {

    it('happy path', () => {
      const expectedFiltersValues = {
        name: {
          name: 'name',
          defaultVal: '',
          isStrict: false
        }
      }

      const data = []
      const filtersValsMock = sinon.mock(filter)
      filtersValsMock.expects('getFiltersValues').once().returns(expectedFiltersValues)

      const filterByMock = sinon.mock(filter)
      filterByMock.expects('filterBy').withArgs(data, expectedFiltersValues.name.name, sinon.match.any, expectedFiltersValues.name.isStrict).once()

      filter.filterByState(data)

      filtersValsMock.verify()
      filtersValsMock.restore()

      filterByMock.verify()
      filterByMock.restore()
    })

  })

  describe('setNameFilter.', () => {
    it('happy path', () => {
      const val = 'some'
      expect(filter.state.name).to.be.equal('')

      filter.setNameFilter(val)

      expect(filter.state.name).to.be.equal(val)
    })

    it('shall accept null as default val', () => {
      filter.setNameFilter(null)

      expect(filter.state.name).to.be.equal('')
    })
  })

  describe('setSeverityFilter.', () => {
    it('happy path', () => {
      const val = 'some'
      expect(filter.state.country_check_severity).to.be.equal(filter.fields.country_check_severity.defaultVal)

      filter.setSeverityFilter(val)

      expect(filter.state.country_check_severity).to.be.equal(val)
    })

    it('shall accept null as default val', () => {
      filter.setSeverityFilter(null)

      expect(filter.state.country_check_severity).to.be.equal(filter.fields.country_check_severity.defaultVal)
    })
  })

  it('shall reset state', () => {
    const mock = sinon.mock(filter)
    mock.expects('setNameFilter').withExactArgs(filter.fields.name.defaultVal).once()
    mock.expects('setSeverityFilter').withExactArgs(filter.fields.country_check_severity.defaultVal).once()

    filter.resetState()

    mock.verify()
    mock.restore()
  })

})
