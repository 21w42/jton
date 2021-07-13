import {TestGiverV2Kit} from './TestGiverV2Kit'
import {Config} from '../../../../config'
import {StringMap} from '../../../../types'
import {prepare} from '../../../../scripts'
import {GiverV2} from '../GiverV2'

export function prepareGiverV2(config: Config, keysMap: StringMap): TestGiverV2Kit {
    const {client, timeout, giverKeys} = prepare(config, keysMap)
    return {
        client: client,
        timeout: timeout,
        giver: new GiverV2(client, timeout, giverKeys)
    }
}