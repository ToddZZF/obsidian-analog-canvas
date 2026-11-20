import type { SimulationInputMetadata, SimulationEnvironmentFacts, SimulationEnvironmentMetadata, SimulationConfigurationMetadata, ModelLibrarySelection } from "./contract.js";
export declare function createSimulationInputMetadata(input: {
    inputRevision?: string;
    netlist: string;
    testbench: string;
    deck: string;
}): Promise<SimulationInputMetadata>;
export declare function createSimulationEnvironmentMetadata(facts: SimulationEnvironmentFacts): Promise<SimulationEnvironmentMetadata>;
export declare function simulationConfigurationMetadata(modelLibrary: ModelLibrarySelection | null): SimulationConfigurationMetadata;
export declare function isSimulationEnvironmentMetadata(value: unknown): value is SimulationEnvironmentMetadata;
export declare function verifySimulationEnvironmentMetadata(value: unknown): Promise<SimulationEnvironmentMetadata | null>;
