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
        let allitems

        // CLean up the string and replace reserved chars
        const fileName = []
        feeds.forEach(feed => {
            fileName.push(`${feed.title.replace(/\s+/g, "-").replace(/[\\?%%*:|"<>]/g, '').toLowerCase()}.json`)
        })

        try {
            let x = 0
            feeds.forEach(feed => {
                try {
                    if (fs.existsSync(`public/rss/${fileName[x]}`)) {
                        if (`${feed.title.replace(/\s+/g, "-").replace(/[\\?%%*:|"<>]/g, '').toLowerCase()}.json` == fileName[x]) {
                            console.log(`UPDATING RSS FILE : ${fileName[x]}`)
                        }
                    }
                    feed.items.map(async(currentItem) => {
                        // Add a new item if it doesnt already exist
                        if (items.filter((item) => item === currentItem).length <= 1) {
                            items.push(currentItem)
                        }
                    })
                } catch (err) {
                    console.log(err)
                }
                // Save the file
                fs.writeFileSync(`public/rss/${fileName[x]}`, JSON.stringify(items))
                items = []
                x = x + 1
            })
        } catch (err) {
            console.log(err)
        }

        try {
            let index = -1
            fileName.forEach(file => {
                index = index + 1
                if (fs.existsSync(`public/rss/${file}`)) {
                    let item = require(`../public/rss/${file}`)
                    if (fileName[index + 1]) {
                        allitems = item.concat(require(`../public/rss/${fileName[index + 1]}`))
                    }
                }
                fs.writeFileSync(`public/rss/allnewshead.json`, JSON.stringify(allitems))
            })
        } catch (err) {
            console.log(err)
        }
    }
}