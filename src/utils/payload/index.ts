import {AbiContract} from '@tonclient/core/dist/modules'
import transferAbi from '../../contract/abi/transfer.abi.json'
import {stringToHex} from '../hex'
import {TonClient} from '@tonclient/core'

/**
 * Generates payload for transfer with comment.
 * @param client
 * @param comment
 * Example:
 *     'for homeless'
 */
export async function getPayloadToTransfer(client: TonClient, comment: string = ''): Promise<string> {
    return getPayload(client, transferAbi, 'transfer', {comment: stringToHex(comment)})
}

/**
 * Creates payload for call another contract.
 * @param client
 * @param abi
 * Example:
 *     {'ABI version': 2, '...'}
 * @param method
 * Example:
 *     'bet'
 * @param input
 * Example:
 *     {
 *         value: 1_000_000_000,
 *         luckyNumber: 50
 *     }
 */
export async function getPayload(
    client: TonClient,
    abi: AbiContract,
    method: string,
    input: Object = {}
): Promise<string> {
    return (await client.abi.encode_message_body({
        abi: {
            type: 'Contract',
            value: abi
        },
        signer: {
            type: 'None'
        },
        call_set: {
            function_name: method,
            input: input
        },
        is_internal: true
    })).body
}