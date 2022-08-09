import jsError from './lib/jsError'
import OnLoad from './lib/onLoad'
import ApiError from './lib/apiError'
import config from "./config";


const tokenKey = config.tokenKey
const projectKey = config.projectKey

const jsErr= new jsError()
jsErr.jsHandleError()
jsErr.promiseHandleError()

const onload = new OnLoad()
// onload.PV()
onload.record()

const apiError = new ApiError()
apiError.apiHandleError()

export {
    tokenKey,
    projectKey
}
