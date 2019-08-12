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
        guideview:{
            default: null,
            type: cc.Prefab,
        },
        btn_tishi:{
            default: null,
            type: cc.Node,
        },
        qipan:{
            default: null,
            type: cc.Node,
        },
        //游戏显示的成语
        wordPrefab:{
            default: null,
            type: cc.Prefab,
        },
        //下面可以点击的成语
        clickcontent:{
            default: null,
            type: cc.Node,
        },
        clickwordPrefab:{
            default: null,
            type: cc.Prefab,
        },
        //选择的光标
        selectbtn:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    //打乱数组排序
    UpsetArray(){
        var arr = this.dataArr.answer;
        var len = arr.length;
        for (var i = 0; i < len - 1; i++) {
            var index = parseInt(Math.random() * (len - i));
            var temp = arr[index];
            arr[index] = arr[len - i - 1];
            arr[len - i - 1] = temp;
        }
        return arr;
    },
    start () {
        this.BtnTishiFangSuo();
        this.dataArr=null;       //消失的字数组的下标也是光标的位置
        this.oldArr = [];       //用来打乱的数组
        this.haveziArr=[];      //是否存在字(用来显示光标的位置)
        this.index =0;
        let data = {"data":{"lvl":2,"conf":{"id":2,"word":["似","心","如","止","水","流","延","年","益","寿","比","东","西","南","北","山"],"idiom":["东西南北","寿比南山","延年益寿","似水流年","心如止水"],"posx":[4,1,2,3,4,4,3,4,5,6,6,4,5,6,7,6],"posy":[7,6,6,6,6,5,4,4,4,4,3,2,2,2,2,1],"answer":[4,7,8,12,13,15],"barrier":[]}},"errcode":0,"errmsg":""};
        console.log(data);
        if(data){
            this.dataArr = data.data.conf;
            for(let i=0;i<data.data.conf.word.length;i++){
                let word = cc.instantiate(this.wordPrefab);
                word.getComponent("WordPrefab").init(i,data.data.conf.answer,data.data.conf.word[i],data.data.conf.posx[i],data.data.conf.posy[i]);
                this.qipan.addChild(word);
            }
            this.select = cc.instantiate(this.selectbtn);
            this.selectId = data.data.conf.answer[this.index];
            this.select.x = data.data.conf.posx[data.data.conf.answer[this.index]]*68;
            this.select.y = data.data.conf.posy[data.data.conf.answer[this.index]]*68;
            this.qipan.addChild(this.select);
            for(let i=0;i<data.data.conf.answer.length;i++){
                this.oldArr[i] = data.data.conf.answer[i];
                this.haveziArr[i]=0;
            }
            //打乱排序
            this.UpsetArray();
            for(let j=0;j<this.dataArr.answer.length;j++){
                let clickword = cc.instantiate(this.clickwordPrefab);
                clickword.getComponent("ClickWordPrefab").init(this.dataArr.answer[j],data.data.conf.word[this.dataArr.answer[j]]);
                this.clickcontent.addChild(clickword);
            }
        }
        //点击下面字的监听
        cc.game.on("clickWord",function(id,word){
            this.qipan.getChildByName(this.oldArr[this.index].toString()).getComponent("WordPrefab").showWord(id,word);
            //如果是正确的
            Global.word.push(word);
            //一个成语填满了才需要判断是否正确
            if(this.dataArr.word[this.oldArr[this.index]] == word){
                for(let i=0;i<this.dataArr.idiom.length;i++){
                    if(this.dataArr.idiom[i].indexOf(word.toString())!=-1){
                        // console.log("word:",word,this.dataArr.idiom[i]);
                        let num=0;
                        for(let k=0;k<this.dataArr.idiom[i].length;k++){
                            for(let j=0;j<Global.word.length;j++){
                                if(Global.word[j] == this.dataArr.idiom[i][k]){
                                    num++;
                                }
                            }
                        }
                        if(num ==4){
                            console.log("正确",this.dataArr.idiom[i]);
                        }
                    }
                }
            }
            this.haveziArr[this.index]=1;
            for(let i=0;i<this.haveziArr.length;i++){
                if(this.haveziArr[i]==0){
                    this.index = i;
                    break;
                }
            }
            if( this.oldArr[this.index]){
                this.selectId = this.oldArr[this.index];
                this.select.x = this.dataArr.posx[this.oldArr[this.index]]*68;
                this.select.y = this.dataArr.posy[this.oldArr[this.index]]*68;
            }else{
                //判断是否结束游戏
            }
        },this);
        //点击棋盘上面字或者空白地方的监听
        cc.game.on("showWord",function(word,index,id){
            this.index = index;
            this.haveziArr[index]=0;
            Global.word.forEach(function(item, index, arr) {
                if(item == word) {
                    arr.splice(index, 1);
                }
            });
            for(let i=0;i<this.clickcontent.children.length;i++){
                if(this.clickcontent.children[i].name == id){
                    this.clickcontent.children[i].active = true;
                }
            }
        },this);
    },
    BackBtn(){
        cc.director.loadScene("start.fire");
    },
    //如何玩
    guideBtn(){
        let guide = cc.instantiate(this.guideview);
        if(guide){
            this.node.addChild(guide);
        }
    },
    //分享按钮
    shareBtn(){
        Global.ShareApp();
    },
    /**
     * 分享的放缩
     */
    BtnTishiFangSuo: function () {
        var self = this;
        this.schedule(function () {
            var action = self.FangSuoFun();
            self.btn_tishi.runAction(action);
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
