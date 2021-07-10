import {NetConfig} from '../../../config'

export interface InfoConfig {
    net: NetConfig
    locale: string | undefined
    keys: string
}