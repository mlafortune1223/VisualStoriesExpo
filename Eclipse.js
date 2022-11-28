import {
  Dimensions,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { PanGestureHandler, State, GestureHandlerRootView } from "react-native-gesture-handler";
//import ToolsButton from "./Buttons/ToolsButton";

// Values for updating transform and scale values based on screen aspect ratio
const defaultAspectRatio = 3 / 4;


const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
const screenAspectRatio = height / width;
const ratioModifier = (((defaultAspectRatio / screenAspectRatio)));
const adjustedWidth = width / ratioModifier;

const circleScaleOffset = ((0.085 * width) / (0.085 * adjustedWidth) + 1) / 2


const SIZE = (66 / 1024) * height;
const bottomY = 0.165 * - height - SIZE / 4
const BUTTON_DISTANCE = 30;
const INNER_BUTTON_SIZE = 0;
const TRANSFORMED_INNER_BUTTON_SIZE = 0;
const distanceFromBottom = ((73 + 114) / 1024) * height
const distanceFromLeft = ((73) / 1366) / ratioModifier * width
const distanceFromTop = ((182 - 66) / 1024) * height
const distanceFromRight = width - (((73 + 114) / ratioModifier / 1366) * width)





const buttonDownY = height - distanceFromBottom
const buttonUpY = distanceFromTop
const buttonRightX = distanceFromRight
const buttonLeftX = distanceFromLeft

const Eclipse = (props) => {
  const [Open, setOpen] = useState(false)
  const [isClosed, setIsClosed] = useState(true)
  const [start, setStart] = useState(true)
  const [tools, setTools] = useState(false)
  const [effects, setEffects] = useState(false)
  const [preview, setPreview] = useState(false)
  const [interact, setInteract] = useState(false)
  const [fontSize, setFontSize] = useState(0.025 * height)
  const [isLeft, setIsLeft] = useState(true);
  const [displayButtons, setDisplayButtons] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isButtonOneSelected, setIsButtonOneSelected] = useState(false);
  const [isButtonTwoSelected, setIsButtonTwoSelected] = useState(false);
  const [isButtonThreeSelected, setIsButtonThreeSelected] = useState(false);
  const [isAnyButtonSelected, setIsAnyButtonSelected] = useState(false)
  // const [animation, setAnimation] = useState(new Animated.Value(0))
  // const [animCount, setAnimCount] = useState(0)
  const animation = useSharedValue(0);


  const screenDimensionRatio = 114 / 1366


  const isDown = useSharedValue(true);

  const translateX = useSharedValue(distanceFromLeft);
  const translateY = useSharedValue(buttonDownY);
  const buttonCloseYPosition = useSharedValue(0);

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.translateX = translateX.value;
      ctx.translateY = translateY.value;

    },
    onActive: (event, ctx) => {
      translateX.value = event.translationX + ctx.translateX;
      translateY.value = event.translationY + ctx.translateY;
      runOnJS(setIsMoving)(true)
      runOnJS(setOpen)(false)
    },
    onEnd: (event) => {

      if (Math.abs(event.translationX) > width / 2 - (SIZE) && Math.abs(event.translationY) > height / 2 - (SIZE)) {
        /// DIAGONAL MOVEMENT ///
        let moveToX
        let moveToY
        if (event.translationX > 0 && event.translationY > 0) {
          /// DOWN RIGHT ///
          console.log('downright')
          moveToX = buttonRightX
          moveToY = buttonDownY
          runOnJS(setIsLeft)(false)
          isDown.value = true;
          translateX.value = withSpring(moveToX, { stiffness: 50 })
          translateY.value = withSpring(moveToY, { stiffness: 50 })

        }
        if (event.translationX < 0 && event.translationY > 0) {
          /// DOWN LEFT ///
          console.log('downleft')
          isDown.value = true;
          runOnJS(setIsLeft)(true);
          translateX.value = withSpring(0.05 * width, { stiffness: 50 })
          translateY.value = withSpring(buttonDownY, { stiffness: 50 })


        }
        if (event.translationX < 0 && event.translationY < 0) {
          /// UP LEFT ///
          console.log('upleft')
          moveToX = buttonLeftX;
          moveToY = buttonUpY;
          runOnJS(setIsLeft)(true);
          isDown.value = false;
          translateX.value = withSpring(moveToX, { stiffness: 50 })
          translateY.value = withSpring(moveToY, { stiffness: 50 })

        }
        if (event.translationX > 0 && event.translationY < 0) {
          /// UP RIGHT ///
          console.log('upright')
          moveToX = buttonRightX;
          moveToY = buttonUpY;
          isDown.value = false;
          runOnJS(setIsLeft)(false);
          translateX.value = withSpring(moveToX, { stiffness: 50 })
          translateY.value = withSpring(moveToY, { stiffness: 50 })

        }
        return;
      }
      else if (Math.abs(event.translationX) > width / 2 - (SIZE)) {
        /// HORIZONTAL MOVEMENT ///
        console.log('slide')
        let moveToX = isLeft ? buttonRightX : buttonLeftX;
        let moveToY = isDown.value ? buttonDownY : buttonUpY;
        let moveButtonToY = isDown.value ? buttonDownY : buttonUpY;
        runOnJS(setIsLeft)(!isLeft);
        translateX.value = withSpring(moveToX, { stiffness: 50 });
        translateY.value = withSpring(moveToY, { stiffness: 50 }, finished => {
          runOnJS(setIsMoving)(false)
        });


        return;
      }
      else if (Math.abs(event.translationY) > height / 2 - (SIZE)) {
        /// VERTICAL MOVEMENT ///
        console.log('jump')
        let moveToX = isLeft ? buttonLeftX : buttonRightX;
        let moveToY = isDown.value ? buttonUpY : buttonDownY;
        let moveButtonToY = isDown.value ? buttonUpY : buttonDownY;
        isDown.value = !isDown.value;
        translateX.value = withSpring(moveToX, { stiffness: 50 });
        translateY.value = withSpring(moveToY, { stiffness: 50 }, finished => {
          runOnJS(setIsMoving)(false)
        });
        return;
      }
      else {
        /// STAYING IN SAME POSITION ///
        let moveToX
        let moveToY
        if (isDown.value && isLeft) {
          translateX.value = withSpring(buttonLeftX, { stiffness: 50 })
          translateY.value = withSpring(buttonDownY, { stiffness: 50 })
        }
        else if (!isDown.value && isLeft) {
          moveToY = buttonUpY;
          translateX.value = withSpring(buttonLeftX, { stiffness: 50 })
          translateY.value = withSpring(moveToY, { stiffness: 50 })

        }
        else if (isDown.value && !isLeft) {
          moveToX = buttonRightX
          translateX.value = withSpring(moveToX, { stiffness: 50 })
          translateY.value = withSpring(buttonDownY, { stiffness: 50 })
        }
        else {
          moveToX = buttonRightX
          moveToY = buttonUpY;
          translateX.value = withSpring(moveToX, { stiffness: 50 })
          translateY.value = withSpring(moveToY, { stiffness: 50 })
        }
      }

    },


  });


  useEffect(() => {

    checkOpen = async () => {
      if (start) {
        setStart(false)
        console.log(0.1 * height)
      }

      else {

        if (!Open && isDown.value) {
          await delay(800)
        }

        console.log('open:' + Open)
        console.log('isDown:' + isDown.value)
        var gap = isDown.value ? SIZE : -SIZE
        gap = Open ? -gap : gap
        console.log('gap:' + gap)
        // buttonCloseYPosition.value = translateY.value + gap
        translateY.value = withSpring(translateY.value + gap, { stiffness: 50 }, () => { })

      }

    }
    checkOpen()
  }, [Open])

  const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );

  const toggleCircle = () => {
    var gap = isDown.value ? SIZE : -SIZE
    gap = Open ? gap : -gap
    buttonCloseYPosition.value = translateY.value + gap
    setOpen(!Open)
    setDisplayButtons(!displayButtons)


  }




  // const animatedColor = useAnimatedStyle(() => {
  //   return {

  //     shadowOpacity: 0.5,
  //     shadowRadius: 120
  //   }
  // })

  // const colorInterpolationTemp = animation.interpolate({
  //   inputRange: [0, 1, 2, 3, 4, 5, 6],
  //   outputRange: ["rgb(224,101,34)" , "rgb(237,28,35)", "rgb(127,63,146)", "rgb(33,64,153)", "rgb(0,155,76)", "rgb(255,222,24)", "rgb(242,101,34)"]
  // })

  const animate = () => {
    animation.value = withRepeat(withTiming(6, { duration: 6000 }), -1)
  }
  useEffect(() => {
    animate()
  }, [])




  const animatedStyle = useAnimatedStyle(() => {
    const colorInterpolation = interpolateColor(animation.value, [0, 1, 2, 3, 4, 5, 6], ["rgba(224,101,34,1)", "rgba(237,28,35,1)", "rgba(127,63,146,1)", "rgba(33,64,153,1)", "rgba(0,155,76,1)", "rgba(255,222,24,1)", "rgba(242,101,34,1)"])

    return {
      shadowColor: colorInterpolation,

      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });
  // Animated.loop(
  //   Animated.timing(animation, {
  //     toValue: 6,
  //     duration: 3000,
  //     useNativeDriver: false
  //   }).start(() => {
  //     Animated.timing(animation, {
  //       toValue: 0,
  //       duration: 3000,
  //       useNativeDriver: false
  //     }).start((e) => {
  //       if (e.finished){
  //         setAnimCount(animCount+1)
  //       }
  //     })
  //   })
  // )


  // useMemo( () => animate() )


  const displayHandler = (value, button) => {
    setOpen(value)
    if (button == "one") {
      setIsAnyButtonSelected(true)
      setIsButtonOneSelected(true)
      setIsButtonTwoSelected(false)
      setIsButtonThreeSelected(false)
    }
    if (button == "two") {
      setIsAnyButtonSelected(true)
      setIsButtonOneSelected(false)
      setIsButtonTwoSelected(true)
      setIsButtonThreeSelected(false)
    }
    if (button == "three") {
      setIsAnyButtonSelected(true)
      setIsButtonOneSelected(false)
      setIsButtonTwoSelected(false)
      setIsButtonThreeSelected(true)
    }
    if (button == "none") {
      setIsAnyButtonSelected(false)
      setIsButtonOneSelected(false)
      setIsButtonTwoSelected(false)
      setIsButtonThreeSelected(false)
    }
  }

  const styles = StyleSheet.create({
    circle: {
      position: "absolute",
      height: screenDimensionRatio * adjustedWidth,
      width: screenDimensionRatio * adjustedWidth,
      backgroundColor: "white",
      borderRadius: screenDimensionRatio * adjustedWidth / 2,
      shadowOpacity: 1,
      shadowRadius: 15,
      shadowOffset: { width: '0%', height: '0%' },
      borderBottomWidth: 0

    },
  })

  return (
    <GestureHandlerRootView >
      <TouchableWithoutFeedback onPress={() => toggleCircle()}>
        <View style={{ flex: 1, zIndex: 99 }}>
          <PanGestureHandler onGestureEvent={panGestureHandler}>
            <Animated.View style={[styles.circle, animatedStyle, { shadowOpacity: Open ? 0.5 : 1 }]} />
            {/* <Animated.View style={[styles.circle, animatedStyle,{shadowColor: Open === true? 'rgba(244, 126, 88, 0.5)' : '#F47E58' ,shadowOpacity: 1}]}/> */}
          </PanGestureHandler>
        </View>
      </TouchableWithoutFeedback>
      <props.buttonOne display={Open} isDown={isDown} isLeft={isLeft} xPosition={translateX} yPosition={translateY} isMoving={isMoving} displayHandler={displayHandler} isSelected={isButtonOneSelected} buttonCloseYPosition={buttonCloseYPosition} isAnyButtonSelected={isAnyButtonSelected} />
      <props.buttonTwo display={Open} isDown={isDown} isLeft={isLeft} xPosition={translateX} yPosition={translateY} isMoving={isMoving} displayHandler={displayHandler} isSelected={isButtonTwoSelected} buttonCloseYPosition={buttonCloseYPosition} isAnyButtonSelected={isAnyButtonSelected} />
      <props.buttonThree display={Open} isDown={isDown} isLeft={isLeft} xPosition={translateX} yPosition={translateY} isMoving={isMoving} displayHandler={displayHandler} isSelected={isButtonThreeSelected} buttonCloseYPosition={buttonCloseYPosition} isAnyButtonSelected={isAnyButtonSelected} />
    </GestureHandlerRootView>
  );

}


export default Eclipse;