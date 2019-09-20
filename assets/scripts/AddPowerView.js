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
        buzu:cc.Node,
        huode:cc.Node,
        freeview:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        wx.aldSendEvent('体力不足弹窗_页面访问数');
        this.startTime = Date.now();

    },
    videoBtn(){
        if (CC_WECHATGAME) {
            if(wx.createRewardedVideoAd){
                wx.aldSendEvent('视频广告');
                wx.aldSendEvent('视频广告_体力不足_视频领取');
                Global.showAdVedio(this.Success.bind(this), this.Failed.bind(this));
            }
        }
    },
    Success(){
        wx.aldSendEvent('视频广告',{'是否有效' : '是'});
        wx.aldSendEvent('视频广告',{'是否有效' : '体力不足_视频领取_是'});
        this.buzu.active = false;
        this.huode.active = true;
        Global.AddPower(2,0,(res)=>{
            if(res.state == 1){
                Global.power +=2;
            }
        });
    },
    Failed(){
        wx.aldSendEvent('视频广告',{'是否有效' : '否'});
        wx.aldSendEvent('视频广告',{'是否有效' : '体力不足_视频领取_否'});
        Global.ShowTip(this.node, "观看完视频才会有奖励哦");
    },
    CloseBtn(){
        var curScene = cc.director.getScene().name;
        if(curScene == "start"){
            cc.find("Canvas").getComponent("start").UserPower();
        }
        wx.aldSendEvent("体力不足弹窗_页面停留时间",{
            "耗时" : (Date.now()-this.startTime)/1000
        });
        wx.aldSendEvent('体力不足弹窗_关闭按钮');
        this.node.destroy();
    },
    FreeBtn(){
        wx.aldSendEvent('体力不足弹窗_免费体力');
        let freepowerview = cc.instantiate(this.freeview);
        if(freepowerview){
            this.node.addChild(freepowerview);
        }
    },
    // update (dt) {},
});
