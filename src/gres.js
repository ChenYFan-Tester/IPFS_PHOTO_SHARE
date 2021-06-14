const gres = (c) => {
    if (c.type == 'html') {
        return new Response(c.ctx, {
            status: c.status ? c.status : 200, headers: {
                "Content-Type": "text/html; charset=utf-8"
            },
        })
    } else if (c.type == "json") {
        return new Response(JSON.stringify({
            ctx: c.ctx,
            status: c.status === 0 ? 0 : c.status,
            msg: c.msg ? c.msg : "没有额外的消息",
            timestmp: (new Date()).valueOf()
        }), {
            status: c.status ? c.status : 200, headers: {
                "Content-Type": "text/html; charset=utf-8"
            },
        })

    } else if (c.type == "js") {
        return new Response(c.ctx, {
            headers: {
                "Content-Type": "application/javascript; charset=utf-8"
            }
        })
    } else {
        return new Response(c.ctx)
    }
}
export default gres