export const ARRAY_DIFF_OP = {
    ADD: 'add',
    REMOVE: 'remove',
    MOVE: 'move',
    NOOP: 'noop',
}

class ArrayWithOriginalIndices {
    #array = [];
    #originalIndices = [];
    #equalsFn;

    constructor(array, equalsFn) {
        this.#array = [...array];
        this.#originalIndices = array.map((_, i) => i);
        this.#equalsFn = equalsFn;
    }

    get length() {
        return this.#array.length;
    }

    isRemoval(index, newArray) {
        if (index >= this.length) {
            return false;
        }

        const item = this.#array[index];
        const indexInNewArray = newArray.findIndex((newItem) => this.#equalsFn(item, newItem));

        return indexInNewArray === -1;
    }

    removeItem(index) {
        const operation = {
            op: ARRAY_DIFF_OP.REMOVE,
            index,
            item: this.#array[index],
        }

        this.#array.splice(index, 1);
        this.#originalIndices.splice(index, 1);

        return operation;
    }

    isNoop(index, newArray) {
        if (index >= this.length) {
            return false;
        }

        const item = this.#array[index];
        const newItem = newArray[index];

        return this.#equalsFn(item, newItem);
    }

    originalIndexAt(index) {
        return this.#originalIndices[index];
    }

    noopItem(index) {
        return {
            op: ARRAY_DIFF_OP.NOOP,
            originalIndex: this.originalIndexAt(index),
            index,
            item: this.#array[index],
        }
    }

    isAddition(item, fromIdx) {
        return this.findIndexFrom(item, fromIdx) === -1;
    }

    findIndexFrom(item, fromIndex) {
        for (let i = fromIndex; i < this.length; i++) {
            if (this.#equalsFn(item, this.#array[i])) {
                return i;
            }
        }

        return -1;
    }

    addItem(item, index) {
        const operation = {
            op: ARRAY_DIFF_OP.ADD,
            index,
            item,
        }

        this.#array.splice(index, 0, item);
        this.#originalIndices.splice(index, 0, -1);

        return operation;
    }

    moveItem(item, toIndex) {
        // 移動先の位置から探索を始めて、古い配列の中で対象の要素を探す
        const fromIndex = this.findIndexFrom(item, toIndex);

        // move 操作の内容を表すオブジェクトを作る
        const operation = {
            op: ARRAY_DIFF_OP.MOVE,
            // 操作オブジェクトに元のインデックスを含める
            originalIndex: this.originalIndexAt(fromIndex),
            from: fromIndex,
            index: toIndex,
            item: this.#array[fromIndex],
        }

        // 古い位置から要素を取り出す
        const [_item] = this.#array.splice(fromIndex, 1);
        // 新しい位置に要素を挿入する
        this.#array.splice(toIndex, 0, _item);

        // #originalIndices 配列から元のインデックスを取り出す
        const [originalIndex] = this.#originalIndices.splice(fromIndex, 1);
        // 新しい位置に元のインデックスを挿入する
        this.#originalIndices.splice(toIndex, 0, originalIndex);
        
        // move 操作オブジェクトを返す
        return operation;
    }

    removeItemsAfter(index) {
        const operations = [];

        while (this.length > index) {
            operations.push(this.removeItem(index));
        }

        return operations;
    }
}

export function withoutNulls(arr) {
    return arr.filter((item) => item != null);
}

export function arraysDiff(oldArray, newArray) {
    return {
        added: newArray.filter(
            (newItem) => !oldArray.includes(newItem)
        ),
        removed: oldArray.filter(
            (oldItem) => !newArray.includes(oldItem)
        ),
    }
}

export function arraysDiffSequence(
    oldArray,
    newArray,
    equalsFn = (a, b) => a === b
) {
    const sequence = [];
    const array = new ArrayWithOriginalIndices(oldArray, equalsFn);

    for (let index = 0; index < newArray.length; index++) {
        if (array.isRemoval(index, newArray)) {
            sequence.push(array.removeItem(index));
            index--;
            continue;
        }

        if (array.isNoop(index, newArray)) {
            sequence.push(array.noopItem(index));
            continue;
        }

        const item = newArray[index];

        if (array.isAddition(item, index)) {
            sequence.push(array.addItem(item, index));
            continue;
        }

        sequence.push(array.moveItem(item, index));
    }

    sequence.push(...array.removeItemsAfter(newArray.length));

    return sequence
}
