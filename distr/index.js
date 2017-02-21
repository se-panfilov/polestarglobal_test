'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var config = {
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
};

var dom = function () {
  'use strict';

  return {
    getElement: function getElement(id) {
      if (!id) return new Error('getElement: no ID');
      return document.getElementById(id);
    },
    setHTML: function setHTML(elem, content) {
      if (!elem) return new Error('setHTML: no such element');
      elem.innerHTML = content;
      return elem;
    },
    clearHTML: function clearHTML(elem) {
      this.setHTML(elem, '');
      return elem;
    },
    addEventListener: function addEventListener(elem, event, cb) {
      if (!elem) return new Error('addEventListener: no such element');

      elem.addEventListener(event, function (event) {
        if (cb) cb(event);
      });
      return elem;
    },
    createElem: function createElem() {
      var tag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'div';
      var className = arguments[1];
      var text = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

      var classes = className ? 'class="' + className : '';
      return '<' + tag + ' ' + classes + '">' + text + '</' + tag + '>';
    }
  };
}();

var elements = function (config, dom) {
  'use strict';

  var messages = {
    elemNotFound: 'No such element',
    noId: 'ID must be specified'
  };

  return {
    _getElem: function _getElem(id) {
      if (!id) throw new Error(messages.noId);
      var elem = dom.getElement(id);
      if (!elem) throw new Error(messages.elemNotFound + ': ' + id);
      return elem;
    },
    getFiltersForm: function getFiltersForm() {
      return this._getElem(config.filtersFormId);
    },
    getNameInput: function getNameInput() {
      return this._getElem(config.nameInputId);
    },
    getCheckSeveritySelect: function getCheckSeveritySelect() {
      return this._getElem(config.countryCheckSeveritySelectId);
    },
    getDataTableBody: function getDataTableBody() {
      return this._getElem(config.dataTableBodyId);
    },
    getSortByNameBtn: function getSortByNameBtn() {
      return this._getElem(config.sortByNameBtnId);
    },
    getSortByCreatedBtn: function getSortByCreatedBtn() {
      return this._getElem(config.sortByCreatedBtnId);
    },
    getSortByModifiedBtn: function getSortByModifiedBtn() {
      return this._getElem(config.sortByModifiedBtnId);
    },
    getSortBySeverityBtn: function getSortBySeverityBtn() {
      return this._getElem(config.sortBySeverityBtnId);
    }
  };
}(config, dom);

var filter = function () {
  var _p = {
    filterStrict: function filterStrict(val, field, value) {
      return val[field] === value;
    },
    filterNotStrict: function filterNotStrict(val, field, value) {
      return val[field].toLowerCase().includes(value.toLowerCase());
    }
  };

  var filter = {
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
    filterBy: function filterBy(data, field, value, isStrict) {
      var _this = this;

      if (!data) throw new Error('filterBy: data shall be passed');
      if (!field) throw new Error('filterBy: field shall be passed');

      var method = isStrict ? _p.filterStrict : _p.filterNotStrict;
      return data.filter(function (v) {
        return method.call(_this, v, field, value);
      });
    },
    getFiltersValues: function getFiltersValues() {
      var _ref;

      return _ref = {}, _defineProperty(_ref, this.fields.name.name, this.state[this.fields.name.name]), _defineProperty(_ref, this.fields.country_check_severity.name, this.state[this.fields.country_check_severity.name]), _ref;
    },
    filterByState: function filterByState(data) {
      var filterValues = this.getFiltersValues();

      var result = data;

      for (var k in filterValues) {
        if (filterValues.hasOwnProperty(k)) {
          if (filterValues[k] !== this.fields[k].defaultVal) {
            result = this.filterBy(result, this.fields[k].name, filterValues[k], this.fields[k].isStrict);
          }
        }
      }

      return result;
    },
    setNameFilter: function setNameFilter(value) {
      if (!value) value = this.fields.name.defaultVal;
      this.state[this.fields.name.name] = value;
    },
    setSeverityFilter: function setSeverityFilter(value) {
      if (!value) value = this.fields.country_check_severity.defaultVal;
      this.state[this.fields.country_check_severity.name] = value;
    },
    resetState: function resetState() {
      this.setNameFilter(this.fields.name.defaultVal);
      this.setSeverityFilter(this.fields.country_check_severity.defaultVal);
    }
  };

  function init() {
    filter.resetState();
  }

  init();

  return filter;
}();

var sorting = function () {
  'use strict';

  var TYPES = {
    number: 'number',
    string: 'string',
    date: 'date'
  };

  var sorting = {
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
    setSorting: function setSorting(field, direction) {
      if (!field) throw new Error('setSorting: field must be set');

      this.state = this.state || {};
      if (field) this.state.field = field;
      this.state.type = this.fields[field].type;
      if (direction) this.state.direction = direction;
    },
    getState: function getState() {
      return this.state;
    },
    toggleDirection: function toggleDirection() {
      if (this.state.direction === this.directions.asc) {
        this.state.direction = this.directions.desc;
        return;
      }
      this.state.direction = this.directions.asc;
    },
    stringSort: function stringSort(a, b) {
      var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'ASC';

      if (!a || !b) throw new Error('stringSort: strings must be passed');
      if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) !== TYPES.string || (typeof b === 'undefined' ? 'undefined' : _typeof(b)) !== TYPES.string) throw new Error('stringSort: invalid strings');

      var multiplier = 1;
      if (direction === this.directions.desc) multiplier = -1;

      var v1 = a.toLowerCase();
      var v2 = b.toLowerCase();

      if (v1 < v2) return -1 * multiplier;
      if (v1 > v2) return 1 * multiplier;
      return 0;
    },
    numberSort: function numberSort(a, b) {
      var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'ASC';

      if (!a || !b) throw new Error('numberSort: numbers must be passed');
      if (!Number.isFinite(a) || !Number.isFinite(b)) throw new Error('numberSort: invalid numbers');

      if (direction === this.directions.asc) return a - b;
      return b - a;
    },
    dateSort: function dateSort(a, b) {
      var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'ASC';

      if (!a || !b) throw new Error('dateSort: dates must be passed');
      var isValidA = (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === TYPES.date || (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === TYPES.string;
      var isValidB = (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === TYPES.date || (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === TYPES.string;

      if (!isValidA || !isValidB) throw new Error('dateSort: invalid dates');
      var d1 = (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === TYPES.date ? a : new Date(a);
      var d2 = (typeof b === 'undefined' ? 'undefined' : _typeof(b)) === TYPES.date ? b : new Date(b);

      return this.numberSort(d1.getTime(), d2.getTime(), direction);
    },
    sort: function sort(data, field) {
      var _this2 = this;

      if (!data) throw new Error('sort: no data provided');
      var type = this.fields[field].type;

      var method = this.stringSort;
      if (type === TYPES.number) method = this.numberSort;
      if (type === TYPES.date) method = this.dateSort;

      var direction = this.getState().direction;
      return data.sort(function (a, b) {
        return method.call(_this2, a[field], b[field], direction);
      });
    },
    resetState: function resetState() {
      this.setSorting(this.fields.name.name, this.directions.asc);
    }
  };

  function init() {
    sorting.resetState();
  }

  init();

  return sorting;
}();

// our cute "redux"-like state, lol
var state = function (filter, sorting) {
  return {
    current: {
      _data: null
    },
    setData: function setData(data) {
      this.current._data = data;
    },
    getData: function getData() {
      return this.current._data;
    },
    getDisplayData: function getDisplayData() {
      var filteredData = filter.filterByState(this.getData());
      return sorting.sort(filteredData, sorting.getState().field);
    }
  };
}(filter, sorting);

var dateUtils = function () {
  'use strict';

  return {
    getHumanReadyDate: function getHumanReadyDate(str) {
      if (!str) throw new Error('getHumanReadyDate: no date string');
      var date = new Date(str);
      var day = date.getUTCDate().toString();
      if (day.length === 1) day = '0' + day;
      var month = date.getUTCMonth().toString();
      if (month.length === 1) month = '0' + month;
      var year = date.getUTCFullYear().toString();

      return day + '.' + month + '.' + year;
    }
  };
}();

var table = function (config, dom, elements, dateUtils, state) {
  'use strict';

  var tableElem = elements.getDataTableBody();

  function createTableRow(data) {
    var nameTd = dom.createElem('td', config.tableCellClass + ' -name', data.name);
    var modifiedTd = dom.createElem('td', config.tableCellClass + ' -modified', dateUtils.getHumanReadyDate(data.modified));
    var createdTd = dom.createElem('td', config.tableCellClass + ' -created', dateUtils.getHumanReadyDate(data.created));
    var modifier = data.country_check_severity.replace(/\d*/, '').toLowerCase();
    var countryCheckSeverityTd = dom.createElem('td', config.tableCellClass + ' -country-check-severity ' + modifier, data.country_check_severity);

    return dom.createElem('tr', config.tableRowClass, nameTd + modifiedTd + createdTd + countryCheckSeverityTd);
  }

  return {
    clearData: function clearData() {
      dom.clearHTML(tableElem);
    },
    prepareHtml: function prepareHtml(data) {
      if (!data) throw new Error('prepareHtml: data cannot be empty');
      return data.reduce(function (c, v) {
        c += createTableRow(v);
        return c;
      }, '');
    },
    displayData: function displayData() {
      var displayData = state.getDisplayData();
      var html = this.prepareHtml(displayData);

      dom.setHTML(tableElem, html);
      return html;
    },
    reload: function reload() {
      this.clearData();
      this.displayData();
    }
  };
}(config, dom, elements, dateUtils, state);

// dirty hack for tests
if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object') var _data = {};
// eslint-disable-next-line no-undef
else _data = data;
// end of hack

// This module pretend server's work
var fetch = function (_data) {
  'use strict';

  return {
    fetchData: function fetchData(cb) {
      // This is a mock for server work
      // In real life it'sgona be return smt like "fetch(url, options).then(...)"...
      // And no need to handle errors in this 'dream world'
      return setTimeout(function () {
        // data contains our "screenings.json" from task
        if (cb) cb(_data);
      }, 0);
    },
    getScreening: function getScreening(cb) {
      return this.fetchData(function (data) {
        return cb(data.results);
      });
    }
  };
}(_data);

// eslint-disable-next-line no-unused-vars
var main = function (elements, dom, fetch, table, filter, sorting) {
  'use strict';

  var EVENTS = {
    onClick: 'click',
    onReset: 'reset',
    onInput: 'input',
    onChange: 'change',
    onSubmit: 'submit'
  };

  function onFiltersChange() {
    var nameInputElem = elements.getNameInput();
    var severitySelectElem = elements.getCheckSeveritySelect();

    filter.setNameFilter(nameInputElem.value);
    filter.setSeverityFilter(severitySelectElem.value);

    table.reload();
  }

  function onReset() {
    filter.resetState();
    sorting.resetState();
    table.reload();
  }

  function onGetData(data) {
    state.setData(data);
    table.reload();
  }

  function bindSorting() {
    var _this3 = this;

    var sortByNameBtn = elements.getSortByNameBtn();
    var sortByCreatedBtn = elements.getSortByCreatedBtn();
    var sortByModifiedBtn = elements.getSortByModifiedBtn();
    var sortBySeverityBtn = elements.getSortBySeverityBtn();

    dom.addEventListener(sortByNameBtn, EVENTS.onClick, function (event) {
      return _this3.setSorting(sorting.fields.name.name);
    });
    dom.addEventListener(sortByCreatedBtn, EVENTS.onClick, function (event) {
      return _this3.setSorting(sorting.fields.created.name);
    });
    dom.addEventListener(sortByModifiedBtn, EVENTS.onClick, function (event) {
      return _this3.setSorting(sorting.fields.modified.name);
    });
    dom.addEventListener(sortBySeverityBtn, EVENTS.onClick, function (event) {
      return _this3.setSorting(sorting.fields.country_check_severity.name);
    });
  }

  function bindFilters() {
    var formElem = elements.getFiltersForm();
    var nameInputElem = elements.getNameInput();
    var severitySelectElem = elements.getCheckSeveritySelect();

    dom.addEventListener(formElem, EVENTS.onReset, onReset);
    dom.addEventListener(nameInputElem, EVENTS.onInput, onFiltersChange);
    dom.addEventListener(severitySelectElem, EVENTS.onChange, onFiltersChange);
  }

  return {
    setSorting: function setSorting(sortingBy) {
      sorting.toggleDirection();
      sorting.setSorting(sortingBy);
      table.reload();
    },
    init: function init() {
      bindFilters();
      bindSorting.call(this);

      fetch.getScreening(onGetData);
    }
  };
}(elements, dom, fetch, table, filter, sorting);

// for testing purpose
if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
  module.exports = {
    config: config,
    dom: dom,
    elements: elements,
    filter: filter,
    sorting: sorting,
    state: state,
    dateUtils: dateUtils,
    table: table,
    fetch: fetch,
    main: main
  };
}