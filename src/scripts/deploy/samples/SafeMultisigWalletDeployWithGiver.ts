import {KeyPair} from '@tonclient/core/dist/modules'
import {Contract} from '../../../contract'
import {DeployWithGiver} from '../DeployWithGiver'
import {SafeMultisigWallet} from '../../../contracts'
import {Hex} from '../../../utils'

export class SafeMultisigWalletDeployWithGiver extends DeployWithGiver {
    private _keys: KeyPair = {
        public: '',
        secret: ''
    }

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
        this._keys = keys
        return new SafeMultisigWallet(this._client, this._config.net.timeout, keys)
    }

    /**
     * Deploy contract.
     * @param contract
     */
    protected async _deploy(contract: SafeMultisigWallet): Promise<void> {
        await contract.deploy([Hex.x0(this._keys.public)], 1)
    }
}