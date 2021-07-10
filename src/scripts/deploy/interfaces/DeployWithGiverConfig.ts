import {DeployConfig} from './DeployConfig'

export interface DeployWithGiverConfig extends DeployConfig {
    giverKeys: string
}