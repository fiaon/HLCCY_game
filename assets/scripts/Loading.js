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
        progressBar: {
            default: null,
            type: cc.ProgressBar,
        },
        loadtext:{
            default:null,
            type:cc.Label,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.LaunchData = JSON.stringify(wx.getLaunchOptionsSync());
        // // 上线前注释console.log("LaunchData=====", this.LaunchData);

        this.LaunchData_json = JSON.parse(this.LaunchData);
        // // 上线前注释console.log("LaunchData_json=====", this.LaunchData_json);

        this.sceneValue = this.LaunchData_json.scene;
        // // 上线前注释console.log("sceneValue=====", this.sceneValue);

        this.queryValue = this.LaunchData_json.query;
        // 上线前注释console.log("queryValue===分享ID==", this.queryValue);

        if (this.queryValue) {
            // // 上线前注释
            if (this.LaunchData_json['query']['introuid']) {
                Global.Introuid = this.LaunchData_json['query']['introuid'];
            }
            if(this.LaunchData_json['query']['app_data']){
                Global.app_data = this.LaunchData_json['query']['app_data'];
                console.log("ceshi-1",this.LaunchData_json['query']['app_data']);
            }
        }
    },

    start () {
        this.progressBar.progress = 0;
        if (CC_WECHATGAME) {
            var self = this;
            wx.login({
                success(res) {
                    // 上线前注释console.log("登录成功 == ", res);
                    self.code = res.code;
                    let parme = {};
                    if(Global.app_data){
                        console.log("app_data存在")
                        parme = {
                            appid: Global.appid,
                            code: self.code,
                            introuid: Global.Introuid,
                            appdata:Global.app_data,
                        };
                    }else{
                        console.log("app_data不存在")
                        parme = {
                            appid: Global.appid,
                            code: self.code,
                            introuid: Global.Introuid,
                            appdata:"",
                        };
                    }
                    // Global.Post(url, parme);
                    console.log("登陆参数",parme);
                    Global.UserLogin(parme);
                    self.loadRemoteAssets();
                }
            });
        }
        
        //this.loadRemoteAssets();
    },
    /**
    * 加载远程资源
    * wx.env.USER_DATA_PATH： 这个是小游戏在手机上的临时目录
    **/
   loadRemoteAssets () {
    const self = this
    const fs = wx.getFileSystemManager()  // 获取微信小游戏sdk中的 文件系统
    // 然后
    const downloadTask = wx.downloadFile({
        url: 'https://img.zaohegame.com/staticfile/wxfa819a83fa221978/res/raw-assets.zip',  // 我们上传到服务器的资源文件压缩包地址
        header: {
            'content-type': 'application/json'
        },
        filePath: '',
        success: function (res){    // 资源下载成功以后，我们将文件解压到小游戏的运行目录
            console.log('资源下载成功', res)
            let zip_res = res.tempFilePath
            fs.unzip({
                zipFilePath: zip_res,
                targetPath: wx.env.USER_DATA_PATH + '/res/',
                success: function (result) {
                    console.log('解压缩成功---', result)
                    wx.setStorageSync('downloaded', true)
                    // self.MainScene.init()       // 解压成功以后再让主场景初始化数据
                    // setTimeout(() => {
                    //     self.hideLoading()
                    // }, 700)
                    cc.director.loadScene("start.fire");
                }
            })
        },
        fail: function(err){
            console.error('资源下载失败', err)
        },
        complete: function (res) {
            console.log('资源下载 complete')

        }
    })
    if (downloadTask) {     // 资源下载的时候，在界面上展示下载的进度，让用户能感知游戏进程
        downloadTask.onProgressUpdate(function(res){
            self.progressBar.progress = res.progress / 100
            self.loadtext.string = res.progress + '%'
        })
    }
},
    // update (dt) {},
});
