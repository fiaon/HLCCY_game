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
        arr_shadow:{
            default:[],
            type:cc.SpriteFrame,
        },
        arr_GaoLiang:{
            default:[],
            type:cc.SpriteFrame,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        wx.aldSendEvent('游戏首页_时光足迹页面访问数');
        this.startTime = Date.now();
        this.curindex = 0;

        if(Global.UserLvlData){
            let data =null;
            for(let i=0;i<Global.UserLvlData.length;i++){
                if(Global.level>=Global.UserLvlData[i].gamelvl){
                    this.curindex = i;
                    data = Global.UserLvlData[i];
                }
            }
            let wan = cc.instantiate(this.peopleup_wan);
            let str = data.name.trim();
            wan.getComponent("PeoplePrefab").labelname.string = str;
            wan.getComponent("PeoplePrefab").shadow.spriteFrame = this.arr_GaoLiang[this.curindex];
            let _height = wan.getComponent("PeoplePrefab").shadow.node.height;
            let _width = wan.getComponent("PeoplePrefab").shadow.node.width;
            wan.getComponent("PeoplePrefab").shadow.node.height = 86;
            wan.getComponent("PeoplePrefab").shadow.node.width = _width /(_height / 86);
            this.content.addChild(wan);
            for(let i=0;i<Global.UserLvlData.length;i++){
                if(Global.level<Global.UserLvlData[i].gamelvl){
                    let wei = cc.instantiate(this.peopleup_wei);
                    let str = Global.UserLvlData[i].name.trim();
                    wei.getComponent("PeoplePrefab").labelname.string =str;
                    wei.getComponent("PeoplePrefab").guanqia.string = "完成第"+Global.UserLvlData[i].gamelvl+"关";
                    wei.getComponent("PeoplePrefab").shadow.spriteFrame = this.arr_shadow[i];
                    this.content.addChild(wei);
                }
            }
        }
    },
    CloseBtn(){
        wx.aldSendEvent("游戏首页_时光足迹页面停留时间",{
            "耗时" : (Date.now()-this.startTime)/1000
        });
        if(Global.level>=10){
            Global.showGameLoop = true;
        }
        if(Global.isplaymusic){
            cc.audioEngine.play(Global.clip_btnclose, false);
        }
        this.node.destroy();
    },
    // update (dt) {},
});
