import {AbiContract, KeyPair} from '@tonclient/core/dist/modules'

export interface ContractConfigInterface {
    abi: AbiContract
    initialData: Object
    keys: KeyPair
    tvc: string
    address?: string
}