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
        boxview:cc.Node,
        powerview:cc.Node,
        powerlabel:cc.Label,
        sharebtn:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        wx.aldSendEvent('惊喜宝箱_页面访问数');
        this.startTime = Date.now();

        this.ShareBtnFangSuo();
        Global.boxnum--;
        Global.SetUserData();
    },
    videoBtn(){
        // if (CC_WECHATGAME) {
        //     if(wx.createRewardedVideoAd){
        //         wx.aldSendEvent('视频广告');
        //         wx.aldSendEvent('视频广告_惊喜宝箱_立即领取');
        //         Global.showAdVedio(this.Success.bind(this), this.Failed.bind(this));
        //     }
        // }
        this.Success();
    },
    Success(){
        wx.aldSendEvent('视频广告',{'是否有效' : '是'});
        wx.aldSendEvent('视频广告',{'是否有效' : '惊喜宝箱_立即领取_是'});
        this.boxview.active = false;
        this.powerview.active = true;
        this.powernum = Math.round(Math.random()+1);
        this.powerlabel.string = "x"+this.powernum;
    },
    Failed(){
        wx.aldSendEvent('视频广告',{'是否有效' : '否'});
        wx.aldSendEvent('视频广告',{'是否有效' : '惊喜宝箱_立即领取_否'});
        Global.ShowTip(this.node, "观看完视频才会有奖励哦");
    },
    boxcloseBtn(){
        wx.aldSendEvent("惊喜宝箱_页面停留时间",{
            "耗时" : (Date.now()-this.startTime)/1000
        });
        wx.aldSendEvent('惊喜宝箱_关闭按钮');
        this.node.destroy();
    },
    powerCloseBtn(){
        //获取体力在关闭页面TODO
        Global.AddPower(this.powernum,0,(res)=>{
            
        });
        cc.find("Canvas").getComponent("start").UserPower();
        this.node.destroy();
    },
    shareBtn(){
        wx.aldSendEvent('分享',{'页面' : '惊喜宝箱_炫耀一下'});
        Global.ShareApp();
    },
    /**
     * 炫耀一下的放缩
     */
    ShareBtnFangSuo: function () {
        var self = this;
        this.schedule(function () {
            var action = self.FangSuoFun();
            self.sharebtn.runAction(action);
        }, 1.0, cc.macro.REPEAT_FOREVER, 0.1);
    },

    /**
     * 按钮放缩方法
     */
    FangSuoFun: function () {
        var action = cc.sequence(
            cc.scaleTo(0.5, 0.9, 0.9),
            cc.scaleTo(0.5, 1.1, 1.1),
        );
        return action;
    },
    // update (dt) {},
});
