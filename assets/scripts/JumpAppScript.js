// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        sprite: {
            default: null,
            type: cc.Sprite,
        },

        labelGame: {
            default: null,
            type: cc.Label,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.index = 0;
    },

    start() {
        this.node.on("touchend", this.TouchEnd, this);
    },

    TouchEnd(event) {
        event.stopPropagation();
        // 上线前注释console.log("this.index == ", this.index);
        //var curScene = cc.director.getScene().name;
        
        if (CC_WECHATGAME) {
            this.appId = Global.jumpappObject[this.index].apid;
            let slef = this;
            wx.navigateToMiniProgram({
                appId: slef.appId,
                path: Global.jumpappObject[this.index].path,
                success: function (res) {
                    // 上线前注释
                    console.log("跳转成功：",slef.appId);
                    Global.AddUserOper(2,slef.appId);
                },
                fail: function (res) {
                    // 上线前注释console.log(res);
                },
            });
        }
    }

    // update (dt) {},
});
