"use strict";
const pkg = require("./package.json");
const PhilipsTV = require("./PhilipsTV");

let Service, Characteristic, Categories;

const pluginName = pkg.name;
const accessoryName = "PhilipsTV";

class PhilipsTvAccessory {
    constructor(log, config, api) {
        this.log = log;
        this.config = config;
        this.api = api;

        Service = api.hap.Service;
        Characteristic = api.hap.Characteristic;
        Categories = api.hap.Categories;

        this.on = false;
        this.volume = 0;

        this.inputSources = [];
        this.ambilightModes = ["FOLLOW VIDEO", "FOLLOW AUDIO", "Lounge Light"];
        this.activeAmbilightMode = 0;
        this.PhilipsTV = new PhilipsTV(config);

        this.services = [];

        const uuid = this.api.hap.uuid.generate(this.config.name);
        this.tvAccessory = new this.api.platformAccessory(this.config.name, uuid, Categories.TELEVISION);
        this.tvAccessory.context.isexternal = true;

        this.tvService = new Service.Television(this.config.name);
        this.tvService.setCharacteristic(Characteristic.ConfiguredName, this.config.name);
        this.tvService.setCharacteristic(Characteristic.SleepDiscoveryMode, Characteristic.SleepDiscoveryMode.ALWAYS_DISCOVERABLE);

        this.tvService.getCharacteristic(Characteristic.Active)
            .onGet(() => this.PhilipsTV.getPowerState())
            .onSet((v) => this.PhilipsTV.setPowerState(v));

        this.tvService.getCharacteristic(Characteristic.RemoteKey)
            .onSet((v) => this.PhilipsTV.sendRemoteKey(v));

        this.tvSpeaker = new Service.TelevisionSpeaker(this.config.name + " Speaker");
        this.tvSpeaker.setCharacteristic(Characteristic.VolumeControlType, Characteristic.VolumeControlType.ABSOLUTE);
        this.tvSpeaker.getCharacteristic(Characteristic.Volume)
            .onGet(() => this.PhilipsTV.getVolumeState())
            .onSet((v) => this.PhilipsTV.setVolumeState(v));
        this.tvSpeaker.getCharacteristic(Characteristic.Mute)
            .onGet(() => this.PhilipsTV.getMuteState())
            .onSet((v) => this.PhilipsTV.setMuteState(v));

        this.tvService.addLinkedService(this.tvSpeaker);

        this.setupInputSources();
        this.setupAmbilightInputs();
        //const system = this.getSystemState()
        const serialNumber = 'PhilipsTV-' + this.config.name; //system.name;
        //const TVversion = system.nettvversion;
        //const language = system.menulanguage;
        //const country = system.country;

        this.informationService = new Service.AccessoryInformation()
            .setCharacteristic(Characteristic.Name, this.config.name)
            .setCharacteristic(Characteristic.Manufacturer, 'Philips')
            .setCharacteristic(Characteristic.Model, this.config.model_year)
            .setCharacteristic(Characteristic.SerialNumber, serialNumber)
            .setCharacteristic(Characteristic.FirmwareRevision, pkg.version);

        //this.tvAccessory.addService(this.informationService); //This give error double UUID
        this.services.push(this.informationService);

        this.tvAccessory.addService(this.tvService);
        this.services.push(this.tvService);

        this.tvAccessory.addService(this.tvSpeaker);
        this.services.push(this.tvSpeaker);

        this.api.on("didFinishLaunching", () => {
            this.api.publishExternalAccessories(pluginName, [this.tvAccessory]);
        });
    }

    setupInputSources() {
        if (!this.config.inputs) return;
        this.tvService.setCharacteristic(Characteristic.ActiveIdentifier, 0);
        this.tvService.getCharacteristic(Characteristic.ActiveIdentifier)
            .onGet(() => 0)
            .onSet(() => {});

        this.config.inputs.forEach((input, index) => {
            // Sanitize input name for HomeKit
            const niceInputName = input.name
                .replace(/_/g, " ")
                .replace(/\b\w/g, c => c.toUpperCase());

            const inputSource = new Service.InputSource(input.name, niceInputName, `input-${index}`);
            inputSource
                .setCharacteristic(Characteristic.Identifier, index)
                .setCharacteristic(Characteristic.ConfiguredName, niceInputName)
                .setCharacteristic(Characteristic.IsConfigured, Characteristic.IsConfigured.CONFIGURED)
                .setCharacteristic(Characteristic.InputSourceType, Characteristic.InputSourceType.APPLICATION)
                .setCharacteristic(Characteristic.CurrentVisibilityState, Characteristic.CurrentVisibilityState.SHOWN);

            this.tvAccessory.addService(inputSource);
            this.services.push(inputSource);
            this.tvService.addLinkedService(inputSource);
        });
    }

    setupAmbilightInputs() {
        const baseId = (this.config.inputs?.length || 0);
        this.tvService.getCharacteristic(Characteristic.ActiveIdentifier)
            .onSet(async (value) => {
                if (value >= baseId && value < baseId + this.ambilightModes.length) {
                    const mode = this.ambilightModes[value - baseId];
                    await this.PhilipsTV.setAmbilightMode(mode);
                }
            });

        this.ambilightModes.forEach((mode, idx) => {
            const id = baseId + idx;
            // Sanitize mode name for HomeKit
            const niceMode = mode.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

            const ambiSwitch = new Service.InputSource(mode, niceMode, `Ambilight-${idx}`);
            ambiSwitch
                .setCharacteristic(Characteristic.Identifier, id)
                .setCharacteristic(Characteristic.ConfiguredName, "Ambilight " + niceMode)
                .setCharacteristic(Characteristic.IsConfigured, Characteristic.IsConfigured.CONFIGURED)
                .setCharacteristic(Characteristic.InputSourceType, Characteristic.InputSourceType.HDMI)
                .setCharacteristic(Characteristic.CurrentVisibilityState, Characteristic.CurrentVisibilityState.SHOWN);

            this.tvAccessory.addService(ambiSwitch);
            this.services.push(ambiSwitch);
            this.tvService.addLinkedService(ambiSwitch);
        });
    }

    getServices() {
        return this.services;
    }
}

module.exports = (homebridge) => {
    homebridge.registerAccessory(pluginName, accessoryName, PhilipsTvAccessory);
};
