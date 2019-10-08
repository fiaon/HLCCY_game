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
        },
        index:0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    },

    start() {
        this.node.on("touchend", this.TouchEnd, this);
    },

    TouchEnd(event) {
        event.stopPropagation();
        // 上线前注释console.log("this.index == ", this.index);
        if(this.node.parent.name == "content"){
            wx.aldSendEvent('导流广告_无聊点我');
        }else if(this.node.parent.name == "lunbobg"){
            wx.aldSendEvent('导流广告_循环广告');
        }else if(this.node.parent.name == "huandong"){
            wx.aldSendEvent('导流广告_晃动广告');
        }else if(this.node.name == "game_guanggao"){
            wx.aldSendEvent('导流广告_宫格广告');
        }else if(this.node.name == "img_tuijian"){
            wx.aldSendEvent('导流广告_如何玩广告');
        }
        
        
        if (CC_WECHATGAME) {
            this.appId = Global.jumpappObject[this.index].apid;
            let slef = this;
            wx.navigateToMiniProgram({
                appId: slef.appId,
                path: Global.jumpappObject[this.index].path,
                success: function (res) {
                    // 上线前注释
                    //console.log("跳转成功：",slef.appId);
                    //Global.AddUserOper(2,slef.appId);
                },
                fail: function (res) {
                    // 上线前注释console.log(res);
                },
            });
        }
    },
    /**
     * 放缩
     */
    JumpAppFangSuo: function () {
        this.schedule(this.doSomething,1);
    },
    doSomething(){
        var action = this.FangSuoFun();
        this.node.runAction(action);
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
    //停止放缩
    StopFangSuo(){
        this.unschedule(this.doSomething);
    },
    // update (dt) {},
});
