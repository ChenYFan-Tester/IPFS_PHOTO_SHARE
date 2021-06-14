import sjcl from 'sjcl'
import index from 'html-loader!./index.html'
import { accept_suffix, accept_length, accept_size, upload_url, recap_mirror, encry,ipfs_url } from './config.json'
import init from 'raw-loader!./html/init.html'
import currentinit from 'html-loader!./html/currentinit.html'
import gres from './src/gres'
import recaptcha from './src/recaptcha'

import customjs from 'raw-loader!./src/custom'
addEventListener("fetch", event => {
    event.respondWith(ipfscloud(event.request))
})

async function ipfscloud(req) {
    const urlStr = req.url
    const urlObj = new URL(urlStr)
    const path = urlObj.href.substr(urlObj.origin.length)
    const domain = (urlStr.split('/'))[2]
    const PASSKEY = JSON.stringify({
        PASS: PASS,
        DOMAIN: domain
    })
    const sq = (key) => {
        return urlObj.searchParams.get(key)
    }
    switch (rp(path)) {
        case '/get':
            if (sq('en') === 'true') {
                return fetch(`${ipfs_url}${sjcl.decrypt(PASSKEY, atob(sq('hash')))}`)
            } else {
                return fetch(`${ipfs_url}${sq('hash')}`)
            }
        case '/custom':
            return gres({
                ctx: customjs
                    .replace(/<!--RECAP-->/g, RECAP)
                    .replace(/<!--RECAP_URL-->/g, (() => {
                        if (recap_mirror) {
                            return 'https://recaptcha.net/recaptcha/api.js'
                        } else {
                            return 'https://google.com/recaptcha/api.js'
                        }
                    })()),
                type: "js"
            })
        case '/upload':
            
            if (!sq('token')) {
                return gres({ type: "json", ctx: { code: -1, success: false }, msg: "人机验证结果不存在！" })
            }
            if (!await recaptcha(
                RECAP_TOKEN,
                sq('token'),
                'ipfs_photo'
            )) {
                return gres({ type: "json", ctx: { code: -1, success: false }, msg: "人机验证不通过，请使用合法的网络环境" })
            }

            try {
                const SHARELIST = await KV.get('PHOTOSHARE', { type: "json" })
                const res = await (await (fetch(upload_url, req))).json()
                //return new Response(JSON.stringify(res))
                try{
                SHARELIST.push({
                    hash: res.Hash,
                    name: res.Name,
                    size: res.Size
                })}catch(p){
                    SHARELIST = []
                    SHARELIST.push({
                        hash: res.Hash,
                        name: res.Name,
                        size: res.Size
                    })
                }
                for (var i in accept_suffix) {
                    if (res.Name.endsWith(accept_suffix[i])) {
                        if (Number(res.Size) <= accept_size) {
                            if (res.Name.length <= accept_length) {
                                await KV.put('PHOTOSHARE', JSON.stringify(SHARELIST))
                                return gres({ type: "json", ctx: { code: 0, success: true } })
                            } else {
                                return gres({ type: "json", ctx: { code: -1, success: false, length: Number(res.Name.length), accept: accept_length }, msg: "这文件的名字有点长" })

                            }
                        } else {
                            return gres({ type: "json", ctx: { code: -1, success: false, size: Number(res.Size), accept: accept_size }, msg: "这文件太大了" })
                        }
                    }
                }
                return gres({ type: "json", ctx: { code: -1, success: false }, msg: "不合法的后缀" })
            } catch (t) {
                return gres({ type: "json", ctx: { code: -1, success: false }, msg: JSON.stringify(t) })
            }
        case '/':
            let piclist = []
            const hinit = `${currentinit}${await (async () => {
                const SHARELIST = await KV.get('PHOTOSHARE', { type: "json" })
                let y = ''
                for (var i in SHARELIST) {
                    if (piclist.indexOf(SHARELIST[i].hash) === -1) {
                        y = init
                            .replace(/<!--HASH-->/g, (() => {
                                if (encry) {
                                    return btoa(sjcl.encrypt(PASSKEY, SHARELIST[i].hash))
                                } else {
                                    return SHARELIST[i].hash
                                }
                            })())
                            .replace(/<!--NAME-->/g, SHARELIST[i].name)
                            .replace(/<!--INTRO-->/g, `${SHARELIST[i].size / 1024}KB`) + y
                        piclist.push(SHARELIST[i].hash)
                    }
                }
                return y.replace(/<!--EN-->/g,encry?'true':'false')
            })()}`
            return gres({
                ctx: index
                    .replace(/<ul class="cd-slider">/g, `<ul class="cd-slider unset">${hinit}`)
                ,
                type: "html"
            })
        default:
            return new Response('ERROR')
    }
}


const rp = (path) => {
    return path.split("?")[0]


}
