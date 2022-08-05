import jsError from './lib/jsError'
import OnLoad from './lib/onLoad'



const tokenKey = 'token'
const projectKey = "1245643154"

const jsErr= new jsError()
jsErr.jsHandleError()
jsErr.promiseHandleError()

const onload = new OnLoad()
// onload.PV()
onload.record()

export {
    tokenKey,
    projectKey
}
