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

test('in()', function () {
    var foo = {
            x: 1,
            dot: {
                y: 2
            },
            innerArray: [1, 2, {z: 3}]
        },
        bar = [1, 2, foo];

    ok(miJs.object(foo).in(bar), 'Проверка на вхождение');
    ok(!miJs.object(foo).in([1, 2, 3]), 'Проверка на невхождение');

    bar = {
        x: 1,
        dot: {
            y: 2
        },
        innerArray: [1, 2, {z: 4}]
    };
    ok(!miJs.object(foo).in(bar), 'Сравнения на всех уровенях вложенности');

    ok(!miJs.object(foo).in([[foo]]), 'Массив в массиве');

    bar = [1, 2, [3, 4], 'foo'];
    ok(miJs.object(1).in(bar), 'Обычное число');
    ok(!miJs.object(5).in(bar), 'Обычное число 2');
    ok(miJs.object([3, 4]).in(bar), 'Массив');
    ok(!miJs.object([3, 5]).in(bar), 'Массив 2');
    ok(miJs.object('foo').in(bar), 'Строка');
    ok(!miJs.object('bar').in(bar), 'Строка 2');

    ok(miJs.object(foo, true).clone().in([1, 2, foo]).result, 'Работа в цепочке');
    ok(!miJs.object(foo, true).clone().in([1, 2]).result, 'Работа в цепочке 2');
});

test('set()', function () {
    var foo = {
            x: 1,
            y: 2,
            dot: {
                x: 3,
                y: 4
            },
            innerArray: [1, 3]
        };

    miJs.object(foo).set({
        x: 6,
        dot:{x:5},
        innerArray:[3, 4]
    });
    equal(foo.x, 6, 'Простое присваивание');
    equal(foo.dot.x, 5, 'Вложенный объект');
    deepEqual(foo.innerArray, [3, 4], 'Массив');
    equal(foo.y, 2, 'Не изменяем не нужные');
    equal(foo.dot.y, 4, 'Не меняем вложенный объект');

    miJs.object(foo).set({
            z: 6,
            x: 1
        },
        true
    );
    equal(foo.z, 6, 'Меняем только те, которые undefined');
    equal(foo.x, 6, 'Не меняем, если не undefined');

    miJs.object(foo).set({
            x: 1,
            y: 5,
            dot: {
                y: 3
            }
        },
        function (currentObject, setObject, key) {
            return (!!(key == 'y'));
        }
    );
    equal(foo.y, 5, 'Фильтрация по функции (присваиваем)');
    equal(foo.x, 6, 'Фильтрация по функции (не присваиеваем)');
    equal(foo.dot.y, 4, 'Фильтрация по функции, вложенные объект');

    equal(miJs.object(foo, true).set({x:1}).clone().result.x, 1, 'Работа в цепочке');
});

test('diff()', function () {
    var foo = {
            x: 1,
            y: 2,
            dot: {
                x: 3,
                y: 4
            },
            innerArray: [1, 2, 3]
        },
        bar = {
            x: 1,
            y: 3,
            dot: {
                x: 4,
                y: 4
            },
            innerArray: [1, 3, 2]
        };

    deepEqual(miJs.object(foo).diff(bar), {
       y: 2,
       dot: {
           x: 3,
           y: 4
       },
       innerArray: [1, 2, 3]
    }, 'Копируем из первого');

    deepEqual(miJs.object(foo).diff(bar, true), {
        y: 3,
        dot: {
            x: 4,
            y: 4
        },
        innerArray: [1, 3, 2]
    }, 'Копируем из второго');

    deepEqual(miJs.object(foo, true).diff(bar).result, {
        y: 2,
        dot: {
            x: 3,
            y: 4
        },
        innerArray: [1, 2, 3]
    }, 'Работа в цепочке');
});

test('keys()', function () {
    var foo = {
        x: 1,
         dot: {y:2},
        innerArray: [1, 2, 3]
    };
    deepEqual(miJs.object(foo).keys(), ['x', 'dot', 'innerArray'], 'Простая проверка');

    deepEqual(miJs.object(foo, true).keys().result, ['x', 'dot', 'innerArray'], 'Работа в цепочке');
});

test('value()', function () {
    var foo = {
        x: 1,
        dot: {y:2}
    };

    equal(miJs.object(foo).value('x'), 1, 'Простая проверка');

    deepEqual(miJs.object(foo).value('dot'), {y:2}, 'Проверка объекта');

    equal(miJs.object(foo, true).clone().value('x').result, 1, 'Работа в цепочке');
});

test('key()', function () {
    var foo = {
        x: 1,
        dot: {
            x: 3,
            y: 4
        },
        innerArray: [1, 2, 3],
        string: 'test'
    };

    equal(miJs.object(foo).key(1), 'x', 'Простая проверка');

    equal(miJs.object(foo).key({
        x: 3,
        y: 4
    }), 'dot', 'Вложеный объект');

    equal(miJs.object(foo).key([1, 2, 3]), 'innerArray', 'Вложеный массив');

    equal(miJs.object(foo).key('test'), 'string', 'Вложеная строка');

    equal(miJs.object(foo).key(5), undefined, 'Несуществующий');

    equal(miJs.object(foo, true).clone().key(1).result, 'x', 'Работа в цепочке');
});

test('externCall()', function () {
    var foo = {
            x: 1,
            y: 2
        },
        callBack = function (i) {
            i.x = 3;
            return 5;
        };

    miJs.object(foo).externCall(callBack);
    equal(foo.x, 3, 'Без копирования результата');

    equal(miJs.object(foo).externCall(callBack, true).result, 5, 'С копированием результата');

    equal(miJs.object(foo, true).clone().externCall(callBack, true).result, 5, 'Работа в цепочке');
});




