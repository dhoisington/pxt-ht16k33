/**
 * makecode HT16K33 led backpack Package
 */

enum HT16K33_I2C_ADDRESSES {
    //% block="0x70 (Default)"
    ADD_0x70 = 0x70,
    //% block="0x71"
    ADD_0x71 = 0x71,
    //% block="0x72"
    ADD_0x72 = 0x72,
    //% block="0x73"
    ADD_0x73 = 0x73,
    //% block="0x74"
    ADD_0x74 = 0x74,
    //% block="0x75"
    ADD_0x75 = 0x75,
    //% block="0x76"
    ADD_0x76 = 0x76,
    //% block="0x77"
    ADD_0x77 = 0x77,
}

enum HT16K33_COMMANDS {
    TURN_OSCILLATOR_ON = 0x21,
    TURN_DISPLAY_ON = 0x81,
    SET_BRIGHTNESS = 0xE0
}

enum HT16K33_CONSTANTS {
    DEFAULT_ADDRESS = HT16K33_I2C_ADDRESSES.ADD_0x70,
    MAX_BRIGHTNESS = 15,
    MAX_BLINK_RATE = 3
}

/**
 * HT16K33 block
 */
//% weight=100 color=#00a7e9 icon="\uf26c" block="HT16K33"
namespace ht16k33 {
    let matrixAddress = 0;

    function sendCommand(command: HT16K33_COMMANDS) {
        pins.i2cWriteNumber(
            matrixAddress,
            0,
            NumberFormat.Int8LE,
            false

        )
        pins.i2cWriteNumber(
            matrixAddress,
            command,
            NumberFormat.Int8LE,
            false
        )
    }

    //% blockId="HT16K33_DISPLAY_NUMBER" block="render bitmap %bitmap"
    export function render(num: number) {
        let convertNumbers = [63, 6, 91, 79, 102, 109, 125, 7, 127, 111]
        let list = [0, 63, 255, 63, 255, 0, 0, 63, 255, 63]
        let formattedArray: number[] = []
        textOfNumber = convertToText(num)
        if (textOfNumber.indexOf(".") == -1) {
            textOfNumber = "" + textOfNumber + "."
        }
        formattedArray[0] = parseFloat(textOfNumber.charAt(textOfNumber.indexOf(".") - 2))
        formattedArray[1] = parseFloat(textOfNumber.charAt(textOfNumber.indexOf(".") - 1))
        formattedArray[2] = parseFloat(textOfNumber.charAt(textOfNumber.indexOf(".") + 1))
        formattedArray[3] = parseFloat(textOfNumber.charAt(textOfNumber.indexOf(".") + 2))
        console.log("This" + formattedArray[1] + textOfNumber.charAt(1))
        if (formattedArray[0] > 0) {
            list[1] = convertNumbers[formattedArray[0]]
        } else {
            list[1] = 0
        }
        if (formattedArray[1] > 0) {
            list[3] = convertNumbers[formattedArray[1]] + 128
        } else {
            list[3] = 191
        }
        if (formattedArray[2] > 0) {
            list[7] = convertNumbers[formattedArray[2]]
        } else {
            list[7] = 63
        }
        if (formattedArray[3] > 0) {
            list[9] = convertNumbers[formattedArray[3]]
        } else {
            list[9] = 0
        }
        let buff = pins.createBufferFromArray(list);
    pins.i2cWriteBuffer(matrixAddress, buff, false);
    }
    

   

    function initializeDisplay() {
        /** 
         * Required to initialize I2C 
         * Issue: https://github.com/lancaster-university/codal-samd/issues/13
         **/
        pins.SDA.setPull(PinPullMode.PullNone)
        pins.SCL.setPull(PinPullMode.PullNone)
        sendCommand(HT16K33_COMMANDS.TURN_OSCILLATOR_ON)
        sendCommand(HT16K33_COMMANDS.TURN_DISPLAY_ON)
        setBrightness(15);
    }
    //% blockId="HT16K33_SET_ADDRESS" block="set address %address"
    export function setAddress(address: HT16K33_I2C_ADDRESSES) {
        if (matrixAddress != address) {
            matrixAddress = address;
            initializeDisplay();
        }
    }

    //% blockId="HT16K33_SET_BRIGHTNESS" block="set brightness %brightness"
    //% brightness.min=0 brightness.max=15
    export function setBrightness(brightness: number) {
        sendCommand(HT16K33_COMMANDS.SET_BRIGHTNESS | brightness & HT16K33_CONSTANTS.MAX_BRIGHTNESS);
    }
    //% blockId="HT16K33_SET_BLINK_RATE" block="set blink rate %rate"
    //% rate.min=0 rate.max=3
    export function setBlinkRate(rate: number) {
        sendCommand(HT16K33_COMMANDS.TURN_DISPLAY_ON | (rate & HT16K33_CONSTANTS.MAX_BLINK_RATE) << 1);
    }
}
