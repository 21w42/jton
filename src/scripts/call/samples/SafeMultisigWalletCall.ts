import {Call} from '../Call'
import {CallConfigInterface} from '../interfaces/CallConfigInterface'
import {AbiContract, KeyPair} from '@tonclient/core/dist/modules'
import {Contract} from '../../../contract'
import {StringMap} from '../../../types'
import {GiverSendEnum} from './GiverSendEnum'
import {readInt} from '../readers/readInt'
import {readBoolean} from '../readers/readBoolean'
import {SafeMultisigWallet} from '../../../contracts'
import fs from 'fs'
import {SafeMultisigWalletCallEnum} from './SafeMultisigWalletCallEnum'

export class SafeMultisigWalletCall extends Call {
    /**
     * @param config {InfoConfigInterface}
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
    constructor(config: CallConfigInterface) {
        super(config, Object.values(SafeMultisigWalletCallEnum))
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
        return new SafeMultisigWallet(this._client, this._config.net.timeout, keys)
    }

    /**
     * Create and return target contract object.
     * @param map {StringMap}
     * Example:
     *     {
     *         address: '0x1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff'
     *     }
     */
    protected _getTargetContract(map: StringMap): Contract {
        return new Contract(this._client, this._config.net.timeout,{
            abi: {},
            address: map[GiverSendEnum.ADDRESS]
        })
    }

    /**
     * Call the public method with an external message.
     * @param contract {Contract} A contract on which we call the public method with an external message.
     * @param keys {KeyPair}
     * Example:
     *     {
     *         public: '0x123...',
     *         secret: '0x456...'
     *     }
     * @param map {StringMap}
     * Example:
     *     {
     *         address: '0x123... ',
     *         value: '1_000_000_000',
     *         bounce: 'false'
     *     }
     */
    protected async _call(contract: SafeMultisigWallet, map: StringMap, keys: KeyPair): Promise<void> {
        const address: string = map[SafeMultisigWalletCallEnum.ADDRESS]
        const value: number = readInt(map[SafeMultisigWalletCallEnum.VALUE])
        const bounce: boolean = readBoolean(map[SafeMultisigWalletCallEnum.BOUNCE])
        const flags: number = readInt(map[SafeMultisigWalletCallEnum.FLAGS])
        const pathToAbi: string = map[SafeMultisigWalletCallEnum.PATH_TO_ABI]
        const method: string = map[SafeMultisigWalletCallEnum.METHOD]
        const parameters: string = map[SafeMultisigWalletCallEnum.PARAMETERS]
        const input: Object = JSON.parse(parameters)
        const text: string = fs.readFileSync(pathToAbi, { encoding: 'utf8'})
        const abi: AbiContract = JSON.parse(text)
        await contract.callAnotherContract(address, value, bounce, flags, abi, method, input, keys)
    }
}