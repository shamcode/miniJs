module('miJS.object');

test('clone()', function () {
    var foo = {
            x: 1,
            y: 2,
            dot: {
                x0: 3,
                y0: 4
            },
            innerArrays: [1, 2, 3]
        },
        bar = miJs.object(foo).clone();
    deepEqual(foo, bar, 'Склонированный объект равен');

    foo.x = 10;
    notEqual(foo.x, bar.x, 'Изменение одного объекта не затрагивает изменение другого');

    foo.dot.x0 = 9;
    notEqual(foo.dot.x0, bar.dot.x0, 'Изменение в глубине объекта');

    foo.innerArrays[0] = 10;
    notEqual(foo.innerArrays[0], bar.innerArrays[0], 'Изменение вложенного массива');

    bar = miJs.object(foo).clone(['x', 'y']);
    notEqual(foo.dot, bar.dot, 'Копирование только части объекта (не копируем)');
    notEqual(foo.innerArrays, bar.innerArrays, 'Копирование только части объекта (вложенный массив)');

    bar = miJs.object(foo).clone(['x', 'y'], true);
    notEqual(foo.x, bar.x, 'Копируем все, кроме указанных ключей (не вошедшие)');
    deepEqual(foo.dot, bar.dot, 'Копируем все, кроме указанных ключей (вошедшие)');

    bar = miJs.object(foo, true).clone().result;
    deepEqual(foo, bar, 'Работа в цепочке');
});


test('equal()', function () {
    var foo = {
            x: 1,
            y: 2,
            dot: {
                x0: 3,
                y0: 4
            },
            innerArrays: [1, 2, 3]
        },
        bar = miJs(foo).clone();

    ok(miJs.object(foo).equal(bar), 'Проверка на равенство');

    bar.x = 5;
    ok(!miJs.object(foo).equal(bar), 'Изменили одно поле');

    bar = miJs.object(foo).clone();
    bar.dot.x0 = 5;
    ok(!miJs.object(foo).equal(bar), 'Изменили вложенный объект');

    bar = miJs.object(foo).clone();
    bar.innerArrays[2] = 5;
    ok(!miJs.object(foo).equal(bar), 'Изменили вложенный массив');

    bar = miJs.object(foo).clone();
    ok(miJs.object(foo, true).equal(bar).result, 'Работа в цепочке');
});




