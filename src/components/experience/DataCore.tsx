import {useRef} from 'react';
import {Canvas,useFrame} from '@react-three/fiber';
import {RoundedBox,Line} from '@react-three/drei';
import * as THREE from 'three';
import type {MotionValue} from 'motion/react';
function Artifact({progress,reduced}:{progress:MotionValue<number>;reduced:boolean}){
 const group=useRef<THREE.Group>(null);
 useFrame(({pointer,clock},delta)=>{
  if(!group.current)return;
  const p=progress.get();
  const blend=1-Math.exp(-Math.min(delta,.05)*4);
  group.current.rotation.y=THREE.MathUtils.lerp(group.current.rotation.y,-.28+(reduced?0:pointer.x*.2+p*.7),blend);
  group.current.rotation.x=THREE.MathUtils.lerp(group.current.rotation.x,.12+(reduced?0:-pointer.y*.13+p*.14),blend);
  group.current.position.y=reduced?0:Math.sin(clock.elapsedTime*.65)*.04-p*.2;
 });
 const points: [number,number,number][] = Array.from({length:81},(_,i)=>{const t=i/80*Math.PI*2;return [Math.cos(t)*2.25,Math.sin(t)*.56,Math.sin(t)*1.55]});
 return <group ref={group} rotation={[.12,-.28,-.08]}>
  <Line points={points} color="#718fff" lineWidth={1} transparent opacity={.6}/>
  <group rotation={[.6,0,.5]}><Line points={points} color="#afbeff" lineWidth={.7} transparent opacity={.25}/></group>
  {[-.62,0,.62].map((z,i)=><group key={z} position={[(i-1)*.25,(i-1)*-.2,z]}>
   <RoundedBox args={[2.25,2.9,.055]} radius={.12} smoothness={4}><meshPhysicalMaterial color={i===2?'#9faeff':'#536ca5'} transparent opacity={.22+i*.08} roughness={.2} metalness={.4} clearcoat={1} depthWrite={false}/></RoundedBox>
   <Line points={[[-.88,1.1,.035],[.88,1.1,.035]]} color="#b7c8ff" lineWidth={1}/>
   {[.65,.26,-.13,-.52].map((y,j)=><mesh key={y} position={[-.15,y,.05]}><boxGeometry args={[j%2?1.25:1.65,.045,.015]}/><meshBasicMaterial color={j===1?'#a6b3ff':'#6b83af'} transparent opacity={.7}/></mesh>)}
   <mesh position={[-.72,-1.04,.06]}><sphereGeometry args={[.05,12,12]}/><meshBasicMaterial color="#75e4cd"/></mesh>
  </group>)}
  <mesh position={[0,-.13,1.05]} rotation={[.4,.4,.3]}><octahedronGeometry args={[.47,0]}/><meshStandardMaterial color="#9daeff" emissive="#6374e7" emissiveIntensity={.45} roughness={.18} metalness={.75}/></mesh>
  <mesh position={[0,-.13,1.05]} rotation={[.4,.4,.3]} scale={1.24}><octahedronGeometry args={[.47,0]}/><meshBasicMaterial color="#bac8ff" wireframe transparent opacity={.32}/></mesh>
  {Array.from({length:14},(_,i)=>{const t=i/14*Math.PI*2;return <mesh key={i} position={[Math.cos(t)*2.25,Math.sin(t)*.56,Math.sin(t)*1.55]}><sphereGeometry args={[i%3===0?.045:.022,10,10]}/><meshBasicMaterial color={i%3===0?'#b6c9ff':'#617caf'}/></mesh>})}
 </group>
}
export default function DataCore({progress,reduced,active}:{progress:MotionValue<number>;reduced:boolean;active:boolean}){
 return <Canvas camera={{position:[0,0,7.6],fov:40}} dpr={[1,1.5]} frameloop={active&&!reduced?'always':'demand'} gl={{alpha:true,antialias:true,powerPreference:'low-power'}}><ambientLight intensity={1.4}/><directionalLight position={[4,5,4]} intensity={4} color="#bac9ff"/><pointLight position={[-3,0,2]} intensity={12} color="#7779fc"/><Artifact progress={progress} reduced={reduced}/></Canvas>
}
