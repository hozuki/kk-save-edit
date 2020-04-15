# Koikatu Save Editor

A simple [Koikatu](http://www.illusion.jp/preview/koikatu/index.php) (コイカツ！) save game editor written in TypeScript/React.
It serves as a personal experiment with browser and language features. And React.

[Live demo](https://hozuki.github.io/kk-save-edit/) (See notes below)

**Confirmed: This app does not and will not work properly.** This is because of JavaScript's poor typing system.
It does not distinguish a float from an integer, if a number is possibly an integer. It does not distinguish (u)int8,
(u)int32, (u)int64, or float32, float64 either. So the [JS library](https://github.com/msgpack/msgpack-javascript) tries
to encode all numbers to integers if they might be, and select the shortest possible range. Sadly, the [.NET library](https://github.com/msgpack/msgpack-cli)
has a strict differentiation on numeric types; it allows shorter integers/floats to "upgrade" to long integers/floats,
but does not allow the implicit conversion from an integer to a float. So the game will complain:

```plain
[Error  : Unity Log] InvalidOperationException: code is invalid. code:0 format:positive fixint
Stack trace:
MessagePack.Decoders.InvalidSingle.Read (byte[],int,int&) <0x000e6>
MessagePack.MessagePackBinary.ReadSingle (byte[],int,int&) <0x00062>
MessagePack.Formatters.SingleArrayFormatter.Deserialize (byte[],int,MessagePack.IFormatterResolver,int&) <0x000b9>
MessagePack.Formatters.ChaFileFaceFormatter.Deserialize (byte[],int,MessagePack.IFormatterResolver,int&) <0x003c7>
MessagePack.MessagePackSerializer.Deserialize<ChaFileFace> (byte[],MessagePack.IFormatterResolver) <0x000ca>
MessagePack.MessagePackSerializer.Deserialize<ChaFileFace> (byte[]) <0x00050>
ChaFileCustom.LoadBytes (byte[],System.Version) <0x00108>
ChaFile.SetCustomBytes (byte[],System.Version) <0x00039>
...
```

## General

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
