const config = {
  filtersFormId: 'data-filters-form',
  nameInputId: 'name-input',
  countryCheckSeveritySelectId: 'country-check-severity-select',
  dataTableBodyId: 'data-table-body',
  sortByNameBtnId: 'sort-by-name-btn',
  sortByCreatedBtnId: 'sort-by-created-btn',
  sortByModifiedBtnId: 'sort-by-modified-btn',
  sortBySeverityBtnId: 'sort-by-severity-btn',
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
      if (!elem) return new Error('setHTML: no such element')
      elem.innerHTML = content
      return elem
    },
    clearHTML (elem) {
      this.setHTML(elem, '')
      return elem
    },
    addEventListener (elem, event, cb) {
      if (!elem) return new Error('addEventListener: no such element')

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
    getDataTableBody () {
      return this._getElem(config.dataTableBodyId)
    },
    getSortByNameBtn () {
      return this._getElem(config.sortByNameBtnId)
    },
    getSortByCreatedBtn () {
      return this._getElem(config.sortByCreatedBtnId)
    },
    getSortByModifiedBtn () {
      return this._getElem(config.sortByModifiedBtnId)
    },
    getSortBySeverityBtn () {
      return this._getElem(config.sortBySeverityBtnId)
    }
  }
}(config, dom))

const filter = (function () {
  const _p = {
    filterStrict (val, field, value) {
      return val[field] === value
    },
    filterNotStrict (val, field, value) {
      return val[field].toLowerCase().includes(value.toLowerCase())
    }
  }

  const filter = {
    state: {},
    fields: {
      name: {
        name: 'name',
        defaultVal: '',
        isStrict: false
      },
      country_check_severity: {
        name: 'country_check_severity',
        defaultVal: 'all',
        isStrict: true
      }
    },
    filterBy (data, field, value, isStrict) {
      if (!data) throw new Error('filterBy: data shall be passed')
      if (!field) throw new Error('filterBy: field shall be passed')

      const method = isStrict ? _p.filterStrict : _p.filterNotStrict
      return data.filter(v => method.call(this, v, field, value))
    },
    getFiltersValues () {
      return {
        [this.fields.name.name]: this.state[this.fields.name.name],
        [this.fields.country_check_severity.name]: this.state[this.fields.country_check_severity.name]
      }
    },
    filterByState (data) {
      const filterValues = this.getFiltersValues()

      let result = data

      for (const k in filterValues) {
        if (filterValues.hasOwnProperty(k)) {
          if (filterValues[k] !== this.fields[k].defaultVal) {
            result = this.filterBy(result, this.fields[k].name, filterValues[k], this.fields[k].isStrict)
          }
        }
      }

      return result
    },
    setNameFilter (value) {
      if (!value) value = this.fields.name.defaultVal
      this.state[this.fields.name.name] = value
    },
    setSeverityFilter (value) {
      if (!value) value = this.fields.country_check_severity.defaultVal
      this.state[this.fields.country_check_severity.name] = value
    },
    resetState () {
      this.setNameFilter(this.fields.name.defaultVal)
      this.setSeverityFilter(this.fields.country_check_severity.defaultVal)
    }
  }

  function init () {
    filter.resetState()
  }

  init()

  return filter
}())

const sorting = (function () {
  'use strict'

  const TYPES = {
    number: 'number',
    string: 'string',
    date: 'date'
  }

  const sorting = {
    state: {
      field: null,
      type: null,
      direction: null
    },
    directions: {
      asc: 'ASC',
      desc: 'DESC'
    },
    fields: {
      name: {
        name: 'name',
        type: TYPES.string
      },
      created: {
        name: 'created',
        type: TYPES.date
      },
      modified: {
        name: 'modified',
        type: TYPES.date
      },
      country_check_severity: {
        name: 'country_check_severity',
        type: TYPES.string
      }
    },
    setSorting (field, direction) {
      if (!field) throw new Error('setSorting: field must be set')

      this.state = this.state || {}
      if (field) this.state.field = field
      this.state.type = this.fields[field].type
      if (direction) this.state.direction = direction
    },
    getState () {
      return this.state
    },
    toggleDirection () {
      if (this.state.direction === this.directions.asc) {
        this.state.direction = this.directions.desc
        return
      }
      this.state.direction = this.directions.asc
    },
    stringSort (a, b, direction = 'ASC') {
      if (!a || !b) throw new Error('stringSort: strings must be passed')
      if (typeof a !== TYPES.string || typeof b !== TYPES.string) throw new Error('stringSort: invalid strings')

      let multiplier = 1
      if (direction === this.directions.desc) multiplier = -1

      const v1 = a.toLowerCase()
      const v2 = b.toLowerCase()

      if (v1 < v2) return (-1 * multiplier)
      if (v1 > v2) return (1 * multiplier)
      return 0
    },
    numberSort (a, b, direction = 'ASC') {
      if (!a || !b) throw new Error('numberSort: numbers must be passed')
      if (!Number.isFinite(a) || !Number.isFinite(b)) throw new Error('numberSort: invalid numbers')

      if (direction === this.directions.asc) return a - b
      return b - a
    },
    dateSort (a, b, direction = 'ASC') {
      if (!a || !b) throw new Error('dateSort: dates must be passed')
      const isValidA = (typeof a === TYPES.date || typeof a === TYPES.string)
      const isValidB = (typeof a === TYPES.date || typeof a === TYPES.string)

      if (!isValidA || !isValidB) throw new Error('dateSort: invalid dates')
      const d1 = (typeof a === TYPES.date) ? a : new Date(a)
      const d2 = (typeof b === TYPES.date) ? b : new Date(b)

      return this.numberSort(d1.getTime(), d2.getTime(), direction)
    },
    sort (data, field) {
      if (!data) throw new Error('sort: no data provided')
      const type = this.fields[field].type

      let method = this.stringSort
      if (type === TYPES.number) method = this.numberSort
      if (type === TYPES.date) method = this.dateSort

      const direction = this.getState().direction
      return data.sort((a, b) => method.call(this, a[field], b[field], direction))
    },
    resetState () {
      this.setSorting(this.fields.name.name, this.directions.asc)
    }
  }

  function init () {
    sorting.resetState()
  }

  init()

  return sorting
}())

// our cute "redux"-like state, lol
const state = (function (filter, sorting) {
  return {
    current: {
      _data: null
    },
    setData (data) {
      this.current._data = data
    },
    getData () {
      return this.current._data
    },
    getDisplayData () {
      const filteredData = filter.filterByState(this.getData())
      return sorting.sort(filteredData, sorting.getState().field)
    }
  }
}(filter, sorting))

const dateUtils = (function () {
  'use strict'

  return {
    getHumanReadyDate (str) {
      if (!str) throw new Error('getHumanReadyDate: no date string')
      const date = new Date(str)
      let day = date.getUTCDate().toString()
      if (day.length === 1) day = '0' + day
      let month = date.getUTCMonth().toString()
      if (month.length === 1) month = '0' + month
      const year = date.getUTCFullYear().toString()

      return `${day}.${month}.${year}`
    }
  }
}())

const table = (function (config, dom, elements, dateUtils, state) {
  'use strict'

  const tableElem = elements.getDataTableBody()

  function createTableRow (data) {
    const nameTd = dom.createElem('td', `${config.tableCellClass} -name`, data.name)
    const modifiedTd = dom.createElem('td', `${config.tableCellClass} -modified`, dateUtils.getHumanReadyDate(data.modified))
    const createdTd = dom.createElem('td', `${config.tableCellClass} -created`, dateUtils.getHumanReadyDate(data.created))
    const modifier = (data.country_check_severity).replace(/\d*/, '').toLowerCase()
    const countryCheckSeverityTd = dom.createElem('td', `${config.tableCellClass} -country-check-severity ${modifier}`, data.country_check_severity)

    return dom.createElem('tr', config.tableRowClass, nameTd + modifiedTd + createdTd + countryCheckSeverityTd)
  }

  return {
    clearData () {
      dom.clearHTML(tableElem)
    },
    prepareHtml (data) {
      if (!data) throw new Error('prepareHtml: data cannot be empty')
      return data.reduce((c, v) => {
        c += createTableRow(v)
        return c
      }, '')
    },
    displayData () {
      const displayData = state.getDisplayData()
      const html = this.prepareHtml(displayData)

      dom.setHTML(tableElem, html)
      return html
    },
    reload () {
      this.clearData()
      this.displayData()
    }
  }
}(config, dom, elements, dateUtils, state))

// dirty hack for tests
if (typeof data !== 'object') var _data = {}
// eslint-disable-next-line no-undef
else _data = data
// end of hack

// This module pretend server's work
const fetch = (function (_data) {
  'use strict'

  return {
    fetchData (cb) {
      // This is a mock for server work
      // In real life it'sgona be return smt like "fetch(url, options).then(...)"...
      // And no need to handle errors in this 'dream world'
      return setTimeout(() => {
        // data contains our "screenings.json" from task
        if (cb) cb(_data)
      }, 0)
    },
    getScreening (cb) {
      return this.fetchData(data => cb(data.results))
    }
  }
}(_data))

// eslint-disable-next-line no-unused-vars
const main = (function (elements, dom, fetch, table, filter, sorting) {
  'use strict'

  const EVENTS = {
    onClick: 'click',
    onReset: 'reset',
    onInput: 'input',
    onChange: 'change',
    onSubmit: 'submit'
  }

  function onFiltersChange () {
    const nameInputElem = elements.getNameInput()
    const severitySelectElem = elements.getCheckSeveritySelect()

    filter.setNameFilter(nameInputElem.value)
    filter.setSeverityFilter(severitySelectElem.value)

    table.reload()
  }

  function onReset () {
    filter.resetState()
    sorting.resetState()
    table.reload()
  }

  function onGetData (data) {
    state.setData(data)
    table.reload()
  }

  function bindSorting () {
    const sortByNameBtn = elements.getSortByNameBtn()
    const sortByCreatedBtn = elements.getSortByCreatedBtn()
    const sortByModifiedBtn = elements.getSortByModifiedBtn()
    const sortBySeverityBtn = elements.getSortBySeverityBtn()

    dom.addEventListener(sortByNameBtn, EVENTS.onClick, event => this.setSorting(sorting.fields.name.name))
    dom.addEventListener(sortByCreatedBtn, EVENTS.onClick, event => this.setSorting(sorting.fields.created.name))
    dom.addEventListener(sortByModifiedBtn, EVENTS.onClick, event => this.setSorting(sorting.fields.modified.name))
    dom.addEventListener(sortBySeverityBtn, EVENTS.onClick, event => this.setSorting(sorting.fields.country_check_severity.name))
  }

  function bindFilters () {
    const formElem = elements.getFiltersForm()
    const nameInputElem = elements.getNameInput()
    const severitySelectElem = elements.getCheckSeveritySelect()

    dom.addEventListener(formElem, EVENTS.onReset, onReset)
    dom.addEventListener(nameInputElem, EVENTS.onInput, onFiltersChange)
    dom.addEventListener(severitySelectElem, EVENTS.onChange, onFiltersChange)
  }

  return {
    setSorting (sortingBy) {
      sorting.toggleDirection()
      sorting.setSorting(sortingBy)
      table.reload()
    },
    init () {
      bindFilters()
      bindSorting.call(this)

      fetch.getScreening(onGetData)
    }
  }
}(elements, dom, fetch, table, filter, sorting))

// for testing purpose
if (typeof module === 'object' && module.exports) {
  module.exports = {
    config,
    dom,
    elements,
    filter,
    sorting,
    state,
    dateUtils,
    table,
    fetch,
    main
  }
}

