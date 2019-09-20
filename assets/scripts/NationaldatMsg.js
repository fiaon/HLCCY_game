// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        btn_yaoqing:{
            default:null,
            type:cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        if(Global.isteam){
            this.btn_yaoqing.active = false;
        }
    },
    onClickInviteFriend: function (event) {
        // 上线前注释console.log("Global.Introuid=去邀请=", Global.Introuid);

        if (CC_WECHATGAME) {
            // 上线前注释console.log(Global.shareimg);
            wx.shareAppMessage({
                title: '你忘记了我们当初的海誓山盟了吗？点击一起赢取千元红包大奖',
                imageUrl: Global.shareimg,
                query: "introuid=" + Global.Introuid,
                success(res) {
                    // 上线前注释console.log("yes");
                },
                fail(res) {
                    // 上线前注释console.log("failed");
                },
                complete(res) {
                    // 上线前注释console.log("complete");
                }
            });
            if (callback) {
                callback();
            }
        }
    },
    CloseBtn(){
        this.node.destroy();
    },
    // update (dt) {},
});
