const fs = require("fs")
const path = require("path")
const ini = require("ini")

const filepath = path.join(require("os").homedir(), ".gitconfig")

function readConfig() {
  return fs.readFileSync(filepath).toString("utf-8")
}

function saveConfig(config) {
  fs.writeFileSync(filepath, ini.stringify(config, {
    whitespace: true
  }), { encoding: "utf-8" })
}

function createBackup(text) {
  const folder = path.resolve("backups")
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder)
  }
  const name = `${Date.now()}.gitconfig`
  fs.writeFileSync(path.join(folder, name), text, { encoding: "utf-8" })
}

function main() {
  const args = require("yargs")(process.argv).argv
  const { username, useremail } = args

  if (!username || !useremail) {
    return
  }

  const text = readConfig()
  createBackup(text)
  const config = ini.parse(text)

  config.user.name = username
  config.user.email = useremail

  saveConfig(config)
}

main()