const fs = require('fs');
const os = require("os");

// let pathList = ["../XDCoreWeb2/", "../XDCoreWeb/"];//更新lib库文件
let pathList = ["../XDCoreWeb/"];

// WebPack插件
class buildDone {
  constructor(_version) {
    this.version = _version;
  }

  apply(compiler) {
    compiler.hooks.done.tap('buildDone', (compilation, data) => {
      // copyfile("./dist/index" + this.version + ".js", "./dist/index.js");
      // copyfile("./dist/index" + this.version + ".css", "./dist/index.css");
      for (let i = 0; i < pathList.length; i++) {
        let rootPath = pathList[i];
        let packagePath = rootPath + "package.json";
        if (fs.existsSync(packagePath)) {
          if (os.type() == "Windows_NT" &&
            fs.realpathSync(rootPath).toLocaleLowerCase() === fs.realpathSync("./").toLocaleLowerCase()) {
            continue;
          } else if (fs.realpathSync(rootPath) === fs.realpathSync("./")) {
            continue;
          }
          //第一步更新 package.json 文件
          let content = JSON.parse(fs.readFileSync(packagePath).toLocaleString());
          content.main = "dist/index" + this.version + ".js";
          content.module = content.main;
          fs.writeFileSync(packagePath, JSON.stringify(content, null, 2))
          let typesPath = rootPath + "types"
          const distPath = rootPath + "dist";
          deletefile(typesPath);//删除types
          deletefile(distPath);//删除dist
          // if (fs.existsSync(distPath)) {
          //   fs.readdirSync(distPath).forEach(file => {
          //     let path = distPath + "/" + file;
          //     if (fs.statSync(path).isFile()) {
          //       fs.rmSync(path);
          //     }
          //   });
          // }
          //复制文件
          copydir("./types", typesPath);
          copydir("./dist", distPath);
          break;
        }
      }
    });
  }
}

function deletefile(srcDir) {//删除文件
  if (fs.existsSync(srcDir)) {
    if (fs.lstatSync(srcDir).isDirectory()) {
      let files = fs.readdirSync(srcDir);
      for (let file of files) {
        deletefile(srcDir + "/" + file);
      }
      try {
        fs.rmdirSync(srcDir)
      } catch (e) {
        console.log(srcDir)
        deletefile(srcDir)
      }
    } else {
      try {
        fs.rmSync(srcDir);
      } catch (e) {
        console.log(srcDir)
        deletefile(srcDir)
      }
    }
  }
}

let version = "";

function copyfile(srcFile, distFile) {
  if (fs.existsSync(srcFile) && fs.lstatSync(srcFile).isFile()) {
    if (fs.existsSync(distFile)) {
      fs.rmSync(distFile);
    }
    fs.copyFileSync(srcFile, distFile);
  }
}

function copydir(srcDir, distDir) {//复制文件
  try {
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir);
    }
    if (fs.existsSync(srcDir)) {
      let files = fs.readdirSync(srcDir);
      for (let file of files) {
        let srcFile = srcDir + "/" + file;
        let distFile = distDir + "/" + file;
        if (fs.lstatSync(srcFile).isFile()) {
          if (fs.existsSync(distFile)) {
            fs.rmSync(distFile);
          }
          fs.copyFileSync(srcFile, distFile);
          if (!version && file.endsWith(".css") && file.indexOf("_") >= 0) {
            version = "_" + file.split("_")[1];
            version = version.substring(0, ".css".length);
          }
        } else {
          copydir(srcFile, distFile);
        }
      }
    }
  } catch (e) {
  }
}

module.exports = buildDone
