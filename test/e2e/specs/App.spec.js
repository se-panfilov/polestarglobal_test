const elements = {
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
    // browser = initPage(browser)
    //
    // browser.expect.element(elements.form).to.be.a('form')
    //
    // browser.end()
  }
}
