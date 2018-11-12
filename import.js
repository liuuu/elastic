const csv = require("csvtojson");
const ELASTICSEARCH = require("elasticsearch");
const Episodes = `${process.env.PWD}/simpsons_episodes.csv`;
const ESCLUSTER = "http://localhost:9200";
const INDEX = "simpsons";
const TYPE = "episode";
const BULK = [];
const fs = require("fs");
const CLIENT = new ELASTICSEARCH.Client({
  host: ESCLUSTER,
  // apiVersion: "6.4"
  log: "trace"
});

console.log("Episodes", Episodes);
// console.log("CLIENT", CLIENT);
console.log("Bulk import into Elasticsearch");

csv({
  checkType: true
})
  .fromFile(Episodes)
  .then(obj => {
    console.log("obj", Array.isArray(obj), obj[1]);
    // const mmm = JSON.parse(obj);
    // console.log("mmm", mmm);
    obj.forEach(el => {
      BULK.push({ index: { _index: INDEX, _type: TYPE, _id: el.id } }, el);
    });
    // console.log(`Adding ${obj.id} to array`);
    // const mmm = JSON.stringify(obj);
    // obj.forEach(el => {
    //   console.log("e.id", el.id);
    // });
    // fs.writeFileSync(`${process.env.PWD}/mmm.json`, mmm);
  })
  .then(data => {
    CLIENT.bulk(
      {
        body: BULK
      },
      err => {
        if (err) {
          console.log(err);
        }
      }
    );
    console.log("Processing complete");
  });
