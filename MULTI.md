# MagicMirror experimental feature - Multi clients / Layout templatation

## What I want to solve with this project.

- Many of modern SBCs or devices which can host MM also has ability of more screens by itself. (RPI 4 can host 2 screens, Khadas VIM4 can 4, usual PC/Mac also can connect many displays) => I want to use 2 display panels for larger mirror with one RPI 4
- Remote clients on the diffrent devices are possible, but they should have same layout and configuration. => I want to build a `livingroom` mirror and a `kitchen` mirror, hosted and controlled by one server, but with different look & feels and even modules.
- Current legacy region structure of MM is very restricted. => I need more flexible and more customizable template. I need custom 4X1 areas for my super-wide display panel which has 1920X480 resolution. Obviously, it could be achieved by heavy CSS tweek with legacy, but it would be painful.

## How to use

### configuration (config.js)

- `clients:[]` is used for multi-screen/clients

```js
// ... default MagicMirror configuration includes modules
// ...
clients: [
  {
    client: "livingroom_1",
    language: "de",
    customCSS: "css/livingroom.css",
    layout: "layout/infoboard.html",
    electronOptions: { ... },
    display: 1,
    modules: [ ... ], // The module which uses `node_helper` should be included in default definition first.
  },
  {
    client: "livingroom_2",
    // ...
  },
  // ...
],
```

- For Browser

```
http://localhost:8080/?client=livingroom_1
```

- For Electron

```sh
node clientonly --address localhost --port 8080 --client livingroom_1
```

## CHANGES

- **ADDED** `layout` directory to contain user-defined layout templates.
- **ADDED** User-defined region is available.
- **CHANGED** `clientonly` runnable on `localhost` (for multiscreens with one device)
- **CHANGED** `Module.sendSocketNotification(notification, payload, client)` to distinguish from which client sends this notification easily.
- **FIXED** `css` non-existence error (It will send fake empty CSS with warning)

## TODO / Open Problem

- Test suites (Somebody help me!)
- Not tested enough, especially Windows and Docker environments.
- Communication between clients. (WebSocket? MQTT? WebRTC? WebTransport??)
- seperatable file for client configs. (config.js is tooooooo long)
- Should `node_helper` also be able to send notifications to the specific client(s)? - a too-complex structure is needed. While just `payload` might have the recipient client id, it could be achieved without this feature... But somehow unkind. (Anyway this is more efficient way if you consider not only each module-instance-level but also module-group-level messaging)
- Obviously, current all modules are not made for multi-clients. So modules should be modified/redeveloped to support multi-clients. (organizing socketNotifications from each client, sending proper messages for the target client, lifecycle, and, ...)
- `node_helper` is hosted in a `server` device, So **`edge_helper`** in a client device might be needed. (for input/output for each client beyond HTML)

- Too many modifications from the current MM's architecture. Is it really worth?
- Again, Is this really useful? (Anyway, I need these features, but not sure the worthy..)
