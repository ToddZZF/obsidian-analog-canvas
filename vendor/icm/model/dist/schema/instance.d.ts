import { z } from "zod";
/**
 * Optional per-instance visual style override. When absent, the instance
 * renders with the document style profile defaults — preserving the exact
 * appearance of pre-existing projects. Each field is independently optional
 * so an older Project's paint remains readable. Current authoring exposes
 * foreground only; `background` is retained as a compatibility field.
 *
 * - `foreground`: replaces the profile foreground for this instance's
 *   symbol strokes (lines, polylines, paths, polygon strokes, circle
 *   strokes) and explicit foreground fills.
 * - `background`: paints an opaque fill rectangle behind the instance's
 *   symbol artwork. The symbol's own strokes remain visible on top.
 */
export declare const InstanceStyleOverrideSchema: z.ZodObject<{
    foreground: z.ZodOptional<z.ZodString>;
    background: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
/**
 * Optional schematic-only Signal Flow formula metadata. These parameters are
 * independent from netlist/SPICE parameters and do not affect electrical
 * connectivity or emitted device bindings.
 */
export declare const SignalFlowParametersSchema: z.ZodObject<{
    formula: z.ZodOptional<z.ZodString>;
    formulaFormat: z.ZodOptional<z.ZodType<import("./rich-text.js").RichTextDocument, unknown, z.core.$ZodTypeInternals<import("./rich-text.js").RichTextDocument, unknown>>>;
    coefficient: z.ZodOptional<z.ZodString>;
    bodyWidth: z.ZodOptional<z.ZodNumber>;
    bodyHeight: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export declare const TerminalRefSchema: z.ZodObject<{
    instanceId: z.ZodString;
    pinName: z.ZodString;
    memberId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const PlacementSchema: z.ZodObject<{
    position: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, z.core.$strict>;
    rotation: z.ZodUnion<readonly [z.ZodLiteral<0>, z.ZodLiteral<45>, z.ZodLiteral<90>, z.ZodLiteral<135>, z.ZodLiteral<180>, z.ZodLiteral<225>, z.ZodLiteral<270>, z.ZodLiteral<315>]>;
    mirror: z.ZodEnum<{
        both: "both";
        horizontal: "horizontal";
        none: "none";
        vertical: "vertical";
    }>;
}, z.core.$strict>;
export declare const NetlistIdentifierSchema: z.ZodString;
export declare const NetlistParameterNameSchema: z.ZodString;
export declare const NetlistParameterValueSchema: z.ZodString;
export declare const NetlistDeviceClassSchema: z.ZodEnum<{
    bjt: "bjt";
    capacitor: "capacitor";
    cccs: "cccs";
    ccvs: "ccvs";
    "current-source": "current-source";
    diode: "diode";
    inductor: "inductor";
    jfet: "jfet";
    mos: "mos";
    "net-marker": "net-marker";
    resistor: "resistor";
    switch: "switch";
    vccs: "vccs";
    vcvs: "vcvs";
    "voltage-source": "voltage-source";
}>;
export declare const InstanceNetlistBindingSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    kind: z.ZodLiteral<"primitive">;
    deviceClass: z.ZodEnum<{
        bjt: "bjt";
        capacitor: "capacitor";
        cccs: "cccs";
        ccvs: "ccvs";
        "current-source": "current-source";
        diode: "diode";
        inductor: "inductor";
        jfet: "jfet";
        mos: "mos";
        "net-marker": "net-marker";
        resistor: "resistor";
        switch: "switch";
        vccs: "vccs";
        vcvs: "vcvs";
        "voltage-source": "voltage-source";
    }>;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"model">;
    deviceClass: z.ZodEnum<{
        bjt: "bjt";
        capacitor: "capacitor";
        cccs: "cccs";
        ccvs: "ccvs";
        "current-source": "current-source";
        diode: "diode";
        inductor: "inductor";
        jfet: "jfet";
        mos: "mos";
        "net-marker": "net-marker";
        resistor: "resistor";
        switch: "switch";
        vccs: "vccs";
        vcvs: "vcvs";
        "voltage-source": "voltage-source";
    }>;
    name: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"subcircuit">;
    childDocumentId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"external-subcircuit">;
    definitionId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"unresolved-subcircuit">;
    name: z.ZodString;
}, z.core.$strict>], "kind">;
export declare const InstanceNetlistDataSchema: z.ZodObject<{
    binding: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"primitive">;
        deviceClass: z.ZodEnum<{
            bjt: "bjt";
            capacitor: "capacitor";
            cccs: "cccs";
            ccvs: "ccvs";
            "current-source": "current-source";
            diode: "diode";
            inductor: "inductor";
            jfet: "jfet";
            mos: "mos";
            "net-marker": "net-marker";
            resistor: "resistor";
            switch: "switch";
            vccs: "vccs";
            vcvs: "vcvs";
            "voltage-source": "voltage-source";
        }>;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"model">;
        deviceClass: z.ZodEnum<{
            bjt: "bjt";
            capacitor: "capacitor";
            cccs: "cccs";
            ccvs: "ccvs";
            "current-source": "current-source";
            diode: "diode";
            inductor: "inductor";
            jfet: "jfet";
            mos: "mos";
            "net-marker": "net-marker";
            resistor: "resistor";
            switch: "switch";
            vccs: "vccs";
            vcvs: "vcvs";
            "voltage-source": "voltage-source";
        }>;
        name: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"subcircuit">;
        childDocumentId: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"external-subcircuit">;
        definitionId: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"unresolved-subcircuit">;
        name: z.ZodString;
    }, z.core.$strict>], "kind">>;
    control: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"voltage">;
        positiveNetId: z.ZodOptional<z.ZodString>;
        negativeNetId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"current">;
        sensorInstanceId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"terminal-current">;
        instanceId: z.ZodOptional<z.ZodString>;
        pinName: z.ZodOptional<z.ZodString>;
        direction: z.ZodEnum<{
            into: "into";
            out: "out";
        }>;
    }, z.core.$strict>], "kind">>;
    parameters: z.ZodRecord<z.ZodString, z.ZodString>;
}, z.core.$strict>;
export declare const InstanceSchema: z.ZodObject<{
    id: z.ZodString;
    symbolId: z.ZodString;
    symbolVariantId: z.ZodOptional<z.ZodString>;
    sourceRef: z.ZodOptional<z.ZodObject<{
        fileId: z.ZodString;
        start: z.ZodObject<{
            offset: z.ZodNumber;
            line: z.ZodNumber;
            column: z.ZodNumber;
        }, z.core.$strict>;
        end: z.ZodObject<{
            offset: z.ZodNumber;
            line: z.ZodNumber;
            column: z.ZodNumber;
        }, z.core.$strict>;
    }, z.core.$strict>>;
    importProvenance: z.ZodOptional<z.ZodObject<{
        kind: z.ZodEnum<{
            model: "model";
            opaque: "opaque";
            primitive: "primitive";
            subcircuit: "subcircuit";
        }>;
        sourceMasterName: z.ZodString;
        sourceTarget: z.ZodString;
        status: z.ZodOptional<z.ZodEnum<{
            missing: "missing";
            resolved: "resolved";
            unsupported: "unsupported";
        }>>;
        modelType: z.ZodOptional<z.ZodString>;
        symbolMappingRegistryId: z.ZodOptional<z.ZodString>;
        terminalMapping: z.ZodOptional<z.ZodArray<z.ZodObject<{
            sourcePosition: z.ZodNumber;
            pinName: z.ZodString;
        }, z.core.$strict>>>;
    }, z.core.$strict>>;
    mosBulkBinding: z.ZodOptional<z.ZodObject<{
        origin: z.ZodEnum<{
            "cell-default": "cell-default";
            "instance-override": "instance-override";
            "supply-default": "supply-default";
        }>;
        netId: z.ZodString;
    }, z.core.$strict>>;
    placement: z.ZodNullable<z.ZodObject<{
        position: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, z.core.$strict>;
        rotation: z.ZodUnion<readonly [z.ZodLiteral<0>, z.ZodLiteral<45>, z.ZodLiteral<90>, z.ZodLiteral<135>, z.ZodLiteral<180>, z.ZodLiteral<225>, z.ZodLiteral<270>, z.ZodLiteral<315>]>;
        mirror: z.ZodEnum<{
            both: "both";
            horizontal: "horizontal";
            none: "none";
            vertical: "vertical";
        }>;
    }, z.core.$strict>>;
    reference: z.ZodOptional<z.ZodString>;
    netlist: z.ZodOptional<z.ZodObject<{
        binding: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"primitive">;
            deviceClass: z.ZodEnum<{
                bjt: "bjt";
                capacitor: "capacitor";
                cccs: "cccs";
                ccvs: "ccvs";
                "current-source": "current-source";
                diode: "diode";
                inductor: "inductor";
                jfet: "jfet";
                mos: "mos";
                "net-marker": "net-marker";
                resistor: "resistor";
                switch: "switch";
                vccs: "vccs";
                vcvs: "vcvs";
                "voltage-source": "voltage-source";
            }>;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"model">;
            deviceClass: z.ZodEnum<{
                bjt: "bjt";
                capacitor: "capacitor";
                cccs: "cccs";
                ccvs: "ccvs";
                "current-source": "current-source";
                diode: "diode";
                inductor: "inductor";
                jfet: "jfet";
                mos: "mos";
                "net-marker": "net-marker";
                resistor: "resistor";
                switch: "switch";
                vccs: "vccs";
                vcvs: "vcvs";
                "voltage-source": "voltage-source";
            }>;
            name: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"subcircuit">;
            childDocumentId: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"external-subcircuit">;
            definitionId: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"unresolved-subcircuit">;
            name: z.ZodString;
        }, z.core.$strict>], "kind">>;
        control: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"voltage">;
            positiveNetId: z.ZodOptional<z.ZodString>;
            negativeNetId: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"current">;
            sensorInstanceId: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"terminal-current">;
            instanceId: z.ZodOptional<z.ZodString>;
            pinName: z.ZodOptional<z.ZodString>;
            direction: z.ZodEnum<{
                into: "into";
                out: "out";
            }>;
        }, z.core.$strict>], "kind">>;
        parameters: z.ZodRecord<z.ZodString, z.ZodString>;
    }, z.core.$strict>>;
    styleOverride: z.ZodOptional<z.ZodObject<{
        foreground: z.ZodOptional<z.ZodString>;
        background: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    bodyFill: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"background">;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"color">;
        color: z.ZodString;
    }, z.core.$strict>], "kind">>;
    documentStyle: z.ZodOptional<z.ZodObject<{
        fontScale: z.ZodOptional<z.ZodNumber>;
        wireStrokeScale: z.ZodOptional<z.ZodNumber>;
        symbolStrokeScale: z.ZodOptional<z.ZodNumber>;
        annotationStrokeScale: z.ZodOptional<z.ZodNumber>;
        junctionRadiusScale: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    signalFlowParameters: z.ZodOptional<z.ZodObject<{
        formula: z.ZodOptional<z.ZodString>;
        formulaFormat: z.ZodOptional<z.ZodType<import("./rich-text.js").RichTextDocument, unknown, z.core.$ZodTypeInternals<import("./rich-text.js").RichTextDocument, unknown>>>;
        coefficient: z.ZodOptional<z.ZodString>;
        bodyWidth: z.ZodOptional<z.ZodNumber>;
        bodyHeight: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
}, z.core.$strict>;
/**
 * An Instance as a placement request names it, before the editor gives it
 * a Reference: one left out takes the next free name, as a GUI insert does
 * (#1256). Everything else is checked as for a stored Instance.
 */
export declare const InstancePlacementRequestSchema: z.ZodObject<{
    id: z.ZodString;
    symbolId: z.ZodString;
    symbolVariantId: z.ZodOptional<z.ZodString>;
    sourceRef: z.ZodOptional<z.ZodObject<{
        fileId: z.ZodString;
        start: z.ZodObject<{
            offset: z.ZodNumber;
            line: z.ZodNumber;
            column: z.ZodNumber;
        }, z.core.$strict>;
        end: z.ZodObject<{
            offset: z.ZodNumber;
            line: z.ZodNumber;
            column: z.ZodNumber;
        }, z.core.$strict>;
    }, z.core.$strict>>;
    importProvenance: z.ZodOptional<z.ZodObject<{
        kind: z.ZodEnum<{
            model: "model";
            opaque: "opaque";
            primitive: "primitive";
            subcircuit: "subcircuit";
        }>;
        sourceMasterName: z.ZodString;
        sourceTarget: z.ZodString;
        status: z.ZodOptional<z.ZodEnum<{
            missing: "missing";
            resolved: "resolved";
            unsupported: "unsupported";
        }>>;
        modelType: z.ZodOptional<z.ZodString>;
        symbolMappingRegistryId: z.ZodOptional<z.ZodString>;
        terminalMapping: z.ZodOptional<z.ZodArray<z.ZodObject<{
            sourcePosition: z.ZodNumber;
            pinName: z.ZodString;
        }, z.core.$strict>>>;
    }, z.core.$strict>>;
    mosBulkBinding: z.ZodOptional<z.ZodObject<{
        origin: z.ZodEnum<{
            "cell-default": "cell-default";
            "instance-override": "instance-override";
            "supply-default": "supply-default";
        }>;
        netId: z.ZodString;
    }, z.core.$strict>>;
    placement: z.ZodNullable<z.ZodObject<{
        position: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, z.core.$strict>;
        rotation: z.ZodUnion<readonly [z.ZodLiteral<0>, z.ZodLiteral<45>, z.ZodLiteral<90>, z.ZodLiteral<135>, z.ZodLiteral<180>, z.ZodLiteral<225>, z.ZodLiteral<270>, z.ZodLiteral<315>]>;
        mirror: z.ZodEnum<{
            both: "both";
            horizontal: "horizontal";
            none: "none";
            vertical: "vertical";
        }>;
    }, z.core.$strict>>;
    reference: z.ZodOptional<z.ZodString>;
    netlist: z.ZodOptional<z.ZodObject<{
        binding: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"primitive">;
            deviceClass: z.ZodEnum<{
                bjt: "bjt";
                capacitor: "capacitor";
                cccs: "cccs";
                ccvs: "ccvs";
                "current-source": "current-source";
                diode: "diode";
                inductor: "inductor";
                jfet: "jfet";
                mos: "mos";
                "net-marker": "net-marker";
                resistor: "resistor";
                switch: "switch";
                vccs: "vccs";
                vcvs: "vcvs";
                "voltage-source": "voltage-source";
            }>;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"model">;
            deviceClass: z.ZodEnum<{
                bjt: "bjt";
                capacitor: "capacitor";
                cccs: "cccs";
                ccvs: "ccvs";
                "current-source": "current-source";
                diode: "diode";
                inductor: "inductor";
                jfet: "jfet";
                mos: "mos";
                "net-marker": "net-marker";
                resistor: "resistor";
                switch: "switch";
                vccs: "vccs";
                vcvs: "vcvs";
                "voltage-source": "voltage-source";
            }>;
            name: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"subcircuit">;
            childDocumentId: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"external-subcircuit">;
            definitionId: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"unresolved-subcircuit">;
            name: z.ZodString;
        }, z.core.$strict>], "kind">>;
        control: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"voltage">;
            positiveNetId: z.ZodOptional<z.ZodString>;
            negativeNetId: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"current">;
            sensorInstanceId: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"terminal-current">;
            instanceId: z.ZodOptional<z.ZodString>;
            pinName: z.ZodOptional<z.ZodString>;
            direction: z.ZodEnum<{
                into: "into";
                out: "out";
            }>;
        }, z.core.$strict>], "kind">>;
        parameters: z.ZodRecord<z.ZodString, z.ZodString>;
    }, z.core.$strict>>;
    styleOverride: z.ZodOptional<z.ZodObject<{
        foreground: z.ZodOptional<z.ZodString>;
        background: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    bodyFill: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"background">;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"color">;
        color: z.ZodString;
    }, z.core.$strict>], "kind">>;
    documentStyle: z.ZodOptional<z.ZodObject<{
        fontScale: z.ZodOptional<z.ZodNumber>;
        wireStrokeScale: z.ZodOptional<z.ZodNumber>;
        symbolStrokeScale: z.ZodOptional<z.ZodNumber>;
        annotationStrokeScale: z.ZodOptional<z.ZodNumber>;
        junctionRadiusScale: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    signalFlowParameters: z.ZodOptional<z.ZodObject<{
        formula: z.ZodOptional<z.ZodString>;
        formulaFormat: z.ZodOptional<z.ZodType<import("./rich-text.js").RichTextDocument, unknown, z.core.$ZodTypeInternals<import("./rich-text.js").RichTextDocument, unknown>>>;
        coefficient: z.ZodOptional<z.ZodString>;
        bodyWidth: z.ZodOptional<z.ZodNumber>;
        bodyHeight: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
}, z.core.$strict>;
/**
 * Persisted electrical supply identity. `conflict` is diagnostic state only;
 * new authoring may choose vdd, ground, or none but never create a
 * short intentionally.
 */
