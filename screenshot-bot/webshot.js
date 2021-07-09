
const fetch = require('node-fetch');
const {Builder, By, Key, until} = require('selenium-webdriver');
const fs = require('fs');
const chrome = require('selenium-webdriver/chrome');

const screen = {
  width: 640 * 2,
  height: 480 * 2
};

(async () => {

  let driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless().windowSize(screen)
            .addArguments("--no-sandbox").addArguments("--disable-dev-shm-usage")).build();

  let shotter = async () => {
    
    fetch('https://kaspersoft.cloud/fetch_rooms', {
      method: 'post',
      headers: { 'Content-Type': 'application/json', token: 'admin' },
    })
    .then(res => res.json())
    .then(async result => {
      if (result.status === 'success') {
        result.rooms.forEach(async room => {
          let p = `https://kaspersoft.cloud/app/conf?room_id=${room.id}&is_guest=true&guest_token=admin`;
          console.info(p);
          try {
            await driver.get(p);
            await driver.sleep(20000);
            let img = await driver.takeScreenshot();
            fs.writeFileSync(__dirname + '/shots/' + room.id + '.png', img, 'base64');
          } finally {}
        });
      }
    });
  }

  shotter();

  setInterval(shotter, 60000);

  setInterval(() => {
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
  }, 2500);

})();
