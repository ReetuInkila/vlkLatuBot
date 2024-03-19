require('dotenv').config()
const axios = require("axios")
const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.command('start', ctx => {
    console.log(ctx.from)
    bot.telegram.sendMessage(ctx.chat.id, 'Tervetuloa Valkeakosken liikunta tila telegram bottiin.\nLähettämällä /help saat näkyviin käytössä olevat komennot', {})
})

bot.command('help', ctx => {
    console.log(ctx.from)
    bot.telegram.sendMessage(ctx.chat.id, `Käytettävissä olevat komennot:
    /help
    /palloiluhalli
    /uimahalli
    /voimailusali
    /wareena
    Voit selailla päivän varauksia lähetämällä haluamasi tilan nimen`, {})
})

bot.command('palloiluhalli', async ctx => {
    const url = createUrl(896)
    let response = await axios.get(url)
    const calendar = makeCalendar(response.data)
    bot.telegram.sendMessage(ctx.chat.id, calendar, {})
})

bot.command('uimahalli', async ctx => {
    const url = createUrl(835)
    let response = await axios.get(835)
    const calendar = makeCalendar(response.data)
    bot.telegram.sendMessage(ctx.chat.id, calendar, {})
})

bot.command('voimailusali', async ctx => {
    const url = createUrl(852)
    let response = await axios.get(url)
    const calendar = makeCalendar(response.data)
    bot.telegram.sendMessage(ctx.chat.id, calendar, {})
})

bot.command('wareena', async ctx => {
    const url = createUrl(836)
    let response = await axios.get(url)
    const calendar = makeCalendar(response.data)
    bot.telegram.sendMessage(ctx.chat.id, calendar, {})
})

function createUrl(locationNumber){
    const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return `https://valkeakoski.tilamisu.fi/fi/locations/${locationNumber}/reservations.json?from=${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}&to=${tomorrow.getFullYear()}-${tomorrow.getMonth()+1}-${tomorrow.getDate()}`
}

function makeCalendar(data){
    const date = new Date(data[0].start_date).toLocaleDateString()
    let reservationInfo = `${data[0].location_name}\n${date}`

    // Loop through the reservations
    data.forEach(reservation => {
        const startDate = new Date(reservation.start_date)
        const endDate = new Date(reservation.end_date)
        const startTime = `${startDate.getHours()}:${(startDate.getMinutes()<10?'0':'') + startDate.getMinutes()}`
        const endTime = `${endDate.getHours()}:${(endDate.getMinutes()<10?'0':'') + endDate.getMinutes()}`
        // Concatenate the start date, end date, and user group name to the string
        reservationInfo += `\n\n${startTime} - ${endTime}\n${reservation.text}`
        if(reservation.text.toLowerCase().includes("nyrkkeily")){
            reservationInfo += ' 🥊'
        }
    })
    return reservationInfo
}

// Start webhook via launch method (preferred)
bot.launch({
    webhook: {
      domain: process.env.URL,
      port: process.env.PORT
    }
})