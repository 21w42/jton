import {NetConfigInterface} from '../../../config'

export interface DeployConfigInterface {
    net: NetConfigInterface
    locale: string | undefined
    keys: string
    requiredForDeployment: number
}