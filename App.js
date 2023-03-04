// @ts-nocheck
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useLayoutEffect, useRef, useState } from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { TextureLoader } from "expo-three";
import { useAnimatedSensor, SensorType } from "react-native-reanimated";

// experimental model
// function Box(props) {
//   const [active, setActive] = useState(false);
//   const mesh = useRef();

//   // to rotate
//   useFrame((state, delta) => {
//     if (!active) {
//       mesh.current.rotation.y += delta * 0.1;
//       mesh.current.rotation.x += delta * 0.1;
//     } else {
//       mesh.current.rotation.y += delta * 5;
//       mesh.current.rotation.x += delta * 0.5;
//     }
//   });
//   return (
//     <mesh
//       {...props}
//       ref={mesh}
//       scale={active ? 1.01 : 1}
//       onClick={() => setActive(!active)}
//     >
//       {/*
//       our actual obj
//       2 component: one geometery and other material
//       */}
//       <boxGeometry />
//       <meshStandardMaterial color={active ? "green" : "gray"} />
//     </mesh>
//   );
// }

//actual model
function Shoes(props) {
  const [base, normal, rough] = useLoader(TextureLoader, [
    require("./assets/Airmax/textures/BaseColor.jpg"),
    require("./assets/Airmax/textures/Normal.jpg"),
    require("./assets/Airmax/textures/Roughness.png"),
  ]);
  const material = useLoader(MTLLoader, require("./assets/Airmax/shoe.mtl"));
  const obj = useLoader(
    OBJLoader,
    require("./assets/Airmax/shoe.obj"),
    (loader) => {
      material.preload();
      loader.setMaterials(material);
    }
  );

  const mesh = useRef();
  //called before our components are render on screen
  //useEffect can after.
  useLayoutEffect(() => {
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.map = base;
        child.material.normalMap = normal;
        child.material.roughnessMap = rough;
      }
    });
  }, [obj]);

  // use to rotate
  useFrame((state, delta) => {
    // console.log(props.animatedSensor.sensor.value);
    let { x, y, z } = props.animatedSensor.sensor.value;
    x = ~~(x * 100) / 5000;
    y = ~~(y * 100) / 5000;
    mesh.current.rotation.x += x;
    mesh.current.rotation.y += y;
  });

  return (
    <mesh ref={mesh} rotation={[0, 0, 0]}>
      <primitive object={obj} scale={10} />
    </mesh>
  );
}
export default function App() {
  const animatedSensor = useAnimatedSensor(SensorType.GYROSCOPE, {
    interval: 100,
  });

  return (
    <Canvas>
      <ambientLight />
      <Suspense fallback={null}>
        <Shoes animatedSensor={animatedSensor} />
      </Suspense>
    </Canvas>
  );
}
