import {ExtensionType} from '../types/ExtensionType'
import {ExportType} from '../types/ExportType'

export interface MakeConfig {
    root: string,
    compile?: string[]
    wrap?: string[]
    compiler?: string
    linker?: string
    stdlib?: string
    extension?: ExtensionType
    export?: ExportType
}