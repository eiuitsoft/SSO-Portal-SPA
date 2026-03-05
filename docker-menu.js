#!/usr/bin/env node
/* eslint-disable */
var readline = require('readline');
var execSync = require('child_process').execSync;
var exec = require('child_process').exec;
var os = require('os');
// Chalk v5+ is ESM-only; when required in CJS we get { default: chalk }. Use .default if present.
var chalk = (function () {
  try {
    var c = require('chalk');
    return c.default && typeof c.default.cyan === 'function' ? c.default : c;
  } catch (e) {
    return { cyan: String, green: String, yellow: String, red: String, blue: String, gray: String };
  }
})();

var path = 'C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe';

function checkDockerRunning() {
  try {
    execSync('docker info', { stdio: 'ignore' });
    return true;
  } catch (e) {
    try {
      execSync('"' + path + '" info', { stdio: 'ignore' });
      return true;
    } catch (err) {
      console.error('❌ Docker chưa sẵn sàng:', err.message);
      return false;
    }
  }
}

function startDocker(callback) {
  var platform = os.platform();

  try {
    if (platform === 'darwin') {
      console.log(chalk.yellow('🔄 Đang mở Docker Desktop trên Mac...'));
      exec('open -a Docker', function (err) {
        if (err) return callback(err);
        waitForDocker(callback);
      });
    } else if (platform === 'win32') {
      console.log(chalk.yellow('🔄 Đang mở Docker Desktop trên Windows...'));
      exec(
        'start "" "C:\\\\Program Files\\\\Docker\\\\Docker\\\\Docker Desktop.exe"',
        function (err) {
          if (err) return callback(err);
          waitForDocker(callback);
        },
      );
    } else {
      console.log(chalk.yellow('🔄 Đang khởi động Docker Daemon trên Linux...'));
      exec('sudo systemctl start docker', function (err) {
        if (err) return callback(err);
        waitForDocker(callback);
      });
    }
  } catch (err) {
    callback(err);
  }
}

function waitForDocker(callback) {
  var maxTries = 30;
  var tries = 0;

  var interval = setInterval(function () {
    if (checkDockerRunning()) {
      clearInterval(interval);
      console.log(chalk.green('✅ Docker đã sẵn sàng!'));
      callback(null);
    } else {
      tries++;
      process.stdout.write('.');
      if (tries >= maxTries) {
        clearInterval(interval);
        callback(new Error('Docker không khởi động được sau 30s'));
      }
    }
  }, 2000);
}

function printMenu() {
  console.log(chalk.cyan('┌────────────────────────────────────────────────┐'));
  console.log(chalk.cyan('│            Docker Management Menu              │'));
  console.log(chalk.cyan('├────────────────────────────────────────────────┤'));
  console.log(chalk.cyan('│ Option   │ Environment   │ Action              │'));
  console.log(chalk.cyan('├──────────┼───────────────┼─────────────────────┤'));

  // Development
  console.log(`│ 1        │ ${chalk.green('Dev')}           │ Build               │`);
  console.log(`│ 2        │               │ Push                │`);
  console.log(`│ 3        │               │ Build + Push        │`);
  console.log(chalk.cyan('├──────────┼───────────────┼─────────────────────┤'));

  // UAT
  console.log(`│ 4        │ ${chalk.blue('UAT')}           │ Build               │`);
  console.log(`│ 5        │               │ Push                │`);
  console.log(`│ 6        │               │ Build + Push        │`);
  console.log(chalk.cyan('├──────────┼───────────────┼─────────────────────┤'));

  // Production
  console.log(`│ 7        │ ${chalk.red('Prod')}          │ Build               │`);
  console.log(`│ 8        │               │ Push                │`);
  console.log(`│ 9        │               │ Build + Push        │`);
  console.log(chalk.cyan('├──────────┼───────────────┼─────────────────────┤'));

  // Exit
  console.log(`│ 0        │ ${chalk.gray('System')}        │ Thoát               │`);

  console.log(chalk.cyan('└──────────┴───────────────┴─────────────────────┘'));
}

function runMenu() {
  printMenu();

  rl.question(chalk.yellow('Chọn một tùy chọn và nhấn Enter: '), function (answer) {
    if (answer.trim() === '0') {
      console.log(chalk.blue('👋 Thoát!'));
      rl.close();
      process.exit(0);
    }

    var cmd = '';
    switch (answer.trim()) {
      case '1':
        cmd = 'npm run docker:build:dev';
        break;
      case '2':
        cmd = 'npm run docker:push:dev';
        break;
      case '3':
        cmd = 'npm run docker:build:dev && npm run docker:push:dev';
        break;
      case '4':
        cmd = 'npm run docker:build:uat';
        break;
      case '5':
        cmd = 'npm run docker:push:uat';
        break;
      case '6':
        cmd = 'npm run docker:build:uat && npm run docker:push:uat';
        break;
      case '7':
        cmd = 'npm run docker:build:prod';
        break;
      case '8':
        cmd = 'npm run docker:push:prod';
        break;
      case '9':
        cmd = 'npm run docker:build:prod && npm run docker:push:prod';
        break;
      default:
        console.log(chalk.red('==> ❌ Lựa chọn không hợp lệ'));
        console.log(chalk.gray('===================\n'));
        return runMenu();
    }

    if (cmd) {
      if (!checkDockerRunning()) {
        console.log(chalk.red('⚠️ Docker chưa chạy, đang mở...'));
        startDocker(function (err) {
          if (err) {
            console.log(chalk.red('❌ Không thể mở Docker: ' + err.message));
            return runMenu();
          }
          execSync(cmd, { stdio: 'inherit' });
          runMenu();
        });
      } else {
        console.log(chalk.green('👉 Running: ' + cmd));
        try {
          execSync(cmd, { stdio: 'inherit' });
        } catch (e) {
          console.log(chalk.red('❌ Lỗi khi chạy lệnh: ' + e.message));
        }
        runMenu();
      }
    }
  });
}

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

runMenu();
