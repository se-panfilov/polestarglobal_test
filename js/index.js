const config = {
  filtersFormId: 'data-filters-form',
  nameInputId: 'name-input',
  countryCheckSeveritySelectId: 'country-check-severity-select',
  dataTableId: 'data-table',
  tableRowClass: 'data-table__row',
  tableCellClass: 'data-table__cell'
}

const dom = (function () {
  'use strict'

  return {
    getElement (id) {
      if (!id) return new Error('getElement: no ID')
      return document.getElementById(id)
    },
    setHTML (elem, content) {
      if (!elem) return new Error('setHTML: no element')
      elem.innerHTML = content
      return elem
    },
    clearHTML (elem) {
      this.setHTML(elem, '')
      return elem
    },
    addEventListener (elem, event, cb) {
      if (!elem) return new Error('addEventListener: no element')

      elem.addEventListener(event, event => {
        if (cb) cb(event)
      })
      return elem
    },
    createElem (tag = 'div', className, text = '') {
      const classes = (className) ? `class="${className}` : ''
      return `<${tag} ${classes}">${text}</${tag}>`
    }
  }
}())

const elements = (function (config, dom) {
  'use strict'

  const messages = {
    elemNotFound: 'No such element',
    noId: 'ID must be specified'
  }

  return {
    _getElem (id) {
      if (!id) throw new Error(messages.noId)
      const elem = dom.getElement(id)
      if (!elem) throw new Error(`${messages.elemNotFound}: ${id}`)
      return elem
    },
    getFiltersForm () {
      return this._getElem(config.filtersFormId)
    },
    getNameInput () {
      return this._getElem(config.nameInputId)
    },
    getCheckSeveritySelect () {
      return this._getElem(config.countryCheckSeveritySelectId)
    },
    getDataTable () {
      return this._getElem(config.dataTableId)
    }
  }
}(config, dom))

const table = (function (config, dom, elements) {
  'use strict'

  const tableElem = elements.getDataTable()

  function createTableRow (data) {
    const nameTd = dom.createElem('td', `${config.tableCellClass} -name`, data.name)
    const modifiedTd = dom.createElem('td', `${config.tableCellClass} -modified`, data.modified)
    const createdTd = dom.createElem('td', `${config.tableCellClass} -created`, data.created)
    const countryCheckSeverityTd = dom.createElem('td', `${config.tableCellClass} -country-check-severity`, data.country_check_severity)
    return dom.createElem('tr', config.tableRowClass, nameTd + modifiedTd + createdTd + countryCheckSeverityTd)
  }

  return {
    clearData () {
      dom.clearHTML(tableElem)
    },
    prepareHtml (data) {
      return data.reduce((c, v) => {
        c += createTableRow(v)
        return c
      }, '')
    },
    displayData (data) {
      if (!data) throw new Error('displayData: No data')
      const html = this.prepareHtml(data)

      dom.setHTML(tableElem, html)
      return html
    }
  }
}(config, dom, elements))

//This is a "pretend" for server work
const fetch = (function (elements, data) {
  'use strict'

  const _p = {
    filterData (data, filters) {
      // TODO (S.Panfilov) implement filtering
      console.info(filters)
      return data
    },
    fetchData (cb) {
      //This is a mock for server work
      //In real life it'sgona be return smt like "fetch(url, options).then(...)"...
      //And no need to handle errors in this 'dream world'
      return setTimeout(() => {
        //data contains our "screenings.json" from task
        if (cb) cb(data)
      }, 0)
    }
  }

  return {
    getScreening (cb, filters) {
      return _p.fetchData(data => {
        const results = data.results
        const filteredResults = _p.filterData(results, filters)
        // TODO (S.Panfilov)  sorting
        return cb(filteredResults)
      })
    },
    onSubmit (event, filters, cb) {
      if (!event) throw new Error('onSubmit: no event provided')
      event.preventDefault()
      event.stopPropagation()

      return this.getScreening(cb, filters)
    },
    _p // dirty hack for tests
  }
}(elements, data))

// eslint-disable-next-line no-unused-vars
const main = (function (elements, dom, fetch, table) {
  'use strict'

  function onSubmit (event) {
    const filters = getFiltersValues()
    fetch.onSubmit(event, filters, onGetData)
  }

  function onGetData (data) {
    table.clearData()
    table.displayData(data)
  }

  function getFiltersValues () {
    return {
      nameInput: elements.getNameInput().value,
      severitySelect: elements.getCheckSeveritySelect().value
    }
  }

  return {
    init () {
      const formElem = elements.getFiltersForm()

      // TODO (S.Panfilov) replace with on change
      dom.addEventListener(formElem, 'submit', event => onSubmit(event))
      fetch.getScreening(onGetData, getFiltersValues())
    }
  }

}(elements, dom, fetch, table))

// for testing purpose
if (typeof module === 'object' && module.exports) {
  module.exports = {
    main
  }
}

