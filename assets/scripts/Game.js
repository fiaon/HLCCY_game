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
    },


    start() {
        this.BtnTishiFangSuo();
        this.dataArr = null;       //数据
        this.oldArr = [];       //用来打乱的数组
        this.haveziArr = [];      //是否存在字(用来显示光标的位置)
        this.index = 0;
        let data = {
            "data": {
                "lvl": 2, "conf": {
                    "id": 2, "word": ["似", "心", "如", "止", "水", "流", "延", "年", "益", "寿", "比", "东", "西", "南", "北", "山"],
                    "idiom": ["东西南北", "寿比南山", "延年益寿", "似水流年", "心如止水"],
                    "posx": [4, 1, 2, 3, 4, 4, 3, 4, 5, 6, 6, 4, 5, 6, 7, 6], 
                    "posy": [7, 6, 6, 6, 6, 5, 4, 4, 4, 4, 3, 2, 2, 2, 2, 1],
                    "answer": [4, 7, 8, 12, 13, 15], "barrier": []
                }
            },
            "errcode": 0, "errmsg": ""
        };

        let _words = data.data.conf.word;
        let _idiom = data.data.conf.idiom;
        let _posx = data.data.conf.posx;
        let _posy = data.data.conf.posy;
        let _answer = data.data.conf.answer;

        var _letters = new Map();
        for (let i = 0; i < _words.length;i++)
        {
            _letters.set(_words[i], _posx[i] * 10 + _posy[i]);
        }

        for (let i = 0; i < _answer.length; i++) {
            this.map_answer.set((_posx[_answer[i]] * 10 + _posy[_answer[i]]), _answer[i]);
            this.map_temp.set((_posx[_answer[i]] * 10 + _posy[_answer[i]]), 0);
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
            // this.UpsetArray();
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

            
            var right_word = "";
            if (_wordPrefab && _wordPrefab.showWord(id, word)) {
                let x = _posx[this.selectId];
                let y = _posy[this.selectId];
                let word_key = x * 10 + y;
                _wordPrefab.setPos(x,y);
                if (this.map_temp.has(word_key) && this.map_temp.get(word_key) == 0) {
                    this.map_temp.set(word_key, id);
                }

                if (this.map_temp.get(word_key) != this.map_answer.get(word_key))
                {
                    // 填词错误
                    right_word = _words[this.map_answer.get(word_key)];
                }
                else
                    right_word = word;
                console.log("right :" , right_word);
            }
            else
                return;

            // 判读是否有一个词条完成了任务，或者错误答案
            for (let i = 0;i < _idiom.length; i++)
            {
                let citiao = _idiom[i];
                // 判断对应字再不在里面
                let bcontain = false;
                for (let x = 0; x < citiao.length; x++)
                {
                    if (citiao[x] == right_word)
                    {
                        bcontain = true;
                        break;
                    }
                }

                if (bcontain)
                {
                    //判断是否已经填满
                    let bNotFinish = false;
                    let bRight = true; 
                    
                    for (let j = 0; j < citiao.length; j++)
                    {
                        let ci = citiao[j];
                        let _index = _letters.get(ci);
                        if (this.map_temp.has(_index))
                        {
                            if (this.map_temp.get(_index) != this.map_answer.get(_index))
                            {
                                bRight = false;
                            }
                            
                            if (this.map_temp.get(_index) == 0)
                                bNotFinish = true;
                        }
                    }

                    if (bRight)
                        console.log(citiao + " is right");
                    else
                    {
                        if (bNotFinish == false)
                            console.log(citiao + " is wrong");
                        else
                            console.log(citiao + " is not finished");
                    }
                        
                }
            }
            //一个成语填满了才需要判断是否正确   
            //填的字的位置下标
            // let clickindex = this.oldArr[this.index];
            // //和这个下标一样的x(也就是竖着的成语) y一样(横着的成语)
            // let num_x = this.dataArr.posx[clickindex];
            // let num_y = this.dataArr.posy[clickindex];
            // let arr_posx = [];
            // let arr_posy = [];
            // let map = [];
            // for(let i=0;i<this.dataArr.posx.length;i++){
            //     if(this.dataArr.posx[i] == num_x&&i!=clickindex){
            //         arr_posx.push(i);
            //     }
            //     if(this.dataArr.posy[i] == num_y&&i!=clickindex){
            //         arr_posy.push(i);
            //     }
            // }
            // console.log("除自己同一竖列的字的下标",arr_posx,"除自己同一横列的字的下标",arr_posy);
            // if(this.dataArr.word[this.oldArr[this.index]] == word){
            //     for(let i=0;i<this.dataArr.idiom.length;i++){
            //         if(this.dataArr.idiom[i].indexOf(word.toString())!=-1){
            //             // console.log("word:",word,this.dataArr.idiom[i]);
            //             let num=0;
            //             for(let k=0;k<this.dataArr.idiom[i].length;k++){
            //                 for(let j=0;j<Global.word.length;j++){
            //                     if(Global.word[j] == this.dataArr.idiom[i][k]){
            //                         num++;
            //                     }
            //                 }
            //             }
            //             if(num ==4){
            //                 console.log("正确",this.dataArr.idiom[i]);
            //             }
            //         }
            //     }
            // }
            this.haveziArr[this.index]=1;
            for(let i=0;i<this.haveziArr.length;i++){
                if(this.haveziArr[i]==0){
                    this.index = i;
                    break;
                }
            }
            if (this.oldArr[this.index]) {
                this.selectId = this.oldArr[this.index];
                this.select.x = this.dataArr.posx[this.oldArr[this.index]] * 68;
                this.select.y = this.dataArr.posy[this.oldArr[this.index]] * 68;
            } else {
                //判断是否结束游戏
            }
        }, this);

        //点击棋盘上面字或者空白地方的监听 擦除或者选择 word_key map中key
        cc.game.on("showWord", function (word, index, id, word_key) {
            this.index = index;
            this.haveziArr[index] = 0;
            console.log("word_key:" + word_key);
            if (this.map_temp.has(word_key) && this.map_temp.get(word_key) != 0) {
                this.map_temp.set(word_key, 0);
                for (let i = 0; i < this.clickcontent.children.length; i++) {
                    if (this.clickcontent.children[i].name == id) {
                        this.clickcontent.children[i].active = true;
                    }
                }
            }


            this.selectId = this.oldArr[this.index];
            this.select.x = this.dataArr.posx[this.oldArr[this.index]] * 68;
            this.select.y = this.dataArr.posy[this.oldArr[this.index]] * 68;

        }, this);

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