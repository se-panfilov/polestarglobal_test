const elements = {
  filtersForm: 'form[id=data-filters-form]',
  nameInput: 'input[id=name-input]',
  countryCheckSeveritySelect: 'select[id=country-check-severity-select]',
  dataTableBody: 'tbody[id=data-table-body]',
  dataTableRow: 'tr[class=data-table__row]',
  sortByNameBtn: 'button[id=sort-by-name-btn]',
  sortByCreatedBtn: 'button[id=sort-by-created-btn]',
  sortByModifiedBtn: 'button[id=sort-by-modified-btn]',
  sortBySeverityBtn: 'button[id=sort-by-severity-btn]',
  resetBtn: 'button[id=reset-btn]'
}

function initPage (browser) {
  const devServer = browser.globals.devServerURL

  browser
    .url(devServer)
    .pause(200)

  return browser
}

module.exports = {
  'default state': function (browser) {
    browser = initPage(browser)
    browser.expect.element(elements.filtersForm).to.be.present.before(1000)

    browser.expect.element(elements.filtersForm).to.be.a('form')
    browser.expect.element(elements.sortByNameBtn).to.be.a('button')
    browser.expect.element(elements.sortByCreatedBtn).to.be.a('button')
    browser.expect.element(elements.sortByModifiedBtn).to.be.a('button')
    browser.expect.element(elements.sortBySeverityBtn).to.be.a('button')
    browser.expect.element(elements.nameInput).to.be.a('input')
    browser.expect.element(elements.countryCheckSeveritySelect).to.be.a('select')

    browser.expect.element(elements.dataTableBody).to.be.a('tbody')
    browser.end()
  },
  'get data': function (browser) {
    browser = initPage(browser)
    browser.expect.element(elements.filtersForm).to.be.present.before(1000)

    browser.pause(10)

    browser.assert.elementCount(elements.dataTableRow, 21)

    browser.end()
  },
  'filter data by name': function (browser) {
    browser = initPage(browser)
    browser.expect.element(elements.filtersForm).to.be.present.before(1000)
    browser.assert.elementCount(elements.dataTableRow, 21)

    browser.setValue(elements.nameInput, 'ar')

    browser.assert.elementCount(elements.dataTableRow, 5)

    browser.end()
  },
  'filter data by severity': function (browser) {
    browser = initPage(browser)
    browser.expect.element(elements.filtersForm).to.be.present.before(1000)
    browser.assert.elementCount(elements.dataTableRow, 21)

    let val = '30-UNKNOWN'
    browser.click(`${elements.countryCheckSeveritySelect} option[value="${val}"]`)
    browser.assert.elementCount(elements.dataTableRow, 6)

    val = '60-OK'
    browser.click(`${elements.countryCheckSeveritySelect} option[value="${val}"]`)
    browser.assert.elementCount(elements.dataTableRow, 7)

    val = '90-CRITICAL'
    browser.click(`${elements.countryCheckSeveritySelect} option[value="${val}"]`)
    browser.assert.elementCount(elements.dataTableRow, 6)

    browser.end()
  },
  'filter data by severity and name': function (browser) {
    browser = initPage(browser)
    browser.expect.element(elements.filtersForm).to.be.present.before(1000)
    browser.assert.elementCount(elements.dataTableRow, 21)

    browser.setValue(elements.nameInput, 'ar')
    browser.assert.elementCount(elements.dataTableRow, 5)

    const val = '90-CRITICAL'
    browser.click(`${elements.countryCheckSeveritySelect} option[value="${val}"]`)
    browser.assert.elementCount(elements.dataTableRow, 1)

    browser.end()
  },
  'can reset filter': function (browser) {
    browser = initPage(browser)
    browser.expect.element(elements.filtersForm).to.be.present.before(1000)
    browser.assert.elementCount(elements.dataTableRow, 21)

    browser.setValue(elements.nameInput, 'ar')
    const val = '90-CRITICAL'
    browser.click(`${elements.countryCheckSeveritySelect} option[value="${val}"]`)
    browser.assert.elementCount(elements.dataTableRow, 1)

    browser.click(elements.resetBtn)
    browser.assert.elementCount(elements.dataTableRow, 21)

    browser.end()
  }
}
