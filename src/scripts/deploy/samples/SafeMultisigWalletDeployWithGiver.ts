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
     * @param keys {KeyPair}
     * Example:
     *     {
     *         public: '0x123...',
     *         secret: '0x456...'
     *     }
     */
    protected _getContract(keys: KeyPair): Contract {
        this._keys = keys
        return new SafeMultisigWallet(this._client, this._config.net.timeout, keys)
    }

    /**
     * Deploy contract.
     * @param contract {Contract}
     */
    protected async _deploy(contract: SafeMultisigWallet): Promise<void> {
        await contract.deploy([Hex.x0(this._keys.public)], 1)
    }
}