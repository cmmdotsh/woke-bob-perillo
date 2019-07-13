const request = require("request");
const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();
const prefix = "bobget";
const darkSkyAPIkey = "fdfa7b9cb1fe58e6c4b6a5d65cc752c8/";
const forecast = "https://api.darksky.net/forecast/";

function robGet(location) {
  return new Promise((resolve, reject) => {
    let options = {
      url: `${forecast}${darkSkyAPIkey}${location}`,
      method: "GET"
    };
    request(options, (err, response) => {
      let status_code = response.statusCode;
      if (status_code === 200) {
        resolve(JSON.parse(response.body));
      } else {
        reject(console.log("bobby boy is asleep"));
      }
      if (status_code === 500) {
        console.log(err);
        reject(console.log("bobby ded, boi"));
      }
    });
  });
}

async function robProcess() {
  let laffy = "30.2241,-92.0198";
  let bobbyKnows = await robGet(laffy);
  let maisRiteNow = {
    putOnKATC: bobbyKnows.currently,
    putOnPBS: bobbyKnows.alerts
  };
  fs.writeFile(
    "bobbyKnow.JSON",
    JSON.stringify(maisRiteNow.putOnKATC, null, 2),
    err => {
      if (err) {
        console.log("could not write bobby's knows, cher");
      }
    }
  );
  fs.writeFile(
    "bobbySee.JSON",
    JSON.stringify(maisRiteNow.putOnPBS, null, 2),
    err => {
      if (err) {
        console.log("could not write bobby's knows, cher");
      }
    }
  );
  console.log("mais das his brain rite dere");
}

robProcess();
