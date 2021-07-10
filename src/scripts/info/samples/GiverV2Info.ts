import {Info} from '../Info'
import {KeyPair} from '@tonclient/core/dist/modules'
import {Contract} from '../../../contract'
import {GiverV2} from '../../../contracts'

export class GiverV2Info extends Info {
    /**
     * Create and return contract object.
     * @param keys {KeyPair}
     * Example:
     *     {
     *         public: '0x123...',
     *         secret: '0x456...'
     *     }
     */
    protected _getContract(keys: KeyPair): Contract {
        return new GiverV2(this._client, this._config.net.timeout, keys)
    }
}