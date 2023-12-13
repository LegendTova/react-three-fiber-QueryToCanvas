import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


var relationships = [];
var objects = [];
var coords = [];

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

	//assuming id 1 is origin
	for(let i = 0; i < objects.length;i++){
		if(objects[i].id == 1){
			coords.push([[0, 0, 0], objects[i].type]);
			continue;
		}
		let j = objects[i].id;
		
		
		for(let k = 0;k < relationships.length;k++){
			if(relationships[k].origin == 1 && relationships[k].destination == j){
				coords.push([[relationships[k].x, relationships[k].y, relationships[k].z], objects[i].type]);
				break;
			}else if(relationships[k].destination == 1 && relationships[k].origin == j){
				coords.push([[-1 * relationships[k].x / 10, -1 * relationships[k].y / 10, -1 * relationships[k].z / 10], objects[i].type]);
				break;
			}
		}
	}
	
})

export {coords};
createRoot(document.getElementById('root')).render(<App/>);
