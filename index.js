require('dotenv').config();
const axios = require("axios");
const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('start', ctx => {
    console.log(ctx.from)
    bot.telegram.sendMessage(ctx.chat.id, 'Tervetuloa valkeakosken tila telegram bottiin.\nLähettämällä /help saat näkyviin käytössä olevat komennot', {})
})

bot.command('help', ctx => {
    console.log(ctx.from)
    bot.telegram.sendMessage(ctx.chat.id, `Käytettävissä olevat komennot.
    /help
    /voimailusali`, {})
})

bot.command('voimailusali', ctx => {
    var rate;
    console.log(ctx.from)
    axios.get(`https://valkeakoski.tilamisu.fi/fi/locations/852/reservations.json?from=2024-03-14&to=2024-03-15`)
    .then(response => {
        console.log(response.data)
        const calendar = makeCalendar(response.data)
        const message = `${response.data[0].location_name}\n${calendar}`
        bot.telegram.sendMessage(ctx.chat.id, message, {})
    })
})

function makeCalendar(data){
    let reservationInfo = ''

    // Loop through the reservations
    data.forEach(reservation => {
        // Concatenate the start date, end date, and user group name to the string
        reservationInfo += `Aika ${reservation.start_date} - ${reservation.end_date}\n${reservation.text}\n`
    });

    return reservationInfo
}

bot.launch()