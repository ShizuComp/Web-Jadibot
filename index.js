var path = require("path");
var express = require("express");
var cors = require("cors");
var secure = require("ssl-express-www");
let rateLimit = require("express-rate-limit");
let fs = require("fs")
let PORT = 3333

var app = express();

app.enable("trust proxy");
app.set("json spaces", 2);
app.use(cors());
app.use(secure);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const limit = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 40, 
  message: 'Oops too many requests'
});
app.use(limit);


app.get("/", async (req, res) => {
	let { jadibot } = JSON.parse(await fs.readFileSync(path.join(__dirname, "./jadibot.json"), "utf-8"))
  try {
    const jadibots = jadibot.map((jadi) => ({
      id: jadi.id.split("@")[0],
      keyid: jadi.keyid,
      warna: jadi.status ? 'green':'red',
      status: jadi.status ? 'online':'offline',
      owner: jadi.owner.split("@",)[0],
    }))
    res.render("index", {
      jadibots: jadibots,
      title: "ShizunoComp - Jadibot List",
    });
  } catch (error) {
    console.error("Error fetching data from JSON Server:", error.message);

    res.render("index", {
      jadibots: [],
      title: "ShizunoComp - Jadibot List",
      error: "Gagal mengambil data dari server",
    });
  }
});


app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`);
});
