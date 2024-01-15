import download from "download-git-repo"
import ora from "ora"
import chalk from "chalk"
import shell from "shelljs"
import fs from "fs-extra"
import log from "log-symbols"
import path from "path"
import inquirer from "inquirer"

const downloadTemplate = (remote, name, options) => {
  const spinner = ora("正在拉取项目=======").start()
  return new Promise((resolve, reject) => {
    download(remote, name, options, (err) => {
      if (err) {
        // console.log(err)
        spinner.fail(chalk.red(err))
        reject(err)
        return
      }
      spinner.succeed(chalk.green("拉取成功========="))
      // console.log("================================ 成功下载")
      resolve(err)
    })
  })
}
export default downloadTemplate

export const templates = [
  {
    name: "pinia",
    value: "CMM528/pinia",
    desc: "下载大菠萝的源代码包",
  },
  {
    name: "router",
    value: "CMM528/router",
    desc: "下载vue路由的的源代码包",
  },
]

export const initAction = async (name, option) => {
  console.log(option, "initAction option")
  if (!shell.which("git")) {
    console.log(chalk.redBright("先安装git"))
    shell.exit(1)
  }
  // 验证 name 是否规范
  if (name.match(/[\u4E00 - \u9FFF`~!@#$*&%[\]^*()\\;:<>/?]/g)) {
    console.log(chalk.redBright("名称存在非法字符!!!!"))
  }
  // 验证是否存在name同名的文件夹
  // 如果没有 -f 选项 提示用户是否删除同名文件夹
  // 如果有的话 直接删除同名的文件夹

  if (fs.existsSync(name)) {
    if (option.force) {
      console.log(
        log.error,
        `已经存在文件夹${chalk.yellowBright(name)}, 将会自动删除!!`
      )
      // 删除
      await removeDir(name)
    } else {
      console.log(log.warning, `已经存在文件夹${chalk.yellowBright(name)}`)
      // 询问是否删除
      const answer = await inquirerConfirm(
        `是否删除文件夹${chalk.yellowBright(name)}`
      )
      console.log(answer, "answer")
      if (answer.confirm) {
        // TODO 删除
        await removeDir(name)
      } else {
        console.log(
          log.error,
          `已经存在文件夹${chalk.yellowBright(name)}, 项目创建失败!!`
        )
        shell.exit(1)
        return
      }
    }
  }

  let repository = ""
  if (option.template) {
    const template = templates.find((x) => x.name === option.template)
    if (!template) {
      console.log(log.error, `不存在模版${chalk.yellow(option.template)}`)
      console.log(
        `\r\n 运行------> ${chalk.yellowBright("cmm-cli list")} 查看可用模版`
      )
      return
    }
    repository = template.value
  } else {
    const template = await inquirerChoose("请选择一个模版拉取", templates)
    repository = template.choices
  }

  // if(!option.ig)
  console.log(repository, "repository")
  await downloadTemplate(repository, name)
  if (!option.ignore) {
    const answer = await inquirerInputs(messages)
    console.log(answer, "2222")
    await changePkgJson(name, answer)
  }

  npmInstall(name)
}

export const messages = [
  {
    message: "请输入项目关键词(,分割):",
    name: "keywords",
  },
  {
    message: "请输入项目描述(,分割):",
    name: "description",
  },
  {
    message: "请输入作者名称:",
    name: "author",
  },
  {
    message: "请输入项目名称:",
    name: "name",
    validate: function (val) {
      if (val.match(/[\u4E00 - \u9FFF`~!@#$*&%[\]^*()\\;:<>/?]/g)) {
        return "项目名称存在非法字符"
      }
      return true
    },
  },
]

export const removeDir = async function (dir) {
  const spinner = ora({
    text: `正在删除文件夹${chalk.cyan(dir)}`,
    color: "yellow",
  }).start()
  try {
    await fs.remove(resolveApp(dir))
    spinner.succeed(chalk.greenBright(`删除文件夹${chalk.cyan(dir)}成功`))
  } catch (e) {
    spinner.fail(chalk.greenBright(`删除文件夹${chalk.cyan(dir)}失败`))
    console.log(e)
    return
  }
}

const appDir = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDir, relativePath)

export const inquirerConfirm = async (message) => {
  const answer = await inquirer.prompt({
    type: "confirm",
    name: "confirm",
    message,
  })
  return answer
}

export const inquirerChoose = async (message, choices, type = "list") => {
  const answer = await inquirer.prompt({
    type,
    name: "choices",
    message,
    choices,
  })
  return answer
}

export const inquirerInput = async (messages) => {
  return await inquirer.prompt({
    type: "input",
    name: "input",
    message: messages,
  })
}

export const inquirerInputs = async (messages) => {
  return await inquirer.prompt(
    messages.map((msg) => {
      return {
        name: msg.name,
        type: "input",
        message: msg.message,
      }
    })
  )
}

export const changePkgJson = async (name, info) => {
  const pkg = await fs.readJson(resolveApp(`${name}/package.json`))
  console.log(pkg)
  Object.keys(info).forEach((item) => {
    if (pkg[item]) {
      pkg[item] = info[item]
    }
  })
  await fs.writeJson(resolveApp(`${name}/package.json`), pkg, { spaces: 2 })
}

export function npmInstall(dir) {
  const spinner = ora("正在安装依赖........").start()
  if (
    shell.exec(`cd ${shell.pwd()}/${dir} && npm install --force -d`).code !== 0
  ) {
    console.log(log.error, chalk.yellowBright(`对不起,依赖安装失败,请手动安装`))
    shell.exit(1)
  }
  spinner.succeed(chalk.greenBright(`成功 Successes`))
  shell.exit(1)
}
