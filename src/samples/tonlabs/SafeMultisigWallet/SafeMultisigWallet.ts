import {Contract} from '../../../contract'
import SafeMultisigWalletContract from './code/SafeMultisigWallet'
import {AbiContract, KeyPair, ResultOfProcessMessage} from '@tonclient/core/dist/modules'
import {TonClient} from '@tonclient/core'

/**
 * @see https://github.com/tonlabs/ton-labs-contracts/tree/master/solidity/safemultisig
 */
export class SafeMultisigWallet extends Contract {
    public static readonly EXTERNAL = {
        acceptTransfer: 'acceptTransfer'
    }

    /**
     * @param client
     * @param timeout
     * Examples:
     *     3000
     *     30000
     *     60000
     * @param keys
     * Example:
     *     {
     *         public: '0x0000111122223333444455556666777788889999aaaabbbbccccddddeeeeffff',
     *         secret: '0x0000000011111111222222223333333344444444555555556666666677777777'
     *     }
     */
    constructor(client: TonClient, timeout: number, keys: KeyPair) {
        super(client, timeout, {
            abi: SafeMultisigWalletContract.abi,
            tvc: SafeMultisigWalletContract.tvc,
            initialData: {},
            keys: keys
        })
    }


    /**********
     * DEPLOY *
     **********/
    /**
     * @param config
     * Example:
     *     {
     *         owners: [
     *            '0x0000111122223333444455556666777788889999aaaabbbbccccddddeeeeffff',
     *            '0x0000000011111111222222223333333344444444555555556666666677777777'
     *        ],
     *        reqConfirms: 1
     *     }
     */
    public async deploy(
        config: {
            owners: string[] | number[],
            reqConfirms: number
        }
    ): Promise<boolean> {
        return await super.deploy(config)
    }


    /**********
     * PUBLIC *
     **********/
    public async callAnotherContract(
        dest: string,
        value: number,
        bounce: boolean,
        flags: number,
        abi: AbiContract,
        method: string,
        input: Object,
        keys?: KeyPair
    ): Promise<ResultOfProcessMessage> {
        const payload: string = await this._getPayloadToCallAnotherContract(abi, method, input)
        return await this.sendTransaction(
            {
                dest,
                value,
                bounce,
                flags,
                payload
            },
            keys
        )
    }

    public async sendTransactionWithComment(
        dest: string,
        value: number,
        bounce: boolean,
        flags: number,
        comment: string,
        keys?: KeyPair
    ): Promise<ResultOfProcessMessage> {
        const payload: string = await this._getPayloadToTransferWithComment(comment)
        return await this.sendTransaction(
            {
                dest,
                value,
                bounce,
                flags,
                payload
            },
            keys
        )
    }

    public async sendTransaction(
        input: {
            dest: string,
            value: number,
            bounce: boolean,
            flags: number,
            payload: string
        },
        keys?: KeyPair
    ): Promise<ResultOfProcessMessage> {
        return await this.call('sendTransaction', input, keys)
    }
}