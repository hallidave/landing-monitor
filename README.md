# Dave's Landing Monitor

**Dave's Landing Monitor** is an in-game toolbar panel for Microsoft Flight Simulator that allows you to monitor your landing rate and other interesting statistics.

![Landing](/images/landing.png)

## Installing

Download the latest release, unzip, and copy the `hallidave-tool-landing` folder to your MSFS Community folder. Remove any old version before copying the new one.

## Building

This project is based on the [MSFS Avionics Framework](https://microsoft.github.io/msfs-avionics-mirror/). You will need to clone and build the framework code before building the Landing Monitor code.

You will need Node, npm, and git installed before building. Full details on setting up your environment are available from the MSFS Avionics Framework site.

You also need to install the [MSFS SDK](https://docs.flightsimulator.com/html/Introduction/SDK_Overview.htm). The build for the Landing Monitor assumes that you have it installed in the `C:\MSFS SDK` directory.

Once everything is installed, execute the follow commands:

```
git clone https://github.com/hallidave/landing-monitor
cd landing-monitor
npm install
npm run package
```

## Contributing

I'm open to feature requests and code contributions. Please file an issue for bugs, features, or code ideas.

I have added hooks to support localisation (see [panel.loc](/src/panel.loc)). If you are able to provide translations for one of the supported languages, please submit a pull request.

## License

This code is made available under the MIT License. See [LICENSE](LICENSE) for details.
