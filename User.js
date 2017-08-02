class User {
    construct(id, sid) {
        this.id = id;
        this.sid = [sid];
        this.connections = 1;

        return this;
    }

    addConnection(sid) {
        this.connections += 1;
        return this.sid.push(sid);
    }

    removeConnection(sid) {
        let index = this.sid.findIndex(sidParam => sidParam == sid);
        return this.sid.splice(index, 1);
    }

}
