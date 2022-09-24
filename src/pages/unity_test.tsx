
import { VStack, Button, Text, Heading } from '@chakra-ui/react'
import { useState, useEffect } from 'react'

import { Unity, useUnityContext } from "react-unity-webgl";

interface Vector2 {
  x: number;
  y: number;
}
export default function Protected(props: any) {
  const { unityProvider, addEventListener, removeEventListener, sendMessage } = useUnityContext({
    productName: "React Unity WebGL Tests",
    companyName: "Jeffrey Lanters",
    // The url's of the Unity WebGL runtime, these paths are public and should be
    // accessible from the internet and relative to the index.html.
    loaderUrl: "unitybuild/2022.10/myunityapp.loader.js",
    dataUrl: "unitybuild/2022.10/myunityapp.data",
    frameworkUrl: "unitybuild/2022.10/myunityapp.framework.js",
    codeUrl: "unitybuild/2022.10/myunityapp.wasm",
    //streamingAssetsUrl: "unitybuild/2022.10/streamingassets",
    // Additional configuration options.
    webglContextAttributes: {
      preserveDrawingBuffer: true,
    },
  });
  const [isUnityMounted, setIsUnityMounted] = useState<boolean>(true);
  const [rotationSpeed, setRotationSpeed] = useState<number>(30);
  const [cubeRotation, setCubeRotation] = useState<number>(0);
  const [clickPosition, setClickPosition] = useState<Vector2>({ x: 0, y: 0 });
  const [saidMessage, setSaidMessage] = useState<string>("Nothing");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [progression, setProgression] = useState<number>(0);

  // When the component is mounted, we'll register some event listener.
  useEffect(() => {
    addEventListener("canvas", handleOnUnityCanvas);
    addEventListener("progress", handleOnUnityProgress);
    addEventListener("loaded", handleOnUnityLoaded);
    addEventListener("RotationDidUpdate", handleOnUnityRotationDidUpdate);
    addEventListener("ClickedPosition", handleOnUnityClickedPosition);
    addEventListener("Say", handleOnUnitySayMessage);
    // When the component is unmounted, we'll unregister the event listener.
    return function () {
      removeEventListener("canvas", handleOnUnityCanvas);
      removeEventListener("progress", handleOnUnityProgress);
      removeEventListener("loaded", handleOnUnityLoaded);
      removeEventListener("RotationDidUpdate", handleOnUnityRotationDidUpdate);
      removeEventListener("ClickedPosition", handleOnUnityClickedPosition);
      removeEventListener("Say", handleOnUnitySayMessage);
    };
  }, []);

  // When the rotation speed has been updated, it will be sent to Unity.
  useEffect(() => {
    sendMessage("MeshCrate", "SetRotationSpeed", rotationSpeed);
  }, [rotationSpeed]);

  // Built-in event invoked when the Unity canvas is ready to be interacted with.
  function handleOnUnityCanvas(canvas: HTMLCanvasElement) {
    canvas.setAttribute("role", "unityCanvas");
  }

  // Built-in event invoked when the Unity app's progress has changed.
  function handleOnUnityProgress(progression: number) {
    setProgression(progression);
  }

  // Built-in event invoked when the Unity app is loaded.
  function handleOnUnityLoaded() {
    setIsLoaded(true);
  }

  // Custom event invoked when the Unity app sends a message indicating that the
  // rotation has changed.
  function handleOnUnityRotationDidUpdate(degrees: number) {
    setCubeRotation(Math.round(degrees));
  }

  // Custom event invoked when the Unity app sends a message indicating that the
  // mouse click position has changed.
  function handleOnUnityClickedPosition(x: number, y: number) {
    setClickPosition({ x, y });
  }

  // Custom event invoked when the Unity app sends a message including something
  // it said.
  function handleOnUnitySayMessage(message: string) {
    setSaidMessage(message);
  }

  // Event invoked when the user clicks the Button, the speed will be increased.
  function handleOnClickIncreaseSpeed() {
    setRotationSpeed(rotationSpeed + 15);
  }

  // Event invoked when the user clicks the Button, the speed will be decreased.
  function handleOnClickDecreaseSpeed() {
    setRotationSpeed(rotationSpeed - 15);
  }

  // Event invoked when the user clicks the Button, the unity container will be
  // mounted or unmounted depending on the current mounting state.
  function handleOnClickUnMountUnity() {
    if (isLoaded === true) {
      setIsLoaded(false);
    }
    setIsUnityMounted(isUnityMounted === false);
  }

  if (!props.authorized) {
    return (
      <h2>Unauthorized</h2>
    )
  } else {
    return (
      <VStack>
        <Heading as='h3'>Connect to see unity app</Heading>



        <h1>React Unity WebGL Tests</h1>
        <p>
          In this React Application we'll explore the possibilities with the
          React Unity WebGL Module. <br></br>Use the built-in events, custom events,
          mount, unmount, press the Buttons and resize the view to see the magic
          in action.
        </p>
        {/* Some Buttons to interact */}
        {/*  <Button onClick={handleOnClickUnMountUnity}>(Un)mount Unity</Button>*/}
        <Button onClick={handleOnClickIncreaseSpeed}>Increase speed</Button>
        <Button onClick={handleOnClickDecreaseSpeed}>Decrease speed</Button>


        <Unity unityProvider={unityProvider} style={{ width: 800, height: 600 }} />




        {/* Displaying some output values */}
        <p>
          The cube is rotated <b>{cubeRotation}</b> degrees
          <br />
          The Unity app said <b>"{saidMessage}"</b>!
          <br />
          Clicked at <b>x{clickPosition.x}</b>, <b>y{clickPosition.y}</b>
        </p>


      </VStack>
    )
  }

}
