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
        // loserView:{
        //     default:null,
        //     type:cc.Prefab,
        // },
        game_jumpApp:{
            default:null,
            type:cc.Prefab,
        },
        level_label:cc.Label,
        display:{
            type:cc.Sprite,
            default:null 
        },
        gglunbo:{
            default:null,
            type:cc.Node,
        },
        tuijian:{
            default:null,
            type:cc.Node,
        },
        ruhewan:{
            default:null,
            type:cc.Node,
        },
        lvlonce:cc.Node,
        lvlonce_hand:cc.Node,
        clip_idiom:{
            default:null,
            type:cc.AudioClip,
        },
        clip_error:{
            default:null,
            type:cc.AudioClip,
        },
        tipsnum:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {
        
    // },
    Success(){
        wx.aldSendEvent('视频广告',{'是否有效' : '是'});
        wx.aldSendEvent('视频广告',{'是否有效' : '视频广告_答题页_提示_是'});
        self.OneRightKey();
    },
    Failed(){
        wx.aldSendEvent('视频广告',{'是否有效' : '否'});
        wx.aldSendEvent('视频广告',{'是否有效' : '视频广告_答题页_提示_否'});
        Global.ShowTip(this.node, "观看完视频才能获取提示");
    },
    //打乱数组排序
    UpsetArray() {
        if(Global.gamedata.data.data.lvl ==1){
            return;
        }
        var arr = this.oldArr;
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

        let self = this;
        wx.onShow(function () {
            if (self.isShared && self.shareTag == "keys") {
                //分享后返回
                let curTime = new Date().getTime();
                if (curTime - self.closeTime >= 5000) {
                    //分享成功
                    wx.aldSendEvent('分享_答题页_提示_分享成功');
                    self.OneRightKey();
                    self.isShared = false;
                    self.shareTag = "";
                    self.closeTime = curTime;
                }else{
                    wx.aldSendEvent('分享_答题页_提示_分享失败');
                    if(Global.level >=16){
                        wx.aldSendEvent('视频广告');
                        wx.aldSendEvent('视频广告_答题页_提示');
                        Global.showAdVedio(self.Success.bind(self), self.Failed.bind(self));
                    }
                }
            }
        })
    },
    LvLOne(){
        this.lvlonce_hand.runAction(cc.sequence(
            cc.moveTo(0.5, this.lvlonce_hand-20, this.lvlonce_hand.y),
            cc.moveTo(0.5, this.lvlonce_hand.x, this.lvlonce_hand.y),
        ));
    },
    onClickInviteFriend: function (event) {
        if(Global.isplaymusic){
            cc.audioEngine.play(Global.clip_btnclick, false);
        }
        wx.aldSendEvent('邀请',{'邀请类型' : '邀请好友组队'});
        if (CC_WECHATGAME) {
            // 上线前注释console.log(Global.shareimg);
            wx.aldShareAppMessage({
                title: '你忘记了我们当初的海誓山盟了吗？点击一起赢取千元红包大奖',
                imageUrl: Global.shareimg,
                query: "team=" + Global.Introuid,
                success(res) {
                    // 上线前注释console.log("yes");
                },
                fail(res) {
                    // 上线前注释console.log("failed");
                },
                complete(res) {
                    // 上线前注释console.log("complete");
                }
            });
        }
    },
    start() {
        wx.aldSendEvent('答题页pv');
        Global.startTime = Date.now();
        this.startTime = Date.now();


        this.tipscount=0;
        this.sharecount =0;
        if(Global.tips>0){
            this.tipsnum.active = true;
            this.tipsnum.getChildByName("number").getComponent(cc.Label).string = Global.tips;
        }else{
            this.tipsnum.active = false;
        }
        //如果是第一关
        if(Global.level ==1 || Global.gamedata.data.data.lvl ==1){
            this.lvlonce.active = true;
            this.schedule(this.LvLOne, 1.0, cc.macro.REPEAT_FOREVER, 0.1);
            this.node.getChildByName("backbg").active = false;
        }
        if(!Global.isteam){
            this.node.getChildByName("haoyoubg").active = true;
            this.display.node.active = false;
        }else{
            this.node.getChildByName("haoyoubg").active = false;
            this.display.node.active = true;
            //给子域发送消息
            var openDataContext = wx.getOpenDataContext();
            openDataContext.postMessage({
                text:'game',
            });
        }
        this.tex = new cc.Texture2D();

        this.dataArr = null;       //消失的字数组的下标也是光标的位置
        this.oldArr = [];         //用来打乱的数组
        this.haveziArr = [];      //是否存在字(用来显示光标的位置)
        this.index = 0;
        // this.loser = null;
        //获取当前关卡数据
        let data = Global.gamedata.data;
        console.log(data);
        let _words = data.data.conf.word;
        this.rightKeywords = _words;
        let _idiom = data.data.conf.idiom;
        let _posx = data.data.conf.posx;
        let _posy = data.data.conf.posy;

        let _answer = data.data.conf.answer;
        this.level_label.string = "第"+data.data.lvl+"关";

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
            this.map_temp.set((_posx[_answer[i]] * 10 + _posy[_answer[i]]), -1);
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
            this.select.x = _posx[_answer[this.index]] * 75;
            this.select.y = _posy[_answer[this.index]] * 75;
            this.qipan.addChild(this.select);
            for (let i = 0; i < _answer.length; i++) {
                this.oldArr[i] = _answer[i];
                this.haveziArr[i] = 0;
            }
            //打乱排序
            this.UpsetArray();
            for (let j = 0; j < this.oldArr.length; j++) {
                let clickword = cc.instantiate(this.clickwordPrefab);
                let __answer = this.oldArr[j];
                clickword.getComponent("ClickWordPrefab").init(this.oldArr[j], _words[__answer], _posx[__answer], _posy[__answer]);
                this.clickcontent.addChild(clickword);
            }
        }

        //点击下面字的监听 放上去 word_key map中的
        cc.game.on("clickWord", function (id, word) {
            if(Global.gamedata.data.data.lvl==1&&this.lvlonce.active){
                this.lvlonce.active = false;
                this.unschedule(this.LvLOne);
                Global.ShowTip(this.node, "试着填充所有的成语吧");
            }
            // this.loser =null;
            let idiom_indexX=null;
            let idiom_indexY=null;
            let indexX = 0;
            let indexY = 0;
            let map_tempHasX = 0;
            let map_tempHasY = 0;
            let wordindex = null;
            var _wordPrefab = this.qipan.getChildByName(this.dataArr.answer[this.index].toString()).getComponent("WordPrefab");
            let x = _posx[this.selectId];
            let y = _posy[this.selectId];
            var word_key = x * 10 + y;
            var right_word = "";
            if (_wordPrefab && _wordPrefab.showWord(id, word)) {

                // let word_key = x * 10 + y;
                _wordPrefab.setPos(x, y);
                if (this.map_temp.has(word_key) && this.map_temp.get(word_key) == -1) {
                    this.map_temp.set(word_key, id);
                }

                if (this.map_temp.get(word_key) != this.map_answer.get(word_key)) {
                    // 填词错误
                    right_word = _words[this.map_answer.get(word_key)];
                }
                else
                    right_word = word;
                //console.log("right :", right_word);
            }
            else
                return;

            //判断填写的字所在的位置 含有那些成语
            {   
                let count_ = 0;
                let start_ = new Array();
                let end_ = new Array();
                for (let i = 0; i < 9; i++) {
                    let temp_word = i * 10 + y;
                    let temp_cha = Math.abs(word_key - temp_word);
                    if (_index_letters.has(temp_word)&& (temp_cha>=0 && temp_cha<=30)) {
                        count_ += 1;
                    }
                    else { 
                        count_ = 0;
                    }
    
                    if (count_ == 4) {
                        end_.push(i);
                        start_.push(i- 3);
                    }
                }
                for(let e=0;e<end_.length;e++){
                    if (end_[e] - start_[e] == 3) {
                        let bFinish = true;
                        let bRight = true;
                        let temp_num=0; //起始下标
                        //横向的已经找出 判断是否已经填写满，或者是否正确
                        for (let i = start_[e]; i <= end_[e]; i++) {
                            let temp_word = i * 10 + y;
                            temp_num++;
                            // 判断我填的字在成语的第几个位置 (用于判断之后的下标的位置) X
                            // if(temp_word == word_key){
                            //     indexX = temp_num-1;
                            // }
                            if (this.map_temp.has(temp_word)) {
                                if (this.map_temp.get(temp_word) == -1) {
                                    bFinish = false;
                                    bRight = false;
                                    map_tempHasX ++;
                                    if(idiom_indexX == null){
                                        idiom_indexX = this.map_answer.get(temp_word); 
                                        indexX = temp_num; 
                                    }
                                }
                                else if (_words[this.map_temp.get(temp_word)] != _words[this.map_answer.get(temp_word)]) {
                                    bRight = false;
                                }
                            }
                        }
        
        
                        if (bRight) {
                            if(Global.isplaymusic){
                                cc.audioEngine.play(this.clip_idiom, false);
                            }
                            // console.log(`横向 %d,%d is right`, start_[e], end_[e]);
                            // for(let i = start_[e]; i <= end_[e]; i++){
                            //     let temp_word = i * 10 + y;

                            //     cc.game.emit("idiomRight",_letters.get(temp_word));
                            // }
                            let k = start_[e]-1;
                            this.schedule(function() {
                                k++;
                                let temp_word = k * 10 + y;
                                if(_letters.has(temp_word)){
                                    var word_prefab = this.qipan.getChildByName(_letters.get(temp_word).toString()).getComponent("WordPrefab")
                                    word_prefab.IdiomRight(_letters.get(temp_word));
                                }
                            }, 0.1, 4, 0);
                            for(let i = start_[e]; i <= end_[e]; i++){
                                let temp_word = i * 10 + y;

                                let temp = _letters.get(temp_word);
                                wordindex = this.JudgeWord(_posx[temp],_posy[temp],temp_word,_index_letters);
                                if(wordindex){
                                    break;
                                }
                            }
                        }
                        else {
                            if (bFinish == false){
                                // console.log(`横向 %d,%d is not finished`, start_[e], end_[e]);
                            }
                            else{
                                //console.log(`横向 %d,%d is wrong`, start_[e], end_[e]);
                                if(Global.isplaymusic){
                                    cc.audioEngine.play(this.clip_error, false);
                                }
                                // if(this.loser ==null){
                                //     this.loser =  cc.instantiate(this.loserView);
                                //     this.node.addChild(this.loser);
                                // }
                                for(let i = start_[e]; i <= end_[e]; i++){
                                    let temp_word = i * 10 + y;
                                    if (this.map_temp.has(temp_word)){
                                        if(_words[this.map_temp.get(temp_word)] != _words[this.map_answer.get(temp_word)]){
                                            //这里就是填错的字
                                            //this.loser.getComponent("LoserView").AddErrorWord(_letters.get(temp_word));
                                            cc.game.emit("idiomError",_letters.get(temp_word));
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            {
                let count_ = 0;
                let start_ = new Array();
                let end_ = new Array();
                for (let i = 0; i < 9; i++) {
                    let temp_word = x*10 + i;
                    let temp_cha = Math.abs(word_key - temp_word);
                    if (_index_letters.has(temp_word)&& (temp_cha>=0 && temp_cha<=3)) {
                        count_ += 1;
                    }
                    else {
                        count_ = 0;
                    }
    
                    if (count_ == 4) {
                        end_.push(i);
                        start_.push(i- 3);
                    }
                }
                for(let e=0;e<end_.length;e++){
                    if (end_[e] - start_[e] == 3) {
                        let bFinish = true;
                        let bRight = true;
                        //纵向的已经找出 判断是否已经填写满，或者是否正确
                        let temp_num=0; //起始下标
                        for (let i = start_[e]; i <= end_[e]; i++) {
                            let temp_word = x*10 + i;
                            temp_num++; // 增加
                            // 判断我填的字在成语的第几个位置 (用于判断之后的下标的位置)
                            // if(temp_word == word_key){
                            //     indexY = 4-temp_num; //当前字所在的位置
                            // }
                            if (this.map_temp.has(temp_word)) {
                                if (this.map_temp.get(temp_word) == -1) {
                                    bFinish = false;
                                    bRight = false;
                                    map_tempHasY ++;
                                    idiom_indexY = this.map_answer.get(temp_word);
                                    indexY = 5-temp_num;
                                }
                                else if (_words[this.map_temp.get(temp_word)] != _words[this.map_answer.get(temp_word)]) {
                                    bRight = false;
                                }
                            }
                        }
        
        
                        if (bRight) {
                            if(Global.isplaymusic){
                                cc.audioEngine.play(this.clip_idiom, false);
                            }
                            //console.log(`纵向 %d,%d is right`, start_[e], end_[e]);
                            // for(let i = start_[e]; i <= end_[e]; i++){
                            //     let temp_word = x * 10 + i;

                            //     cc.game.emit("idiomRight",_letters.get(temp_word));
                            // }
                            let k = end_[e]+1;
                            this.schedule(function() {
                                k--;
                                let temp_word = x * 10 + k;
                                if(_letters.has(temp_word)){
                                    var word_prefab = this.qipan.getChildByName(_letters.get(temp_word).toString()).getComponent("WordPrefab")
                                    word_prefab.IdiomRight(_letters.get(temp_word));
                                }
                            }, 0.1, 4, 0);
                            for(let i = start_[e]; i <= end_[e]; i++){
                                let temp_word = x * 10 + i;
                                let temp = _letters.get(temp_word);
                                wordindex = this.JudgeWord(_posx[temp],_posy[temp],temp_word,_index_letters);
                                if(wordindex){
                                    break;
                                }

                            }
                        }
                        else {
                            if (bFinish == false){
                                //console.log(`纵向 %d,%d is not finished`, start_[e], end_[e]);
                            }
                            else{
                                //console.log(`纵向 %d,%d is wrong`, start_[e], end_[e]);
                                if(Global.isplaymusic){
                                    cc.audioEngine.play(this.clip_error, false);
                                }
                                // if(this.loser ==null){
                                //     this.loser =  cc.instantiate(this.loserView);
                                //     this.node.addChild(this.loser);
                                // }
                                for(let i = start_[e]; i <= end_[e]; i++){
                                    let temp_word = x * 10 + i;
                                    if (this.map_temp.has(temp_word)){
                                        if(_words[this.map_temp.get(temp_word)] != _words[this.map_answer.get(temp_word)]){
                                            //this.loser.getComponent("LoserView").AddErrorWord(_letters.get(temp_word));
                                            cc.game.emit("idiomError",_letters.get(temp_word));
                                        }
                                    }
                                }
                            }   
                        }
                    }
                }
            }

            this.haveziArr[this.index] = 1;
            // 判断所在字 横的成语位置比竖的成语位置 那个靠前先填那个成语
            // if(indexX <= indexY){
                //如果位置相同 比如 玩x不x 和 欺xxx  都是第二个。再按存在字多的来填.也就是需要填字少的
                // 横着的需要填的字比竖着的少 也就是场上存在的多 或者当前字竖着没有成语
                if((map_tempHasX <= map_tempHasY || map_tempHasY == 0) && map_tempHasX!=0){
                    if(idiom_indexX && idiom_indexY){
                        if(indexX < indexY){
                            for (let i = 0; i < this.dataArr.answer.length; i++) {
                                if (this.dataArr.answer[i] == idiom_indexY) {
                                    this.index = i;
                                    break;
                                }
                            }
                        }else {
                            for (let i = 0; i < this.dataArr.answer.length; i++) {
                                if (this.dataArr.answer[i] == idiom_indexX) {
                                    this.index = i;
                                    break;
                                }
                            }
                        }
                    }else if(idiom_indexX && idiom_indexY == null){
                        for (let i = 0; i < this.dataArr.answer.length; i++) {
                            if (this.dataArr.answer[i] == idiom_indexX) {
                                this.index = i;
                                break;
                            }
                        }
                    }
                    else{
                        for (let i = 0; i < this.haveziArr.length; i++) {
                            if (this.haveziArr[i] == 0) {
                                this.index = i;
                                break;
                            }
                        }
                    }
                    // 竖着的需要填的字比竖着的少 也就是场上存在的多 或者当前字横着没有成语
                }else if( (map_tempHasX > map_tempHasY || map_tempHasX == 0) && map_tempHasY!=0){
                    if(idiom_indexY && idiom_indexX == null){
                        for (let i = 0; i < this.dataArr.answer.length; i++) {
                            if (this.dataArr.answer[i] == idiom_indexY) {
                                this.index = i;
                                break;
                            }
                        }
                    }else if(idiom_indexX && idiom_indexY){
                        if(indexX <= indexY){
                            for (let i = 0; i < this.dataArr.answer.length; i++) {
                                if (this.dataArr.answer[i] == idiom_indexY) {
                                    this.index = i;
                                    break;
                                }
                            }
                        }else{
                            for (let i = 0; i < this.dataArr.answer.length; i++) {
                                if (this.dataArr.answer[i] == idiom_indexX) {
                                    this.index = i;
                                    break;
                                }
                            }
                        }
                    }
                    else{
                        for (let i = 0; i < this.haveziArr.length; i++) {
                            if (this.haveziArr[i] == 0) {
                                this.index = i;
                                break;
                            }
                        }
                    }
                }else{
                    //当前完全且正确的成语每个字是否还有连接其他没填完的成语 光标优先去这些成语的位置
                    if(wordindex){
                        for (let i = 0; i < this.dataArr.answer.length; i++) {
                            if (this.dataArr.answer[i] == wordindex) {
                                this.index = i;
                                break;
                            }
                        }
                    }else{
                        for (let i = 0; i < this.haveziArr.length; i++) {
                            if (this.haveziArr[i] == 0) {
                                this.index = i;
                                break;
                            }
                        }
                    }
                }
            // }else{
            //     if(idiom_indexY){
            //         for (let i = 0; i < this.dataArr.answer.length; i++) {
            //             if (this.dataArr.answer[i] == idiom_indexY) {
            //                 this.index = i;
            //                 break;
            //             }
            //         }
            //     }else{
            //         for (let i = 0; i < this.haveziArr.length; i++) {
            //             if (this.haveziArr[i] == 0) {
            //                 this.index = i;
            //                 break;
            //             }
            //         }
            //     }
            // }
            // if (this.dataArr.answer[this.index]) {
                this.selectId = this.dataArr.answer[this.index];
                this.select.x = this.dataArr.posx[this.dataArr.answer[this.index]] * 75;
                this.select.y = this.dataArr.posy[this.dataArr.answer[this.index]] * 75;
            // }
            //判断2个map是否都一样（胜利条件）
            let winnum =0;
            for(let i=0;i<this.arr_answer.length;i++){
                if(this.map_temp.get(this.arr_answer[i]) !=-1){
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
                let nowtime = Math.floor((Date.now()-this.startTime)/1000);
                Global.AddGameLog(nowtime,this.tipscount,this.sharecount,Global.gamedata.data.data.lvl);
                Global.level = Global.gamedata.data.data.lvl;
                let win =  cc.instantiate(this.winView);
                this.node.addChild(win);
            }
        }, this);

        //点击棋盘上面字或者空白地方的监听 擦除或者选择 word_key map中key
        cc.game.on("showWord", function (index, id, word_key) {
            this.index = index;
            this.haveziArr[index] = 0;
            // console.log("word_key:" + word_key);
            
            if (this.map_temp.has(word_key) && this.map_temp.get(word_key) != -1) {
                this.map_temp.set(word_key, -1);
            }

            for (let i = 0; i < this.clickcontent.children.length; i++) {
                if (this.clickcontent.children[i].name == id) {
                    //this.clickcontent.children[i].opacity = 255;
                    this.clickcontent.children[i].getComponent("ClickWordPrefab").ChangeState();
                }
            }

            this.selectId = this.dataArr.answer[this.index];
            this.select.x = this.dataArr.posx[this.dataArr.answer[this.index]] * 75;
            this.select.y = this.dataArr.posy[this.dataArr.answer[this.index]] * 75;
        }, this);

        if(CC_WECHATGAME){
            if(Global.level>10){
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
                game_jump.x = parseInt(jumpIndexArr[ranindex]/10) * 75 +37;
                game_jump.y = jumpIndexArr[ranindex]%10 * 75 +37;
                let src = game_jump.getComponent(require("JumpAppScript"));
                let src_index = Math.floor(Math.random()*Global.jumpappObject.length);
                if(src){
                    if (src) {
                        src.index = src_index;
                    }
                    src.sprite.spriteFrame = Global.jumpappObject[src_index].sprite;
                }
                this.qipan.addChild(game_jump);
            }

            if(Global.level >=30){
                this.tuijian.active = true;
                this.ruhewan.active = false;
                let rantuijian = Math.floor(Math.random()*Global.jumpappObject.length);
                let _tuijian = this.tuijian.getComponent(require("JumpAppScript"))
                _tuijian.index = rantuijian;
                _tuijian.sprite.spriteFrame = Global.jumpappObject[_tuijian.index].sprite;
            }
        }
        cc.director.preloadScene("start", function () {
            cc.log("预加载开始scene");
        });
    },
    //判断字的横竖是否有成语 
    JudgeWord(x,y,word_key,_index_letters){
        let wordindex = null;
        { 
            let count_ = 0;
            let start_ = 0;
            let end_ = 0;
            for (let i = 0; i < 9; i++) {
                let temp_word = i * 10 + y;
                let temp_cha = Math.abs(word_key - temp_word);
                if (_index_letters.has(temp_word)&& (temp_cha>=0 && temp_cha<=30)) {
                    count_ += 1;
                }
                else { 
                    count_ = 0;
                }
    
                if (count_ == 4) {
                    end_    = i;
                    start_  = i- 3;
                }
            }
            if (end_ - start_ == 3) {
                // console.log("横着有成语",start_,end_)
                //横向的已经找出 判断是否已经填写满，或者是否正确
                for (let i = start_; i <= end_; i++) {
                    let temp_word = i * 10 + y;
                    // console.log("横word",temp_word,this.map_temp);
                    if (this.map_temp.has(temp_word)) {
                        if (this.map_temp.get(temp_word) == -1) {
                            wordindex = this.map_answer.get(temp_word);
                            // console.log("横着有没填完的",this.map_answer.get(temp_word));
                            break;
                        }
                    }
                }
            }
        }
        {
            let count_ = 0;
            let start_ = 0;
            let end_ = 0;
            for (let i = 0; i < 9; i++) {
                let temp_word = x*10 + i;
                let temp_cha = Math.abs(word_key - temp_word);
                if (_index_letters.has(temp_word)&& (temp_cha>=0 && temp_cha<=3)) {
                    count_ += 1;
                }
                else {
                    count_ = 0;
                }

                if (count_ == 4) {
                    end_   = i;
                    start_  = i- 3;
                }
            }
            if (end_ - start_ == 3) {
                // console.log("竖着有成语",start_,end_)
                for (let i = start_; i <= end_; i++) {
                    let temp_word = x*10 + i;
                    // console.log("竖word",temp_word,this.map_temp);
                    if (this.map_temp.has(temp_word)) {
                        if (this.map_temp.get(temp_word) == -1) {
                            wordindex = this.map_answer.get(temp_word);
                            // console.log("竖着有没填完的",this.map_answer.get(temp_word));
                        }
                    }
                }
            }
        }
        return wordindex;
    },
    //提示 自动填充一个正确答案
    OneRightKey(){
        for (let i = 0; i < this.clickcontent.children.length; i++) {
            if (this.clickcontent.children[i].name == this.dataArr.answer[this.index]) {
                this.clickcontent.children[i].active = false;
            }
        }
        cc.game.emit("clickWord",this.dataArr.answer[this.index],this.rightKeywords[this.dataArr.answer[this.index]]);
        Global.ShowTip(this.node, "已成功获取一个提示");
    },
    BackBtn() {
        if(Global.isplaymusic){
            cc.audioEngine.play(Global.clip_btnclick, false);
        }
        cc.director.loadScene("start.fire");
    },
    //如何玩
    guideBtn() {
        if(Global.isplaymusic){
            cc.audioEngine.play(Global.clip_btnclick, false);
        }
        wx.aldSendEvent("答题页_如何玩");
        let guide = cc.instantiate(this.guideview);
        if (guide) {
            this.node.addChild(guide);
        }
    },
    //提示按钮(点击后进入好友分享页面，分享成功自动填充一个正确答案，分享失败进入15s视频播放页面，播放成功自动填充一个正确答案)
    shareBtn() {
        wx.aldSendEvent("答题页_提示");
        if(Global.tips >0){
            Global.tips--;
            this.tipscount++;
            this.OneRightKey();
            if(Global.tips>0){
                this.tipsnum.active = true;
                this.tipsnum.getChildByName("number").getComponent(cc.Label).string = Global.tips;
            }else{
                this.tipsnum.active = false;
            }
        }else{
            this.sharecount++;
            wx.aldSendEvent('分享',{'分享功能' : '答题页_提示'});
            this.isShared = true;
            this.shareTag = "keys";
            this.closeTime = new Date().getTime();
            Global.ShareApp();
        }
    },
    _updaetSubDomainCanvas () {
        if (!this.tex) {
            return;
        }
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;

        this.tex.initWithElement(sharedCanvas);
        this.display.spriteFrame = new cc.SpriteFrame(this.tex);
    },
    update (dt) {
        this._updaetSubDomainCanvas();
    },
    /**
     * 循环切换广告图片的方法
     */
    ChangeJumpAppSelectSprite() {
        let sprite = this.gglunbo.getComponent(cc.Sprite);
        this.gglunbo.index = Math.floor(Math.random()*3);
        this.gglunbo.on("touchend", this.TouchEnd, this);
        if(Global.jumpappObject[this.gglunbo.index].lunbo!=null){
            sprite.spriteFrame = Global.jumpappObject[this.gglunbo.index].lunbo;
        }else{
            sprite.spriteFrame = Global.jumpappObject[this.gglunbo.index].sprite;
        }
    },
    TouchEnd(event) {
        event.stopPropagation();
        if (CC_WECHATGAME) {
            wx.navigateToMiniProgram({
                appId: Global.jumpappObject[event.target.index].apid,
                path: Global.jumpappObject[event.target.index].path,
                success: function (res) {
                    // 上线前注释console.log(res);
                },
                fail: function (res) {
                    // 上线前注释console.log(res);
                },
            });
        }
    },
});
