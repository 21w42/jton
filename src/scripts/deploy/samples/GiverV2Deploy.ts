import {KeyPair} from '@tonclient/core/dist/modules'
import {Contract} from '../../../contract'
import {GiverV2} from '../../../contracts'
import {Deploy} from '../Deploy'

export class GiverV2Deploy extends Deploy {
    /**
     * Create and return contract object.
     * @param keys
     * Example:
     *     {
     *         public: '0x0000111122223333444455556666777788889999aaaabbbbccccddddeeeeffff',
     *         secret: '0x0000000011111111222222223333333344444444555555556666666677777777'
     *     }
     */
    protected _getContract(keys: KeyPair): Contract {
        return new GiverV2(this._client, this._config.net.timeout, keys)
    }

    /**
     * Deploy contract.
     * @param contract
     */
    protected async _deploy(contract: GiverV2): Promise<void> {
        await contract.deploy()
    }
}