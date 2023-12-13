import React, { useEffect, useRef, Suspens, useStore} from 'react';
import { Canvas, useLoader, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import reportWebVitals from './reportWebVitals';
import {coords} from './index.js'

var count = 0;
var coords2 = coords;
var camSave = new THREE.Vector3(0, 0, 1);
var isStart = true;

export const App = () => (
	<Render/>
)

function Render(){
	const cameraRef = useRef(null)
	
    return (
		<Canvas shadows dpr={[1, 1.5]} gl={{ antialias: false }} camera={{position: [0, 0, 1]}}>
		  <color attach="background" args={['#141622']} />
		  <CameraMove />
   		  <Objects/>
		  <ambientLight intensity={0.4} />
		  <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
		</Canvas>
	
	);
	
}

function CameraMove(){
	const cameraRef = useRef()
	
    const {
        camera, gl:{domElement},
    } = useThree()

    useEffect(() => {
        cameraRef.current = camera
    },[camera])

    useFrame((state) => {
		var relationships = [];
		var objects = [];
		
		try{
			if(count > 0 && camSave.equals(cameraRef.current.position)){
				
				const query = `
					query {
						relationships{
						   origin,
						   destination,
						   x, 
						   y,
						   z
						},
						objects {
							id,
							type
						}
					}
				`;
				fetch("http://localhost:4000/graphql", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json",
				},
				body: JSON.stringify({
					query
				})
				}).then(response => {
					return response.json();
				}).then(data => {
					relationships = data.data.relationships;
					objects = data.data.objects;
					coords2 = [];
						
					//assuming id 1 is origin
					for(let i = 0; i < objects.length;i++){
						if(objects[i].id == 1){
							coords2.push([[0, 0, 0], objects[i].type]);
							continue;
						}my 
						let j = objects[i].id;
						
						
						for(let k = 0;k < relationships.length;k++){
							if(relationships[k].origin == 1 && relationships[k].destination == j){
								coords2.push([[relationships[k].x, relationships[k].y, relationships[k].z], objects[i].type]);
								break;
							}else if(relationships[k].destination == 1 && relationships[k].origin == j){
								coords2.push([[-1 * relationships[k].x / 10, -1 * relationships[k].y / 10, -1 * relationships[k].z / 10], objects[i].type]);
								break;
							}
						}
					}
					
					console.log(coords2);
					
				})	

				count = 0
				camSave = new THREE.Vector3(cameraRef.current.position.x, cameraRef.current.position.y, cameraRef.current.position.z)
				
				cameraRef.current.position = new THREE.Vector3(0, 0, 1);
				
			}else if (!cameraRef.current.position.equals(camSave)) {
				console.log(count);
				count = count + 1
				camSave = new THREE.Vector3(cameraRef.current.position.x, cameraRef.current.position.y, cameraRef.current.position.z)
			}
		}catch(err){
			console.log("asdas")
		}
    },[])
	
	return (
		<OrbitControls 
			ref={cameraRef} 
			args={[camera,domElement]} 
			onUpdate={
				() => {
					console.log(cameraRef.current?.position)
				} 
			}
        />
	)
}

function Objects(){
	const obs = [];
	if(isStart){
	    coords2 = coords;
		isStart = false;
	}
	
	for(let i = 0; i < coords2.length;i++){
		const box = (
			<mesh position={[coords2[i][0][0], coords2[i][0][1], coords2[i][0][2]]}>
			    <boxGeometry args={[1, 1, 1]}>
				</boxGeometry>
			</mesh>
		);
		
		obs.push(box);
	}
	
	return obs;
	
}





export default App;