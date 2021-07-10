import {NetConfigInterface} from '../../../config'

export interface InfoConfigInterface {
    net: NetConfigInterface
    locale: string | undefined
    keys: string
}