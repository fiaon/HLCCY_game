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
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.GuangGaoAnim();
    },
    /**
     * 游戏内小广告动画
     */
    GuangGaoAnim: function () {
        var self = this;
        this.schedule(function () {
            var action = self.DouDongFun();
            self.node.runAction(action);
        }, 1.0, cc.macro.REPEAT_FOREVER, 0.1);
    },

    DouDongFun: function () {
        var action = cc.sequence(
            cc.skewTo(0.5,-10,10),
            cc.skewTo(0.5,10,-10)
        );
        return action;
    },
    // update (dt) {},
});
