import {NetConfig} from '../../../config'

export interface DeployConfig {
    net: NetConfig
    locale: string | undefined
    keys: string
    requiredForDeployment: number
}