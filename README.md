# Koikatu Save Editor

A simple [Koikatu](http://www.illusion.jp/preview/koikatu/index.php) (コイカツ！) save game editor written in TypeScript/React.
It serves as a personal experiment with browser and language features. And React.

This is a port of [KGSE](https://github.com/hozuki/KoikatuGameSaveEditor). Since WinForms has severe
performance issue dealing with tons of control windows, maybe an implementation running in browsers
can help. In fact, it does. Although you still have to wait some time for creation of elements, it is
smooth performing other tasks (scrolling, editing, ...).

This project contains read-only/write-only/read-write stream(s) built on `Uint8Array`, mocking [`MemoryStream`](https://docs.microsoft.com/en-us/dotnet/api/system.io.memorystream).
It may be helpful to show how to use mixins with TypeScript to achieve pseudo extension functions (i.e. composition).

Required browser features (in addition to common "modern" ones):

- `TextEncoder`/`TextDecoder`
- `Blob`

Please do not complain about the user interface (or, please do). It "just works".
