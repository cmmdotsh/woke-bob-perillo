const request = require("request");
const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();
const bobBrain = require("./bobBrain.json");
const darkSkyAPIkey = require("./bobCIA.json");
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

async function robOnTV() {
  let laffy = "30.2241,-92.0198";
  let bobbyKnows = await robGet(laffy);
  let maisRiteNow = {
    putOnKATC: bobbyKnows.currently,
    putOnPBS: bobbyKnows.alerts
  };
  fs.writeFile(
    "bobbyDictionary.JSON",
    JSON.stringify(bobbyKnows, null, 2),
    (err = {
      if(err) {
        console.log("mais he kno nuthin");
      }
    })
  );
  fs.writeFile(
    "bobbyNow.JSON",
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
  return new Promise((resolve, reject) => {
    if (maisRiteNow === undefined) {
      reject(console.log("mais what the fuck"));
    } else {
      resolve(maisRiteNow);
    }
  });
}

client.login(bobBrain.token);

client.once("ready", () => {
  console.log("bobby p is awake! find shelter!");
});

client.on("message", async message => {
  if (message == bobBrain.prefix + " now") {
    try {
      await message.channel.send(
        "***REPORTING NOW, CHEIF METEOROLOGIST ROB PERILLO***"
      );
      let riteNow = await robOnTV();
      let sevenPMForecast = new Discord.RichEmbed()
        .setTitle("⛈️ Current Weather ⛈️")
        .setAuthor("bobby p is here wuddup")
        .setDescription(riteNow.putOnKATC.summary)
        .setColor("RED")
        .addField("current temp:", riteNow.putOnKATC.temperature + "F", null)
        .addField("wind speed:", riteNow.putOnKATC.windSpeed + "mph")
        .addField("wind bearing:", windCardinal(riteNow.putOnKATC.windBearing))
        .addField("gust speed:", riteNow.putOnKATC.windGust + "mph");
      await message.channel.send(sevenPMForecast);
    } catch (error) {
      message.channel.send("bobby's drunk, we can't find 'em");
      console.log(error);
    }
  }
});

client.on("message", async message => {
  if (message == bobBrain.prefix + " alerts") {
    try {
      await message.channel.send("***PINGING THE KATC HURRICANE CENTER***");
      let riteNow = await robOnTV();
      let hurricaneCenterLive = new Discord.RichEmbed()
        .setTitle("Current Weather Alerts")
        .setAuthor("HURRICANE CENTER LIVE")
        .addField("active weather alerts", riteNow.putOnPBS.length);
      await message.channel.send(hurricaneCenterLive);
      await message.channel.send("_which alert?_");
      await client.on("message", async message => {
        let post = await alertSelect(message, riteNow.putOnPBS);
        let embed = new Discord.RichEmbed()
          .setTitle(post.title)
          .setAuthor(post.severity)
          .addField("expires", new Date(post.expires).toLocaleTimeString())
          .setDescription(post.description);
        console.log("");
        await message.channel.send(embed);
      });
    } catch (error) {
      message.channel.send("mais the hurricane center down, cher");
      console.log(error);
    }
  }
});

function windCardinal(wind) {
  const directions = [
    "↑ N",
    "↗ NE",
    "→ E",
    "↘ SE",
    "↓ S",
    "↙ SW",
    "← W",
    "↖ NW"
  ];
  return directions[Math.round(wind / 45) % 8];
}

function alertSelect(alertID, alerts) {
  return alerts[alertID];
}

robOnTV();
