# zonemta-dry-run
This project aim to change zonemta mail receiver for testing purpose


## Setup

Add this as a dependency for your ZoneMTA app

```
npm install @mindbaz/zonemta-dry-run --save
```

Add a configuration entry in the "plugins" section of your ZoneMTA app

Example [here](./config.example.toml).

First enable plugin :

```toml
# plugins/dry-run.toml
["modules/@mindbaz/zonemta-dry-run"]
enabled = true

header = "X-My-Dry-Run"

receivers = [
  "adam.brooks@mail.info",
  "ashley.gonzalez@mail.info",
  "ashley.harrell@mail.info"
]

fakeReceivers = [
  "isThisRealLife@mail.info"
]

sender = "sender@mail.info"
```

## License

The GNU General Public License 3 ([details](https://www.gnu.org/licenses/quick-guide-gplv3.en.html))
