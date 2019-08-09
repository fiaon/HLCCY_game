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
        pageView:cc.PageView,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
         //一共多少页
         this.count = this.pageView.getPages().length;        
         
    },
    leftBtn(){
        //取当前页下序号 
        let index = this.pageView.getCurrentPageIndex();
        if(index>0){
            index -=1;
            //执行切换                
           this.pageView.scrollToPage(index, 1);
        }
    },
    rightBtn(){
        //取当前页下序号 
        let index = this.pageView.getCurrentPageIndex();
        if(index<this.count){
            index +=1;
            //执行切换                
           this.pageView.scrollToPage(index, 1);
        }
    },
    closeBtn(){
        this.node.destroy();
    },
    // update (dt) {},
});
