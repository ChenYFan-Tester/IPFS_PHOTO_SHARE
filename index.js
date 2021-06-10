import index from 'html-loader!./index.html'
import accept from './accept.json'
import init from 'raw-loader!./html/init.html'
import currentinit from 'html-loader!./html/currentinit.html'
import gres from './src/gres'
addEventListener("fetch", event => {
    event.respondWith(ipfscloud(event.request))
})

async function ipfscloud(req) {
    const urlStr = req.url
    const urlObj = new URL(urlStr)
    const path = urlObj.href.substr(urlObj.origin.length)
    const domain = (urlStr.split('/'))[2]
    const sq = (key) => {
        return urlObj.searchParams.get(key)
    }
    switch (rp(path)) {
        case '/get':
            return fetch(`https://ipfs.io/ipfs/${sq('hash')}`)
        case '/upload':
            try {
                const SHARELIST = await KV.get('PHOTOSHARE', { type: "json" })
                const res = await (await (fetch('https://cf2vercel.vercel.app/api/v0/add?pin=true', req))).json()
                SHARELIST.push({
                    hash: res.Hash,
                    name: res.Name,
                    size: res.Size
                })
                for(var i in accept){
                    if(res.Name.endsWith(accept[i])){
                        await KV.put('PHOTOSHARE', JSON.stringify(SHARELIST))
                        return gres({ type: "json", ctx: { code: 0, success: true }})
                    }
                }
                return gres({ type: "json", ctx: { code: -1, success: false },msg:"不合法的后缀"})
            } catch (t) {
                return gres({ type: "json", ctx: { code: -1, success: false }, msg: t })
            }
        case '/':
            const hinit = `${currentinit}${await (async () => {
                const SHARELIST = await KV.get('PHOTOSHARE', { type: "json" })
                let y = ''
                for (var i in SHARELIST) {
                    y = init
                        .replace(/<!--HASH-->/g, SHARELIST[i].hash)
                        .replace(/<!--URL-->/g, `https://${domain}/get?hash=${SHARELIST[i].hash}`)
                        .replace(/<!--NAME-->/g, SHARELIST[i].name)
                        .replace(/<!--INTRO-->/g, `${SHARELIST[i].size/1024}KB`) + y
                }
                return y
            })()}`
            return gres({
                ctx: index
                    .replace(/<ul class="cd-slider">/g, `<ul class="cd-slider" style="transform:unset;">${hinit}`)
                ,
                type: "html"
            })
    }
}


const rp = (path) => {
    return path.split("?")[0]


}


function timestampToTime(timestamp) {

    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000

    var Y = date.getFullYear() + '-';

    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';

    var D = date.getDate() + ' ';

    var h = date.getHours() + ':';

    var m = date.getMinutes() + ':';

    var s = date.getSeconds();

    return Y + M + D + h + m + s;

}
