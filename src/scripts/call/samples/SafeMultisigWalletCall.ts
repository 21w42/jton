import {Call} from '../Call'
import {CallConfig} from '../interfaces/CallConfig'
import {AbiContract, KeyPair} from '@tonclient/core/dist/modules'
import {Contract} from '../../../contract'
import {StringMap} from '../../../types'
import {GiverSendEnum} from './GiverSendEnum'
import {readAbi} from '../readers/readAbi'
import {readInt} from '../readers/readInt'
import {readBoolean} from '../readers/readBoolean'
import {readJson} from '../readers/readJson'
import {SafeMultisigWallet} from '../../../samples'
import {SafeMultisigWalletCallEnum} from './SafeMultisigWalletCallEnum'

export class SafeMultisigWalletCall extends Call {
    /**
     * @param config
     * Example:
     *     {
     *         net: {
     *             url: 'http://localhost',
     *             timeout: 30_000
     *         },
     *         locale: 'EN',
     *         keys: `${__dirname}/../library/keys/GiverV2.se.keys.json`
     *     }
     */
    constructor(config: CallConfig) {
        super(config, Object.values(SafeMultisigWalletCallEnum))
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
        return new SafeMultisigWallet(this._client, this._config.net.timeout, keys)
    }

    /**
     * Create and return target contract object.
     * @param map
     * Example:
     *     {
     *         address: '0:0000111122223333444455556666777788889999aaaabbbbccccddddeeeeffff'
     *     }
     */
    protected _getTargetContract(map: StringMap): Contract {
        return new Contract(this._client, this._config.net.timeout, {
            abi: {},
            address: map[GiverSendEnum.ADDRESS]
        })
    }

    /**
     * Call the public method with an external message.
     * @param contract A contract on which we call the public method with an external message.
     * @param keys
     * Example:
     *     {
     *         public: '0x0000111122223333444455556666777788889999aaaabbbbccccddddeeeeffff',
     *         secret: '0x0000000011111111222222223333333344444444555555556666666677777777'
     *     }
     * @param map
     * Example:
     *     {
     *         address: '0:0000111122223333444455556666777788889999aaaabbbbccccddddeeeeffff ',
     *         value: '1_000_000_000',
     *         bounce: 'false'
     *     }
     */
    protected async _call(contract: SafeMultisigWallet, map: StringMap, keys: KeyPair): Promise<void> {
        const address: string = map[SafeMultisigWalletCallEnum.ADDRESS]
        const value: number = readInt(map[SafeMultisigWalletCallEnum.VALUE])
        const bounce: boolean = readBoolean(map[SafeMultisigWalletCallEnum.BOUNCE])
        const flags: number = readInt(map[SafeMultisigWalletCallEnum.FLAGS])
        const abi: AbiContract = readAbi(map[SafeMultisigWalletCallEnum.PATH_TO_ABI])
        const method: string = map[SafeMultisigWalletCallEnum.METHOD]
        const input: Object = readJson(map[SafeMultisigWalletCallEnum.PARAMETERS])
        await contract.callAnotherContract(address, value, bounce, flags, abi, method, input, keys)
    }
}