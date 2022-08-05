import {tokenKey,projectKey} from '../index'

class Report{

    constructor() {
    }

    gather(data){
        const extraData = {
            projectKey,
            title: document.title,
            url: location.href,
            timestamp: Date.now(),
            cookie:document.cookie || localStorage.getItem(tokenKey)
        }
        let postData = {...data,...extraData}
        console.log(postData)
    }
}
export default Report
