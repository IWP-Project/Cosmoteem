const fs = require("fs");
const { nextTick } = require("process");
const Parser = require("rss-parser")

// RSS News Feed Parser

module.exports = {
    async parse() {

        // Make a new RSS Parser
        const parser = new Parser();

        //Get all the items in the RSS FEED
        const feeds = []
        const nasa_bn = await parser.parseURL("https://www.nasa.gov/rss/dyn/breaking_news.rss")
        const isro_bn = await parser.parseURL("https://nasa.einnews.com/rss/gwQwZXSzhX9L34PD")
        feeds.push(nasa_bn, isro_bn)
        let items = []

        // CLean up the string and replace reserved chars
        const fileName = []
        feeds.forEach(feed => {
            fileName.push(`${feed.title.replace(/\s+/g, "-").replace(/[\\?%%*:|"<>]/g, '').toLowerCase()}.json`)
        })
        console.log(fileName)
        console.log('-------------------------------------------///////////////////////////////////------------------------------------------')
        try {
            fileName.forEach(file => {
                // if (fs.existsSync(`public/rss/${file}`)) {
                //     items = require(`../public/rss/${file}`)
                // }
            })
        } catch (err) {
            console.log(err)
        }

        console.log(items)
        console.log('---------------------//////////////////////////////---------------------------------')
        try {
            feeds.forEach(feed => feed.items.map(async(currentItem) => {
                // Add a new item if it doesnt already exist
                if (items.filter((item) => item === currentItem).length <= 1) {
                    items.push(currentItem)
                }
            }))
        } catch (err) {
            console.log(err)
        }

        // Save the file
        fileName.forEach(file => fs.writeFileSync(`public/rss/${file}`, JSON.stringify(items)))
    }
}