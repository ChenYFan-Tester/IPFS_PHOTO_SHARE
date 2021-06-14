# IPFS图片分享站

本来只是自己随手写的一个小项目，也没想着怎么规范化，只是怎么方便怎么来，没想到会这么多人想搭建。

稍微重写了一下，目前搭建就是直接把[./dist/index.min.js](https://github.com/ChenYFan-Tester/IPFS_PHOTO_SHARE/blob/main/dist/index.min.js)复制到Worker框里面，然后配置。

# 配置过程

## 绑定KV

`设置`=>`KV 命名空间绑定`=>`编辑变量`=>`添加绑定`

- `变量名称` => `KV`
- `KV 命名空间` => `下拉，选一个`

## 设置变量

KV的写入次数是有限的，避免被滥用和盗刷，我们强制开启了人机验证模块[reCAPTCHA V3无感知评分](https://www.google.com/recaptcha/)。

请先[注册reCAPTCHA](https://g.co/recaptcha/v3)(需要梯子)，选择类型为"reCAPTCHA第3版",之后将获得的密钥设置至Workers变量。

|变量名|变量内容|
|---|---|
|`RECAP`|在您的网站提供给用户的 HTML 代码中使用此网站密钥。|
|`RECAP_TOKEN`|此密钥用于您的网站和 reCAPTCHA 之间的通信。|
|`PASS`|此密钥将作为加密密钥，请手滚键盘，无需记忆|

# 开发者

如果你想让这个程序工作的更好，可以修改`config.json`配置文件，修改后需运行`webpack`进行打包：

- `accept_suffix` 接受的后缀 `Array`
- `accept_size` 接受的文件最大大小 `Number`
- `accept_size` 接受的文件名最长长度 `Number`
- `upload_url` 由于`infura`官方api屏蔽了CloudFlareWorker的出口节点,此url为其反代,您也可以自建 `String`
- `ipfs_url` ipfs镜像地址，Worker建议用CloudFlare提供的ipfs地址，您也可以自建 `String`
- `recap_mirror` 人机验证是否开启镜像,在中国大陆内必须开启 `Boolean`
- `recap_score` 人机验证最低分数,建议`0.4~0.7` `Number`
- `encry` 加密hash，使其无法获得直链，必须在此站点内使用**加密会严重拖慢程序运行时间，当出现500错误时，请尝试将此设置为false** `Boolean`
