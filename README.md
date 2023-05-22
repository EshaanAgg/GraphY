# Graphy!

This is an accompanying serverless function for the `Saras GPT` Telegram Bot that is used to generate graphs and visualizations for the user's data (using `D3.js`) and then send the same to the user via the `telegram-bot-api` package!

The function is hosted on Netlify!

### Sample Request

```
{
  "chatId": "1677617528",
  "data": [
    {
      "deck": "Ammendments",
      "accuracy": "60"
    },
    {
      "deck": "Reports",
      "accuracy": "80"
    }
  ]
}
```
