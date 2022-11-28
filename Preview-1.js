import React, {useRef,useState,useEffect} from 'react'
import { View, Text,SafeAreaView, Dimensions, ScrollView, TouchableOpacity, StyleSheet, Alert, Animated, TouchableWithoutFeedback } from 'react-native'
import WebView from 'react-native-webview'
import Modal from 'react-native-modal'
import { ColorPicker } from 'react-native-color-picker'
import RnSlider from '@react-native-community/slider'
import { actions } from './constants'
import * as ImagePicker from 'expo-image-picker'


export default function Preview(props) {
  const height = Dimensions.get('window').height
  const width = Dimensions.get('window').width
  const webRef = useRef(null)
  const [scroll,setScroll] = useState(true)
  const [cust,setCust] = useState(width * 0.86)
  const [offset,setOffset] = useState(0)

  let navigation = props.navigation    
  const htmlDrawing = 
  `      
  <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no">
  <canvas id="canvas" width=${width*0.85} height=${height*0.85} style="border:1px solid; border-color:black; "></canvas>
  <script type="text/javascript" >
  
  var strokeColor='black';
  var canvas;
  var ctx;
  var styleId=1;
  var draw;
  // let prevX;
  // let prevY;
  var points = [];
  let restore_arr = [];
  let index = -1;
  let cap = 0;
  var storePoints = [];
  var sendPoints = [];
  var scroll;
  
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  // canvas.width = p;
  
  let rct = canvas.getBoundingClientRect();
  
  canvas.width = rct.width * devicePixelRatio;
  canvas.height = rct.height * devicePixelRatio;
  
  ctx.scale(devicePixelRatio,devicePixelRatio);
  canvas.style.width = rct.width + "px"
  canvas.style.height = rct.height + "px"
  
  ctx.lineWidth = 2;
  ctx.lineJoin = ctx.lineCap = 'round';
  ctx.strokeStyle = strokeColor;
  ctx.globalAlpha = 1;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  // canvas.addEventListener("touchstart", (e) => {
  //   scroll = '!scroll';
  //   window.ReactNativeWebView.postMessage('!scroll');
    
  //   points.push({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  //   storePoints.push({ x: e.touches[0].clientX, y: e.touches[0].clientY, id:styleId, color:ctx.strokeStyle, lineWidth:ctx.lineWidth });
  // })
  
  // canvas.addEventListener("touchend", (e) => {
    
  //   points.length = 0;
  //   scroll = 'scroll';
  //   window.ReactNativeWebView.postMessage('scroll');
  //   sendPoints = [...sendPoints,storePoints];
  //   storePoints = [];
    
  //   /// UNDO LOGIC ///
    
  //   restore_arr.push(ctx.getImageData(0,0,canvas.width,canvas.height));
  //   index += 1;
  // })
  
  
  // canvas.addEventListener("touchmove",(e)=>{
    
  //   if(scroll==='scroll'){
  //     return;
  //   }
    
  //   if(styleId === ${actions.penStroke})
  //   {
  //     storePoints.push({ x: e.touches[0].clientX, y: e.touches[0].clientY, id:styleId, color:ctx.strokeStyle, lineWidth:ctx.lineWidth });
  //     penStroke(e);
  //   }
    
  //   if(styleId === ${actions.pencilStroke})
  //   {
  //     storePoints.push({ x: e.touches[0].clientX, y: e.touches[0].clientY, id:styleId, color:ctx.strokeStyle, lineWidth:ctx.lineWidth });
  //     pencilStroke(e);
  //   }
    
  //   if(styleId === ${actions.markerStroke})
  //   {
  //     // points.push({x: e.touches[0].clientX, y: e.touches[0].clientY});
  //     storePoints.push({ x: e.touches[0].clientX, y: e.touches[0].clientY, id:styleId, color:ctx.strokeStyle, lineWidth:ctx.lineWidth });
  //     markerStroke(e);
  //   }
    
  //   if(styleId === ${actions.slicedStroke})
  //   {
  //     storePoints.push({ x: e.touches[0].clientX, y: e.touches[0].clientY, id:styleId, color:ctx.strokeStyle, lineWidth:ctx.lineWidth });
  //     slicedStroke(e);
  //   }
    
  //   if(styleId === ${actions.multipleLines})
  //   {
  //     points.push({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  //     storePoints.push({ x: e.touches[0].clientX, y: e.touches[0].clientY, id:styleId, color:ctx.strokeStyle, lineWidth:ctx.lineWidth });
  //     stroke(offsetPoints(-5));
  //     stroke(offsetPoints(-2));
  //     stroke(points);
  //     stroke(offsetPoints(2));
  //     stroke(offsetPoints(5));
  //   }
  //   if(styleId === ${actions.waterEffect})
  //   {
  //     if(e.touches[0].clientX >= points[points.length-1].x -5 && e.touches[0].clientX <= points[points.length-1].x +5 && e.touches[0].clientY >= points[points.length-1].y -5 && e.touches[0].clientY <= points[points.length-1].y +5){
  //       return;
  //     }
  //     points.push({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  //     storePoints.push({ x: e.touches[0].clientX, y: e.touches[0].clientY, id:styleId, color:ctx.strokeStyle, lineWidth:ctx.lineWidth });
  //     waterStroke(e);
  //   }
  //   if(styleId === ${actions.stars})
  //   {
  //     if(e.touches[0].clientX >= points[points.length-1].x -15 && e.touches[0].clientX <= points[points.length-1].x +15 && e.touches[0].clientY >= points[points.length-1].y -15 && e.touches[0].clientY <= points[points.length-1].y +15){
  //       return;
  //     }
  //     points.push({ x: e.touches[0].clientX, y: e.touches[0].clientY});
  //     storePoints.push({ x: e.touches[0].clientX, y: e.touches[0].clientY, id:styleId, color:ctx.strokeStyle, lineWidth:ctx.lineWidth });
  //     for (var i = 0; i < points.length; i++) 
  //     {
  //       drawStar(points[i].x, points[i].y);
  //     }
  //   }
  //   if(styleId === ${actions.verticalLine})
  //   {
  //     if(e.touches[0].clientX >= points[points.length-1].x -10 && e.touches[0].clientX <= points[points.length-1].x +10 && e.touches[0].clientY >= points[points.length-1].y -10 && e.touches[0].clientY <= points[points.length-1].y +10){
  //       return;
  //     }
  //     points.push({ x: e.touches[0].clientX, y: e.touches[0].clientY});
  //     storePoints.push({ x: e.touches[0].clientX, y: e.touches[0].clientY, id:styleId, color:ctx.strokeStyle, lineWidth:ctx.lineWidth });
  //     for (var i = 0; i < points.length; i++) 
  //     {
  //       drawVerticalLines(points[i].x, points[i].y);
  //     }
  //   }
    
  //   if(styleId === ${actions.sprayBrush})
  //   {
  //     storePoints.push({ x: e.touches[0].clientX, y: e.touches[0].clientY, id:styleId, color:ctx.strokeStyle, lineWidth:ctx.lineWidth });
  //     sprayBrush(e);
  //   }
  //   if(styleId === ${actions.rings})
  //   {
  //     storePoints.push({ x: e.touches[0].clientX, y: e.touches[0].clientY, id:styleId, color:ctx.strokeStyle, lineWidth:ctx.lineWidth });
  //     ringBrush(e);
  //   }
    
  // })
  
  
  /// PEN STROKE ///
  
  function penStroke(e)
  {
    ctx.globalAlpha = 1;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(points[points.length-1].x - getRandomInt(0, 2), points[points.length-1].y - getRandomInt(0, 2));
    ctx.lineTo(e.touches[0].clientX - getRandomInt(0, 2), e.touches[0].clientY - getRandomInt(0, 2));
    
    ctx.moveTo(points[points.length-1].x, points[points.length-1].y);
    ctx.lineTo(e.touches[0].clientX, e.touches[0].clientY);
    
    ctx.moveTo(points[points.length-1].x + getRandomInt(0, 2), points[points.length-1].y + getRandomInt(0, 2));
    ctx.lineTo(e.touches[0].clientX + getRandomInt(0, 2), e.touches[0].clientY + getRandomInt(0, 2));
    ctx.stroke();
    
    points[points.length-1].x = e.touches[0].clientX;
    points[points.length-1].y = e.touches[0].clientY;
    return;
  }  
  
  /// PENCIL STROKE ///
  
  function pencilStroke(e)
  {
    ctx.globalAlpha = 1;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(points[points.length-1].x, points[points.length-1].y);  
    ctx.lineTo(e.touches[0].clientX, e.touches[0].clientY);
    ctx.stroke();
    points[points.length-1].x = e.touches[0].clientX;
    points[points.length-1].y = e.touches[0].clientY;
    return;
  }
  
  /// MARKER STROKE ///
  
  function markerStroke(e)
  {
    ctx.beginPath();
    ctx.lineWidth = 10;
    ctx.globalAlpha = 1;
    ctx.translate(0.5, 0.5);
    ctx.moveTo(points[points.length-1].x, points[points.length-1].y);  
    ctx.lineTo(e.touches[0].clientX, e.touches[0].clientY);
    points[points.length-1].x = e.touches[0].clientX;
    points[points.length-1].y = e.touches[0].clientY;
    // ctx.translate(-0.5, -0.5);
    ctx.stroke();
    return;
  }
  
  /// SLICED STROKE ///
  
  function slicedStroke(e)
  {
    
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(points[points.length-1].x - 4, points[points.length-1].y - 4);
    ctx.globalAlpha = 1;
    ctx.stroke();
    ctx.lineTo(e.touches[0].clientX - 4, e.touches[0].clientY - 4);
    
    ctx.moveTo(points[points.length-1].x - 2, points[points.length-1].y - 2);
    ctx.globalAlpha = 0.6;
    ctx.stroke();
    ctx.lineTo(e.touches[0].clientX - 2, e.touches[0].clientY - 2);
    
    ctx.moveTo(points[points.length-1].x, points[points.length-1].y);
    ctx.globalAlpha = 0.4;
    ctx.stroke();
    ctx.lineTo(e.touches[0].clientX, e.touches[0].clientY);
    
    ctx.lineTo(e.touches[0].clientX + 2, e.touches[0].clientY + 2);
    ctx.globalAlpha = 0.3;
    ctx.stroke();
    ctx.moveTo(points[points.length-1].x + 2, points[points.length-1].y + 2);
    
    ctx.moveTo(points[points.length-1].x + 4, points[points.length-1].y + 4);
    ctx.globalAlpha = 0.2;
    ctx.stroke();
    ctx.lineTo(e.touches[0].clientX + 4, e.touches[0].clientY + 4);
    
    points[points.length-1].x = e.touches[0].clientX;
    points[points.length-1].y = e.touches[0].clientY;
    return;
  }
  
  /// MULTI LINE ///
  
  function stroke(points) {
    var p1 = points[0];
    var p2 = points[1];
    ctx.lineWidth = 1;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    
    for (var i = 1, len = points.length; i < len; i++) {
      // we pick the point between pi+1 & pi+2 as the
      // end point and p1 as our control point
      var midPoint = midPointBtw(p1, p2);
      ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
      p1 = points[i];
      p2 = points[i+1];
    }
    // Draw last line as a straight line while
    // we wait for the next point to be able to calculate
    // the bezier control point
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
  }
  
  function offsetPoints(val) {
    var offsetPoints = [ ];
    for (var i = 0; i < points.length; i++) {
      offsetPoints.push({ 
        x: points[i].x + val,
        y: points[i].y + val
      });
    }
    return offsetPoints;
  }
  
  function midPointBtw(p1, p2) {
    return {
      x: p1.x + (p2.x - p1.x) / 2,
      y: p1.y + (p2.y - p1.y) / 2
    };
  }  
  
  //// WATER STROKE ////
  
  function waterStroke(e){
    
    ctx.fillStyle = ctx.strokeStyle;
    ctx.globalAlpha = Math.random();
    ctx.beginPath();
    ctx.arc(e.touches[0].clientX, e.touches[0].clientY, getRandomInt(5, 10),false, Math.PI * 2, false);
    ctx.fill();
  }
  
  //// STAR DESIGN ////
  
  function drawStar(x, y) {
    var length = 10;
    ctx.globalAlpha = 1;
    ctx.lineWidth = 1;
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.rotate((Math.PI * 1 / 10));
    for (var i = 5; i--;) {
      ctx.lineTo(0, length);
      ctx.translate(0, length);
      ctx.rotate((Math.PI * 2 / 10));
      ctx.lineTo(0, -length);
      ctx.translate(0, -length);
      ctx.rotate(-(Math.PI * 6 / 10));
    }
    ctx.lineTo(0, length);
    ctx.stroke();
    ctx.restore();
  }
  
  //// VERTICAL LINES ////
  
  function drawVerticalLines(x, y) {
    var length = 10;
    ctx.globalAlpha = 1;
    ctx.lineWidth = 2;
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.rotate((Math.PI * 1 / 10));
    for (var i = 5; i--;) {
      ctx.lineTo(0, length);
      ctx.lineTo(0, -length);
    }
    ctx.lineTo(0, length);
    ctx.stroke();
    ctx.restore();
  }
  
  //// SPRAY BRUSH ////
  
  function sprayBrush(e){
    var density = 50;
    ctx.lineWidth = 10;
    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.fillStyle = ctx.strokeStyle;
    // ctx.moveTo(points[points.length-1].x, points[points.length-1].y);
    for (var k = density; k--; ) {
      var radius = getRandomFloat(0, 20);
      var angle = getRandomFloat(0, Math.PI);
      ctx.fillRect(e.touches[0].clientX + radius * Math.cos(angle), e.touches[0].clientY + radius * Math.sin(angle), 1, 1);
    }
  }
  
  /// RINGS ///
  
  function ringBrush(e){
    var density = 50;
    var radius = 20;
    ctx.lineWidth = 10;
    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.fillStyle = ctx.strokeStyle;
    // ctx.moveTo(points[points.length-1].x, points[points.length-1].y);
    for (var k = density; k--; ) {
      var angle = getRandomFloat(0, Math.PI*2);
      ctx.fillRect(e.touches[0].clientX + radius * Math.cos(angle), e.touches[0].clientY + radius * Math.sin(angle), 1, 1);
    }
  }
  
  
  /// CLEAR CANVAS ///
  
  function clearData(){
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
    restore_arr = [];
    index = -1;
    sendPoints = [];
  }
  
  /// UNDO CANVAS ///
  
  function undo(){
    if(index<=0){
      clearData()
    }else{
      index -= 1;
      restore_arr.pop();
      ctx.putImageData(restore_arr[index],0,0);
    }
    sendPoints.pop();
  }
  
  /// RANDOMIZE INT POINTS ///
  
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  /// RANDOMIZE FLOAT POINTS ///
  
  function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  /// HANDLE IMAGE ///  
  
  function handleImage(a){
    const img = new Image();
    img.src = "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png";
    img.onload=()=>{
      ctx.globalAlpha = 1;
      ctx.drawImage(img,0,0,900,800);
    }
  }
  
  /// RECEIVE REACT NATIVE INTERACTION ///
  
  
  var message = function(event){
    var msgData = JSON.parse(event.data);
    // alert(msgData);
    if(msgData.action === '${actions.setColor}'){
      ctx.strokeStyle = msgData.data;
      return;
    }
    if(msgData === '${actions.clearData}'){
      clearData();
      return;
    }
    if(msgData.action === '${actions.setStrokeStyle}'){
      styleId = msgData.data;
      return;
    }
    if(msgData.action === '${actions.setImage}'){
      var a = JSON.stringify(msgData.data);
      handleImage(a);
      return;
    }
    if(msgData === '${actions.undo}'){
      undo();
      return;
    }
    if(msgData === '${actions.getPoints}'){
      let a = JSON.stringify(sendPoints);
      window.ReactNativeWebView.postMessage(a);
    }
    if(msgData.action === '${actions.setStrokeWidth}'){
      ctx.lineWidth = msgData.data;
      return;
    }
  }
  var img = new Image;
  img.onload = function(){
    ctx.drawImage(img, 0, 0, ${width*0.85}, ${height*0.85});
  };
  img.src = '${props.route.params.a}';
  document.addEventListener("message", message , false);
  window.addEventListener("message", message , false);
  </script>`;

  const scrolling = (event) => {
    const x = event.nativeEvent.contentOffset.x
    if(x > 0 && cust < 10000){
      setCust(cust - offset + x + 50)
      setOffset(x)
    }
  }

  return (
    <SafeAreaView style={{height,width,backgroundColor:'white'}} >
      <TouchableOpacity
        style={{
          marginHorizontal:'2%',
          paddingHorizontal:'1%'
        }}
        onPress={() => navigation.goBack()} 
      >
        <Text>Go Back</Text>
      </TouchableOpacity>
      <WebView
        bounces={false}
        scrollEnabled={false}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        ref={(ref) => webRef.current=ref}
        source={{html: htmlDrawing}}
        onHttpError={(e) => {
          const { nativeEvent } = e;
          console.warn('error',nativeEvent)
        }}
        // onMessage={onMessage}
        style={{height, width: cust, marginLeft: '6.75%'}}
        originWhitelist={['*']}
      >
        {props.route.params.arr.map((sticker) => {
          console.log(sticker)
          return(
            <Animated.View style={styles.stickerContainer} collapsable={false}>
              <TouchableWithoutFeedback 
                onPress={() => {
                  console.log('==========')
                  console.log(sticker)
                  console.log('==========')
                }}
              >
                <Animated.Image
                  style={[
                    styles.pinchableImage,
                    {
                      // must translate before applying other changes
                      transform: [
                        { translateX: sticker.translateX }, 
                        { translateY: sticker.translateY },
                        { perspective: 200 },
                        { scale: sticker.scale },
                        { rotate: sticker.rotateStr },
                      ],
                    },
                  ]}
                  source={{
                    uri: sticker.stickerURI
                  }}
                  key={sticker.id}
                />
              </TouchableWithoutFeedback>
            </Animated.View>
          )
        })}
      </WebView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  bottomButton:{
    marginHorizontal:'2%',
    borderWidth:1,
    borderColor:'black'
  },
  strokeModal:{
    height:300,
    width:300,
    alignSelf:'center',
    backgroundColor:'white',
    alignItems:'center',
    paddingVertical:'1%' 
  },
  colorModal:{
    height:300,
    width:300,
    alignSelf:'center'
  },
  strokeModalText:{
    marginBottom:'2%'
  },
  pinchableImage: {
    width: 150,
    height: 150,
    zIndex: 99
  },
  stickerContainer: {
    position: 'absolute',
    height: 95, 
    width: 95,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99
  },
});
