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
        this.schedule(this.UpDown,4.2);
    },
    UpDown: function () {
        this.node.runAction(cc.sequence(
            cc.moveTo(0.2, this.node.x, this.node.y-10),
            cc.moveTo(0.2, this.node.x, this.node.y),
            cc.moveTo(0.2, this.node.x, this.node.y-10),
            cc.moveTo(0.2, this.node.x, this.node.y),
            cc.moveTo(0.2, this.node.x, this.node.y-10),
            cc.moveTo(0.2, this.node.x, this.node.y),
        ))
    },
    StopAnim(){
        this.unschedule(this.UpDown);
    },
    // update (dt) {},
});
