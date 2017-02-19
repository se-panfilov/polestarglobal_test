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
    displayData (data) {
      if (!data) throw new Error('displayData: No data')

      const itemsHtml = data.reduce((c, v) => {
        c += createTableRow(v)
        return c
      }, '')
      dom.setHTML(tableElem, itemsHtml)
      return itemsHtml
    }
  }
}(config, dom, elements))

//This is a "pretend" for server work
const fetch = (function (messages, elements, data) {
  'use strict'

  const _p = {
    getScreening (cb, filters) {
      const data = this.fetchData(cb)
      return this.filterData(data, filters)
    },
    // onError (response) { // no need to handle errors in 'dream world'
    //   throw new Error(msg)
    // },
    filterData (data, filters) {

    },
    fetchData (cb) {
      //This is a mock for server work
      //In real life it'sgona be return smt like "fetch(url, options).then(...)"...
      setTimeout(() => {
        //data contains our "screenings.json" from task
        if (cb) cb(data)
      }, 0)
    }
  }

  return {
    onSubmit (event, filters, cb) {
      if (!event) throw new Error('onSubmit: no event provided')
      event.preventDefault()
      event.stopPropagation()

      return _p.getScreening(filters, cb)
    },
    _p // dirty hack for tests
  }
}(messages, elements, data))

// eslint-disable-next-line no-unused-vars
const main = (function (elements, dom) {
  'use strict'

  function onSubmit (event, filtersElem) {
    // const value = filtersElem.value


    // list.clearData()
    // search.onSubmit(event, value).then(showData)
  }

  return {
    init () {
      const formElem = elements.getForm()

      const filters = {
        nameInputElem: elements.getNameInput(),
        severitySelectElem: elements.getCheckSeveritySelect()
      }

      dom.addEventListener(formElem, 'submit', event => onSubmit(event, filters))
    }
  }

}(elements, dom))

// for testing purpose
if (typeof module === 'object' && module.exports) {
  module.exports = {
    main
  }
}

