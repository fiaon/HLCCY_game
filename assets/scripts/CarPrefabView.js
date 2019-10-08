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
        sharebtn:cc.Node,
        carimg:cc.Sprite,
        carlvlsprite:{
            default:[],
            type: cc.SpriteFrame,
        },
        guanggao:{
            default:[],
            type:cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.ShareBtnFangSuo();
        let self = this;
        Global.carlvl++;

        self.carimg.spriteFrame = this.carlvlsprite[Global.carlvl-1];

        Global.SetUserInfo();

        for(let i =0;i<this.guanggao.length;i++){
            let src = this.guanggao[i].getComponent(require("JumpAppScript"));
            if (src) {
                src.index = i;
            }
            src.sprite.spriteFrame = Global.jumpappObject[i].sprite;
        }
    },
    init(){

    },
    closeBtn(){
        cc.find("Canvas").getComponent("start").UserPower();
        if(Global.level>=10){
            Global.showGameLoop = true;
        }
        if(Global.isplaymusic){
            cc.audioEngine.play(Global.clip_btnclose, false);
        }
        this.node.destroy();
    },
    shareBtn(){
        if(Global.isplaymusic){
            cc.audioEngine.play(Global.clip_btnclick, false);
        }
        wx.aldSendEvent('分享',{'页面' : '车辆升级_炫耀一下'});
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
