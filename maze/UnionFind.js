function UnionFind(size) {
    this.parents = new Array(size);
    this.size = new Array(size);

    for(var i = 0; i < size; i++){
        this.parents[i] = i;
        this.size[i] = 1;
    }
}

var proto = UnionFind.prototype;

proto.find = function(x){
    if(this.parents[x] === x)
        return x;

    var ret = this.find(this.parents[x]);
    this.parents[x] = ret;

    return ret;
};

proto.union = function(x, y){
    var px = this.find(this.parents[x]);
    var py = this.find(this.parents[y]);

    if(px === py)
        return false;

    if(this.size[px] < this.size[py]){
        this.parents[px] = py;
        this.size[py] += this.size[px];
    }
    else{
        this.parents[py] = px;
        this.size[px] += this.size[py];
    }

    return true;
};

module.exports = UnionFind;
