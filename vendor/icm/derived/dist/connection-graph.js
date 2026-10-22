/** Transient graph of the completed edit. Stored Net IDs never add an edge. */
export class ConnectionGraph {
    parent = new Map();
    add(key) {
        if (!this.parent.has(key))
            this.parent.set(key, key);
    }
    root(key) {
        this.add(key);
        let root = key;
        while (this.parent.get(root) !== root)
            root = this.parent.get(root);
        while (key !== root) {
            const next = this.parent.get(key);
            this.parent.set(key, root);
            key = next;
        }
        return root;
    }
    join(keys) {
        const first = keys[0];
        if (!first)
            return;
        for (const key of keys.slice(1)) {
            const a = this.root(first), b = this.root(key);
            if (a !== b)
                this.parent.set(b, a);
        }
    }
    groups(keys) {
        const groups = new Map();
        for (const key of keys) {
            const root = this.root(key);
            const group = groups.get(root) ?? [];
            group.push(key);
            groups.set(root, group);
        }
        return [...groups.values()];
    }
}
