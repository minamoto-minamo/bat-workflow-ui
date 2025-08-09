import rawApp from "./app-config.yml?raw"
import { loadYaml } from "./loadYaml"

export const CONFIG = loadYaml(rawApp)
