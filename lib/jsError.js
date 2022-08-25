import Report from './Report'

class JsError {

    report = new Report();

    constructor(){

    }

    /**
     * 监听js报错
     */
    jsHandleError(){
        const self = this
        window.addEventListener('error', function (event) {
            // console.log(event)
            //这是一个脚本加载错误
            if (event.target && (event.target.src || event.target.href)) {
                let postData = {
                    errorType: 'resourceError',//js或css资源加载错误
                    filename: event.target.src || event.target.href,//哪个文件报错了
                    tagName: event.target.tagName,//SCRIPT
                }
                self.report.gather(postData,'sourceError')
            } else {// js执行错误
                // let errPageInfo = event.error.stack.split('at')[1].split("?")
                // let errPageLength = errPageInfo.length-1
                // let errPage = errPageInfo[errPageLength-1]
                //
                // let tg = /\d+:\d+/
                // let errPagePosition = tg.exec(errPageInfo[errPageLength])

                let postData = {
                    errorType: 'jsError',//JS执行错误
                    message: event.message,//报错信息
                    filename: event.filename,//哪个文件报错了
                    position: `${event.lineno}:${event.colno}`,// 报错代码的行列
                }
                // console.log("jsError",self.test)
                self.report.gather(postData,'jsError')
            }
        },true)
    }

    /**
     * Promise
     */
    promiseHandleError(){
        const self = this
        window.addEventListener('unhandledrejection', function (event) {
            // console.log(event)
            let message;
            let filename;
            let line = 0;
            let column = 0;
            let position;
            let stack = '';
            let reason = event.reason;
            if (typeof reason === 'string') {
                message = reason;
            } else if (typeof reason === 'object') {//说明是一个错误对象
                message = reason.message;

                if (reason.stack) {
                    let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
                    filename = matchResult[1];
                    line = matchResult[2];
                    column = matchResult[3];
                    // let errPageInfo = reason.stack.split('at')[1].split("?")
                    // let errPageLength = errPageInfo.length-1
                    // let errPage = errPageInfo[errPageLength-1]
                    //
                    // let tg = /\d+:\d+/
                    // let errPagePosition = tg.exec(errPageInfo[errPageLength])
                    // filename = errPage;
                    // position = errPagePosition[0]
                }

            }
            let postData = {
                errorType: 'promiseError',//JS执行错误
                message,//报错信息
                filename,//哪个文件报错了
                position: position,
            }
            self.report.gather(postData,'jsError')
        },true)
    }
}
export default JsError;
