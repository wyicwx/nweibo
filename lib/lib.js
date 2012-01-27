//配置文件
exports.lib_config = require("./config.js");

//用户类库
exports.lib_user = require("./user.js").user;

//被被注者（角色）
exports.lib_speakers = require("./speakers.js").speakers;

//关注者（角色）
exports.lib_follower = require("./follower.js").follower;

//视图操作库
exports.lib_views = require("./views.js");
