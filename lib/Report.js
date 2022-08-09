import {tokenKey,projectKey} from '../index'

class Report{

    constructor() {
    }

    reportAddress = 'http://hts0000.top:3001'

    gather(data,type){
        const extraData = {
            projectKey,
            title: document.title,
            url: location.href,
            timestamp: Date.now(),
            cookie:document.cookie || localStorage.getItem(tokenKey)
        }
        let postData = {...data,...extraData}
        switch (type){
            case 'jsError':
                this.send({...postData},'jserror')
                break;
            case 'apiError':
                this.send({...postData},'apierror')
                break;
            case 'sourceError':
                this.send({...postData},'sourceerror')
                break;
            case 'performance':
                this.send({...postData},'performance')
                break;
        }
        console.log(postData)
    }

    send(data = {},type){
        let body = JSON.stringify(data)
        let xhr = new XMLHttpRequest;
        xhr.open('POST', `${this.reportAddress}/api/reporter/${type}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');//请求体类型
        xhr.setRequestHeader('x-log-apiversion', '0.1.0');//版本号
        xhr.setRequestHeader('x-log-bodyrawsize', body.length);//请求体的大小
        xhr.onload = function () {
            // console.log(this.xhr.response);
        }
        xhr.onerror = function (error) {
            //console.log(error);
        }
        xhr.send(JSON.stringify(data));
    }
}
export default Report
