# miniJs
miniJs - небольшая библиотека типовых функций для объектов, массивов, функций в JavaScript.
В неё вошли такие функции, как клонирование объекта (`clone`), задание свойств(`set`), 
проверка на равенство(`equal`), проверка на вхождение в массив (`in`) и т.д.

## Как использовать?
Для начала, подключите её к вашему проекту, т.е. пропишите ссылки на файл miniJs.js
Доступ к функциям осуществляется через глобальнные переменные `miniJs`, `miJs`.
Пример:
```js
var a = {
			x: 1, 
			y: 2, 
		}
var b = miJs.object(a).clone()
//Изменения в объекте a не повлекут за собой изменения в b:
a.x = 3
alert(b.x)
```
## Какие функции есть?
Со списком функций и как работать с ними можно ознакомиться в [Wiki](https://github.com/shamcode/miniJs/wiki/Home)
##License

(The MIT License)

Copyright (c) 2012 Eugene Burnashov &lt;shamcode@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
