#!/usr/bin/env node

const clui = require('clui')
const chalk = require('chalk')
const program = require('commander')
const inquirer = require('inquirer')
const fs = require('fs')

program
  .version('0.0.1')
  .option('-r, --reset', '飲んだ量をリセットする')
  .option('-n, --now', '現在までに飲んだ量を表示する')
  .option('-s, --set', '体重の設定をする')
  .parse()

class Water {
  constructor () {
    this.today = new Date().toLocaleDateString()
    this.Progress = clui.Progress
    this.thisProgressBar = new this.Progress(20)
  }

  weightSet () {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'weight',
          message: 'あなたの体重を入力してください(kg)',
          validate: (input) => {
            if (input && Number.isFinite(Number(input))) {
              return true
            } else {
              return '正しく入力されていません'
            }
          }
        }
      ]).then(answers => {
        this.addWeight(answers)
        console.log(`体重を${answers.weight}kgで登録しました。`)
        console.log(`一日に飲む水の量の目安は${this.targetAmount(answers.weight)}mlです！`)
      })
  }

  targetAmount (weight) {
    return weight * 40 - 1000
  }

  drink () {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'water',
          message: '飲んだ水の量を入力してください(ml)',
          validate: (input) => {
            if (input && Number.isFinite(Number(input))) {
              return true
            } else {
              return '正しく入力されていません'
            }
          }
        }
      ]).then(answers => {
        if (this.strage.water.length && this.today !== this.strage.water.slice(-1)[0].date) {
          this.strage.water = []
        }
        const contents = {
          date: this.today,
          amount: Number(answers.water)
        }
        this.strage.water.push(contents)
        this.writeFile(this.strage)
        this.total(this.strage)
      })
  }

  reset () {
    this.strage.water = []
    this.writeFile(this.strage)
    console.log('飲んだ量をリセットしました！')
  }

  nowAchivement () {
    this.total(this.strage)
  }

  total (record) {
    const total = this.calcTotal(record)
    console.log('今日は' + chalk.cyan(total + 'ml') + '飲みました！')
    console.log(this.progressBar(total, this.targetAmount(this.weight)))
  }

  progressBar (currentValue, maxValue) {
    const width = 20
    let barLength = Math.ceil(currentValue / maxValue * width)
    let barColor = chalk.cyan

    if (barLength > width) {
      barLength = width
    }

    if (currentValue > maxValue) {
      barColor = chalk.magenta
    }

    return '[' +
      barColor('|'.repeat(barLength)) +
      '-'.repeat(width - barLength) +
      '] ' +
      Math.ceil(currentValue / maxValue * 100) + '%' +
      ' | ' + barColor(currentValue) + '/' + maxValue + 'ml'
  }
}

class FileStrage extends Water {
  constructor () {
    super()
    this.strage = this.openFile()
    this.weight = this.strage.weight || ''
  }

  notSetWeight () {
    return this.weight === ''
  }

  openFile () {
    if (fs.existsSync('./water.json')) {
      return JSON.parse(fs.readFileSync('./water.json', 'utf8'))
    } else {
      const firstSet = {
        weight: '',
        water: []
      }
      fs.writeFileSync('./water.json', JSON.stringify(firstSet))
      return JSON.parse(fs.readFileSync('./water.json', 'utf8'))
    }
  }

  writeFile (text) {
    fs.writeFileSync('./water.json', JSON.stringify(text))
  }

  addWeight (answers) {
    this.strage.weight = Number(answers.weight)
    this.writeFile(this.strage)
  }

  calcTotal (record) {
    return record.water.map(value => value.amount).reduce((acc, cur) => acc + cur, 0)
  }
}

class Main {
  constructor () {
    this.options = program.opts()
    this.water = new FileStrage()
  }

  run () {
    if (this.water.notSetWeight()) {
      this.water.weightSet()
    } else if (this.options.reset) {
      this.water.reset()
    } else if (this.options.now) {
      this.water.nowAchivement()
    } else if (this.options.set) {
      this.water.weightSet()
    } else if (!this.options.length) {
      this.water.drink()
    }
  }
}

new Main().run()
