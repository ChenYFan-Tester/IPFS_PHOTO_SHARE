(async () => {

    
    window.replaceimg = (hash, en) => {
        document.getElementById(hash).src = `/get?hash=${hash}&en=${en==='true'?'true':'false'}`
    };
    loadJS('<!--RECAP_URL-->?render=<!--RECAP-->',()=>{})
    document.getElementById('file').addEventListener('change', async () => {

        try { swal.close() } catch (p) { }
        swal({ title: "\n人机验证中...", icon: "https://cdn.jsdelivr.net/gh/HexoPlusPlus/CDN@db63c79/loading.gif", text: "\n", button: false, closeModal: false, });

        grecaptcha.ready(() => {
            grecaptcha.execute('<!--RECAP-->', { action: 'ipfs_photo' }).then(async (token) => {


                try { swal.close() } catch (p) { }
                swal({ title: "\n上传中...", icon: "https://cdn.jsdelivr.net/gh/HexoPlusPlus/CDN@db63c79/loading.gif", text: "\n", button: false, closeModal: false, });
                var formdata = new FormData();
                formdata.append("file", document.getElementById("file").files[0]);
                const p = await (await fetch(`/upload?token=${token}`, { method: 'POST', body: formdata })).json()
                if (p.ctx.success) {
                    try { swal.close() } catch (p) { }
                    swal("成功！", "你的文件已上传，刷新即可在分享区查看您上传的图片", "success");
                } else {
                    try { swal.close() } catch (p) { }
                    swal("失败！！", p.msg, "error");
                }

            });
        });
    })

})()