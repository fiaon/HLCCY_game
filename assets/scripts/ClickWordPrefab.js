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
        word:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        //this.selectbtn = cc.find("Canvas/qipanbg/9*9/select_img");
    },

    init(id,word, posx, posy){
        this.selectID = id;
        this.selectword = word;
        this.node.name = id.toString();
        this.word.string = word;
        // 无效
        this.word_index = posx * 10 + posy;
    },

    clickBtn(){
        this.node.active = false;
        cc.game.emit("clickWord",this.selectID,this.selectword);
    },

  
    // update (dt) {},
});
