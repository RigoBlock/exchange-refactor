#!/usr/bin/env node

const program = require('commander')
const fs = require('fs-extra')
const Handlebars = require('handlebars')

const appHomePath =
  './src/app/ApplicationExchangeHome/applicationExchangeHome.js'
const srcPath = '/app'
const refactorPath = '/refactor'
const onlyComponentsRegExp = RegExp('_redux|_utils|PoolsApi|css')
const cssFileComponent = RegExp('css')

program.version('0.1.0').parse(process.argv)

fs.ensureDirSync(__dirname + refactorPath)
fs.ensureDirSync(__dirname + refactorPath + '/_atomic/')
fs.ensureDirSync(__dirname + refactorPath + '/_atomic/atoms')
fs.ensureDirSync(__dirname + refactorPath + '/_atomic/molecules')
fs.ensureDirSync(__dirname + refactorPath + '/_atomic/organisms')
fs.ensureDirSync(__dirname + refactorPath + '/_const/')
fs.ensureDirSync(__dirname + refactorPath + '/_redux/')
fs.ensureDirSync(__dirname + refactorPath + '/_utils/')
fs.ensureDirSync(__dirname + refactorPath + '/Elements/')

const extract = async () => {
  const indexTemplateSource = fs.readFileSync(
    __dirname + '/templates/index.handlebars',
    'utf8'
  )
  const testTemplateSource = fs.readFileSync(
    __dirname + '/templates/test.handlebars',
    'utf8'
  )
  const indexTemplate = Handlebars.compile(indexTemplateSource)
  const testTemplate = Handlebars.compile(testTemplateSource)
  const matches = getImportedComponents(appHomePath)
  const sourceComponents = matches.map(el =>
    el.replace('..', __dirname + srcPath)
  )
  const destinationComponents = matches.map(el =>
    el.replace('..', __dirname + refactorPath)
  )

  const copyPromises = destinationComponents.map(async (path, index) => {
    await fs.ensureDirSync(path)
    const filename = `${path.split('/').pop()}`
    const source = {
      name: filename
    }
    const indexData = indexTemplate(source)
    const testData = testTemplate(source)
    await fs.outputFile(`${path}/index.js`, indexData)
    await fs.outputFile(`${path}/${filename}.test.js`, testData)
    await fs.copy(`${sourceComponents[index]}.js`, `${path}/${filename}.jsx`)
    if (fs.existsSync(`${sourceComponents[index]}.module.css`)) {
      await fs.copy(
        `${sourceComponents[index]}.module.css`,
        `${path}/${filename}.module.css`
      )
    }
  })

  await Promise.all(copyPromises)
}

getImportedComponents = file => {
  let content = fs.readFileSync(file, 'utf8')
  return content
    .match(/\.+\/[a-zA-Z\/_\.]*/g)
    .filter(element => !onlyComponentsRegExp.test(element))
}

getImportedCss = file => {
  let content = fs.readFileSync(file, 'utf8')
  return content
    .match(/\.+\/[a-zA-Z\/_\.]*/g)
    .filter(element => cssFileComponent.test(element))
}

extract()
