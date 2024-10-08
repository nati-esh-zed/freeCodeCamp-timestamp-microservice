const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

app.get("/", function (req, res) {
  return res.sendFile(__dirname + '/views/index.html');
});

const numRegexp = /^\d+$/;

function parseDate(dateParam) {
  if (dateParam == null)
    return new Date();
  else if (numRegexp.test(dateParam))
    return new Date(Number.parseInt(dateParam));
  else {
    const date = new Date(decodeURIComponent(dateParam));
    return isNaN(date) ? null : date;
  }
}

app.get("/api/:date?", function (req, res) {
  const date = parseDate(req.params.date);
  if (date == null)
    return res.status(422).json({ error: "Invalid Date" });
  const unix = date.getTime();
  const utc = date.toUTCString();
  return res.json({ unix, utc });
});

app.use(express.static('public'));

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log(`Listening on port ${listener.address().port}`);
});
