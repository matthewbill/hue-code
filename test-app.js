const HueBridgesRepository = require('./src/hue/hue-bridges-repository');

const hueBirdgesRepository = new HueBridgesRepository();
hueBirdgesRepository.getHueBridges().then(result => {
  console.log(result);
}).catch(error => {
  console.log(error);
});


// get all the bridges

// select the bridges - gui (vscode)

// try creating a user (looping?) for the selected bridge (use needs to go and press a button)

// after a period of time - give up


