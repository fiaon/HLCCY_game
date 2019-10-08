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
        this.startTime = Date.now();
    },
    onClickInviteFriend: function (event) {
        if(Global.isplaymusic){
            cc.audioEngine.play(Global.clip_btnclick, false);
        }
        // 上线前注释console.log("Global.Introuid=去邀请=", Global.Introuid);
        wx.aldSendEvent('获奖规则_邀请好友组队');
        wx.aldSendEvent('邀请',{'邀请类型' : '邀请好友组队'});
        if (CC_WECHATGAME) {
            // 上线前注释console.log(Global.shareimg);
            wx.aldShareAppMessage({
                title: '你忘记了我们当初的海誓山盟了吗？点击一起赢取千元红包大奖',
                imageUrl: Global.shareimg,
                query: "team=" + Global.Introuid,
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
        if(Global.level>=10){
            Global.showGameLoop = true;
        }
        if(Global.isplaymusic){
            cc.audioEngine.play(Global.clip_btnclose, false);
        }
        wx.aldSendEvent("获奖规则页面停留时间",{
            "耗时" : (Date.now()-this.startTime)/1000
        });
        this.node.destroy();
    },
    // update (dt) {},
});
