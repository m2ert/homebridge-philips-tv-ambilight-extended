# homebridge-philips-tv-ambilight-extended

Enhanced Homebridge plugin for Philips Android TV with proper TV icon, Ambilight control, and extended features.

## Features

✨ **Clean TV Interface** - Displays as proper TV accessory with TV icon in HomeKit  
🎨 **Ambilight Control** - Full ambilight control with brightness adjustment  
🔊 **Native Volume Control** - Proper TV speaker volume control (no more fan icons!)  
📱 **App Launching** - Launch Netflix, YouTube, and other Android TV apps  
📺 **Channel Control** - Switch between TV channels with presets  
🎮 **Remote Control** - Full remote control functionality  
⚡ **Wake on LAN** - Power on TV remotely via network  
🔄 **Auto Status Updates** - Real-time status polling and updates  

## Installation

```bash
npm install -g homebridge-philips-tv-ambilight-extended
```

## TV Pairing

Before using this plugin, you need to pair your TV to get API credentials:

### Option 1: Using pylips (Recommended)
```bash
pip3 install pylips
python3 -m pylips
```

### Option 2: Using philips_android_tv
```bash
git clone https://github.com/suborb/philips_android_tv
cd philips_android_tv
python ./philips.py --host YOUR_TV_IP pair
```

The pairing process will give you `username` and `password` credentials needed for configuration.

## Configuration

Add this to your Homebridge `config.json`:

```json
{
  "accessories": [
    {
      "accessory": "PhilipsTV",
      "name": "Living Room TV",
      "ip_address": "192.168.1.100",
      "poll_status_interval": 30,
      "model_year": 2016,
      "has_ambilight": true,
      "username": "your_api_username",
      "password": "your_api_password",
      "wol_url": "wol://aa:bb:cc:dd:ee:ff",
      "inputs": [
        { "name": "TV Mode" },
        { 
          "name": "Netflix",
          "launch": {
            "intent": {
              "component": {
                "packageName": "com.netflix.ninja",
                "className": "com.netflix.ninja.MainActivity"
              },
              "action": "android.intent.action.MAIN"
            }
          }
        },
        { 
          "name": "YouTube",
          "launch": {
            "intent": {
              "component": {
                "packageName": "com.google.android.youtube.tv",
                "className": "com.google.android.apps.youtube.tv.activity.ShellActivity"
              },
              "action": "android.intent.action.MAIN"
            }
          }
        },
        { "name": "CNN", "channel": 501 },
        { "name": "BBC", "channel": 502 },
        { "name": "National Geographic", "channel": 503 }
      ]
    }
  ]
}
```

## Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `accessory` | string | ✅ | Must be "PhilipsTV" |
| `name` | string | ✅ | Display name for your TV |
| `ip_address` | string | ✅ | TV's IP address |
| `username` | string | ✅ | API username from pairing |
| `password` | string | ✅ | API password from pairing |
| `poll_status_interval` | number | ❌ | Status update interval in seconds (default: 30) |
| `model_year` | number | ❌ | TV model year (default: 2016) |
| `has_ambilight` | boolean | ❌ | Enable ambilight control (default: false) |
| `wol_url` | string | ❌ | Wake on LAN MAC address (format: wol://aa:bb:cc:dd:ee:ff) |
| `inputs` | array | ❌ | Custom input sources (apps and channels) |

## Input Configuration

### TV Channels
```json
{ "name": "BBC One", "channel": 101 }
```

### Android TV Apps
```json
{ 
  "name": "Netflix",
  "launch": {
    "intent": {
      "component": {
        "packageName": "com.netflix.ninja",
        "className": "com.netflix.ninja.MainActivity"
      },
      "action": "android.intent.action.MAIN"
    }
  }
}
```

### Popular App Package Names
- **Netflix**: `com.netflix.ninja`
- **YouTube**: `com.google.android.youtube.tv`
- **Amazon Prime**: `com.amazon.avod.thirdpartyclient`
- **Disney+**: `com.disney.disneyplus`
- **Spotify**: `com.spotify.tv.android`
- **Plex**: `com.plexapp.android`
- **Kodi**: `org.xbmc.kodi`
- **VLC**: `org.videolan.vlc`

## HomeKit Interface

This plugin creates a clean TV interface with:

### Main TV Accessory
- **TV Icon** - Proper television icon in HomeKit
- **Power Control** - Turn TV on/off
- **Volume Control** - Native TV speaker volume
- **Input Selection** - Switch between configured inputs
- **Remote Control** - Navigation and media controls

### Additional Accessories (if enabled)
- **Ambilight** - Separate lightbulb for ambilight control
- **Volume Fan** - Alternative volume control (can be disabled)

## Remote Control Keys

| HomeKit Button | TV Action |
|---------------|-----------|
| Play/Pause | PlayPause |
| Up/Down/Left/Right | Navigation |
| Select | Confirm |
| Back | Back |
| Exit | Exit |
| Info | Info |

## Wake on LAN

To use Wake on LAN:
1. Enable WOL in your TV's network settings
2. Connect TV via Ethernet cable
3. Find your TV's MAC address
4. Add `wol_url` to configuration: `"wol_url": "wol://aa:bb:cc:dd:ee:ff"`

## Troubleshooting

### TV Not Responding
- Check if TV is on the same network
- Verify IP address is correct
- Ensure API credentials are valid
- Check if TV's API is enabled in settings

### Volume Control Issues
- Make sure TV supports volume API
- Check if external speakers are connected
- Verify TV is not in mute mode

### Ambilight Not Working
- Ensure TV has ambilight capability
- Check if ambilight is enabled in TV settings
- Verify `has_ambilight: true` in configuration

### App Launch Failures
- Verify app package names are correct
- Check if apps are installed on TV
- Ensure apps are compatible with intent launching

## API Reference

This plugin uses the Philips JointSpace API v6. For advanced usage and additional endpoints, see:
- [Philips TV API Documentation](https://github.com/eslavnov/pylips/wiki)
- [JointSpace API Reference](http://jointspace.sourceforge.net/)

## Compatibility

- **TV Models**: Philips Android TV 2016+
- **API Version**: JointSpace API v6
- **Homebridge**: v1.0.0+
- **Node.js**: v14+

## Support

For issues and feature requests, please visit:
[GitHub Issues](https://github.com/m2ert/homebridge-philips-tv-ambilight-extended/issues)

## License

ISC License

## Credits

Based on the excellent work from:
- [homebridge-philips-tv6](https://github.com/98oktay/homebridge-philips-tv6)
- [homebridge-philips-android-tv](https://github.com/konradknitter/homebridge-philips-android-tv)
- [pylips](https://github.com/eslavnov/pylips)

---

**Made with ❤️ for the Homebridge community**
