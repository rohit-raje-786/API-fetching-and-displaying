const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
const { Client } = require("pg");
const path = require("path");
const router = express.Router();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "api",
  password: "sonupatil",
  port: 5432,
});
client
  .connect()
  .then(() => console.log("succesfully connected"))
  .catch((err) => console.log(err));

app.use(cors());

router.get("/", async (req, res) => {
  res.send("hello");
});
router.get("/data", async (req, res) => {
  client.query("select * from intern", (err, result) => {
    if (!err) {
      const arr=result.rows
      res.render('index',{arr})
      console.log(result.rows)
    } else {
      console.log(err);
    }
  });
});
router.get("/storedata", async (req, res) => {
  await axios
    .get("https://api.wazirx.com/api/v2/tickers")
    .then((result) => result.data)
    .then((result) => {
      for (let i = 0; i < 10; i++) {
        
        const dt = result[Object.keys(result)[i]];
        client.query(
          "INSERT INTO intern (name, last,buy,sell,volume,base_unit) VALUES ($1,$2,$3,$4,$5,$6)",
          [
            dt["name"],
            dt["last"],
            dt["buy"],
            dt["sell"],
            dt["volume"],
            dt["base_unit"],
          ],
          (err, result) => {
            if (!err) {
              console.log("sucessfully inserted");
            } else {
              console.log(err);
            }
          }
        );
      }
    })
    .catch((err) => console.log(err));
});
app.use("/", router);
app.listen(5000, () => {
  console.log("listening on port 5000");
});
