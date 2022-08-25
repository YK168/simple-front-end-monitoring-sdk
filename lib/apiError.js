import Report from './Report'
import config from "../config";

class ApiError{
    report = new Report();

    apiHandleError(){
        const self = this
        let XMLHttpRequest = window.XMLHttpRequest;

        // 拿到原生的open方法
        let oldOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url, async) {

            // 过滤一些请求，将请求的method, url, async拿到保存起来
            if (!url.match(/logstores/) && !url.match(/sockjs/)) {
                this.logData = { method, url, async };
            }
            // 执行原生方法
            return oldOpen.apply(this, arguments);
        }
        // 拿到原生的send方法
        let oldSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function (body) {
            // console.log(this.logData.url.indexOf(config.reportAddress))
            // console.log(this.logData.url)
            // console.log(config.reportAddress)
            if (this.logData && this.logData.url.indexOf(config.reportAddress) == -1) {
                let startTime = Date.now();//在发送之前记录一下开始的时间


                // 无论请求成功还是失败都将数据保存，具体看情况
                let handler = (type) => (event) => {
                    let duration = Date.now() - startTime;
                    let status = this.status;//200 500
                    let statusText = this.statusText;// OK Server Error
                    let xhrInfo = {
                        kind: 'stability',
                        type: 'xhr',
                        eventType: type,//load error abort
                        pathname: this.logData.url,//请求路径
                        status: status + '-' + statusText,//状态码
                        duration,//持续时间
                        response: this.response ? JSON.stringify(this.response) : '',//响应体
                        params: body || ''
                    }
                    self.report.gather({xhrInfo},'apiError')
                }

                // 请求的各种状态
                this.addEventListener('load', handler('load'), false); // 请求正常结束
                this.addEventListener('error', handler('error'), false); // 请求error
                this.addEventListener('abort', handler('abort'), false);
            }
            // 执行原生方法
            return oldSend.apply(this, arguments);
        }
    }
}

export default ApiError
