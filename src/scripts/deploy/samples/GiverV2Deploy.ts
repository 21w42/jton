import {KeyPair} from '@tonclient/core/dist/modules'
import {Contract} from '../../../contract'
import {GiverV2} from '../../../contracts'
import {Deploy} from '../Deploy'

export class GiverV2Deploy extends Deploy {
    /**
     * Create and return contract object.
     * @param keys {KeyPair}
     * Example:
     *     {
     *         public: '0x123...',
     *         secret: '0x456...'
     *     }
     * @return {Contract}
     */
    protected _getContract(keys: KeyPair): Contract {
        return new GiverV2(this._client, this._config.net.timeout, keys)
    }

    /**
     * Deploy contract.
     * @param contract {Contract}
     */
    protected async _deploy(contract: GiverV2): Promise<void> {
        await contract.deploy()
    }
}