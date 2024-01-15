#! /usr/bin/env node
import downloadTemplate, { templates, initAction } from "./util.js"
import figlet from "figlet"
import chalk from "chalk"
import { program } from "commander"
// import pkg from "./package.json" assert { type: "json" } 这可以使用
import fs from "fs"
// import.meta.url  ESM模块化中的属性 用于获取当前模块文件的 URL 的绝对地址,只可以支持在 ESM 的模块环境中使用
// __dirname 获取当前模块所在目录的绝对地址, 它是由NodeJs在每一个模块注入的特殊变量 只可以在commonjs模块中使用
// process.cwd() cwd ' current working directory' 当前工作目录
const pkg = JSON.parse(
  await fs.promises.readFile(
    new URL("./package.json", import.meta.url),
    "utf-8"
  )
)
// console.log(pkg, "pkg")

program.version(pkg.version, "-v --version")
program.version(pkg.version, "-V --version")

program
  .command("create <app-name>")
  .description("创建一个新的项目")
  .option("-t --template [template]", "输入模版名称创建项目")
  .option("-f --force", "覆盖本地同名的项目")
  .option("-i --ignore", "忽略")
  .action(initAction)

program
  .command("list")
  .description("查看所有可用的模版")
  .action((name, option) => {
    // console.log(chalk.yellowBright("所有可用的模版"))
    templates.forEach((tem) => console.log(chalk.greenBright(tem.name)))
  })

// console.log(
//   "\r\n" +
//     chalk.greenBright.bold(
//       figlet.textSync("cmm-cli!", {
//         font: "Standard",
//         horizontalLayout: "default",
//         verticalLayout: "default",
//         width: 80,
//         whitespaceBreak: true,
//       })
//     )
// )

// console.log(`\r\n Run ${chalk.cyan(`cmm-cli <command> help`)} for detail`)
// await downloadTemplate("CMM528/router", "test2")

program.parse(process.argv)

console.log("测试")
