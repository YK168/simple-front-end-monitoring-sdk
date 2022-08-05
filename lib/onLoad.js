import Report from './Report'
import {Dep,Watch} from '../utils/Dep'

const addHistoryMethod= (function(){
    var historyDep = new Dep()// 创建订阅池
    return function (name,fn){
        if(name==='historyChange'){
            var event = new Watch(name,fn);
            Dep.watch = event;
            historyDep.defined();//增加订阅者
            Dep.watch = null;
        }else if(name==='pushState'||name==='replaceState'){
            var method = history[name];
            return function(){
                method.apply(history,arguments)
                historyDep.notify();
            }
        }
    }
})()

class OnLoad{

    report = new Report();

    constructor() {
    }

    PV(){
        const self = this
        let postData = {
            errorType: 'pv',//JS执行错误
        }
        self.report.gather(postData)
    }

    record(){
        let recordFunc = (e) => {
            // this.PV()
            this.getTiming();
            this.whiteScreenError()
        };
        let recodPvFunc = (e)=>{
            this.PV()
        }
        let recordTimingFunc = (e) => {
            this.getTiming();
        }
        // window.addHistoryListener = addHistoryMethod('historyChange',recordFunc)
        // history.pushState =  addHistoryMethod('pushState');
        // // history.replaceState =  addHistoryMethod('replaceState')
        // window.removeEventListener("unload", recordFunc);
        // window.addEventListener("unload", recordFunc);

        window.addHistoryListener = addHistoryMethod('historyChange',recodPvFunc)
        history.pushState =  addHistoryMethod('pushState');
        // history.replaceState =  addHistoryMethod('replaceState')
        window.removeEventListener("load", recordFunc);
        window.addEventListener("load", recordFunc);
    }


    /**
     * 页面性能计算
     *  analysisTime: 1825, //解析dom树耗时
         appcacheTime: 0,  //DNS 缓存时间
         blankTime: 8, //白屏时间
         dnsTime: 0, //DNS 查询时间
         domReadyTime: 53, //domReadyTime
         loadPage: 1878, //页面加载完成的时间
         redirectTime: 0, //重定向时间
         reqTime: 8, //请求时间
         tcpTime: 0, //tcp连接耗时
         ttfbTime: 1, //读取页面第一个字节的时间
         unloadTime: 0, //卸载页面的时间
     */
    getTiming(){
        const self = this
        try {
            if(!window.performance || !window.performance.timing){
                console.log('你的浏览器不支持 performance 操作');
                return;
            }
            var t = window.performance.timing;
            var times = {};
            var loadTime = t.loadEventEnd - t.loadEventStart;
            if(loadTime < 0) {
                setTimeout(function(){
                    self.getTiming();
                }, 200);
                return;
            }
            //【重要】重定向的时间
            times.redirectTime = (t.redirectEnd - t.redirectStart).toFixed(2);
            //【重要】DNS 查询时间
            //【原因】DNS 预加载做了么？页面内是不是使用了太多不同的域名导致域名查询的时间太长？
            times.dnsTime = (t.domainLookupEnd - t.domainLookupStart).toFixed(2);
            //【重要】读取页面第一个字节的时间
            //【原因】这可以理解为用户拿到你的资源占用的时间，加异地机房了么，加CDN 处理了么？加带宽了么？加 CPU 运算速度了么？
            times.ttfbTime = (t.responseStart - t.navigationStart).toFixed(2);
            //DNS 缓存时间
            times.appcacheTime = (t.domainLookupStart - t.fetchStart).toFixed(2);
            //卸载页面的时间
            times.unloadTime = (t.unloadEventEnd - t.unloadEventStart).toFixed(2);
            //tcp连接耗时
            times.tcpTime = (t.connectEnd - t.connectStart).toFixed(2);
            //【重要】内容加载完成的时间
            //【原因】页面内容经过 gzip 压缩了么，静态资源 css/js 等压缩了么？
            times.reqTime = (t.responseEnd - t.responseStart).toFixed(2);
            //解析dom树耗时
            times.analysisTime = (t.domComplete - t.domInteractive).toFixed(2);
            //白屏时间
            times.blankTime = (t.domLoading - t.navigationStart).toFixed(2);
            //domReadyTime
            times.domReadyTime = (t.domContentLoadedEventEnd - t.navigationStart).toFixed(2);
            //【重要】页面加载完成的时间
            //【原因】这几乎代表了用户等待页面可用的时间
            times.loadPageTime = (t.loadEventEnd - t.navigationStart).toFixed(2);
            self.report.gather({times})

        } catch(e) {
            console.log(e)
        }
    }

    whiteScreenError(){
        const self = this
        setTimeout(()=>{
            let monitorWhiteScreenNode = document.querySelector('#app');
            if (!monitorWhiteScreenNode) {
                monitorWhiteScreenNode = document.querySelector('#whiteScreen');
            }
            console.log(monitorWhiteScreenNode.innerHTML)
            if (monitorWhiteScreenNode) {
                try {
                    if (!(/\w/.test(monitorWhiteScreenNode.innerHTML))) {
                        // 重要节点没有内容
                        self.report.gather({whiteError:true})
                    }
                } catch (err) {
                }
            }
        },12000)
    }
}
export default OnLoad;
