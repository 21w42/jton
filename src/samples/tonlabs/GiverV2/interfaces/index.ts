import {ResultOfCall} from '../../../../contract/interfaces/ResultOfCall'

export interface SendTransactionIn {
    dest: string
    value: number
    bounce?: boolean
}

export interface UpgradeIn {
    code: string
}

export interface GetMessagesOut {
    hash: string
    expireAt: string
}

export interface GetMessagesResult extends ResultOfCall {
    out: GetMessagesOut[]
}