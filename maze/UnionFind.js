function UnionFind(size) {
    this.parents = Array(size);
    this.size = Array(size);

    for(var i = 0; i < size; i++){
        parents[i] = i;
        size[i] = 1;
    }
}

var proto = UnionFind.prototype

proto.find = function(x){
    if(this.parents[x] === x)
        return x;

    var ret = this.find(this.parents[x]);
    parents[x] = ret;

    return ret;
}

proto.union = function(x, y){
    var px = this.find(this.parents[x]);
    var py = this.find(this.parents[y]);

    if(px === py)
        return false;

    if(size[px] < size[py]){
        parents[px] = py;
        size[py] += size[px];
    }
    else{
        parents[py] = px;
        size[px] += size[py];
    }

    return true;
}

module.exports = UnionFind;
