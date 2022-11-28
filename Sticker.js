import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View, Image, TouchableWithoutFeedback, Alert } from 'react-native';
import { PanGestureHandler, PinchGestureHandler, RotationGestureHandler, State } from 'react-native-gesture-handler';
import { set } from 'react-native-reanimated';

const USE_NATIVE_DRIVER = false; // https://github.com/kmagiera/react-native-gesture-handler/issues/71
const MINIMUM_STICKER_SCALE = 0.25;
const MAXIMUM_STICKER_SCALE = 2.5;
var imgHeight = 150
var imgWidth = 150
var imageSize = 0
var transX = 0
var transY = 0
var scal = 1
var rot = '0rad'

export default function Sticker(props) {
    const [sticker, setSticker] = useState(props.uri)
    const [id, setID] = useState(props.id)
    const [clock, setClock] = useState(true)
    const updateSticker = props.updateSticker;
    const delSticker = props.delSticker;

    // useEffect(() => {
    //   console.log('use')
    //   var newStick = sticker.filter(stick => stick.id === id)[0]
    //   newStick.translateX = transX
    //   newStick.translateY = transY
    //   newStick.scale = scal
    //   newStick.rotateStr = rot
    //   console.log('NewSticker:')
    //   console.log(newStick)
    //   updateSticker(newStick, id)
    // }, [scal, transY, transX, rot])

    /* Pinching */
    const pinchScale = useRef(new Animated.Value(1));
    const scale = pinchScale.current.interpolate({
        inputRange: [MINIMUM_STICKER_SCALE, MAXIMUM_STICKER_SCALE],
        outputRange: [MINIMUM_STICKER_SCALE, MAXIMUM_STICKER_SCALE],
        extrapolate: 'clamp',
    });

    const onPinchGestureEvent = Animated.event(
        [{ nativeEvent: { scale: pinchScale.current } }],
        { useNativeDriver: USE_NATIVE_DRIVER }
    );

    /* Rotation */
    const rotate = useRef(new Animated.Value(0));
    const rotateStr = rotate.current.interpolate({
        inputRange: [-100, 100],
        outputRange: ['-100rad', '100rad'],
    });

    const onRotateGestureEvent = Animated.event(
        [{ nativeEvent: { rotation: rotate.current } }],
        { useNativeDriver: USE_NATIVE_DRIVER }
    );


    /* Pan */
    const translateX = useRef(new Animated.Value(0));
    const translateY = useRef(new Animated.Value(0));
    const onPanGestureEvent = Animated.event(
        [{ nativeEvent: { translationX: translateX.current, translationY: translateY.current } }],
        { useNativeDriver: USE_NATIVE_DRIVER }
    );

    const onRotateHandlerStateChange = event => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            // rotate.setOffset(lastRotate);
            // rotate.setValue(0);
            var thisSticker = sticker.filter(stick => stick.id === id)[0]
            thisSticker['rotateStr'] = rotateStr
            updateSticker(thisSticker, id)
        }
    };

    // const onPinchHandlerStateChange = useCallback(() => {
    //   translateX.extractOffset()
    //   translateY.extractOffset()
    // })

    const updateScale = (scal) => {
        var thisSticker = sticker.filter(stick => stick.id === id)[0]
        thisSticker['scale'] = scal
        updateSticker(thisSticker, id)
    }

    const onPinchHandlerStateChange = event => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            // pinchScale.setValue(1);
            updateScale(scale)
        }
    };

    // const onPinchHandlerStateChange = useCallback(() => {
    //   translateX.extractOffset()
    //   translateY.extractOffset()
    //   rotate.extractOffset()
    //   var thisSticker = sticker.filter(stick => stick.id === id)[0]
    //   thisSticker['scale'] = scale
    //   updateSticker(thisSticker, id)
    // })

    const onPanStateChange = event => {
        translateX.current.extractOffset()
        translateY.current.extractOffset()
        if (event.nativeEvent.oldState === State.ACTIVE) {
            // translateX.setValue(event.nativeEvent.translationX);
            // translateX.setValue(0);
            // translateY.setValue(event.nativeEvent.translationY);
            // translateY.setValue(0);
            var thisSticker = sticker.filter(stick => stick.id === id)[0]
            thisSticker['translateX'] = translateX.current
            thisSticker['translateY'] = translateY.current
            updateSticker(thisSticker, id)
        }
    };

    // const onPanStateChange = useCallback(() => {
    //   translateX.extractOffset()
    //   translateY.extractOffset()
    // })

    // scale.addListener((val) => {
    //   scal = val.value
    //   console.log(scal)
    // })

    // translateX.addListener((val) => {
    //   transX = val.value
    //   console.log(transX)
    // })

    // translateY.addListener((val) => {
    //   transY = val.value
    //   console.log(transY)
    // })

    // rotate.addListener((val) => {
    //   rot = val.value + 'rad'
    //   console.log(rot)
    // })

    const panStyle = {
        transform: [{ translateX: translateX.current }, { translateY: translateY.current }],
    };

    return (
        <PanGestureHandler
            onGestureEvent={onPanGestureEvent}
            onHandlerStateChange={onPanStateChange}
        >
            <RotationGestureHandler
                id={'rotate' + id}
                simultaneousHandlers={['pinch' + id]}
                onGestureEvent={onRotateGestureEvent}
                onHandlerStateChange={onRotateHandlerStateChange}
            >
                <PinchGestureHandler
                    id={'pinch' + id}
                    simultaneousHandlers={['rotate' + id]}
                    onGestureEvent={onPinchGestureEvent}
                    onHandlerStateChange={onPinchHandlerStateChange}
                >
                    <Animated.View
                        style={[panStyle, styles.stickerContainer]}
                        collapsable={false}
                    >
                        <TouchableWithoutFeedback onPress={() => delSticker(id)}>
                            <Animated.Image
                                style={[
                                    styles.pinchableImage,
                                    {
                                        transform: [
                                            { perspective: 200 },
                                            { scale: scale },
                                            { rotate: rotateStr },
                                        ],
                                    },
                                ]}
                                source={{
                                    uri: sticker.filter(stick => stick.id === id)[0].stickerURI
                                }}
                                key={id}
                            />
                        </TouchableWithoutFeedback>
                    </Animated.View>
                </PinchGestureHandler>
            </RotationGestureHandler>
        </PanGestureHandler>
    );
}

const styles = StyleSheet.create({
    stickerContainer: {
        position: 'absolute',
        height: 95,
        width: 95,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pinchableImage: {
        height: imgWidth,
        width: imgHeight
    },
});