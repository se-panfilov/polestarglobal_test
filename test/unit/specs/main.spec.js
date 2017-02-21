const elements = require('../../../js/index').elements
const main = require('../../../js/index').main
const dom = require('../../../js/index').dom
const fetch = require('../../../js/index').fetch
const sinon = require('sinon')

describe('main:', () => {

  it('can init', () => {
    const mock = sinon.mock(fetch)
    mock.expects('getScreening').once()

    main.init()

    mock.verify()
    mock.restore()
  })

})
