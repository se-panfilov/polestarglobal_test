const config = {
  filtersFormId: 'data-filters-form',
  nameInputId: 'name-input',
  countryCheckSeveritySelectId: 'country-check-severity-select',
  dataTableBodyId: 'data-table-body',
  sortByNameBtnId: 'sort-by-name-btn',
  sortByCreatedBtnId: 'sort-by-created-btn',
  sortByModifiedBtnId: 'sort-by-modified-btn',
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

  const filters = {
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
        isStrict: true//,
        // values: {
        //   all: {
        //     name: 'all'
        //   },
        //   critical: {
        //     name: 'critical',
        //     val: '90-CRITICAL'
        //   },
        //   unknown: {
        //     name: 'unknown',
        //     val: '30-UNKNOWN'
        //   },
        //   warning: {
        //     name: 'warning',
        //     val: '70-WARNING'
        //   },
        //   ok: {
        //     name: 'ok',
        //     val: '60-OK'
        //   }
        // }
      }
    },
    filterBy (data, field, value, isStrict) {
      if (!data) throw new Error('filterBy: data shall be passed')
      if (!field) throw new Error('filterBy: field shall be passed')

      return data.filter(v => ((isStrict ? _p.filterStrict : _p.filterNotStrict))(v, field, value))
    },
    // filterBySeverity(data, value, isStrict) {
    //   if (!data) throw new Error('filterBySeverity: data shall be passed')
    //
    //   const isSeverityFilter = !!(value && value !== this.fields.country_check_severity.defaultVal)
    //   const severityVal = this.fields.country_check_severity.values[value].val
    //   if (isSeverityFilter) {
    //     data = filter.filterBy(data, filter.fields.country_check_severity.name, severityVal, isStrict)
    //   }
    //   return data
    // },
    getFiltersValues () {
      return {
        [this.fields.name.name]: this.state[this.fields.name.name],
        [this.fields.country_check_severity.name]: this.state[this.fields.country_check_severity.name]
      }
    },
    filterByState (data) {
      const filterValues = this.getFiltersValues()

      let result = data // TODO (S.Panfilov)  deepCopy

      for (const k in filterValues) {
        if (filterValues.hasOwnProperty(k)) {
          if (filterValues[k] !== filter.fields[k].defaultVal) {
            result = this.filterBy(result, filter.fields[k].name, filterValues[k], filter.fields[k].isStrict)
          }
        }
      }

      return result

    },
    setNameFilter (value) {
      this.state[this.fields.name.name] = value
    },
    setSeverityFilter (value) {
      this.state[this.fields.country_check_severity.name] = value
    },
    resetState () {
      this.setNameFilter(this.fields.name.defaultVal)
      this.setSeverityFilter(this.fields.country_check_severity.defaultVal)
    }
  }

  function init () {
    filters.resetState()
  }

  init()

  return filters
}())

const sorting = (function () {
  'use strict'

  const sorting = {
    directions: {
      asc: 'ASC',
      desc: 'DESC'
    },
    fields: {
      name: 'name',
      created: 'created',
      modified: 'modified',
    },
    setSorting(field, direction) {
      if (!field) throw new Error('setSorting: field must be set')

      this.state = this.state || {}
      if (field) this.state.field = field
      if (direction) this.state.direction = direction
    },
    getSorting () {
      return this.state
    },
    toggleDirection () {
      if (this.state.direction === this.directions.asc) {
        this.state.direction = this.directions.desc
        return
      }
      this.state.direction = this.directions.asc
    },
    stringSort (a, b, field, direction = 'ASC') {
      let multiplier = 1
      if (direction === this.directions.desc) multiplier = -1

      const v1 = a[field].toLowerCase()
      const v2 = b[field].toLowerCase()

      if (v1 < v2) return (-1 * multiplier)
      if (v1 > v2) return (1 * multiplier)
      return 0
    },
    numberSort (a, b, field, direction = 'ASC') {
      if (direction === this.directions.asc) return a[field] - b[field]
      return b[field] - a[field]
    },
    dateSorting (a, b, field, direction = 'ASC'){
      const d1 = new Date(a).getTime()
      const d2 = new Date(b).getTime()

      return this.numberSort(d1, d2, field, direction)
    },
    sort (data, field, type = 'string') {
      if (!data) throw new Error('sort: no data provided')

      let method
      if (type === 'string') method = this.stringSort
      if (type === 'number') method = this.stringSort

      return data.sort((a, b) => method.call(this, a, b, field, this.getSorting.direction))
    }
  }

  function init () {
    sorting.setSorting(sorting.fields.name, sorting.directions.asc)
  }

  init()

  return sorting
}())

//our cute "redux", lol
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
      // TODO (S.Panfilov) curWorkPoint
      // get filters, get sorting, do it and return result
      // sorting.sort(data, sorting.getSorting().field, 'string')

      const filteredData = filter.filterByState(this.getData())
      console.info(filteredData)
      // filter.getFiltersValues()
      return filteredData
    }
  }

}(filter, sorting))

const dateUtils = (function () {
  'use strict'

  return {
    getHumanReadyDate (str) {
      if (!str) throw new Error('getHumanReadyDate: no data string')
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

const table = (function (config, dom, elements, sorting, dateUtils, state) {
  'use strict'

  const tableElem = elements.getDataTableBody()

  function createTableRow (data) {
    const nameTd = dom.createElem('td', `${config.tableCellClass} -name`, data.name)
    const modifiedTd = dom.createElem('td', `${config.tableCellClass} -modified`, dateUtils.getHumanReadyDate(data.modified))
    const createdTd = dom.createElem('td', `${config.tableCellClass} -created`, dateUtils.getHumanReadyDate(data.created))
    const countryCheckSeverityTd = dom.createElem('td', `${config.tableCellClass} -country-check-severity`, data.country_check_severity)
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
    sortData (data) {
      return sorting.sort(data, sorting.getSorting().field, 'string')
    },
    displayData () {
      // const sortedData = this.sortData(data)
      // const html = this.prepareHtml(sortedData)
      const html = this.prepareHtml(state.getDisplayData())

      dom.setHTML(tableElem, html)
      return html
    }
  }
}(config, dom, elements, sorting, dateUtils, state))

//This module pretend server's work
const fetch = (function (elements, data, filter) {
  'use strict'

  // const _p = {
  // filterData (data, filters) {
  //TODO (S.Panfilov) no need for filtering here
  // const isNameFilter = (filters.name && filters.name.length > 0)
  // if (isNameFilter) data = filter.filterBy(data, filter.fields.name.name, filters.name, false)
  //
  // data = filter.filterBySeverity(data, filters[filter.fields.country_check_severity.name], true)
  //
  // return data
  // },
  // }

  return {
    fetchData (cb) {
      //This is a mock for server work
      //In real life it'sgona be return smt like "fetch(url, options).then(...)"...
      //And no need to handle errors in this 'dream world'
      return setTimeout(() => {
        //data contains our "screenings.json" from task
        if (cb) cb(data)
      }, 0)
    },
    getScreening (cb) {
      return this.fetchData(data => cb(data.results))
    }
  }
}(elements, data, filter))

// eslint-disable-next-line no-unused-vars
const main = (function (elements, dom, fetch, table, filter, sorting) {
  'use strict'

  function onSubmit (event) {
    event.preventDefault()
    event.stopPropagation()

    fetch.getScreening(onGetData)
  }

  function onFiltersChange (event) {
    const nameInputElem = elements.getNameInput()
    const severitySelectElem = elements.getCheckSeveritySelect()

    filter.setNameFilter(nameInputElem.value)
    filter.setSeverityFilter(severitySelectElem.value)

    onSubmit(event)
  }

  function onReset (event) {
    filter.resetState()
    const filters = filter.getFiltersValues()
    fetch.getScreening(onGetData, filters)
  }

  function onGetData (data) {
    table.clearData()
    state.setData(data)
    table.displayData()
  }

  return {
    reload (event, sortingBy = 'name') {
      sorting.toggleDirection()
      sorting.setSorting(sortingBy)
      console.info(123123)
      onSubmit(event)
    },
    init () {
      const formElem = elements.getFiltersForm()
      const nameInputElem = elements.getNameInput()
      const severitySelectElem = elements.getCheckSeveritySelect()

      // dom.addEventListener(formElem, 'submit', event => onSubmit(event))
      dom.addEventListener(formElem, 'reset', event => onReset(event))
      dom.addEventListener(nameInputElem, 'input', event => onFiltersChange(event))
      dom.addEventListener(severitySelectElem, 'change', event => onFiltersChange(event))

      const sortByNameBtn = elements.getSortByNameBtn()
      const sortByCreatedBtn = elements.getSortByCreatedBtn()
      const sortByModifiedBtn = elements.getSortByModifiedBtn()
      dom.addEventListener(sortByNameBtn, 'click', event => this.reload(event, 'name'))
      dom.addEventListener(sortByCreatedBtn, 'click', event => this.reload(event, 'created'))
      dom.addEventListener(sortByModifiedBtn, 'click', event => this.reload(event, 'modified'))

      fetch.getScreening(onGetData, filter.getFiltersValues())
    }
  }

}(elements, dom, fetch, table, filter, sorting))

// for testing purpose
if (typeof module === 'object' && module.exports) {
  module.exports = {
    main
  }
}

