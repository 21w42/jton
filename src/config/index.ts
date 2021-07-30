import {ClientConfig} from '@tonclient/core'

export interface NetConfig {
    client: ClientConfig
    transactions: {
        fee: number
        tolerance: number
        giver: string
    }
}

export interface Config {
    net: { [key: string]: NetConfig }
    defaultNet: string
}