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
        arr_word:new Array(),
        lvl_label:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

        // if(Global.playerlvl<Global.carlvl){
        //     let num_lvl = Global.UserLvlData[Global.playerlvl].gamelvl - Global.level;
        //     this.lvl_label.string = "还有"+num_lvl+"关后可升级最新人物";
        // }else{
        //     let num_lvl = Global.CarLvlData[Global.carlvl-1].gamelvl - Global.level;
        //     this.lvl_label.string = "还有"+num_lvl+"关后可升级最新车辆";
        // }
    },
    AddErrorWord(num){
        this.arr_word.push(num);
        console.log("arrword",this.arr_word);
    },
    AgainChallengeBtn(){
        cc.director.loadScene("game.fire");
    },
    //继续按钮 看视频成功之后取消当前的错误成语
    ShowAdVideo(){
        for(let i=0;i<this.arr_word.length;i++){
            cc.game.emit("idiomError",this.arr_word[i]);
        }
        this.node.destroy();
    }
    // update (dt) {},
});
