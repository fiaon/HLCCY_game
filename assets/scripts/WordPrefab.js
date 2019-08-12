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
        img:cc.Node,
        ziimg:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        
    },
    //初始化数据
    //
    init(k,arr,word,x,y){
        this.selectword = word;
        this.node.name = k.toString();
        for(let i=0;i<arr.length;i++){
            if(k ==arr[i]){
                this.word.string ="";
                this.node.x = x*68;
                this.node.y = y*68;
                this.index = i;
                this.img.active =true;
                this.node.on("touchstart",this.clickBtn,this);
                return;
            }else{
                this.word.string = word;
                this.node.x = x*68;
                this.node.y = y*68;
            }
        }
        Global.word.push(word);
    },
    //显示点击的字
    showWord(id,word){
        //如果这里有字就互换,没字就显示
        if(this.word.string!=""){
            cc.game.emit("showWord",this.selectword,this.index,this.selectID);
        }
        this.selectID = id;
        this.word.string = word;
        this.selectword = word;
        this.ziimg.active = true;
    },
    clickBtn(){
        var selectbtn = cc.find("Canvas/qipanbg/9*9/select_img");
        selectbtn.position = this.node.position;
        if(this.word.string!=""){
            this.word.string = "";
            this.ziimg.active = false;
        }
        cc.game.emit("showWord",this.selectword,this.index,this.selectID);
    },
    // update (dt) {},
});
