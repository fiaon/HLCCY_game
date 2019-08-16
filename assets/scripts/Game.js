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
        guideview: {
            default: null,
            type: cc.Prefab,
        },
        btn_tishi: {
            default: null,
            type: cc.Node,
        },
        qipan: {
            default: null,
            type: cc.Node,
        },
        //游戏显示的成语
        wordPrefab: {
            default: null,
            type: cc.Prefab,
        },
        //下面可以点击的成语
        clickcontent: {
            default: null,
            type: cc.Node,
        },
        clickwordPrefab: {
            default: null,
            type: cc.Prefab,
        },
        // map_answer:{
        //     default: null,
        // },
        //选择的光标
        selectbtn: cc.Prefab,
        winView:{
            default:null,
            type:cc.Prefab,
        },
        loserView:{
            default:null,
            type:cc.Prefab,
        },
        game_jumpApp:{
            default:null,
            type:cc.Prefab,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    //打乱数组排序
    UpsetArray() {
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

    onLoad() {
        //保存答案
        this.map_answer = new Map();
        //保存操作的答案
        this.map_temp = new Map();
        //保存答案的下标
        this.arr_answer = new Array();
    },


    start() {
        this.BtnTishiFangSuo();
        this.dataArr = null;       //消失的字数组的下标也是光标的位置
        this.oldArr = [];       //用来打乱的数组
        this.haveziArr = [];      //是否存在字(用来显示光标的位置)
        this.index = 0;
        this.loser = null;
        let data = {
            "data": {
                "lvl": 7,
                "conf": {
                    "id": 7,
                    "word": ["夕", "阳", "西", "下", "不", "春", "投", "明", "明", "白", "白", "机", "不", "雪", "颠", "倒", "黑", "白", "把"],
                    "idiom": ["夕阳西下", "阳春白雪", "明明白白", "不明不白", "颠倒黑白", "投机倒把"],
                    "posx": [5, 6, 7, 8, 4, 6, 2, 4, 5, 6, 7, 2, 4, 6, 1, 2, 3, 4, 2],
                    "posy": [7, 7, 7, 7, 6, 6, 5, 5, 5, 5, 5, 4, 4, 4, 3, 3, 3, 3, 2],
                    "answer": [1, 7, 9, 13, 15, 17],
                    "barrier": []
                }
            },
            "errcode": 0,
            "errmsg": ""
        };
        console.log(data);
        let _words = data.data.conf.word;
        let _idiom = data.data.conf.idiom;
        let _posx = data.data.conf.posx;
        let _posy = data.data.conf.posy;

        let _answer = data.data.conf.answer;

        var _letters = new Map();
        for (let i = 0; i < _words.length; i++) {
            _letters.set(_posx[i] * 10 + _posy[i],i);
        }

        var _index_letters = new Map();
        for (let i = 0; i < _words.length; i++) {
            _index_letters.set(_posx[i] * 10 + _posy[i], _words[i]);
        }

        for (let i = 0; i < _answer.length; i++) {
            this.map_answer.set((_posx[_answer[i]] * 10 + _posy[_answer[i]]), _answer[i]);
            this.map_temp.set((_posx[_answer[i]] * 10 + _posy[_answer[i]]), 0);
            this.arr_answer.push((_posx[_answer[i]] * 10 + _posy[_answer[i]]));
        }
        console.log(this.map_answer);

        if (data) {
            this.dataArr = data.data.conf;
            for (let i = 0; i < _words.length; i++) {
                let word = cc.instantiate(this.wordPrefab);
                word.getComponent("WordPrefab").init(i, _answer, _words[i], _posx[i], _posy[i]);
                this.qipan.addChild(word);
            }
            this.select = cc.instantiate(this.selectbtn);
            this.selectId = _answer[this.index];
            this.select.x = _posx[_answer[this.index]] * 68;
            this.select.y = _posy[_answer[this.index]] * 68;
            this.qipan.addChild(this.select);
            for (let i = 0; i < _answer.length; i++) {
                this.oldArr[i] = _answer[i];
                this.haveziArr[i] = 0;
            }
            //打乱排序
            //this.UpsetArray();
            for (let j = 0; j < this.dataArr.answer.length; j++) {
                let clickword = cc.instantiate(this.clickwordPrefab);
                let __answer = this.dataArr.answer[j];
                clickword.getComponent("ClickWordPrefab").init(this.dataArr.answer[j], _words[__answer], _posx[__answer], _posy[__answer]);
                this.clickcontent.addChild(clickword);
            }
        }

        //点击下面字的监听 放上去 word_key map中的
        cc.game.on("clickWord", function (id, word) {
            var _wordPrefab = this.qipan.getChildByName(this.oldArr[this.index].toString()).getComponent("WordPrefab");
            let x = _posx[this.selectId];
            let y = _posy[this.selectId];
            var word_key = x * 10 + y;
            var right_word = "";
            if (_wordPrefab && _wordPrefab.showWord(id, word)) {

                // let word_key = x * 10 + y;
                _wordPrefab.setPos(x, y);
                if (this.map_temp.has(word_key) && this.map_temp.get(word_key) == 0) {
                    this.map_temp.set(word_key, id);
                }

                if (this.map_temp.get(word_key) != this.map_answer.get(word_key)) {
                    // 填词错误
                    right_word = _words[this.map_answer.get(word_key)];
                }
                else
                    right_word = word;
                console.log("right :", right_word);
            }
            else
                return;

            //判断填写的字所在的位置 含有那些成语
            {
                let start_ = 0;
                let count_ = 0;
                let end_ = 0;
                for (let i = 1; i <= 9; i++) {
                    let temp_word = i * 10 + y;
                    if (_index_letters.has(temp_word)) {
                        count_ += 1;
                    }
                    else {
                        count_ = 0;
                    }
    
                    if (count_ == 4) {
                        end_ = i;
                        start_ = end_ - 3;
                    }
                }
                if (end_ - start_ == 3) {
                    let bFinish = true;
                    let bRight = true;
                    //横向的已经找出 判断是否已经填写满，或者是否正确
                    for (let i = start_; i <= end_; i++) {
                        let temp_word = i * 10 + y;
                        if (this.map_temp.has(temp_word)) {
                            if (this.map_temp.get(temp_word) == 0&&word!=_index_letters.has(temp_word)) {
                                bFinish = false;
                                bRight = false;
                            }
                            else if (_words[this.map_temp.get(temp_word)] != _words[this.map_answer.get(temp_word)]) {
                                bRight = false;
                            }
                        }
                    }
    
    
                    if (bRight) {
                        console.log(`横向 %d,%d is right`, start_, end_);
                        for(let i = start_; i <= end_; i++){
                            let temp_word = i * 10 + y;
                            cc.game.emit("idiomRight",_letters.get(temp_word));
                        }
                    }
                    else {
                        if (bFinish == false){
                            console.log(`横向 %d,%d is not finished`, start_, end_);
                        }
                        else{
                            console.log(`横向 %d,%d is wrong`, start_, end_);
                            if(this.loser ==null){
                                this.loser =  cc.instantiate(this.loserView);
                                this.node.addChild(this.loser);
                            }
                            for(let i = start_; i <= end_; i++){
                                let temp_word = i * 10 + y;
                                if (this.map_temp.has(temp_word)){
                                    if(_words[this.map_temp.get(temp_word)] != _words[this.map_answer.get(temp_word)]){
                                        //这里就是填错的字
                                        this.loser.getComponent("LoserView").AddErrorWord(_letters.get(temp_word));
                                        //cc.game.emit("idiomError",_letters.get(temp_word));
                                    }
                                }
                            }
                        }
                    }
                }
            }
            {
                let start_ = 0;
                let count_ = 0;
                let end_ = 0;
                for (let i = 1; i <= 9; i++) {
                    let temp_word = x*10 + i;
                    if (_index_letters.has(temp_word)) {
                        count_ += 1;
                    }
                    else {
                        count_ = 0;
                    }
    
                    if (count_ == 4) {
                        end_ = i;
                        start_ = end_ - 3;
                    }
                }
                if (end_ - start_ == 3) {
                    let bFinish = true;
                    let bRight = true;
                    //横向的已经找出 判断是否已经填写满，或者是否正确
                    for (let i = start_; i <= end_; i++) {
                        let temp_word = x*10 + i;
                        if (this.map_temp.has(temp_word)) {
                            if (this.map_temp.get(temp_word) == 0&&word!=_index_letters.has(temp_word)) {
                                bFinish = false;
                                bRight = false;
                            }
                            else if (_words[this.map_temp.get(temp_word)] != _words[this.map_answer.get(temp_word)]) {
                                bRight = false;
                            }
                        }
                    }
    
    
                    if (bRight) {
                        console.log(`纵向 %d,%d is right`, start_, end_);
                        for(let i = start_; i <= end_; i++){
                            let temp_word = x * 10 + i;
                            cc.game.emit("idiomRight",_letters.get(temp_word));
                        }
                    }
                    else {
                        if (bFinish == false){
                            console.log(`纵向 %d,%d is not finished`, start_, end_);
                        }
                        else{
                            console.log(`纵向 %d,%d is wrong`, start_, end_);
                            if(this.loser ==null){
                                this.loser =  cc.instantiate(this.loserView);
                                this.node.addChild(this.loser);
                            }
                            for(let i = start_; i <= end_; i++){
                                let temp_word = x * 10 + i;
                                if (this.map_temp.has(temp_word)){
                                    if(_words[this.map_temp.get(temp_word)] != _words[this.map_answer.get(temp_word)]){
                                        this.loser.getComponent("LoserView").AddErrorWord(_letters.get(temp_word));
                                        //cc.game.emit("idiomError",_letters.get(temp_word));
                                    }
                                }
                            }
                        }   
                    }
                }
            }

            this.haveziArr[this.index] = 1;
            for (let i = 0; i < this.haveziArr.length; i++) {
                if (this.haveziArr[i] == 0) {
                    this.index = i;
                    break;
                }
            }
            if (this.oldArr[this.index]) {
                this.selectId = this.oldArr[this.index];
                this.select.x = this.dataArr.posx[this.oldArr[this.index]] * 68;
                this.select.y = this.dataArr.posy[this.oldArr[this.index]] * 68;
            }
            //判断2个map是否都一样（胜利条件）
            let winnum =0;
            for(let i=0;i<this.arr_answer.length;i++){
                if(this.map_temp.get(this.arr_answer[i]) !=0){
                    //this.map_temp.get(this.arr_answer[i]) != this.map_answer.get(this.arr_answer[i]
                    if(_words[this.map_temp.get(this.arr_answer[i])] != _words[this.map_answer.get(this.arr_answer[i])]){
                        break;
                    }else{
                        winnum++;
                    }
                }else{
                    winnum=0;
                }
            }
            if(winnum == this.arr_answer.length){
                //TODO
                console.log("获胜")
                let win =  cc.instantiate(this.winView);
                this.node.addChild(win);
            }
        }, this);

        //点击棋盘上面字或者空白地方的监听 擦除或者选择 word_key map中key
        cc.game.on("showWord", function (index, id, word_key) {
            this.index = index;
            this.haveziArr[index] = 0;
            console.log("word_key:" + word_key);
            
            if (this.map_temp.has(word_key) && this.map_temp.get(word_key) != 0) {
                this.map_temp.set(word_key, 0);
            }

            for (let i = 0; i < this.clickcontent.children.length; i++) {
                if (this.clickcontent.children[i].name == id) {
                    this.clickcontent.children[i].active = true;
                }
            }

            this.selectId = this.oldArr[this.index];
            this.select.x = this.dataArr.posx[this.oldArr[this.index]] * 68;
            this.select.y = this.dataArr.posy[this.oldArr[this.index]] * 68;
        }, this);

        let jumpIndexArr = new Array();
        for(let i=0;i<9;i++){
            for(let j=0;j<9;j++){
                let jumpadd = i*10+j;
                if(_index_letters.has(jumpadd) ==false){
                    jumpIndexArr.push(jumpadd);
                }
            }
        }
        let ranindex =Math.floor( Math.random()*jumpIndexArr.length);
        let game_jump = cc.instantiate(this.game_jumpApp);
        game_jump.x = parseInt(jumpIndexArr[ranindex]/10) * 68;
        game_jump.y = jumpIndexArr[ranindex]%10 * 68;
        console.log("广告位置: ",parseInt(jumpIndexArr[ranindex]/10),jumpIndexArr[ranindex]);
        this.qipan.addChild(game_jump);

    },
    BackBtn() {
        cc.director.loadScene("start.fire");
    },
    //如何玩
    guideBtn() {
        let guide = cc.instantiate(this.guideview);
        if (guide) {
            this.node.addChild(guide);
        }
    },
    //分享按钮
    shareBtn() {
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
