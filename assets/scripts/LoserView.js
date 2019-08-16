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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        //this.arr_word = new Array();
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
