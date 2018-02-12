import { Component, OnInit } from '@angular/core';
import { RCExpositionModel } from '../shared/RC-exposition-model.service';

@Component({
  selector: 'app-expo-preview',
  templateUrl: './expo-preview.component.html',
  styleUrls: ['./expo-preview.component.css']
})
export class ExpoPreviewComponent implements OnInit {

  constructor( private rcExpoModel : RCExpositionModel ) { }


  ngOnInit() {
	  	// define objects
	let ob1 = new RCText("text tool 1", 1, 1, "hello world");
	let ob2 = new RCImage("leonardo", 1, 2, "assets/rclang/tests/media/leonardo.jpg");
	let ob3 = new RCText("text tool 2", 2, 2, "some more *stuff*");

	// an object in the same cell as ob3 (will be fused)
	let ob4 = new RCText("text tool 3", 2, 2, "and even more **stuff**");

	// define grid
	let grid = new RCGrid(2,2);

	// create a weave
	let weave1 = new RCWeave(grid, "w1", [ob1, ob2, ob3, ob4]);

	// create exposition
	let exposition = new RCExposition("title of expo", ["Jane Doe"], "", [weave1]);

	// render
	exposition.renderResponsive();
  }

}
