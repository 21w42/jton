export interface NetConfig {
    url: string
    timeout: number
    transactionFee: number
    tolerance: number
    giver: string
}

export interface Config {
    net: { [key: string]: NetConfig }
    defaultNet: string
}