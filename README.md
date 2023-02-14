# Scriptnet
Welcome to ScriptNet, a software package for analysing the interfaces of the crime commission process and networks of association. The software is a collaboration between the University of Manchester (Nick Lord, Elisa Bellotti and Cecilia Flores-Elizondo), Joshua Melville, and Steve McKellar (Team Garlic). More specifically:

*   Content developed by Nick Lord, Elisa Bellotti and Cecilia Flores-Elizondo
*   Software developed by Joshua Melville and Steve McKellar

The project, entitled 'In Pursuit of Food System Integrity: Scoping and Development of the SCRIPTNET Tool-Kit', was funded by the Economic and Social Research Council Impact Acceleration Account.

Cite as follows:

*   Lord, N., Bellotti, E., Flores-Elizondo, C., Melville, J. and McKellar, S. (2020) ScriptNet: An Integrated Criminological-Network Analysis Tool, University of Manchester.

## Documentation and Downloads

You can download the software for Windows and macOS from the following links:
  - [Windows](https://github.com/scriptnet-project/scriptnet/releases/download/v1.0.0/ScriptNet.Setup.1.0.0.exe)
  - [macOS](https://github.com/scriptnet-project/scriptnet/releases/download/v1.0.0/ScriptNet-1.0.0-Installer.dmg)
  
To view all available versions of the software, visit the [releases page](https://github.com/scriptnet-project/scriptnet/releases/).

A user manual for the software is available as a Microsoft Word formatted document from [this link](https://github.com/scriptnet-project/scriptnet/raw/master/Scriptnet%20investigator%20manual_FINAL.docx).

## License and Copyright
Copyright 2023, Nick Lord, Elisa Bellotti, Cecilia Flores-Elizondo, Joshua Melville, and Steve McKellar.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version. See the LICENSE file for further details.

## Developer Information

This is built on top of [electron-vite-react](https://github.com/electron-vite/electron-vite-react).

### Development Scripts

```bash
# run application in development mode
yarn dev

# compile source code and create webpack output
yarn compile

# `yarn compile` & create build with electron-builder
yarn dist
# To disable code signing on macOS set the env var CSC_IDENTITY_AUTO_DISCOVERY=false

# `yarn compile` & create unpacked build with electron-builder
yarn dist:dir
```
