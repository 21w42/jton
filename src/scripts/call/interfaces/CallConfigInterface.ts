import {NetConfigInterface} from '../../../config'

export interface CallConfigInterface {
    net: NetConfigInterface
    locale: string | undefined
    keys: string
}