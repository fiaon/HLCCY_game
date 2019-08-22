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

    },
    videoBtn(){
        //Global.showAdVedio(this.Success.bind(this), this.Failed.bind(this))
    },
    Success(){
        this.buzu.active = false;
        this.huode.active = true;
        Global.AddPower(2,(res)=>{
            if(res.state == 1){
                Global.power +=2;
            }
        });
    },
    Failed(){
        Global.ShowTip(this.node, "观看完视频才会有奖励哦");
    },
    CloseBtn(){
        this.node.destroy();
    },
    FreeBtn(){
        let freepowerview = cc.instantiate(this.freeview);
        if(freepowerview){
            this.node.addChild(freepowerview);
        }
    },
    // update (dt) {},
});
