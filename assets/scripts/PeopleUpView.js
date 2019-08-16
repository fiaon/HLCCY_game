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
        peopleup_wan:cc.Prefab,
        peopleup_wei:cc.Prefab,
        content:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        if(Global.UserLvlData){
            let data =null;
            for(let i=0;i<Global.UserLvlData.length;i++){
                if(Global.level>=Global.UserLvlData[i].gamelvl){
                    data = Global.UserLvlData[i];
                }
            }
            let wan = cc.instantiate(this.peopleup_wan);
            let str = data.name.trim();
            wan.getComponent("PeoplePrefab").labelname.string = str;
            this.content.addChild(wan);
            for(let i=0;i<Global.UserLvlData.length;i++){
                if(Global.level<Global.UserLvlData[i].gamelvl){
                    let wei = cc.instantiate(this.peopleup_wei);
                    let str = Global.UserLvlData[i].name.trim();
                    wei.getComponent("PeoplePrefab").labelname.string =str;
                    wei.getComponent("PeoplePrefab").guanqia.string = "完成第"+Global.UserLvlData[i].gamelvl+"关";
                    this.content.addChild(wei);
                }
            }
        }
    },
    CloseBtn(){

        this.node.destroy();
    },
    // update (dt) {},
});
