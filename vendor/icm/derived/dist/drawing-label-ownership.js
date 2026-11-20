/** Owned annotations immediately above their instance in the paint order. */
export function gatheredDrawingLabelOwners(order, owners) {
    const gathered = new Map();
    let owner;
    for (const entry of order) {
        if (entry.kind === "instance")
            owner = entry.id;
        else if (entry.kind === "annotation" &&
            owner &&
            owners.get(entry.id) === owner)
            gathered.set(entry.id, owner);
        else
            owner = undefined;
    }
    return gathered;
}
