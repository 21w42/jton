import {NetConfig} from '../../../config'

export interface CallConfig {
    net: NetConfig
    locale: string | undefined
    keys: string
}